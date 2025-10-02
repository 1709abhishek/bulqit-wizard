"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft, Check } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import type { WizardData } from "../signup-wizard"

type Props = {
  data: WizardData
  updateData: (data: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

const futureServices = [
  { id: "mobile-car-washing", name: "Mobile Car Washing", icon: <Image src="/mobile-car-washing.png" alt="Mobile Car Washing" width={50} height={50} /> },
  {id: "neighborhood-security", name: "Neighborhood Security", icon: <Image src="/neighborhood-security.png" alt="Neighborhood Security" width={50} height={50} />},
  { id: "pressure-washing", name: "Pressure Washing", icon: <Image src="/pressure-washing.png" alt="Pressure Washing" width={50} height={50} /> },
  { id: "solar-panel-cleaning", name: "Solar Panel Cleaning", icon: <Image src="/solar-panel-cleaning.png" alt="Solar Panel Cleaning" width={50} height={50} /> },
  { id: "pet-waste-removal", name: "Pet Waste Removal", icon: <Image src="/pet-waste-removal.png" alt="Pet Waste Removal" width={50} height={50} /> },
  { id: "laundry-services", name: "Laundry Services", icon: <Image src="/laundry-services.png" alt="Laundry Services" width={50} height={50} /> },
  { id: "housekeeping", name: "Housekeeping", icon: <Image src="/housekeeping.png" alt="Housekeeping" width={50} height={50} /> },
  { id: "internet-service", name: "Internet Service", icon: <Image src="/internet-service.png" alt="Internet Service" width={50} height={50} /> },
  { id: "property-tax-appeal", name: "Property Tax Appeal", icon: <Image src="/property-tax-appeal.png" alt="Property Tax Appeal" width={50} height={50} /> },
  { id: "oil-and-gas-rights-revenue", name: "Oil and Gas Rights Revenue", icon: <Image src="/oil-and-gas-rights-revenue.png" alt="Oil and Gas Rights Revenue" width={50} height={50} /> },
]

export function FutureServicesStep({ data, updateData, onNext, onBack }: Props) {
  const toggleService = (serviceId: string) => {
    const newServices = data.futureServices.includes(serviceId)
      ? data.futureServices.filter((s) => s !== serviceId)
      : [...data.futureServices, serviceId]
    updateData({ futureServices: newServices })
  }

  const handleNext = () => {
    onNext()
  }

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isValid = data.firstName && data.lastName && data.email && data.address

  const handleSubmit = async () => {
    if (!(data.firstName && data.lastName && data.email)) return

    setSubmitting(true)
    setError(null)

    // Persist to parent state first for consistency
    updateData(data)

    const payload = { ...data }

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Failed to submit")
      }

      onNext()
    } catch (e: any) {
      setError(e?.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 md:py-16">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">{"Back"}</span>
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {"What should we add next?"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {
                "These services aren't planned yet, but if enough neighbors want them, we'll work to make them happen in your Bulqit Block."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {futureServices.map((service) => {
              const isSelected = data.futureServices.includes(service.id)
              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={cn(
                    "relative p-6 rounded-2xl border-2 transition-all duration-300 text-left",
                    isSelected
                      ? "border-border-hover bg-success-muted shadow-md"
                      : "border-border bg-card hover:border-border-hover/50",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{service.icon}</span>
                      <span className="text-lg font-semibold text-card-foreground">{service.name}</span>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                        <Check className="w-4 h-4 text-success-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : null}

          <Button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-secondary text-primary-foreground rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
        </div>
      </div>
    </div>
  )
}
