import './App.css';
import React from 'react';
import Home from './components/Login/home';
import Login from './components/Login/login';
import ProjectPage from './components/ProjectPage/ProjectPage';
import Info from './components/DashboardPage/Info';
import AddProject from './components/ProjectPage/addProject';
import {Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Route exact path="/">
        < Home />
      </Route>
      <Route exact path="/login">
        < Login />
      </Route>
      <Route exact path="/project">
        < ProjectPage />
      </Route>
      <Route exact path="/info">
        < Info />
      </Route>
      <Route exact path="/addProject">
        < AddProject />
      </Route>
    </div>
  );
}

export default App;
