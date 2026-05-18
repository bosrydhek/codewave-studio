import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/components/LandingPage'
import { Workbench } from '@/components/Workbench'
import { IntakePricingForm } from '@/components/IntakePricingForm'
import { ClientPipelinePortal } from '@/components/ClientPipelinePortal'
import { OperatorPanel } from '@/components/OperatorPanel'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/intake" element={<IntakePricingForm />} />
        <Route path="/portal/:id" element={<ClientPipelinePortal />} />
        <Route path="/operator" element={<OperatorPanel />} />
        <Route path="/dashboard" element={<Workbench initialView="dashboard" />} />
        
        {/* Catch-all */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App
