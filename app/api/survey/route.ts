import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      address,
      city,
      state,
      zipCode,
      services,
      futureServices,
      firstName,
      lastName,
      email,
    } = body ?? {}

    if (!address || !firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql<{
      id: string
    }[]>
      `INSERT INTO wizard_survey_responses (
        address, city, state, zip_code, services, future_services, first_name, last_name, email
      ) VALUES (
        ${address}, ${city ?? null}, ${state ?? null}, ${zipCode ?? null}, ${services ?? []}, ${futureServices ?? []}, ${firstName}, ${lastName}, ${email}
      ) RETURNING id`;

    return NextResponse.json({ id: result[0].id }, { status: 201 })
  } catch (error) {
    console.error("Failed to save survey response", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 