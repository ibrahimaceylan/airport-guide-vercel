import { FlightsResponseSchema, FlightSchema } from "@/lib/validation";

export type Flight = typeof FlightSchema._type;

export async function fetchFlights(): Promise<Flight[]> {
  const url =
    process.env.FLIGHTS_API_URL || "https://mock.istairport.dev/api/flights";

  try {
    const response = await fetch(url, { next: { revalidate: 30 } });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const json = await response.json();
    return FlightsResponseSchema.parse(json);
  } catch (error) {
    console.warn("[fetchFlights] Validation or network fallback:", error);
    return [
      {
        id: "TK001",
        airline: "Turkish Airlines",
        destination: "London",
        departureTime: "12:00",
        status: "On Time",
      },
      {
        id: "TK002",
        airline: "Pegasus",
        destination: "Berlin",
        departureTime: "13:30",
        status: "Delayed",
      },
      {
        id: "TK003",
        airline: "Emirates",
        destination: "Dubai",
        departureTime: "14:45",
        status: "Cancelled",
      },
    ];
  }
}
