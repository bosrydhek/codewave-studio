'use client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  DollarSign, 
  Layers, 
  Palette, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react'

export function IntakePricingForm() {
  const navigate = useNavigate()
  
  // Step State: 'pricing' | 'brief' | 'payment' | 'success'
  const [step, setStep] = useState<'pricing' | 'brief' | 'payment' | 'success'>('pricing')
  
  // Pricing State
  const [expectedRoi, setExpectedRoi] = useState<number>(100000)
  const [vertical, setVertical] = useState<'high-value' | 'standard'>('high-value')
  
  // Form/Brief State
  const [brandName, setBrandName] = useState('')
  const [aesthetic, setAesthetic] = useState('Sleek')
  const [integrationNeeds, setIntegrationNeeds] = useState<string[]>([])
  const [targetAudience, setTargetAudience] = useState('')
  
  // Payment State
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [generatedProjectId, setGeneratedProjectId] = useState('')

  // Calculate Value Price
  const getCalculatedPrice = () => {
    const multiplier = vertical === 'high-value' ? 0.05 : 0.03
    const calculated = expectedRoi * multiplier
    // Clamp between £1,500 and £5,000
    return Math.min(Math.max(calculated, 1500), 5000)
  }

  const lockedPrice = getCalculatedPrice()

  const handleNextStep = () => {
    if (step === 'pricing') setStep('brief')
    else if (step === 'brief') setStep('payment')
  }

  const handleBackStep = () => {
    if (step === 'brief') setStep('pricing')
    else if (step === 'payment') setStep('brief')
  }

  const toggleIntegration = (id: string) => {
    if (integrationNeeds.includes(id)) {
      setIntegrationNeeds(prev => prev.filter(item => item !== id))
    } else {
      setIntegrationNeeds(prev => [...prev, id])
    }
  }

  const executePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPaying(true)
    
    // Simulate premium payment processing
    setTimeout(() => {
      setIsPaying(false)
      const projectId = `dw-${Math.random().toString(36).substring(2, 9)}`
      setGeneratedProjectId(projectId)
      
      // Save local mock data
      const mockProjects = JSON.parse(localStorage.getItem('designwave_projects') || '[]')
      const newProj = {
        id: projectId,
        name: brandName || 'Unnamed Venture',
        vertical: vertical === 'high-value' ? 'SaaS / Tech' : 'Agency / Local',
        roi: expectedRoi,
        price: lockedPrice,
        status: 'Brief Submitted',
        aesthetic,
        integrations: integrationNeeds,
        audience: targetAudience,
        updated_at: new Date().toISOString(),
        revisionsLeft: 3,
        clarifications: [
          {
            id: 'clar-1',
            question: 'Can you specify your primary competitor websites so our styling algorithm extracts standard conversion patterns?',
            answered: false,
            answer: ''
          }
        ],
        logs: [
          { time: new Date().toLocaleTimeString(), message: 'Brief submitted to pipeline' },
          { time: new Date().toLocaleTimeString(), message: 'Value-pricing confirmed: Stripe pre-auth success' },
          { time: new Date().toLocaleTimeString(), message: 'Clarity model queued standard competitor check' }
        ]
      }
      localStorage.setItem('designwave_projects', JSON.stringify([...mockProjects, newProj]))
      
      setStep('success')
    }, 2200)
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-indigo-950 opacity-40 blur-[130px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-primary-tint-2 opacity-10 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl glass-card rounded-modal border border-border-low bg-bg-surface/50 p-6 md:p-12 shadow-2xl backdrop-blur-xl">
        
        {/* Step Indicator Header */}
        <div className="mb-8 flex items-center justify-between border-b border-border-low/40 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-sm p-2 text-primary">
              <Cpu size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Designwave AI</span>
              <h2 className="text-lg font-bold font-display">Client Onboarding Portal</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {['Pricing', 'Brief', 'Checkout', 'Success'].map((sName, index) => {
              const currentStepIdx = ['pricing', 'brief', 'payment', 'success'].indexOf(step)
              const isActive = index <= currentStepIdx
              return (
                <div key={sName} className="flex items-center">
                  <div className={`text-[10px] font-bold px-2.5 py-1 rounded-pill transition-colors ${
                    isActive ? 'bg-primary text-text-on-primary' : 'bg-bg-sunken text-text-muted border border-border-low/50'
                  }`}>
                    {sName}
                  </div>
                  {index < 3 && <div className={`h-[1px] w-4 md:w-8 ${isActive ? 'bg-primary' : 'bg-border-low/40'}`} />}
                </div>
              )
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-display font-semibold mb-2">Value-Based Dynamic Pricing</h1>
                <p className="text-text-muted text-sm max-w-xl">
                  Get premium Payload CMS designs priced reasonably against your expected project return. Zero human sales calls, fully automated value matching.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6 bg-bg-sunken/40 border border-border-low/50 p-6 rounded-card">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-3">
                      Project ROI Vertical
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setVertical('high-value')}
                        className={`flex flex-col items-center p-4 border rounded-card transition-all ${
                          vertical === 'high-value' 
                            ? 'border-primary bg-primary/10 shadow-lg' 
                            : 'border-border-low/50 bg-bg-surface hover:bg-bg-elevated'
                        }`}
                      >
                        <TrendingUp size={24} className="text-primary mb-2" />
                        <span className="font-bold text-sm">High Value</span>
                        <span className="text-[10px] text-text-muted mt-1 text-center">SaaS, E-Com, FinTech (5% multiplier)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVertical('standard')}
                        className={`flex flex-col items-center p-4 border rounded-card transition-all ${
                          vertical === 'standard' 
                            ? 'border-primary bg-primary/10 shadow-lg' 
                            : 'border-border-low/50 bg-bg-surface hover:bg-bg-elevated'
                        }`}
                      >
                        <Layers size={24} className="text-text-muted mb-2" />
                        <span className="font-bold text-sm">Standard</span>
                        <span className="text-[10px] text-text-muted mt-1 text-center">Agencies, Creators, Local (3% multiplier)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                        Expected 12-Month ROI
                      </label>
                      <span className="text-primary font-mono font-bold">
                        £{expectedRoi.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={300000}
                      step={5000}
                      value={expectedRoi}
                      onChange={(e) => setExpectedRoi(Number(e.target.value))}
                      className="w-full h-1.5 bg-bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-text-muted mt-1">
                      <span>£10,000</span>
                      <span>£150,000</span>
                      <span>£300,000+</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Outputs */}
                <div className="flex flex-col justify-between bg-gradient-to-br from-indigo-950/20 to-bg-sunken border border-primary/20 p-8 rounded-card relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <DollarSign size={120} />
                  </div>
                  
                  <div className="relative z-10 space-y-4">
                    <span className="bg-primary-tint-1/20 border border-primary-tint-1/30 px-3 py-1 rounded-pill text-[10px] font-bold text-primary-tint-1 uppercase tracking-wide inline-block">
                      Value-Pricing Confirmed
                    </span>
                    <div>
                      <h4 className="text-text-muted text-sm font-medium">Your Transparent Flat Rate:</h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-5xl font-extrabold tracking-tight font-display text-text-primary">
                          £{lockedPrice.toLocaleString()}
                        </span>
                        <span className="text-text-muted text-sm">GBP</span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-border-low/40 pt-4 text-xs text-text-muted">
                      <div className="flex justify-between">
                        <span>Base Multiplier ({vertical === 'high-value' ? '5%' : '3%'}):</span>
                        <span>£{(expectedRoi * (vertical === 'high-value' ? 0.05 : 0.03)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Min/Max Cap Limit:</span>
                        <span>£1,500 - £5,000</span>
                      </div>
                      <div className="flex justify-between font-bold text-text-secondary pt-2 border-t border-border-low/20">
                        <span>Guaranteed Deliverable:</span>
                        <span>Full Site + Payload CMS</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full mt-6 btn-primary-gradient text-text-on-primary py-3.5 rounded-pill flex items-center justify-center gap-2 font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10"
                  >
                    Lock Price & Input Brief
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'brief' && (
            <motion.div
              key="brief"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-display font-semibold mb-2">Project Specifications</h1>
                <p className="text-text-muted text-sm">
                  Outline your brand goals and aesthetic preference to direct Claude&apos;s design layout generator.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                      Brand / Venture Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hartwell Properties"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="bg-bg-sunken border border-border-low/60 text-text-primary rounded-card px-4 py-3 w-full text-base focus:border-primary focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                      Target Audience Profile
                    </label>
                    <textarea
                      placeholder="Describe who will be visiting your site..."
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="bg-bg-sunken border border-border-low/60 text-text-primary rounded-card px-4 py-3 w-full min-h-[100px] text-base focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-2">
                      Design Aesthetic Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Sleek Glassmorphic', 'Brutalist Flat', 'Vibrant Warm', 'Minimalist Clean'].map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setAesthetic(style)}
                          className={`px-3 py-2.5 text-xs font-semibold rounded-card border transition-all text-left flex items-center justify-between ${
                            aesthetic === style 
                              ? 'border-primary bg-primary/5 text-primary' 
                              : 'border-border-low/40 bg-bg-sunken/50 text-text-muted hover:bg-bg-elevated'
                          }`}
                        >
                          {style}
                          <Palette size={14} className={aesthetic === style ? 'text-primary' : 'text-text-muted/30'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-2">
                      Required Third-Party Integrations
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'stripe', name: 'Stripe Payments' },
                        { id: 'auth', name: 'User Login' },
                        { id: 'search', name: 'Instant Search' }
                      ].map((item) => {
                        const active = integrationNeeds.includes(item.id)
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleIntegration(item.id)}
                            className={`px-2 py-2 text-[10px] font-bold rounded-sm border transition-all text-center ${
                              active 
                                ? 'border-primary bg-primary/10 text-primary' 
                                : 'border-border-low/40 bg-bg-sunken/40 text-text-muted hover:bg-bg-elevated'
                            }`}
                          >
                            {item.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border-low/40">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="px-6 py-3.5 border border-border-low/60 rounded-pill font-bold hover:bg-bg-elevated active:scale-95 transition-all text-sm"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!brandName.trim()}
                  className="flex-1 btn-primary-gradient text-text-on-primary py-3.5 rounded-pill flex items-center justify-center gap-2 font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all text-sm"
                >
                  Continue to Secure Checkout
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-display font-semibold mb-2">Secure Payment Gateway</h1>
                <p className="text-text-muted text-sm">
                  Pre-authorize Stripe payment at your locked rate of <span className="text-text-primary font-bold">£{lockedPrice.toLocaleString()}</span>. No charge is finalized until you approve the initial site design.
                </p>
              </div>

              <form onSubmit={executePayment} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Credit Card Box */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-700/80 p-6 rounded-card relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <CreditCard size={120} />
                    </div>
                    <div className="flex justify-between items-start mb-12">
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Pre-Authorization</span>
                      <CreditCard className="text-slate-400" />
                    </div>

                    <div className="space-y-4">
                      <div className="text-sm font-mono text-slate-300">
                        {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                      </div>
                      
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                        <div>
                          <div className="text-[8px] text-slate-500">Holder</div>
                          <div>{brandName || 'VALUED CUSTOMER'}</div>
                        </div>
                        <div>
                          <div className="text-[8px] text-slate-500">Expires</div>
                          <div>{cardExpiry || 'MM/YY'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs text-text-muted">
                    <ShieldCheck className="text-success flex-shrink-0" size={16} />
                    <span>Locked value payment secured in escrow. 100% money-back guarantee applies.</span>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4 bg-bg-sunken/40 border border-border-low/40 p-6 rounded-card">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      className="bg-bg-surface border border-border-low/60 text-text-primary rounded-card px-4 py-3.5 w-full text-sm font-mono focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-bg-surface border border-border-low/60 text-text-primary rounded-card px-4 py-3.5 w-full text-sm font-mono focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                        CVC
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="•••"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        className="bg-bg-surface border border-border-low/60 text-text-primary rounded-card px-4 py-3.5 w-full text-sm font-mono focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-border-low/40 mt-4">
                    <button
                      type="button"
                      onClick={handleBackStep}
                      className="px-6 py-3.5 border border-border-low/60 rounded-pill font-bold hover:bg-bg-elevated active:scale-95 transition-all text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isPaying || cardNumber.length < 16}
                      className="flex-1 btn-primary-gradient text-text-on-primary py-3.5 rounded-pill flex items-center justify-center gap-2 font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all text-xs"
                    >
                      {isPaying ? 'Authorizing Escape escrow...' : `Authorize £${lockedPrice.toLocaleString()}`}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="text-center py-12 space-y-6"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-success/20 border border-success/30 flex items-center justify-center text-success">
                <CheckCircle2 size={36} className="animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-primary font-mono font-bold tracking-widest text-xs uppercase block">ESCROW FUNDED SUCCESS</span>
                <h1 className="text-4xl font-display font-semibold">Ready to Design</h1>
                <p className="text-text-muted text-sm max-w-md mx-auto">
                  Escrow payment successfully pre-authorized. Designwave AI has initiated context mapping and structured brief compilation.
                </p>
              </div>

              <div className="bg-bg-sunken border border-border-low/50 p-6 rounded-card max-w-md mx-auto text-left space-y-3 font-mono text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span className="text-text-muted">Transaction ID:</span>
                  <span>{generatedProjectId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Auth Rate:</span>
                  <span>£{lockedPrice.toLocaleString()} GBP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Active Pipeline:</span>
                  <span className="text-primary font-bold">1-Shot Generation Queue</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/portal/${generatedProjectId}`)}
                className="btn-primary-gradient text-text-on-primary px-8 py-4 rounded-pill flex items-center justify-center gap-2 font-bold shadow-xl mx-auto hover:scale-105 active:scale-95 transition-all text-base"
              >
                Track Live Progress
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
