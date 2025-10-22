import { NextResponse } from "next/server";

export async function GET() {
  const flights = [
    { id: 1, flightNo: "TK1987", destination: "London", status: "On Time", departure: "2025-10-20T09:15:00Z" },
    { id: 2, flightNo: "BA676", destination: "Istanbul", status: "Delayed", departure: "2025-10-20T10:30:00Z" },
    { id: 3, flightNo: "LH1303", destination: "Frankfurt", status: "Boarding", departure: "2025-10-20T08:50:00Z" }
  ];
  return NextResponse.json(flights);
}
