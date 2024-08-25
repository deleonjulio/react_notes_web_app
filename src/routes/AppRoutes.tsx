import { createBrowserRouter } from 'react-router-dom'
import { Notes } from '../pages/Notes'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { PageNotFound } from '../pages/PageNotFound'
import { GET } from '../utils/request'

async function loader () {
  let data = {
    authenticated: false,
    email: null,
  };

  try {
    const url = '/isAuthenticated'
    const response = await GET(url);
    if(response.data.user.email) {
      data = {
        authenticated: true,
        email: response.data.user.email
      }
    }
  } catch (error) {
    console.log(error)
  }

  return data
}

const routes = [
  {
    path: '/',
    errorElement: <PageNotFound />,
    children: [
      { path: '', element: <Notes />, loader },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
];

const Root = createBrowserRouter([...routes])

export default Root
