import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import all page components
import Home from './pages/Home';
import Search from './pages/Search';
import ListingDetail from './pages/ListingDetail';
import ErrorPage from './pages/Error';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// ✅ Debugging: সব কম্পোনেন্ট check করুন
console.log('App component type:', typeof App);
console.log('Home component type:', typeof Home);
console.log('Login component type:', typeof Login);
console.log('Register component type:', typeof Register);
console.log('Search component type:', typeof Search);
console.log('ListingDetail component type:', typeof ListingDetail);
console.log('ErrorPage component type:', typeof ErrorPage);

// ✅ Temporary Dashboard component (যদি Dashboard.js না থাকে)
const Dashboard = () => (
  <div style={{ padding: '24px' }}>
    <h1>User Dashboard</h1>
    <p>Welcome to your personal dashboard!</p>
    <div style={{ marginTop: '20px' }}>
      <h3>Your Activities</h3>
      <ul>
        <li>View your bookings</li>
        <li>Manage your listings</li>
        <li>Update profile settings</li>
      </ul>
    </div>
  </div>
);

// ✅ Alternative: যদি Dashboard.js file exists থাকে তাহলে comment out করুন
// import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'search', element: <Search /> },
      { path: 'listing/:id', element: <ListingDetail /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  }
]);

// ✅ Additional debugging
console.log('Dashboard component type:', typeof Dashboard);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();