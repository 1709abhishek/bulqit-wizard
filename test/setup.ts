import "@testing-library/jest-dom"
import { cleanup } from "@testing-library/react"
import { afterEach, beforeAll, vi } from "vitest"

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables
beforeAll(() => {
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "test-api-key"
})

global.google = {
  maps: {
    places: {
      Autocomplete: vi.fn().mockImplementation(() => ({
        addListener: vi.fn((event, callback) => {
          // Store callback for manual triggering if needed
          return callback
        }),
        getPlace: vi.fn(() => ({
          formatted_address: "123 Test St, Test City, TC 12345",
          address_components: [
            { types: ["street_number"], long_name: "123" },
            { types: ["route"], long_name: "Test St" },
            { types: ["locality"], long_name: "Test City" },
            { types: ["administrative_area_level_1"], short_name: "TC" },
            { types: ["postal_code"], long_name: "12345" },
          ],
        })),
        setFields: vi.fn(),
      })),
      PlacesServiceStatus: {
        OK: "OK",
      },
    },
    Geocoder: vi.fn().mockImplementation(() => ({
      geocode: vi.fn((request, callback) => {
        callback(
          [
            {
              formatted_address: "123 Test St, Test City, TC 12345",
              types: ["street_address"], // Added types array
              address_components: [
                { types: ["street_number"], long_name: "123" },
                { types: ["route"], long_name: "Test St" },
                { types: ["locality"], long_name: "Test City" },
                { types: ["administrative_area_level_1"], short_name: "TC" },
                { types: ["postal_code"], long_name: "12345" },
              ],
            },
          ],
          "OK",
        )
      }),
    })),
    GeocoderStatus: {
      OK: "OK",
    },
    event: {
      addListener: vi.fn(),
      clearInstanceListeners: vi.fn(),
    },
  },
} as any

const originalCreateElement = document.createElement.bind(document)
document.createElement = vi.fn((tagName: string, options?: any) => {
  if (tagName === "script") {
    const mockScript = originalCreateElement(tagName, options) as HTMLScriptElement
    // Prevent actual script loading by immediately calling onload
    Object.defineProperty(mockScript, "src", {
      set: (value: string) => {
        // Simulate successful script load
        setTimeout(() => {
          if (mockScript.onload) {
            mockScript.onload(new Event("load"))
          }
        }, 0)
      },
    })
    return mockScript
  }
  return originalCreateElement(tagName, options)
}) as any

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any
