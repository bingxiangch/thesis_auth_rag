import axios from 'axios'

const api = axios.create({})
// Flag to mark if access token is being refreshed
let isRefreshing = false
// Array of requests that failed due to invalid access token.
let failedQueue = []

// Processing failed requests with the refreshed token.
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Interceptor to catch all outgoing requests.
api.interceptors.request.use((config) => {
  // Before every request get tokens from local storage
  let tokensData = JSON.parse(localStorage.getItem('tokens'))
  // If access token was found
  if (tokensData?.accessToken) {
    // Set access token as authorization header
    config.headers['authorization'] = `bearer ${tokensData.accessToken}`
  }
  return config
})

// Interceptor to catch all incoming responses.
api.interceptors.response.use(
  // If response is ok, return it without touching it.
  (response) => {
    return response
  },
  // If response is error, going here.
  (err) => {
    // Saving original request.
    const originalRequest = err.config
    // If error HTTP status code is 403, it means unauthorized (invalid access token)
    if (err.response.status === 403 && !originalRequest._retry) {
      // If access tokens are already being refreshed, put request into failed queue.
      if (isRefreshing) {
        return (
          new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject })
          })
            // When promise is resolved, token is returned and the original request can be retried.
            .then((token) => {
              // Setting new token to request.
              originalRequest.headers['authorization'] = 'Bearer ' + token
              // Unpacking request to prevent bug with unknown header names
              // and sending the request again.
              return axios({
                ...originalRequest,
                headers: originalRequest.headers.toJSON()
              })
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        )
      }
      // Setting flags to mark that the process of refreshing access token has begun.
      originalRequest._retry = true
      isRefreshing = true
      // Returning promise that resolves, when new token is returned.
      return new Promise(function (resolve, reject) {
        // Getting new tokens from api
        axios
          .post('http://localhost:8001/v1/token', {
            token: JSON.parse(localStorage.getItem('tokens')).refreshToken
          })
          .then(({ data }) => {
            // Setting new tokens to local storage
            localStorage.setItem(
              'tokens',
              JSON.stringify({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
              })
            )
            // Replace the access token with freshly created one
            axios.defaults.headers.common['authorization'] = 'Bearer ' + data.accessToken
            originalRequest.headers['authorization'] = 'Bearer ' + data.accessToken
            processQueue(null, data.accessToken)
            // Resume the original request
            resolve(
              axios({ ...originalRequest, headers: originalRequest.headers.toJSON() })
            )
          })
          .catch(() => {
            // Logging out if refresh token was invalid as well.
            localStorage.removeItem('tokens')
            // TODO: Transforming these interceptors into
            // functional component would allow calling handleLogout from AuthProvider
            window.location.reload(false)
          })
          .finally(() => {
            isRefreshing = false
          })
      })
    }
    return Promise.reject(err)
  }
)
export default api
