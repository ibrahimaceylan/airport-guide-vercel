import { z } from "zod";

export const FlightSchema = z.object({
  id: z.string(),
  airline: z.string(),
  destination: z.string(),
  departureTime: z.string(),
  status: z.enum(["On Time", "Delayed", "Cancelled"]),
});

export const TransportSchema = z.object({
  mode: z.enum(["Taxi", "Bus", "Metro", "Parking"]),
  active: z.boolean(),
  lastUpdate: z.string(),
});

export const FlightsResponseSchema = z.array(FlightSchema);
export const TransportResponseSchema = z.array(TransportSchema);
