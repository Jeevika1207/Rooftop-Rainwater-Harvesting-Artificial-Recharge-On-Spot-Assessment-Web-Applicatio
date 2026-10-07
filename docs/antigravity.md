# Hydronix Industrial: Complete Project Prompt

## Overview
Hydronix Industrial is a precision assessment tool for Rooftop Rainwater Harvesting (RTRWH) and Artificial Recharge (AR). It is designed for industrial, commercial, and residential scales, providing data-driven feasibility reports based on GIS coordinates and local rainfall patterns.

## Tech Stack
- **Framework**: Next.js 15 (App Router).
- **UI**: Shadcn UI, Tailwind CSS, Lucide Icons.
- **Charts**: Recharts (Radar for Water Balance, Bar for 10-Year ROI).
- **AI/GenAI**: Genkit with Gemini 2.5 Flash for GIS automation and document extraction.
- **Data**: Open-Meteo API for historical rainfall data.
- **Deployment**: PWA enabled with Web Manifest and offline-ready metadata.

## Core Logic & Features
1. **Dual-Mode Assessment**:
   - **Industrial**: Focused on m³ volumes, heavy-duty RCC tanks, and process water demand.
   - **Residential**: Focused on family member counts (135L/day benchmark) and modular tanks.
2. **GIS Automation**: Uses geolocation to identify site coordinates and triggers AI-simulated analysis of catchment area footprint.
3. **Dynamic Calculations**:
   - **Harvest Potential**: `Area * Rainfall * Runoff Coefficient`.
   - **Tank Optimization**: Balanced between daily demand, critical storage days, and site space constraints.
   - **Groundwater Recharge**: Calculates surplus water for dual-injection well potential.
4. **Economic Analysis**: Generates a 10-year ROI forecast comparing initial investment against municipal water savings.
5. **Professional Reporting**: 
   - Interactive results dashboard.
   - "Export Full Report" functionality optimized for high-fidelity PDF generation via CSS `@media print`.
6. **Theme Support**: Full Dark/Light mode support via `next-themes`.

## Project Prompt (The "Antigravity" Master Instruction)
"Act as a professional water engineering consultant. Build a PWA using Next.js 15 and Shadcn UI that performs industrial-grade rainwater harvesting assessments. Integrate a historical rainfall API, implement a calculation engine for tank sizing and groundwater recharge, and provide a visual dashboard with ROI analysis. Ensure the UI is mobile-first, supports dark mode, and allows for professional report exports. When 'Other' industry is selected, allow custom text entry. All logic should be backed by a configurable JSON benchmark dataset."
