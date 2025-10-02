"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, MapPin } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { WizardData } from "../signup-wizard"

declare global {
  interface Window {
    gm_authFailure?: () => void
  }
}

type Props = {
  data: WizardData
  updateData: (data: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

type ValidationStatus = "idle" | "validating" | "valid" | "invalid"

export function AddressStep({ data, updateData, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    address: data.address,
    city: data.city || "",
    state: data.state || "",
    zipCode: data.zipCode || "",
  })
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("idle")
  const [validationMessage, setValidationMessage] = useState("")
  const [isAutocompleteReady, setIsAutocompleteReady] = useState(false)
  const [showAutocompleteTip, setShowAutocompleteTip] = useState(false)
  const [emailError, setEmailError] = useState<string>("")
  const [emailTouched, setEmailTouched] = useState<boolean>(false)
  const [isInputMounted, setIsInputMounted] = useState(false)

  const addressInputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setEmailError("Email is required")
      return false
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    console.log("[v0] API Key configured:", apiKey ? "Yes" : "No")

    if (!apiKey) {
      setApiError(
        "Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.",
      )
      return
    }

    window.gm_authFailure = () => {
      console.log("[v0] Google Maps authentication failed")
      setApiError(
        "Google Maps API authentication failed. Please check your API key and ensure the Maps JavaScript API and Places API are enabled in Google Cloud Console.",
      )
    }

    const loadGoogleMapsScript = () => {
      if (typeof window.google !== "undefined") {
        console.log("[v0] Google Maps already loaded")
        setIsScriptLoaded(true)
        return
      }

      console.log("[v0] Loading Google Maps script...")
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=Function.prototype`
      script.async = true
      script.defer = true
      script.onload = () => {
        console.log("[v0] Google Maps script loaded successfully")
        setIsScriptLoaded(true)
        setApiError(null)
      }
      script.onerror = () => {
        console.log("[v0] Failed to load Google Maps script")
        setApiError("Failed to load Google Maps API. Please check your internet connection and API key configuration.")
      }
      document.head.appendChild(script)
    }

    loadGoogleMapsScript()

    return () => {
      delete window.gm_authFailure
    }
  }, [])

  useEffect(() => {
    if (isScriptLoaded && typeof window.google !== "undefined") {
      console.log("[v0] Initializing Geocoder")
      geocoderRef.current = new window.google.maps.Geocoder()
    }
  }, [isScriptLoaded])

  const validateAddress = async (address: string, city: string, state: string, zipCode: string) => {
    if (!geocoderRef.current || !address.trim()) {
      setValidationStatus("idle")
      return
    }

    setValidationStatus("validating")
    setValidationMessage("")

    const fullAddress = `${address}, ${city}, ${state} ${zipCode}`.trim()

    try {
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoderRef.current?.geocode(
          {
            address: fullAddress,
            componentRestrictions: { country: "US" },
          },
          (results, status) => {
            if (status === "OK" && results) {
              resolve(results)
            } else {
              reject(status)
            }
          },
        )
      })

      if (result && result.length > 0) {
        const location = result[0]

        const hasStreetAddress =
          location.types &&
          (location.types.includes("street_address") ||
            location.types.includes("premise") ||
            location.types.includes("subpremise"))

        if (hasStreetAddress) {
          setValidationStatus("valid")
          setValidationMessage("Address verified")
        } else {
          setValidationStatus("invalid")
          setValidationMessage("Please enter a complete street address")
        }
      } else {
        setValidationStatus("invalid")
        setValidationMessage("Address not found. Please check and try again.")
      }
    } catch (error) {
      setValidationStatus("invalid")
      setValidationMessage("Unable to verify address. Please check and try again.")
    }
  }

  useEffect(() => {
    if (!addressInputRef.current || !isScriptLoaded || typeof window.google === "undefined") {
      console.log("[v0] Autocomplete not ready:", {
        hasInput: !!addressInputRef.current,
        isScriptLoaded,
        hasGoogle: typeof window.google !== "undefined",
      })
      return
    }

    console.log("[v0] Initializing Google Places Autocomplete")
    console.log("[v0] Input element:", addressInputRef.current)

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["address_components", "formatted_address"],
      })

      console.log("[v0] Autocomplete initialized successfully")
      setIsAutocompleteReady(true)

      setTimeout(() => {
        const pacContainer = document.querySelector(".pac-container")
        if (pacContainer) {
          console.log("[v0] Autocomplete dropdown container found:", pacContainer)
        } else {
          console.log("[v0] Autocomplete dropdown container will appear when you start typing")
        }
      }, 1000)

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace()
        if (!place?.address_components) {
          console.log("[v0] No address components in selected place")
          return
        }

        let streetNumber = ""
        let route = ""
        let city = ""
        let state = ""
        let zipCode = ""

        place.address_components.forEach((component) => {
          const types = component.types
          if (types.includes("street_number")) {
            streetNumber = component.long_name
          }
          if (types.includes("route")) {
            route = component.long_name
          }
          if (types.includes("locality")) {
            city = component.long_name
          }
          if (types.includes("administrative_area_level_1")) {
            state = component.short_name
          }
          if (types.includes("postal_code")) {
            zipCode = component.long_name
          }
        })

        const streetAddress = `${streetNumber} ${route}`.trim()
        const fullAddressDisplay = `${streetAddress}, ${city}, ${state} ${zipCode}`.trim()

        setFormData((prev) => ({
          ...prev,
          address: fullAddressDisplay, // Display full address in the field
          city,
          state,
          zipCode,
        }))

        setShowAutocompleteTip(false)
        validateAddress(streetAddress, city, state, zipCode)
      })
    } catch (error) {
      console.error("[v0] Error initializing autocomplete:", error)
      setApiError("Failed to initialize address autocomplete. This may be due to API key restrictions.")
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [isScriptLoaded, isInputMounted])

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "address" && validationStatus !== "idle") {
      setValidationStatus("idle")
      setValidationMessage("")
    }
    if (field === "email") {
      if (emailTouched) {
        validateEmail(value)
      }
    }
  }

  const handleValidateClick = () => {
    validateAddress(formData.address, formData.city, formData.state, formData.zipCode)
  }

  const handleNext = () => {
    if (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.address.trim() &&
      (validationStatus === "valid" || apiError) &&
      validateEmail(formData.email)
    ) {
      updateData(formData)
      onNext()
    }
  }

  const ValidationIcon = () => {
    if (validationStatus === "validating") {
      return <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
    }
    if (validationStatus === "valid") {
      return <CheckCircle2 className="w-5 h-5 text-success" />
    }
    if (validationStatus === "invalid") {
      return <AlertCircle className="w-5 h-5 text-destructive" />
    }
    return null
  }

  const isValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.address.trim() &&
    (apiError || validationStatus === "valid") &&
    isValidEmail(formData.email) &&
    !emailError

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
              {"Where is your home?"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {"Enter your details and address so we can find your Bulqit Block."}
            </p>
          </div>

          {apiError && (
            <div className="p-4 rounded-xl bg-destructive/10 border-2 border-destructive/20">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive">Google Maps API Issue</p>
                  <p className="text-sm text-muted-foreground">{apiError}</p>
                  <p className="text-sm text-muted-foreground">
                    {"You can still enter your address manually. To fix autocomplete:"}
                  </p>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1 ml-2">
                    <li>{"Go to Google Cloud Console → APIs & Services → Library"}</li>
                    <li>{"Enable 'Maps JavaScript API' AND 'Places API' (both required)"}</li>
                    <li>{"Go to Credentials → Your API Key → Application restrictions"}</li>
                    <li>{"Add HTTP referrers: localhost:3000/*, 127.0.0.1:3000/*"}</li>
                    <li>{"Under API restrictions → Select 'Maps JavaScript API' and 'Places API'"}</li>
                    <li>{"Enable billing (required for Places API)"}</li>
                  </ol>
                  <p className="text-xs text-muted-foreground mt-2">
                    {"Check your browser's Network tab for specific API error messages."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-card-foreground">
                {"Street Address"} <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Input
                  id="address"
                  ref={(el) => {
                    addressInputRef.current = el
                    if (el && !isInputMounted) {
                      setIsInputMounted(true)
                    }
                  }}
                  type="text"
                  placeholder="730 South Loomis Street"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  onFocus={() => setShowAutocompleteTip(true)}
                  onBlur={() => setTimeout(() => setShowAutocompleteTip(false), 200)}
                  className="h-12 px-4 pr-12 rounded-xl border-2 border-border focus:border-border-hover bg-card"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <ValidationIcon />
                </div>
              </div>
              {isAutocompleteReady && showAutocompleteTip && !validationMessage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{"Start typing to see address suggestions"}</span>
                </div>
              )}
              {validationMessage && (
                <p className={`text-sm ${validationStatus === "valid" ? "text-success" : "text-destructive"}`}>
                  {validationMessage}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-card-foreground">
                  {"First Name"} <span className="text-primary">*</span>
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="h-12 px-4 rounded-xl border-2 border-border focus:border-border-hover bg-card"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-card-foreground">
                  {"Last Name"} <span className="text-primary">*</span>
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="h-12 px-4 rounded-xl border-2 border-border focus:border-border-hover bg-card"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-card-foreground">
                {"Email"} <span className="text-primary">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => {
                  setEmailTouched(true)
                  validateEmail(formData.email)
                }}
                className="h-12 px-4 rounded-xl border-2 border-border focus:border-border-hover bg-card"
              />
              {emailTouched && emailError && <p className="text-sm text-destructive">{emailError}</p>}
            </div>

            <input type="hidden" value={formData.city} />
            <input type="hidden" value={formData.state} />
            <input type="hidden" value={formData.zipCode} />

            {!apiError && validationStatus === "idle" && formData.address.trim() && (
              <Button
                onClick={handleValidateClick}
                variant="outline"
                size="lg"
                className="w-full h-12 text-base font-medium rounded-full bg-transparent"
              >
                {"Verify Address"}
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={!isValid}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-secondary text-primary-foreground rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {"Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
