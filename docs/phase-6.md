# Phase 6 — Advanced Modules (Flights API + Real-Time Transport Integration)

### 🎯 Objective
Integrate live data for flight departures/arrivals and real-time ground transport modules, extending the dashboard’s interactivity.

### 🧱 Deliverables
- ✅ Flight departures/arrivals via external API (mock or open-data source)
- ✅ Real-time updates for transport (metro, taxi, bus)
- ✅ Modular service structure for easy API swapping
- ✅ Loading/error states with graceful fallbacks
- ✅ Verification & Codex metadata updates

### ⚙️ Implementation Plan
1. **API Layer**
   - Create `/src/lib/api/flights.ts` and `/src/lib/api/transport.ts`
   - Fetch data from a sample REST endpoint or mock JSON
   - Cache results with ISR or SWR

2. **Dashboard Components**
   - Update `FlightsList.tsx` to consume live data
   - Enhance `TaxiWidget`, `BusWidget`, etc. with status badges (“On Time”, “Delayed”)

3. **UI Polish**
   - Add shimmer loaders while fetching
   - Include “Last updated X minutes ago” footer

4. **Verification**
   - New script `scripts/verify-phase6.sh` checks for `/src/lib/api` and live data hooks

### 📚 Next Phase
Phase 7 — Data Analytics & Performance Insights
