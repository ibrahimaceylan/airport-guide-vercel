# Phase 6C — Live Data Validation & Analytics Enhancements

### 🎯 Objective
Strengthen the Live API Analytics module by validating incoming data, improving chart visuals, and enhancing resilience for real-world API latency.

### 🧱 Deliverables
- ✅ Integrate **Zod** schemas for validating Flights & Transport API responses.  
- ✅ Add error boundary UI in `AnalyticsPanel`.  
- ✅ Extend Recharts panel with a **time-series bar chart** showing hourly departures.  
- ✅ Add utility in `/lib/validation.ts` for reuse.  
- ✅ Enhance SWR caching + error handling.

### ⚙️ Implementation Plan
1. **Schema Validation**
   - Create `/src/lib/validation.ts` using Zod.
   - Parse and clean API responses before use.

2. **Analytics Enhancements**
   - Extend `AnalyticsPanel.tsx` → add `BarChart` for hourly departures.
   - Add UI for error and loading states.

3. **Verification**
   - New script `scripts/verify-phase6c.sh` checks for Zod usage, charts, and error handlers.

### 📚 Next Phase
Phase 7 — Data Analytics & Performance Insights (expanded metrics + optimization dashboard)

---

### ✅ Implementation Summary
- Zod validation added for Flights & Transport APIs  
- Enhanced AnalyticsPanel with BarChart + PieChart  
- SWR auto-refresh and robust error handling  
- Phase 6C verified and complete
