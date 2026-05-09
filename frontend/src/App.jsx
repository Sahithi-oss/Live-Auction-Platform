import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuctionRoom from './pages/AuctionRoom';
import CreateAuction from './pages/CreateAuction';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import AdminPanel from './pages/AdminPanel';
import PaymentPage from './pages/PaymentPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-sky-500/30">
          <Toaster position="bottom-right" toastOptions={{
            style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
          }} />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auction/:id" element={<AuctionRoom />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-auction" element={<CreateAuction />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/payment/:auctionId" element={<PaymentPage />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
