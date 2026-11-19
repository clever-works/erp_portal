# Nexus ERP Portal

A responsive ERP portal starter built with Next.js App Router, TypeScript, Tailwind CSS 4, and Lucide icons.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Node.js 20.9 or later is required by the current Next.js line.

## Current scope

The portal includes a responsive workspace shell, dashboard, workforce chart, employee directory with search/status filters and CSV export, employee creation, leave request approve/reject actions, attendance check-in/out, theme switching, and starter views for the other ERP modules. Demo changes persist in the browser's local storage.

The employee and leave data in this starter are sample data. Authentication, PostgreSQL/Prisma, server-side permissions, file storage, and production workflows are not connected yet. Add those in the next implementation phases before using this with real organizational data.

## Structure

- `src/app/layout.tsx`: application metadata and global stylesheet
- `src/app/page.tsx`: portal entry point
- `src/app/globals.css`: responsive design system and layout styles
- `src/components/erp-portal.tsx`: interactive portal experience and sample module views

