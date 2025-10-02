import SignupWizard from "@/components/signup-wizard"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

describe("SignupWizard Integration Tests", () => {
  beforeEach(() => {
    render(<SignupWizard />)
  })

  describe("Welcome Step", () => {
    it("should render welcome step initially", () => {
      expect(screen.getByText(/Join your Block/i)).toBeInTheDocument()
      expect(screen.getByText(/Get Started/i)).toBeInTheDocument()
    })

    it("should navigate to address step when Get Started is clicked", async () => {
      const user = userEvent.setup()
      const getStartedButton = screen.getByText(/Get Started/i)

      await user.click(getStartedButton)

      await waitFor(() => {
        expect(screen.getByText(/Where is your home/i)).toBeInTheDocument()
      })
    })
  })








  describe("Progress Indicator", () => {
    it("should show correct progress at each step", async () => {
      const user = userEvent.setup()

      // Welcome step - no progress indicator visible yet
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()

      // Navigate to address step
      await user.click(screen.getByText(/Get Started/i))
      await waitFor(() => screen.getByText(/Where is your home/i))

      // Progress indicator should be visible
      const progressIndicator = screen.getByRole("progressbar")
      expect(progressIndicator).toBeInTheDocument()
    })
  })

})
