"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import type { WizardData } from "../signup-wizard"

type Props = {
  data: WizardData
  updateData: (data: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

export function UserDetailsStep({ data, updateData, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!(formData.firstName && formData.lastName && formData.email)) return

    setSubmitting(true)
    setError(null)

    // Persist to parent state first for consistency
    updateData(formData)

    const payload = { ...data, ...formData }

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

  const isValid = formData.firstName && formData.lastName && formData.email

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 md:py-16">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">{"Back"}</span>
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {"Almost there!"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {"Enter your details so we can keep you updated on your Bulqit Block."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  {"First Name"} <span className="text-primary">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Abhishek"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="h-12 px-4 rounded-xl border-2 border-border focus:border-border-hover bg-card"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  {"Last Name"} <span className="text-primary">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Jain"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="h-12 px-4 rounded-xl border-2 border-border focus:border-border-hover bg-card"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                {"Email"} <span className="text-primary">*</span>
              </label>
              <Input
                type="email"
                placeholder="1709abhishek@gmail.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-12 px-4 rounded-xl border-2 border-border focus:border-border-hover bg-card"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                {"Phone"} <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <Input
                type="tel"
                placeholder="(773) 837-2198"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="h-12 px-4 rounded-xl border-2 border-border focus:border-border-hover bg-card"
              />
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
    </div>
  )
}
