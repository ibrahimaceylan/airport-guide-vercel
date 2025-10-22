# Phase 5 — Localization UI Polish + Language Switcher

### 🏁 Objective
Refine multilingual UI by adding a language switcher and polishing RTL/LTR alignment across the dashboard layout.

### 🧱 Deliverables
- ✅ Add a 🌐 Language Switcher in `Topbar.tsx`
- ✅ Ensure smooth transition between `/en`, `/tr`, `/ar` routes
- ✅ Polish RTL/LTR styles (margins, padding, icon alignment)
- ✅ Update typography for Arabic fonts
- ✅ Update verification + Codex meta for Phase 5

### ⚙️ Implementation Plan
1. Create `/src/components/LanguageSwitcher.tsx`  
   - Use `next-intl`’s `useLocale()` and `useTranslations()` hooks  
   - Show options: EN | TR | AR  
   - Highlight active locale  
   - Redirect via `router.push('/${locale}${pathname}')`

2. Integrate the component into `src/components/dashboard/Topbar.tsx`
   - Place it on the right side of the Topbar  
   - Adjust Tailwind utilities for RTL (`flex-row-reverse` on Arabic)  

3. Update Tailwind typography + spacing classes:
   - Replace fixed `ml`/`mr` with logical `ms`/`me` (via `rtl:ml-` classes)  
   - Ensure icon alignment consistent across locales  

4. Verification Script:
   - Check presence of `LanguageSwitcher.tsx`
   - Verify `useLocale` usage and RTL detection  

5. Docs:
   - Update `docs/project-roadmap.md` to include Phase 5  
   - Snapshot as v1.5.0  

---

### 📚 Next Phase
Phase 6 — Advanced Modules (Flight API + Real-Time Transport Integration)
