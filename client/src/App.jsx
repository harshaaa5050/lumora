import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../src/Components/Navbar'
import UserDashbord from '../src/Pages/UserDashbord'
import CreateCommunity from '../src/Pages/CreateCommunity'
import ViewCommunity from '../src/Pages/ViewCommunity'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/* Redirect root → dashboard */}
        <Route path="/" element={<Navigate to="/dashbord" replace />} />

        {/* Dashboard */}
        <Route path="/dashbord" element={<UserDashbord />} />

        {/* Create community */}
        <Route path="/community" element={<CreateCommunity />} />

        {/* View a specific community by id */}
        <Route path="/view-community/:id" element={<ViewCommunity />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/dashbord" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App