import { Link, useLocation, Outlet } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import useRegistrationStore from '../../store/registrationStore'

export default function RegisterLayout() {
  const location = useLocation()
  const { step1Completed, step2Completed } = useRegistrationStore()

  const getStepNumber = () => {
    if (location.pathname.includes('cuenta')) return 1
    if (location.pathname.includes('pago')) return 2
    if (location.pathname.includes('confirmacion')) return 3
    return 1
  }

  const currentStep = getStepNumber()

  const isStepAccessible = (stepNumber) => {
    if (stepNumber <= currentStep) return true
    if (stepNumber === 2 && step1Completed) return true
    if (stepNumber === 3 && step2Completed) return true
    return false
  }

  const steps = [
    { number: 1, label: 'Registro', path: '/registro/cuenta' },
    { number: 2, label: 'Pago', path: '/registro/pago' },
    { number: 3, label: 'Dashboard', path: '/registro/confirmacion' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex justify-between items-center py-4 px-8 bg-white border-b border-slate-200">
        <Link
          to={currentStep > 1 ? steps[currentStep - 2].path : '/'}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-rose-500 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-bold text-lg">
            <span className="text-blue-600">BIT</span>
            <span className="text-rose-500">WATCH</span>
          </span>
        </Link>

        <div className="text-right">
          <div className="text-xs text-slate-400">Plan seleccionado</div>
          <div className="text-sm font-semibold text-blue-600">Plan DEMO</div>
        </div>
      </header>

      <div className="flex justify-center py-8 px-8">
        <div className="flex items-center gap-0 max-w-xl w-full">
          {steps.map((step, index) => {
            const accessible = isStepAccessible(step.number)
            return (
              <div key={step.number} className="flex items-center flex-1 last:flex-initial">
                {accessible ? (
                  <Link to={step.path} className="flex flex-col items-center group">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        currentStep >= step.number
                          ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                          : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'
                      }`}
                    >
                      {currentStep > step.number ? '✓' : step.number}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                        currentStep >= step.number ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center cursor-not-allowed opacity-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-slate-200 text-slate-400">
                      {step.number}
                    </div>
                    <span className="text-xs mt-2 font-medium text-slate-400">
                      {step.label}
                    </span>
                  </div>
                )}
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 mt-[-20px] transition-colors duration-500 ${
                      currentStep > step.number ? 'bg-blue-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <main className="px-8 pb-12 animate-fade-in"><Outlet /></main>
    </div>
  )
}
