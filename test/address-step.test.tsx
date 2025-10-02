import { AddressStep } from "@/components/wizard-steps/address-step"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("AddressStep Component", () => {
  const mockOnNext = vi.fn()
  const mockOnBack = vi.fn()
  const mockUpdateData = vi.fn()
  const defaultData = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    services: [],
    futureServices: [],
    phone: "",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render all form fields", () => {
    render(<AddressStep data={defaultData} updateData={mockUpdateData} onNext={mockOnNext} onBack={mockOnBack} />)

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Street Address/i)).toBeInTheDocument()
  })

  it("should disable continue button when fields are empty", () => {
    render(<AddressStep data={defaultData} updateData={mockUpdateData} onNext={mockOnNext} onBack={mockOnBack} />)

    const continueButton = screen.getByText(/Continue/i)
    expect(continueButton).toBeDisabled()
  })


  it("should call onBack when back button is clicked", async () => {
    const user = userEvent.setup()
    render(<AddressStep data={defaultData} updateData={mockUpdateData} onNext={mockOnNext} onBack={mockOnBack} />)

    await user.click(screen.getByText(/Back/i))
    expect(mockOnBack).toHaveBeenCalled()
  })

  it("should populate fields with existing data", () => {
    const existingData = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      address: "456 Main St",
      city: "Test City",
      state: "TC",
      zipCode: "12345",
      services: [],
      futureServices: [],
      phone: "",
    }

    render(<AddressStep data={existingData} updateData={mockUpdateData} onNext={mockOnNext} onBack={mockOnBack} />)

    expect(screen.getByLabelText(/First Name/i)).toHaveValue("Jane")
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue("Smith")
    expect(screen.getByLabelText(/Email/i)).toHaveValue("jane@example.com")
    expect(screen.getByLabelText(/Street Address/i)).toHaveValue("456 Main St")
  })

  it("should show heading text", () => {
    render(<AddressStep data={defaultData} updateData={mockUpdateData} onNext={mockOnNext} onBack={mockOnBack} />)

    expect(screen.getByText(/Where is your home/i)).toBeInTheDocument()
  })
})
