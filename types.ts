import { ReactNode } from 'react';

// V4.0.0 — PRD "site swap" spine. Five sections (BIO / INFLUENCES / AI /
// AMERICAN DYNAMISM / BRAND) plus the FRONT_MATTER cover and the MANIFEST
// index overlay. The old taste-led spine (TASTE/SEEING/VISUAL_LANGUAGES/
// DOCTRINE/DOCTRINE_LIBRARY/PORTFOLIOS/BIOGRAPHY) was retired in the swap.
export enum ModuleType {
  MANIFEST = 'MANIFEST',
  FRONT_MATTER = 'FRONT_MATTER',
  BIO = 'BIO',
  INFLUENCES = 'INFLUENCES',
  AI = 'AI',
  AMERICAN_DYNAMISM = 'AMERICAN_DYNAMISM',
  BRAND = 'BRAND'
}

/** Evidence link item for module sidebar. Reserved for future use. */
export interface EvidenceItem {
  title: string;
  description: string;
  link: string;
  linkLabel?: string;
}

/** Subsection for implications and stress tests. Reserved for future use. */
export interface SubSection {
  title: string;
  content: string[];
}

/**
 * A source-cited quote pulled directly from a doctrine artifact.
 * Used by Tier-1 company cards to surface L9 evidence — the rule
 * the artifact lives by, in its own words.
 */
export interface DoctrineExcerpt {
  quote: string;
  source: string;
}

/**
 * Tier-2 doctrine card — for artifacts that codify a system of rules
 * rather than ship a product surface. Examples: SEAL (5-palette brand
 * doctrine), DYNAMISM DOSSIER (8-doctrine corpus extraction), LIFT BENCH
 * (founder-engineering swarm doctrine).
 *
 * Distinct from the Tier-1 company schema because Tier-2 artifacts prove
 * rule-making ability, not shipping ability.
 */
export interface DoctrineCard {
  /** Short identifier — uppercase. */
  name: string;
  /** One-line domain claim — what the doctrine governs. */
  thesisLine: string;
  /** Cover quote pulled from the artifact, source-cited. */
  doctrineExcerpt: DoctrineExcerpt;
  /** Object kind on disk. Sets the L7 visual register. */
  artifactFormat: 'codex' | 'skill' | 'interactive' | 'framework' | 'spec';
  /** Hard count of governing units (rules / palettes / cells / doctrines). */
  governingUnits: string;
  /** What this doctrine proves about the practice. */
  proves: string;
  /** Public link — live demo, repo, or downloadable artifact. */
  link: string;
  /** Domain anchor — SEAL register where applicable. */
  domain?: 'maritime' | 'industrial' | 'spectrum' | 'air' | 'ground' | 'editorial' | 'cross-domain';
  /** Secondary artifacts demonstrating the doctrine in application.
   *  If `pending` is true, the link is unverified and renders as plain text
   *  with a REPO PENDING mark rather than as a clickable anchor. */
  implementations?: { name: string; link: string; pending?: boolean }[];
}

export interface ModuleData {
  id: ModuleType;
  index: string; // "01", "02" etc.
  title: string;
  promptText: string; // Renamed from prompt for clarity
  responseText: string; // Plain text for logic/inquiry
  responseDisplay: ReactNode; // Rich UI content
  themeColor: 'blue' | 'cream' | 'black' | 'clay';
  implications?: SubSection;
  evidence?: EvidenceItem[];
  stressTest?: SubSection;
}

export interface InquiryState {
  assess: string[];
  challenge: string[];
  note: string;
}
