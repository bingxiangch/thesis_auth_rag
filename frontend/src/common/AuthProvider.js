// Author: Oskari Niskanen

import React, { useContext, useState, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useChat } from '../components/ChatContext'
import { BASE_URL } from '../config'
const AuthContext = createContext(null)
// Hook accesses the funuctions from this component.
// Offers login/logout related functionality and user setting.
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const { resetChat } = useChat()
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(() => {
    if (localStorage.getItem('tokens')) {
      let tokens = JSON.parse(localStorage.getItem('tokens'))
      return jwt_decode(tokens.accessToken)
    }
    return null
  })

  // Sends login request to server
  const handleLogin = async (payload) => {
    try {
      // Emptying any previous error code.
      setErr(null);
      const params = new URLSearchParams();
      // Add credentials to the URLSearchParams object
      params.append('username', payload.username);
      params.append('password', payload.password);  
      // Calling login endpoint with the provided payload (Credentials)
      const response = await axios.post(`${BASE_URL}token`, params);
  
      // Setting response to local storage via hook.
      localStorage.setItem(
        'tokens',
        JSON.stringify({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        })
      );
  
      // Decoding access token and setting it as user to get access to username and role.
      setUser(jwt_decode(response.data.access_token));
  
      resetChat()
      // Redirecting user.
      navigate('/chat');
    } catch (error) {
      // If the API returned an error, display it in the login form.
      if (error.response) {
        setErr(error.response.data.detail);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logging out.
  const handleLogout = () => {
    // Removing tokens from local storage.
    localStorage.removeItem('tokens')
    // Emptying user from state.
    setUser(null)
    // Navigating to login page.
    resetChat()
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout, loading, err }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
