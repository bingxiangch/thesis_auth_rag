## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Things to do
- Improve Axios interceptors. Possibly make them into functional component and use logout hook to log user out if refresh token is invalid/expired.
- Add search functionality to map view.
- Move API call of devices from map view marker cluster component to parent component.
- Reduce number of concurrent API calls in device details view. Currently, 4 graphs get the data from API simultaneously. On first run, one call to /data endpoint is enough.
- Extend testing to test API interceptors, log in/out functionality and protected routes.
- Find a way to move away from current version of react-leaflet-markercluster, as it is a fork of the "official" repository and might not be updated.
- Check frontend security vulnerabilities. One critical vulnerability was about Recharts and d3.js.
- Update Tremor if needed (as of 20.12. there is version 1.30 that was launched on 16.12.2022)
- Check if HashRouting really is the way to go with this application. BrowserRouter could be better but afaik cannot be used if app is not served as static files from server.
