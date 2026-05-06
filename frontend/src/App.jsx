import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import TenantList from './pages/TenantList';
import TenantForm from './pages/TenantForm';
import TenantDetail from './pages/TenantDetail';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col font-schibsted bg-black text-white">
      <nav className="border-b border-white/10 sticky top-0 z-50 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-12">
              <Link to="/" className="flex items-center space-x-3">
                <img src="/logo.png" alt="Admin Portal Logo" className="w-8 h-8 rounded-lg object-contain bg-green-400" />
                <span className="text-xl font-bold tracking-tight">Admin Portal <span className="text-brand italic font-normal text-sm">v1.0</span></span>
              </Link>
              <div className="hidden md:flex space-x-8">
                <NavBtn to="/">Dashboard</NavBtn>
                <NavBtn to="/analytics">Analytics</NavBtn>
                <NavBtn to="/tenants">Tenants</NavBtn>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <div className="text-right">
                    <p className="text-sm font-bold leading-none">{user?.username}</p>
                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-bold">Admin</p>
                </div>
                <button 
                  onClick={logout} 
                  className="bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-6 flex-grow w-full">
        {children}
      </main>
      
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-xs font-medium text-white/40">
          Build with 💚 by <span className="text-brand font-bold">Team 77</span>
        </p>
      </footer>
    </div>
  );
};

const NavBtn = ({ to, children }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `text-sm font-semibold transition-all px-3 py-2 rounded-lg ${
      isActive 
      ? 'bg-brand text-black shadow-lg shadow-brand/20' 
      : 'text-white/60 hover:bg-white/5 hover:text-white'
    }`}
  >
    {children}
  </NavLink>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/tenants" element={<ProtectedRoute><Layout><TenantList /></Layout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
          <Route path="/new" element={<ProtectedRoute><Layout><TenantForm /></Layout></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><Layout><TenantForm /></Layout></ProtectedRoute>} />
          <Route path="/tenant/:id" element={<ProtectedRoute><Layout><TenantDetail /></Layout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
