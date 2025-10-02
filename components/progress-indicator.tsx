export function ProgressIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm">
      <div className="h-1 bg-border">
        <div
          className="h-full bg-success transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
        />
      </div>
    </div>
  )
}
