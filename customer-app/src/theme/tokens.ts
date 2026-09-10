/**
 * Reload Official Design System - Centralized Design Tokens
 * 
 * Strict Design System Rules:
 * 1. Alert Red (#DC2626) is reserved exclusively for unmitigated hazards, cancellations, or expired compliance — never decorative.
 * 2. Only one primary CTA per screen uses Trust Teal (#0F6E56); all secondary actions use neutral text links or subtle outlined buttons.
 * 3. High-contrast pairings (Ink Slate #16212E on Paper #F8F9FA / Pure White #FFFFFF) for extreme outdoor legibility.
 * 4. Tri-Color Risk Model: Verified/Active (#0F6E56), Due/Pending/Warning (#D97706), Expired/Critical/Error (#DC2626).
 */

export const reloadTokens = {
  // 1. Primary Brand & Core System Colors
  primary: '#0F6E56',             // Trust Teal: primary CTA, active nav pills/tabs, verified badges, active route markers
  primaryDark: '#0B5240',         // Deep Teal: hover & pressed states for primary buttons
  primaryTint: '#E6F4F1',         // Teal Tint / Mint: verified pill backgrounds, active tab soft highlights, success alert cards
  surface: '#F8F9FA',             // Primary Surface (Paper/Canvas): global background canvas
  card: '#FFFFFF',                // Card Surface (Pure White): form cards, modals, data tables, elevated sheets
  ink: '#16212E',                 // Primary Text/Ink (Ink Slate): page headers, main headings, primary data points
  muted: '#5A6578',               // Secondary Text (Muted Slate): subtitles, field labels, timestamps, table headers, helper text
  border: '#E2E8F0',              // Borders & Dividers (Border Gray): card borders, table dividers, input strokes, separators

  // 2. Status & Compliance Colors (Tri-Color Risk Model)
  statusVerified: '#0F6E56',      // Verified/Active: document verified, active trip, gate pass cleared, compliant status
  statusVerifiedTint: '#E6F4F1',  // Fill for verified/active status
  statusWarning: '#D97706',       // Due/Pending/Warning: expiring documents (within 30 days), medium-severity flags, pending review
  statusWarningTint: '#FEF3C7',   // Fill for due/pending/warning
  statusCritical: '#DC2626',      // Expired/Critical/Error: expired documents, high-severity flags, critical deviations, cancelled trips
  statusCriticalTint: '#FEF2F2',  // Fill for expired/critical/error

  // 3. Specialized Freight & Category Accents
  regulatedCargo: '#2563EB',      // Cold-Chain Blue: reefer/pharma/cold-chain compliance badges
  regulatedCargoTint: '#EFF6FF',  // Tint for cold-chain badges
  neutralState: '#64748B',        // Neutral Gray: closed bookings, low-severity flags, inactive filters, disabled states
  neutralStateTint: '#F1F5F9',    // Tint for neutral gray
  adminShell: '#0F172A',          // Dark Console Navy: optional high-contrast admin utility elements, terminal-grade indicators
} as const;

export type ReloadTokens = typeof reloadTokens;
export default reloadTokens;
