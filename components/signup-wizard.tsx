"use client"

import { useState } from "react"
import { WelcomeStep } from "./wizard-steps/welcome-step"
import { AddressStep } from "./wizard-steps/address-step"
import { ServicesStep } from "./wizard-steps/services-step"
import { FutureServicesStep } from "./wizard-steps/future-services-step"
import { UserDetailsStep } from "./wizard-steps/user-details-step"
import { ThankYouStep } from "./wizard-steps/thank-you-step"
import { ProgressIndicator } from "./progress-indicator"

export type WizardData = {
  address: string
  city?: string
  state?: string
  zipCode?: string
  services: string[]
  futureServices: string[]
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function SignupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<WizardData>({
    address: "",
    services: [],
    futureServices: [],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const totalSteps = 6
  const showProgress = currentStep > 0 && currentStep < totalSteps - 1

  const updateData = (newData: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    console.log("Wizard completed with data:", data)
    nextStep()
  }

  const steps = [
    <WelcomeStep key="welcome" onNext={nextStep} />,
    <AddressStep key="address" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />,
    <ServicesStep key="services" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />,
    <FutureServicesStep key="future" data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />,
    <UserDetailsStep key="details" data={data} updateData={updateData} onNext={handleSubmit} onBack={prevStep} />,
    <ThankYouStep key="thankyou" />,
  ]

  return (
    <div className="min-h-screen bg-background-muted relative overflow-hidden">
      {showProgress && <ProgressIndicator currentStep={currentStep - 1} totalSteps={totalSteps - 2} />}
      <div className="relative z-10">{steps[currentStep]}</div>
    </div>
  )
}
