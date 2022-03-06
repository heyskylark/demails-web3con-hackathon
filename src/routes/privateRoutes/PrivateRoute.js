import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from '../../layout/MainLayout';
import { Home, Email } from '../../components';
// import Loadable from "../../common/Loadable";

// dashboard routing

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/logged-in',
  element: <MainLayout />,
  children: [
    {
      path: '/logged-in',
      element: <Navigate to="/logged-in/inbox" />
    },
    {
      path: '/logged-in/:tab',
      element: <Home />
    },
    {
      path: '/logged-in/:tab/:id',
      element: <Email />
    }
  ]
};

export default MainRoutes;
