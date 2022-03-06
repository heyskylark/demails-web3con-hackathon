import Login from '../../pages/Login';
import OpenRouteTemplate from './OpenRouteTemplate';
const OpenRoutes = {
  element: <OpenRouteTemplate />,
  children: [
    {
      path: '/',
      element: <Login />
    }
  ]
};

export default OpenRoutes;
