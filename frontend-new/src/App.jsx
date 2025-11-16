import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import RoleSelection from './pages/RoleSelection';
import Buyer from './pages/Buyer';
import Seller from './pages/Seller';
import Renter from './pages/Renter';
import Orders from './pages/Orders';

const AppRoutes = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/buyer" element={<Buyer />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/renter" element={<Renter />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </Router>
  );
}

export default App;
