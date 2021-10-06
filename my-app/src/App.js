import './App.css';
import React from 'react';
import Home from './components/Login/home';
import Login from './components/Login/login';
import ProjectPage from './components/ProjectPage/ProjectPage';
import DashBoardPage from './components/DashboardPage/dashBoardPage';
import ListPage from './components/Lists/ListPage'
import {Route} from 'react-router-dom';
import CardPage from './components/Cards/CardPage'

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
        < DashBoardPage />
      </Route>
      <Route exact path="/project/:projectId/lists">
        < ListPage />
      </Route>
      <Route exact path="/project/:projectId/list/:listId/cards">
        < CardPage />
      </Route>
    </div>
  );
}

export default App;
