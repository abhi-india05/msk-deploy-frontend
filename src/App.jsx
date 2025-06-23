import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import NotificationDrawer from './components/NotificationDrawer';
import PrivateRoute from './components/PrivateRoute';
import ClientProjects from './pages/ClientProjects';
import Clients from './pages/Clients';
import Dashboard from './pages/Dashboard';
import InvoicePage from './pages/InvoicePage';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StatPage from './pages/StatPage';
import UserProfile from './pages/UserProfile';
function App() {
  const location = useLocation();
  return (
      <>
      <ToastContainer/>
      <NotificationDrawer />
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/:user_id/dashboard' element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }/>
       <Route path="/:user_id/clients" element=
       {<PrivateRoute>
        <Clients/>
        </PrivateRoute>} />
        <Route path='/:user_id/statistics' element=
        {<PrivateRoute>
          <StatPage/>
        </PrivateRoute>} />
        <Route path="/:user_id/:client_id/:project_id/viewinvoice" element={
          <PrivateRoute>
            <InvoicePage/>
          </PrivateRoute>
        } />
         
        <Route path='/:user_id/:client_id/projects' element=
        {<PrivateRoute>
          <ClientProjects/>
        </PrivateRoute>} />

         <Route path='/:user_id/userprofile/'element={
          <PrivateRoute>
            <UserProfile/>
          </PrivateRoute>} />
       
      </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;