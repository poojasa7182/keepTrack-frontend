import './App.css';
import React from 'react';
import Home from './components/Login/home';
import Login from './components/Login/login';
import Project from './components/ProjectPage/body';
import Info from './components/DashboardPage/Info';
import AddProject from './components/ProjectPage/addProject';
import {Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      hi
      <Route exact path="/">
        < Home />
      </Route>
      <Route exact path="/login">
        < Login />
      </Route>
      <Route exact path="/project">
        < Project />
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
