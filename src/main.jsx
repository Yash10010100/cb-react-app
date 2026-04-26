import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AuthContainer from './components/AuthContainer';

import {
  EventDetails,
  EventRegistration,
  ExploreEvents,
  FormBuilder,
  LandingPage,
  LoginPage,
  ManageParticipants,
  NotFound,
  OrganizerDashboard,
  RegisterPage,
  StudentDashboard,
  UpdateEvent,
  UploadEvent
} from './pages'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <AuthContainer authentication={false}><LoginPage /></AuthContainer> },
      { path: "/register", element: <AuthContainer authentication={false}><RegisterPage /></AuthContainer> },
      { path: "/dashboard", element: <AuthContainer authentication={true} role="student"><StudentDashboard /></AuthContainer> },
      { path: "/organizer", element: <AuthContainer authentication={true} role="organizer"><OrganizerDashboard /></AuthContainer> },
      { path: "/organizer/upload", element: <AuthContainer authentication={true} role="organizer"><UploadEvent /></AuthContainer> },
      { path: "/organizer/participants", element: <AuthContainer authentication={true} role="organizer"><ManageParticipants /></AuthContainer> },
      { path: "/organizer/form-builder/:eventId", element: <AuthContainer authentication={true} role="organizer"><FormBuilder /></AuthContainer> },
      { path: "/explore", element: <ExploreEvents /> },
      { path: "/events/:id", element: <EventDetails /> },
      { path: "/events/:id/edit", element: <AuthContainer authentication={true} role="organizer"><UpdateEvent /></AuthContainer> },
      { path: "/events/:id/register", element: <AuthContainer authentication={true} role="student"><EventRegistration /></AuthContainer> },
      { path: "*", element: <NotFound /> }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
