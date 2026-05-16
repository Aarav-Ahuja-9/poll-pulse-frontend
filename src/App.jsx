import React from "react";

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar"; 
import Signup from "./pages/Signup";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VoterScreen from './pages/VoterScreen';
import CampaignDashboard from './pages/CampaignDashboard';
import Home from './pages/home';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

const AppRoutes = () => {
  const location = useLocation();

  const hideNavbar = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/poll");

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <Navbar />}

      <main className={!hideNavbar ? "pt-4" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/dashboard/:pollId" element={<CampaignDashboard />} />

          <Route path="/poll/:slug" element={<VoterScreen />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;