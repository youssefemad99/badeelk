# scripts/generate_css.py
# Generates comprehensive, high-contrast, modern styles.css for Badeelk
# Compliant with Section 4: Green primary, Red warnings only, Beige notes only,
# Dark mode toggle, mobile-first with >=44px tap targets, soft fade-in, responsive.

CSS_CONTENT = """/* styles.css - Design System & UI Components for Badeelk (بديلك) */
/* Color Rules: Green is primary brand, Red is warnings only, Beige is notes only */

:root {
  --font-family: 'Cairo', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Primary Green Palette */
  --brand-primary: #0F5A46;
  --brand-primary-hover: #093f31;
  --brand-surface: #ECF8F4;
  --brand-surface-subtle: #F3FAF7;
  --brand-border: #A8DEC9;
  --brand-text: #0B4536;

  /* Red Warning Palette (Warnings only) */
  --danger: #B91C1C;
  --danger-surface: #FEF2F2;
  --danger-border: #FECACA;
  --danger-text: #991B1B;

  /* Beige Note Palette (Notes & disclaimers only) */
  --note-surface: #FFFBEB;
  --note-border: #FDE68A;
  --note-text: #92400E;

  /* Neutral Surface / Dark Mode Tokens */
  --bg-app: #F8FAFC;
  --card-bg: #FFFFFF;
  --card-hover: #FFFFFF;
  --text-main: #0F172A;
  --text-secondary: #334155;
  --text-muted: #64748B;
  --border-subtle: #E2E8F0;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(15, 90, 70, 0.08);
  --shadow-lg: 0 10px 25px -3px rgba(15, 90, 70, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-full: 9999px;
  --focus-ring: 0 0 0 3px rgba(15, 90, 70, 0.25);
  --min-tap: 44px;
}

body.theme-dark {
  --brand-primary: #10B981;
  --brand-primary-hover: #059669;
  --brand-surface: #064E3B;
  --brand-surface-subtle: #022C22;
  --brand-border: #047857;
  --brand-text: #A7F3D0;

  --danger: #EF4444;
  --danger-surface: #450A0A;
  --danger-border: #7F1D1D;
  --danger-text: #FCA5A5;

  --note-surface: #451A03;
  --note-border: #78350F;
  --note-text: #FDE68A;

  --bg-app: #0B1311;
  --card-bg: #13221E;
  --card-hover: #192D28;
  --text-main: #F1F5F9;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;
  --border-subtle: #1F3831;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.6);
  --focus-ring: 0 0 0 3px rgba(16, 185, 129, 0.35);
}

/* Global Reset & Base */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-family);
  font-size: 16px;
  line-height: 1.5;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  background-color: var(--bg-app);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 1) TOP NAVIGATION HEADER */
.site-header {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.header-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.brand-wrapper {
  display: flex;
  align-items: center;
}

.brand-logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.logo-box {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--brand-primary), #1A8065);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(15, 90, 70, 0.25);
  flex-shrink: 0;
}

.brand-titles {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--brand-primary);
  line-height: 1.2;
}

.brand-tagline {
  font-size: 0.75rem;
  color: var(--text-muted);
  display: none;
}

@media (min-width: 640px) {
  .brand-tagline {
    display: block;
  }
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-ctrl {
  background-color: var(--brand-surface-subtle);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 12px;
  min-height: var(--min-tap);
  border-radius: var(--radius-full);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.btn-ctrl:hover {
  background-color: var(--brand-surface);
  color: var(--brand-text);
  border-color: var(--brand-border);
}

.btn-icon {
  width: var(--min-tap);
  padding: 0;
}

/* 2) HERO SECTION & SEARCH BAR */
.hero-section {
  background: linear-gradient(180deg, var(--brand-surface-subtle) 0%, var(--bg-app) 100%);
  padding: 32px 16px 20px 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.hero-container {
  max-width: 820px;
  margin: 0 auto;
  text-align: center;
}

.hero-copy-block {
  margin-bottom: 24px;
}

.hero-main-title {
  font-size: 1.85rem;
  font-weight: 900;
  color: var(--text-main);
  line-height: 1.3;
  margin-bottom: 10px;
}

@media (min-width: 640px) {
  .hero-main-title {
    font-size: 2.3rem;
  }
}

.hero-sub-text {
  font-size: 0.95rem;
  color: var(--text-secondary);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Hero Search Box Container */
.search-hero-box {
  position: relative;
  margin: 0 auto;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--card-bg);
  border: 2px solid var(--brand-primary);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
  padding: 4px 8px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.search-input-container:focus-within {
  box-shadow: 0 0 0 4px rgba(15, 90, 70, 0.2), var(--shadow-lg);
}

.search-leading-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--brand-primary);
  flex-shrink: 0;
}

.hero-search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
  outline: none;
  padding: 10px 4px;
  min-height: var(--min-tap);
  width: 100%;
}

.hero-search-input::placeholder {
  color: var(--text-muted);
  font-weight: 400;
  font-size: 0.95rem;
}

.search-trailing-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-search-action {
  background: transparent;
  border: none;
  color: var(--text-muted);
  width: var(--min-tap);
  height: var(--min-tap);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-search-action:hover {
  background-color: var(--brand-surface);
  color: var(--brand-primary);
}

.clear-btn {
  font-size: 1.1rem;
  font-weight: 700;
}

/* Autocomplete Dropdown Listbox */
.autocomplete-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-height: 420px;
  overflow-y: auto;
  z-index: 1000;
  display: none;
  text-align: right;
  padding: 6px;
}

html[dir="ltr"] .autocomplete-dropdown {
  text-align: left;
}

.autocomplete-dropdown.active {
  display: block;
  animation: fadeIn 0.12s ease-out;
}

.suggestion-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  min-height: var(--min-tap);
  border-radius: var(--radius-md);
  cursor: pointer;
  gap: 12px;
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color 0.15s ease;
}

.suggestion-row:last-child {
  border-bottom: none;
}

.suggestion-row:hover,
.suggestion-row.keyboard-selected {
  background-color: var(--brand-surface);
}

.suggestion-meta-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.suggestion-brand-ar {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-main);
}

.suggestion-brand-en {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--brand-text);
}

.suggestion-meta-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

html[dir="ltr"] .suggestion-meta-right {
  align-items: flex-start;
}

.suggestion-formula {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.suggestion-badge-form {
  font-size: 0.72rem;
  font-weight: 600;
  background-color: var(--brand-surface-subtle);
  color: var(--brand-text);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.highlight-match {
  background-color: #FEF08A;
  color: #713F12;
  border-radius: 2px;
  padding: 0 2px;
  font-weight: 800;
}

/* Recent Searches Header */
.recent-searches-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 6px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
}

.btn-clear-recent {
  background: none;
  border: none;
  font-family: inherit;
  font-size: 0.75rem;
  color: var(--danger);
  cursor: pointer;
  text-decoration: underline;
}

.recent-search-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--text-main);
  transition: background-color 0.15s ease;
}

.recent-search-item:hover {
  background-color: var(--brand-surface);
}

/* Popular Chips directly below search box */
.popular-chips-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.popular-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  white-space: nowrap;
}

.chips-scroller {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
}

.chips-scroller::-webkit-scrollbar {
  display: none;
}

.chip-item {
  background-color: var(--card-bg);
  border: 1px solid var(--border-subtle);
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 6px 12px;
  min-height: 38px;
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
  transition: all 0.15s ease;
}

.chip-item:hover {
  background-color: var(--brand-surface);
  color: var(--brand-text);
  border-color: var(--brand-border);
}

/* Single line Database Stats */
.db-stats-single-line {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 16px;
  padding: 4px 12px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}

/* 3) MAIN APP CONTAINER */
.main-app-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
  flex: 1;
  width: 100%;
}

/* 4) SEARCH RESULTS VIEW */
.search-results-section {
  animation: fadeIn 0.25s ease-out;
}

.queried-drug-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-md);
  margin-bottom: 20px;
}

.queried-top-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.queried-brand-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--brand-primary);
}

.queried-brand-en {
  font-size: 1.05rem;
  color: var(--text-secondary);
}

.queried-badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  background-color: var(--brand-surface);
  color: var(--brand-text);
}

.meta-badge-form {
  background-color: var(--border-subtle);
  color: var(--text-main);
}

/* Alerts inside results */
.alert-strip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-top: 12px;
}

.alert-mandatory {
  background-color: var(--brand-surface);
  border: 1px solid var(--brand-border);
  color: var(--brand-text);
}

.alert-sensitive {
  background-color: var(--danger-surface);
  border: 1px solid var(--danger-border);
  color: var(--danger-text);
  font-weight: 600;
}

/* Filter and Sorting Toolbar */
.results-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}

.toolbar-heading {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-main);
}

.toolbar-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.select-filter {
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-app);
  color: var(--text-main);
  min-height: 38px;
  cursor: pointer;
}

/* Substitutes Grid */
.substitutes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.substitute-item-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  position: relative;
}

.substitute-item-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--brand-border);
}

.substitute-item-card.is-current {
  border: 2px solid var(--brand-primary);
  background-color: var(--brand-surface-subtle);
}

.current-match-pill {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 0.72rem;
  font-weight: 700;
  background-color: var(--brand-primary);
  color: #FFFFFF;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

html[dir="ltr"] .current-match-pill {
  left: auto;
  right: 10px;
}

.sub-card-header {
  display: flex;
  flex-direction: column;
}

.sub-brand-ar {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-main);
}

.sub-brand-en {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brand-primary);
}

.sub-company {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.sub-details-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: var(--bg-app);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
}

.sub-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.sub-price-val {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--brand-primary);
}

.sub-price-na {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-style: italic;
}

.sub-card-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px solid var(--border-subtle);
}

.btn-card-action {
  flex: 1;
  background-color: var(--bg-app);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 6px 8px;
  min-height: 38px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.15s ease;
}

.btn-card-action:hover {
  background-color: var(--brand-surface);
  color: var(--brand-text);
  border-color: var(--brand-border);
}

/* Empty Search State */
.empty-results-box {
  background-color: var(--card-bg);
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 40px 20px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.empty-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-main);
  margin-top: 12px;
}

.empty-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-top: 8px;
  line-height: 1.6;
}

/* 5) DEFAULT EDUCATIONAL BOTTOM SECTIONS */
.info-grid-section {
  margin-top: 36px;
}

.section-block-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
  text-align: center;
  margin-bottom: 20px;
}

.three-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.feature-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.feature-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background-color: var(--brand-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.feature-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
}

.feature-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.bottom-notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.note-box {
  padding: 16px;
  border-radius: var(--radius-md);
}

.alert-beige {
  background-color: var(--note-surface);
  border: 1px solid var(--note-border);
  color: var(--note-text);
}

.alert-red {
  background-color: var(--danger-surface);
  border: 1px solid var(--danger-border);
  color: var(--danger-text);
}

.note-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 6px;
}

.note-body {
  font-size: 0.88rem;
  line-height: 1.5;
}

.privacy-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 24px;
  text-align: center;
  padding: 12px;
}

/* 6) FOOTER */
.site-footer {
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-subtle);
  padding: 20px 16px;
  margin-top: auto;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.footer-sub-meta {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-link-btn {
  background: none;
  border: none;
  color: var(--brand-primary);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 4px;
}

/* 7) MODALS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-overlay.active {
  display: flex;
  animation: fadeIn 0.15s ease-out;
}

.modal-container {
  background-color: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  max-width: 540px;
  width: 100%;
  padding: 24px;
  box-shadow: var(--shadow-lg);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close-btn {
  position: absolute;
  top: 14px;
  left: 14px;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-app);
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

html[dir="ltr"] .modal-close-btn {
  left: auto;
  right: 14px;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.modal-icon-badge {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: var(--brand-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sources-list {
  padding-right: 20px;
  margin: 10px 0;
  font-size: 0.9rem;
  line-height: 1.6;
}

html[dir="ltr"] .sources-list {
  padding-right: 0;
  padding-left: 20px;
}

.modal-notice-box {
  background-color: var(--brand-surface);
  border: 1px solid var(--brand-border);
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--brand-text);
  margin-top: 12px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-main);
}

.form-input, .form-textarea {
  font-family: inherit;
  font-size: 0.95rem;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-app);
  color: var(--text-main);
  outline: none;
}

.form-input:focus, .form-textarea:focus {
  border-color: var(--brand-primary);
  box-shadow: var(--focus-ring);
}

.btn-submit-report {
  background-color: var(--brand-primary);
  color: #FFFFFF;
  border: none;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 12px;
  min-height: var(--min-tap);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-submit-report:hover {
  background-color: var(--brand-primary-hover);
}

/* Camera Barcode Scanner */
.scanner-container {
  max-width: 440px;
}

.barcode-video {
  width: 100%;
  height: 260px;
  border-radius: var(--radius-md);
  background-color: #000000;
  object-fit: cover;
}

.scanner-status {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 8px;
}

/* Price Update & Under Review Badges (Modification 1) */
.stats-sep {
  opacity: 0.5;
  margin: 0 4px;
}

.price-update-tag {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.price-under-review {
  color: #B45309;
  background-color: #FEF3C7;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
}

body.theme-dark .price-under-review {
  background-color: #78350F;
  color: #FDE68A;
}

/* AI Explainer Modal & Button (Modification 3) */
.btn-explain-ai {
  background-color: var(--brand-surface);
  border: 1px solid var(--brand-border);
  color: var(--brand-text);
  font-weight: 700;
}

.btn-explain-ai:hover {
  background-color: var(--brand-primary);
  color: #FFFFFF;
}

.ai-modal-container {
  max-width: 620px;
}

.ai-icon-badge {
  background: linear-gradient(135deg, var(--brand-surface), #A3D9C9);
}

.ai-modal-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.ai-loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 16px;
  text-align: center;
}

.ai-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-subtle);
  border-top-color: var(--brand-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ai-error-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  text-align: center;
  gap: 12px;
}

.ai-content-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 10px;
  animation: fadeIn 0.2s ease-out;
}

.ai-section {
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 12px;
}

.ai-section:last-of-type {
  border-bottom: none;
}

.ai-section-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--brand-primary);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ai-section-body {
  font-size: 0.92rem;
  color: var(--text-main);
  line-height: 1.6;
}

.ai-badge-class {
  display: inline-block;
  background-color: var(--brand-surface);
  color: var(--brand-text);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
}

.ai-list {
  padding-right: 20px;
  margin: 4px 0 0 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-main);
}

html[dir="ltr"] .ai-list {
  padding-right: 0;
  padding-left: 20px;
}

.ai-list li {
  margin-bottom: 4px;
}

.list-danger li {
  color: var(--danger-text);
}

.ai-permanent-disclaimer {
  background-color: var(--note-surface);
  border: 1px solid var(--note-border);
  color: var(--note-text);
  padding: 12px 14px;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 600;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 8px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
"""

with open("../styles.css", "w", encoding="utf-8") as f:
    f.write(CSS_CONTENT)

print("Updated ../styles.css successfully!")
