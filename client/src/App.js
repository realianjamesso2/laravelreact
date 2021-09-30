import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
 
import Register from './components/frontend/auth/Register';
import Login from './components/frontend/auth/Login';
 

import AdminPrivateRoute from './AdminPrivateRoute';
import PublicRoute from './PublicRoute';

import axios from 'axios'; 


axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';

axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config){
  const token = localStorage.getItem('auth-token'); 
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

function App() {
  return (
    <div className="App">
       <Router>
        <Switch>

            <AdminPrivateRoute path="/admin" name="Admin" />
            
            <PublicRoute path="/" name="Home" />

            <Route exact path="/login">
              {localStorage.getItem('auth-token') ? <Redirect to="/" /> : <Login /> }
            </Route>
            <Route exact path="/register">
              {localStorage.getItem('auth-token') ? <Redirect to="/" /> : <Register /> }
            </Route>

            {/* <Route path="/admin" name="Admin" render={(props) => <MasterLayout {...props} /> }  /> */}
 
             

        </Switch>
       </Router>
    </div>
  );
}

export default App;
