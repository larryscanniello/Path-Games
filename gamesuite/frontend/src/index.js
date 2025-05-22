import React from 'react';
import ReactDOM from 'react-dom/client';
import SeeOldFireGames from './Components/Firegame/SeeOldFireGames'
import SeeMiceBots from './Components/Mousegame/SeeMiceBots'
import Mousegame from './Components/Mousegame/Mousegame';
import Home from './Components/Home'
import Firegame from './Components/Firegame/Firegame'
import Login from './Components/Login'
import Register from './Components/Register'
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from './Components/AuthProvider';
import ViewFiregameList from './Components/Firegame/ViewFiregameList';
import SeeOldMouseGames from './Components/Mousegame/SeeOldMouseGames';
import ViewMousegameList from "./Components/Mousegame/ViewMousegameList";


const router = createBrowserRouter([
  {
    path: "",
    element: <Home/>,
  },
  {
    path: "/firegame",
    element: <ProtectedRoute><Firegame/></ProtectedRoute>,
  },
  {
    path: "/seeoldfiregames/:username/:gameID/",
    element: <SeeOldFireGames/>,
  },
  {
    path: "/seeoldfiregames/",
    element: <ViewFiregameList/>
  },
  {
    path: "/seemicebots",
    element: <SeeMiceBots/>
  },
  {
    path: "/seeoldmousegames",
    element: <ViewMousegameList/>
  },
  {
    path: "/seeoldmousegames/:username/:gameID/",
    element: <SeeOldMouseGames/>
  },
  {
    path: "/mousegame",
    element: <ProtectedRoute><Mousegame/></ProtectedRoute>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  },
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
      <RouterProvider router = {router} />
      </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
