"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft, Check } from "lucide-react"
import Image from "next/image"
import type { WizardData } from "../signup-wizard"

type Props = {
  data: WizardData
  updateData: (data: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

const services = [
  { id: "lawn-care", name: "Lawn Care", icon: <Image src="/lawn-care.png" alt="Lawn Care" width={50} height={50} /> },
  { id: "pool-maintenance", name: "Pool Maintenance", icon: <Image src="/pool-maintenance.png" alt="Pool Maintenance" width={50} height={50} /> },
  { id: "pest-control", name: "Pest Control", icon: <Image src="/pest-control.png" alt="Pest Control" width={50} height={50} /> },
  { id: "outdoor-cleaning", name: "Outdoor Cleaning", icon: <Image src="/outdoor-cleaning.png" alt="Outdoor Cleaning" width={50} height={50} /> },
  { id: "window-cleaning", name: "Window Cleaning", icon: <Image src="/window-cleaning.png" alt="Window Cleaning" width={50} height={50} /> },
  { id: "trash-bin-cleaning", name: "Trash Bin Cleaning", icon: <Image src="/trash-bin-cleaning.png" alt="Trash Bin Cleaning" width={50} height={50} /> },
]

export function ServicesStep({ data, updateData, onNext, onBack }: Props) {
  const toggleService = (serviceId: string) => {
    const newServices = data.services.includes(serviceId)
      ? data.services.filter((s) => s !== serviceId)
      : [...data.services, serviceId]
    updateData({ services: newServices })
  }

  const handleNext = () => {
    if (data.services.length > 0) {
      onNext()
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
              {"What services are you interested in?"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {"Select all that apply. We'll work to bring these to your Block."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => {
              const isSelected = data.services.includes(service.id)
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

          <Button
            onClick={handleNext}
            disabled={data.services.length === 0}
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-secondary text-primary-foreground rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {"Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}
