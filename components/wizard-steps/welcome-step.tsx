"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl mx-auto text-center space-y-8">
        <Image src="/bulqit-logo.png" alt="Bulqit Logo" width={200} height={200} className="mx-auto" />

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Join your Block.
            <br />
            Bulk home services.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {"Answer a few questions so we can bring better deals on home services to your neighborhood."}
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Button
            onClick={onNext}
            size="lg"
            className="w-full max-w-md h-14 text-lg font-semibold bg-primary hover:bg-secondary text-primary-foreground rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {"Get Started"}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground/70 pt-8">{"Takes less than 2 minutes"}</p>
      </div>
    </div>
  )
}
