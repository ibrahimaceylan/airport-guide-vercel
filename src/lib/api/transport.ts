import { TransportResponseSchema, TransportSchema } from "@/lib/validation";

export type TransportStatus = typeof TransportSchema._type;

export async function fetchTransportStatuses(): Promise<TransportStatus[]> {
  const url =
    process.env.TRANSPORT_API_URL ||
    "https://mock.istairport.dev/api/transport";

  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const json = await response.json();
    return TransportResponseSchema.parse(json);
  } catch (error) {
    console.warn("[fetchTransportStatuses] Validation or network fallback:", error);
    const now = new Date().toISOString();
    return [
      { mode: "Taxi", active: true, lastUpdate: now },
      { mode: "Bus", active: true, lastUpdate: now },
      { mode: "Metro", active: false, lastUpdate: now },
      { mode: "Parking", active: true, lastUpdate: now },
    ];
  }
}
