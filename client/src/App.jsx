import React from 'react';
import CommunityPage from './pages/CommunityPage.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from './Pages/LandingPage.jsx'
import AuthPage from './auth/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AchievementsPage from './admin/AchievementsPage.jsx'
import RulesPage from './admin/RulesPage.jsx'
import UserReportsPage from './admin/UserReportsPage.jsx'
import CommunityReportsPage from './admin/CommunityReportsPage.jsx'

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/achievements" replace />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="rules" element={<RulesPage />} />
            <Route path="user-reports" element={<UserReportsPage />} />
            <Route path="community-reports" element={<CommunityReportsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
