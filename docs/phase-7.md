# Phase 7 — Dynamic Content Management (CRUD + Role-Based Admin)

## 🎯 Objective
Enable full dynamic control of homepage content via database-driven CRUD operations and a modern, role-based Admin interface.

The goal is to transform static sections into editable, modular blocks controlled by Admins and Editors.

---

## 🧱 Deliverables

| Category | Deliverable | Description |
|-----------|-------------|-------------|
| 🏗️ **Database** | Prisma models for homepage sections | Hero, QuickLinks, Highlights, Transport, AtAirport, CTAStrip |
| 💾 **Backend API** | CRUD endpoints for each section | RESTful routes with validation and role protection |
| 🧰 **Admin Panel** | Add/Edit/Delete modals | Built with React Hook Form + Zod validation |
| 🔐 **Access Control** | Role-based routing | Admin = full access, Editor = edit-only |
| 🧩 **Frontend Integration** | Homepage renders dynamic data | Live fetch via `/api/content/[section]` |
| 🧭 **Verification** | `scripts/verify-phase7.sh` | Ensures DB models, API routes, and Admin CRUD UI exist |

---

## 🧩 Prisma Schema Additions

```prisma
model Hero {
  id        Int      @id @default(autoincrement())
  title     String
  subtitle  String
  imageUrl  String
  ctaText   String?
  ctaLink   String?
}

model QuickLink {
  id        Int      @id @default(autoincrement())
  label     String
  icon      String
  url       String
}

model Highlight {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  imageUrl    String
}

model Transport {
  id          Int      @id @default(autoincrement())
  mode        String
  status      String
  description String
  iconUrl     String
}

model AtAirport {
  id          Int      @id @default(autoincrement())
  name        String
  category    String
  description String
  imageUrl    String
}

model CTAStrip {
  id          Int      @id @default(autoincrement())
  title       String
  subtitle    String
  buttonText  String
  buttonUrl   String
}
```

API Endpoints Plan
Method	Path	Description	Access
GET	/api/content/[section]	Get all records for section	Public
POST	/api/content/[section]	Create new record	Admin
PUT	/api/content/[section]/[id]	Edit record	Admin / Editor
DELETE	/api/content/[section]/[id]	Delete record	Admin

All endpoints will:

Validate payload with Zod

Verify user session via auth.ts

Use Prisma ORM for DB transactions

🧮 Admin Panel UI Structure

/admin/content page with tabbed sections:

Hero

Quick Links

Highlights

Transport

At Airport

CTA Strip

Each section uses:

Data table view (list of records)

Modal for Add/Edit

Inline delete confirmation

Controlled form via React Hook Form + Zod

🎨 Modal Form Styling

Use @headlessui/react or @radix-ui/react-dialog
Combined with TailwindCSS for responsive, accessible UI.

Example (pseudo-layout):
<Dialog open={isOpen} onClose={() => setOpen(false)}>
  <DialogPanel className="p-6 bg-white rounded-xl shadow-xl">
    <h2 className="text-lg font-semibold mb-4">{mode === "add" ? "Add Hero" : "Edit Hero"}</h2>
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input name="title" label="Title" />
        <Input name="subtitle" label="Subtitle" />
        <Input name="imageUrl" label="Image URL" />
        <Button type="submit">Save</Button>
      </form>
    </FormProvider>
  </DialogPanel>
</Dialog>

Role-Based Access

middleware.ts ensures route protection:

Admin → /admin full access

Editor → /admin/content edit-only

User → Redirect to /login

Role check example:

if (session.user.role !== "ADMIN" && req.method === "POST") {
  return new Response("Forbidden", { status: 403 });
}

⚙️ Verification Plan

scripts/verify-phase7.sh will check:

✅ Prisma schema models

✅ Presence of /api/content/ routes

✅ Role-based access conditions in middleware.ts

✅ Admin modal usage (Dialog component presence)

🧩 Next Phase (8)

Phase 8 — Deployment + CMS Enhancements

Versioned content management

Revalidation hooks

Production deployment (Vercel)

Last updated: Mon Oct 20 2025 — Version 1.7.0
