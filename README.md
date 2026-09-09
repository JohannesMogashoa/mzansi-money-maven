# Mzansi Money Maven

Mzansi Money Maven is an Investec-focused personal-finance assistant designed to help users understand spending patterns, surface financial insights, and receive context-aware guidance from their transaction data.

The current application combines authenticated onboarding and dashboards with Investec Private Banking integration, Convex application data, AI providers, and financial visualisation components.

## Product focus

The public experience is built around three ideas:

- **Spending patterns** — identify trends across transaction activity.
- **Personalised nudges** — turn financial context into actionable guidance.
- **Instant insights** — explain financial behaviour in a more accessible way.

The landing page explicitly positions the product for Investec clients and routes users toward onboarding and the authenticated dashboard.

## Current architecture

```text
Next.js 16 application
      |
      +--> Clerk authentication
      +--> onboarding
      +--> dashboard
      +--> server/API routes
      |
      +-------------+----------------+
      |             |                |
      v             v                v
   Convex       Investec PB API   AI providers
 app state       transactions      OpenRouter /
                                Vercel AI SDK
```

## Tech stack

- Next.js 16 + React 19
- TypeScript
- Clerk
- Convex
- Investec Private Banking API client
- Vercel AI SDK
- OpenRouter provider/SDK
- Recharts
- React Hook Form + Zod
- Tailwind CSS 4
- Vercel Analytics

## Repository structure

```text
app/
  page.tsx          product landing page
  onboarding/       onboarding flow
  dashboard/        authenticated financial experience
  api/              server/integration endpoints

components/         reusable UI and product components
convex/             backend data/functions
```

## Engineering focus

- keeping Investec credentials and financial API operations behind server boundaries;
- using Convex for reactive application state and backend workflows;
- separating authentication identity from financial-domain data;
- using AI to explain or enrich financial information rather than replacing deterministic transaction data;
- presenting financial information through charts and concise dashboard views.

## Getting started

```bash
npm install
npm run dev
```

Configure the Clerk, Convex, Investec, and AI-provider environment values required by the current application before using authenticated/integration flows.

Production checks:

```bash
npm run lint
npm run build
```

## Security and privacy

This project handles personal financial information. Keep banking credentials, authentication secrets, AI-provider keys, and server tokens out of source control. Financial data should be minimised and only sent to AI providers when the feature explicitly requires it and the data boundary is understood.

## Project status

Mzansi Money Maven is an evolving financial-assistant application. The repository already contains the product shell, onboarding/dashboard architecture, authentication, Convex, Investec, and AI integration dependencies; this README avoids claiming specific automated advice or analysis behaviours beyond what the implementation supports.
