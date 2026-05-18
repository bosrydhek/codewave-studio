import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/components/LandingPage'
import { Workbench } from '@/components/Workbench'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Workbench initialView="dashboard" />} />
        <Route path="/editor" element={<Workbench initialView="editor" />} />
        <Route path="/projects" element={<Workbench initialView="projects" />} />
        <Route path="/canvas" element={<Workbench initialView="canvas" />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Workbench initialView="welcome" />} />
      </Routes>
    </Router>
  )
}

export default App
