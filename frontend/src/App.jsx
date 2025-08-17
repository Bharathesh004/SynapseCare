import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/NavBar'
import Homepage from './Components/HomePage'
import Footer from './Components/Footer'
import RiskAssessment from './Components/RiskAssessment'
import Login from './Components/Login'
import Register from './Components/Register'

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />          
          <Route path="/predict" element={<RiskAssessment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App