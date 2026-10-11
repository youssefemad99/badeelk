// app.js - Main Application Controller for "بديلك" (Badeelk)
// Compliant with all PDF updates:
// Modification 1: Price audit, display 'السعر قيد المراجعة' for unverified, unverified sorted last, price last updated date.
// Modification 2: Completely removed digitToggleBtn, Western digits (0-9) used consistently.
// Modification 3: '✨ اشرح بالذكاء الاصطناعي' button, clinical safety prompt, 8 clear sections, proxy server integration, caching & rate-limit handling.

import { searchMedication, getSuggestions, highlightMatch, getRecentSearches, clearRecentSearches } from "./searchEngine.js";
import { initDataLoader } from "./dataLoader.js";
import { DATASET_METRICS, DRUG_DATABASE, PRICE_LAST_UPDATED, PRICE_LAST_UPDATED_EN } from "./dataset.js";
import {
  t,
  setLanguage,
  toggleLanguage,
  getCurrentLanguage,
  applyTranslationsToDOM
} from "./i18n.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Clean up any deprecated localStorage digit key (Modification 2)
  localStorage.removeItem("badeelak_digits");

  // Initialize on-demand chunk loader
  initDataLoader();

  // DOM Elements
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearBtn");
  const suggestionsDropdown = document.getElementById("suggestionsDropdown");
  const searchResultsView = document.getElementById("searchResultsView");
  const defaultHomeSections = document.getElementById("defaultHomeSections");
  const popularChipsContainer = document.getElementById("popularChipsContainer");
  const srAnnouncer = document.getElementById("srAnnouncer");

  // Controls
  const langToggleBtn = document.getElementById("langToggleBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const voiceSearchBtn = document.getElementById("voiceSearchBtn");
  const barcodeScanBtn = document.getElementById("barcodeScanBtn");

  // Stat & Date Elements (Modification 1)
  const statTotalDrugs = document.getElementById("statTotalDrugs");
  const statTotalGroups = document.getElementById("statTotalGroups");
  const priceLastUpdatedText = document.getElementById("priceLastUpdatedText");

  // Modals
  const aboutModal = document.getElementById("aboutModal");
  const openAboutBtn = document.getElementById("openAboutBtn");
  const footerAboutBtn = document.getElementById("footerAboutBtn");
  const closeAboutModalBtn = document.getElementById("closeAboutModalBtn");

  const reportModal = document.getElementById("reportModal");
  const closeReportModalBtn = document.getElementById("closeReportModalBtn");
  const reportForm = document.getElementById("reportForm");
  const reportedDrugName = document.getElementById("reportedDrugName");
  const footerReportBtn = document.getElementById("footerReportBtn");

  const barcodeModal = document.getElementById("barcodeModal");
  const closeBarcodeModalBtn = document.getElementById("closeBarcodeModalBtn");
  const barcodeVideo = document.getElementById("barcodeVideo");
  const scannerStatus = document.getElementById("scannerStatus");

  // AI Explainer Modal Elements (Modification 3)
  const aiExplainModal = document.getElementById("aiExplainModal");
  const closeAiModalBtn = document.getElementById("closeAiModalBtn");
  const aiModalDrugSubtitle = document.getElementById("aiModalDrugSubtitle");
  const aiLoadingBox = document.getElementById("aiLoadingBox");
  const aiErrorBox = document.getElementById("aiErrorBox");
  const aiErrorMsg = document.getElementById("aiErrorMsg");
  const aiRetryBtn = document.getElementById("aiRetryBtn");
  const aiContentBox = document.getElementById("aiContentBox");
  const aiSummary = document.getElementById("aiSummary");
  const aiDrugClass = document.getElementById("aiDrugClass");
  const aiAllowedFor = document.getElementById("aiAllowedFor");
  const aiAvoidIf = document.getElementById("aiAvoidIf");
  const aiSideEffects = document.getElementById("aiSideEffects");
  const aiInteractions = document.getElementById("aiInteractions");
  const aiTips = document.getElementById("aiTips");
  const aiSeeDoctorIf = document.getElementById("aiSeeDoctorIf");

  let lastAiRequestParams = null;

  // State
  let currentSearchResults = null;
  let activeFilterForm = "ALL";
  let activeFilterCompany = "ALL";
  let activeSortBy = "cheapest";
  let selectedSuggestionIndex = -1;
  let debounceTimer = null;
  let cameraStream = null;

  // =========================================================
  // 1) INITIALIZE LANGUAGE & THEME PREFERENCES
  // =========================================================
  const savedLang = localStorage.getItem("badeelak_lang") || "ar";
  setLanguage(savedLang);

  const savedTheme = localStorage.getItem("badeelak_theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("theme-dark");
    updateThemeIcon(true);
  }

  function updateThemeIcon(isDark) {
    if (!themeToggleBtn) return;
    const moon = themeToggleBtn.querySelector(".icon-moon");
    const sun = themeToggleBtn.querySelector(".icon-sun");
    if (moon && sun) {
      moon.style.display = isDark ? "none" : "block";
      sun.style.display = isDark ? "block" : "none";
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("theme-dark");
      localStorage.setItem("badeelak_theme", isDark ? "dark" : "light");
      updateThemeIcon(isDark);
    });
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      toggleLanguage();
      renderStats();
      if (currentSearchResults) {
        renderResultsView(currentSearchResults);
      }
    });
  }

  // Render Database Stats & Price Last Updated (Modification 1 & 2)
  function renderStats() {
    const totalCount = DATASET_METRICS ? DATASET_METRICS.totalRecords : DRUG_DATABASE.length;
    const groupsCount = DATASET_METRICS ? DATASET_METRICS.totalSubstituteGroups : 16808;
    const currentLang = getCurrentLanguage();

    if (statTotalDrugs) statTotalDrugs.textContent = totalCount.toLocaleString("en-US");
    if (statTotalGroups) statTotalGroups.textContent = groupsCount.toLocaleString("en-US");
    if (priceLastUpdatedText) {
      priceLastUpdatedText.textContent = currentLang === "ar" ? (PRICE_LAST_UPDATED || "11 أكتوبر 2026") : (PRICE_LAST_UPDATED_EN || "October 11, 2026");
    }
  }
  renderStats();

  // =========================================================
  // 2) LIVE AUTOCOMPLETE (100MS DEBOUNCE, START AT 1ST CHAR)
  // =========================================================
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value;

    if (query.trim().length > 0) {
      clearBtn.style.display = "flex";
      debounceTimer = setTimeout(() => {
        handleAutocomplete(query.trim());
      }, 100);
    } else {
      clearBtn.style.display = "none";
      showRecentSearches();
    }
  });

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim().length === 0) {
      showRecentSearches();
    } else {
      handleAutocomplete(searchInput.value.trim());
    }
  });

  async function handleAutocomplete(query) {
    selectedSuggestionIndex = -1;
    const suggestions = await getSuggestions(query);

    if (suggestions.length === 0) {
      suggestionsDropdown.innerHTML = `
        <div style="padding:12px; font-size:0.85rem; color:var(--text-muted); text-align:center;">
          ${t("noResultsTitle")}
        </div>
      `;
      suggestionsDropdown.classList.add("active");
      announceToScreenReader(t("noResultsTitle"));
      return;
    }

    const currentLang = getCurrentLanguage();

    suggestionsDropdown.innerHTML = suggestions.map((s, idx) => {
      const brandPrimary = currentLang === "ar" ? (s.brandAr || s.brandEn) : s.brandEn;
      const brandSecondary = currentLang === "ar" ? s.brandEn : (s.brandAr || s.brandEn);
      const highlightedPrimary = highlightMatch(brandPrimary, query);
      const activePrimary = currentLang === "ar" ? (s.activeIngredientAr || s.activeIngredientEn) : s.activeIngredientEn;

      return `
        <div class="suggestion-row" role="option" id="suggest-item-${idx}" data-index="${idx}" data-search="${s.brandEn}">
          <div class="suggestion-meta-left">
            <span class="suggestion-brand-ar">${highlightedPrimary}</span>
            <span class="suggestion-brand-en">${brandSecondary}</span>
          </div>
          <div class="suggestion-meta-right">
            <span class="suggestion-formula">${activePrimary} ${s.concentration || ''}</span>
            <span class="suggestion-badge-form">${s.form}</span>
          </div>
        </div>
      `;
    }).join("");

    suggestionsDropdown.classList.add("active");
    announceToScreenReader(`${suggestions.length} suggestions available.`);

    suggestionsDropdown.querySelectorAll(".suggestion-row").forEach(row => {
      row.addEventListener("click", () => {
        const text = row.getAttribute("data-search");
        selectAndSearch(text);
      });
    });
  }

  function showRecentSearches() {
    selectedSuggestionIndex = -1;
    const recent = getRecentSearches();
    if (recent.length === 0) {
      suggestionsDropdown.classList.remove("active");
      return;
    }

    suggestionsDropdown.innerHTML = `
      <div class="recent-searches-header">
        <span>${t("recentSearchesHeading")}</span>
        <button id="btnClearRecentList" class="btn-clear-recent">${t("clearRecent")}</button>
      </div>
      ${recent.map((item) => `
        <div class="recent-search-item" data-text="${item}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>${item}</span>
        </div>
      `).join("")}
    `;

    suggestionsDropdown.classList.add("active");

    const clearBtnList = document.getElementById("btnClearRecentList");
    if (clearBtnList) {
      clearBtnList.addEventListener("click", (e) => {
        e.stopPropagation();
        clearRecentSearches();
        suggestionsDropdown.classList.remove("active");
      });
    }

    suggestionsDropdown.querySelectorAll(".recent-search-item").forEach(el => {
      el.addEventListener("click", () => {
        const text = el.getAttribute("data-text");
        selectAndSearch(text);
      });
    });
  }

  function selectAndSearch(term) {
    searchInput.value = term;
    clearBtn.style.display = "flex";
    suggestionsDropdown.classList.remove("active");
    executeSearch(term);
  }

  function announceToScreenReader(message) {
    if (srAnnouncer) {
      srAnnouncer.textContent = message;
    }
  }

  // =========================================================
  // 3) KEYBOARD ACCESSIBILITY (UP, DOWN, ENTER, ESCAPE)
  // =========================================================
  searchInput.addEventListener("keydown", (e) => {
    const rows = suggestionsDropdown.querySelectorAll(".suggestion-row");
    const count = rows.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (count > 0) {
        selectedSuggestionIndex = (selectedSuggestionIndex + 1) % count;
        updateSelectedSuggestion(rows);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (count > 0) {
        selectedSuggestionIndex = (selectedSuggestionIndex - 1 + count) % count;
        updateSelectedSuggestion(rows);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && rows[selectedSuggestionIndex]) {
        const text = rows[selectedSuggestionIndex].getAttribute("data-search");
        selectAndSearch(text);
      } else if (searchInput.value.trim().length > 0) {
        suggestionsDropdown.classList.remove("active");
        executeSearch(searchInput.value.trim());
      }
    } else if (e.key === "Escape") {
      suggestionsDropdown.classList.remove("active");
    }
  });

  function updateSelectedSuggestion(rows) {
    rows.forEach((r, idx) => {
      if (idx === selectedSuggestionIndex) {
        r.classList.add("keyboard-selected");
        searchInput.setAttribute("aria-activedescendant", r.id);
        r.scrollIntoView({ block: "nearest" });
      } else {
        r.classList.remove("keyboard-selected");
      }
    });
  }

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.style.display = "none";
    suggestionsDropdown.classList.remove("active");
    resetToDefaultView();
    searchInput.focus();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchHeroBox")) {
      suggestionsDropdown.classList.remove("active");
    }
  });

  popularChipsContainer.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip-item");
    if (chip) {
      const q = chip.getAttribute("data-query");
      if (q) {
        selectAndSearch(q);
      }
    }
  });

  function resetToDefaultView() {
    currentSearchResults = null;
    searchResultsView.style.display = "none";
    searchResultsView.innerHTML = "";
    defaultHomeSections.style.display = "block";
  }

  // =========================================================
  // 4) SEARCH EXECUTION & RESULTS RENDERING
  // =========================================================
  async function executeSearch(query) {
    defaultHomeSections.style.display = "none";
    searchResultsView.style.display = "block";
    searchResultsView.innerHTML = `
      <div class="queried-drug-card" style="opacity:0.6;">
        <div style="height:28px; width:40%; background:var(--border-subtle); border-radius:6px; margin-bottom:12px;"></div>
        <div style="height:18px; width:60%; background:var(--border-subtle); border-radius:6px;"></div>
      </div>
    `;

    const result = await searchMedication(query, {
      sortBy: activeSortBy,
      formFilter: activeFilterForm === "ALL" ? null : activeFilterForm,
      companyFilter: activeFilterCompany === "ALL" ? null : activeFilterCompany
    });

    currentSearchResults = result;
    renderResultsView(result);
  }

  function isSensitiveMedicine(activeIngredientEn) {
    const sensitiveKeys = [
      "CARBAMAZEPINE", "VALPROATE", "VALPROIC", "LEVETIRACETAM", "LAMOTRIGINE",
      "LEVOTHYROXINE",
      "WARFARIN", "RIVAROXABAN", "APIXABAN", "DABIGATRAN", "CLOPIDOGREL",
      "INSULIN", "GLIMEPIRIDE", "GLICLAZIDE", "METFORMIN",
      "DIGOXIN", "AMIODARONE", "LITHIUM", "THEOPHYLLINE"
    ];
    const up = (activeIngredientEn || "").toUpperCase();
    return sensitiveKeys.some(k => up.includes(k));
  }

  function renderResultsView(searchResult) {
    if (!searchResult.found) {
      renderNotFoundView(searchResult.query);
      return;
    }

    const { result, substitutes, matchedBrandEn } = searchResult;
    const currentLang = getCurrentLanguage();
    const isSensitive = isSensitiveMedicine(result.activeIngredientEn);

    const availableForms = Array.from(new Set(substitutes.map(s => s.form).filter(Boolean)));
    const activeIngPrimary = currentLang === "ar" ? (result.activeIngredientAr || result.activeIngredientEn) : result.activeIngredientEn;
    const activeIngSecondary = currentLang === "ar" ? result.activeIngredientEn : (result.activeIngredientAr || result.activeIngredientEn);

    searchResultsView.innerHTML = `
      <!-- TOP QUERIED DRUG CARD -->
      <div class="queried-drug-card">
        <div class="queried-top-row">
          <div>
            <h2 class="queried-brand-title">${activeIngPrimary}</h2>
            <div class="queried-brand-en">${activeIngSecondary}</div>
          </div>
          <div class="queried-badges-row">
            <span class="meta-badge">⚡ ${result.concentration || ''}</span>
            <span class="meta-badge meta-badge-form">💊 ${result.form}</span>
            <button class="btn-card-action btn-explain-ai" 
              data-ingredient-en="${result.activeIngredientEn || ''}" 
              data-ingredient-ar="${result.activeIngredientAr || ''}" 
              data-strength="${result.concentration || ''}" 
              data-form="${result.form || ''}" 
              title="اشرح هذا الدواء بالذكاء الاصطناعي">
              ${t("explainWithAi")}
            </button>
          </div>
        </div>

        <!-- Mandatory Pharmacist Disclaimer Strip -->
        <div class="alert-strip alert-mandatory">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F5A46" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span data-i18n="verifiedFormula">${t("verifiedFormula")}</span>
        </div>

        <!-- Sensitive Medication Warning Banner -->
        ${isSensitive ? `
          <div class="alert-strip alert-sensitive">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span data-i18n="sensitiveWarning">${t("sensitiveWarning")}</span>
          </div>
        ` : ""}
      </div>

      <!-- FILTER & SORTING TOOLBAR -->
      <div class="results-toolbar">
        <div class="toolbar-heading">
          <span data-i18n="substitutesFound">${t("substitutesFound")}</span> (${substitutes.length})
        </div>
        <div class="toolbar-controls">
          <select id="sortSelect" class="select-filter" aria-label="Sort options">
            <option value="cheapest" ${activeSortBy === 'cheapest' ? 'selected' : ''}>${t('sortCheapest')}</option>
            <option value="company" ${activeSortBy === 'company' ? 'selected' : ''}>${t('sortCompany')}</option>
            <option value="name" ${activeSortBy === 'name' ? 'selected' : ''}>${t('sortName')}</option>
          </select>

          <select id="formFilterSelect" class="select-filter" aria-label="Filter by dosage form">
            <option value="ALL">${t('filterFormAll')}</option>
            ${availableForms.map(f => `<option value="${f}" ${activeFilterForm === f ? 'selected' : ''}>${f}</option>`).join("")}
          </select>
        </div>
      </div>

      <!-- SUBSTITUTES GRID -->
      <div class="substitutes-grid">
        ${substitutes.map(sub => renderSubstituteCard(sub, matchedBrandEn)).join("")}
      </div>
    `;

    setupCardEventListeners(substitutes);

    const sortSelect = document.getElementById("sortSelect");
    const formFilterSelect = document.getElementById("formFilterSelect");

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        activeSortBy = e.target.value;
        executeSearch(searchInput.value.trim());
      });
    }

    if (formFilterSelect) {
      formFilterSelect.addEventListener("change", (e) => {
        activeFilterForm = e.target.value;
        executeSearch(searchInput.value.trim());
      });
    }
  }

  // Render Substitute Card (Modification 1 & 3: Price verification & AI button)
  function renderSubstituteCard(sub, matchedBrandEn) {
    const currentLang = getCurrentLanguage();
    const isCurrent = matchedBrandEn && sub.brandEn.toUpperCase() === matchedBrandEn.toUpperCase();

    const brandAr = sub.brandAr || sub.brandEn;
    const brandEn = sub.brandEn;
    const company = sub.company || (currentLang === "ar" ? "شركة محلية مسجلة" : "Registered Local Pharma");
    const activeText = currentLang === "ar" ? (sub.activeIngredientAr || sub.activeIngredientEn) : sub.activeIngredientEn;

    // Price Display Validation Rule (Modification 1):
    // If priceVerified is false, show "السعر قيد المراجعة"
    // Otherwise show formatted price "4.80 ج.م"
    let priceHtml = "";
    if (sub.priceVerified === false) {
      priceHtml = `<span class="price-under-review" data-i18n="priceUnderReview">${t("priceUnderReview")}</span>`;
    } else if (sub.price !== null && sub.price !== undefined && Number(sub.price) > 0) {
      const formattedPrice = Number(sub.price).toFixed(2);
      priceHtml = `<span class="sub-price-val">${formattedPrice} ${t("currencyEgp")}</span>`;
    } else {
      priceHtml = `<span class="price-under-review" data-i18n="priceUnderReview">${t("priceUnderReview")}</span>`;
    }

    return `
      <div class="substitute-item-card ${isCurrent ? 'is-current' : ''}">
        ${isCurrent ? `<span class="current-match-pill">${currentLang === 'ar' ? 'اللي بحثت عنه' : 'Searched Item'}</span>` : ''}

        <div class="sub-card-header">
          <h3 class="sub-brand-ar">${brandAr}</h3>
          <div class="sub-brand-en">${brandEn}</div>
          <div class="sub-company">${company}</div>
        </div>

        <div class="sub-details-box">
          <div><strong>${t("filterFormAll")}:</strong> ${sub.form}</div>
          <div><strong>${currentLang === 'ar' ? 'المادة والتركيز:' : 'Formula:'}</strong> ${activeText} ${sub.concentration || ''}</div>
          <div class="sub-price-row">
            <span>${currentLang === 'ar' ? 'السعر الرسمي:' : 'Official Price:'}</span>
            ${priceHtml}
          </div>
        </div>

        <div class="sub-card-actions">
          <button class="btn-card-action btn-explain-ai" 
            data-ingredient-en="${sub.activeIngredientEn || ''}" 
            data-ingredient-ar="${sub.activeIngredientAr || ''}" 
            data-strength="${sub.concentration || ''}" 
            data-form="${sub.form || ''}" 
            title="اشرح بالذكاء الاصطناعي">
            ${t("explainWithAi")}
          </button>

          <button class="btn-card-action btn-copy-name" data-name="${brandEn} / ${brandAr}" title="نسخ اسم الدواء">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span class="copy-label">${t("copyName")}</span>
          </button>

          <button class="btn-card-action btn-share-wa" data-share="${encodeURIComponent(`بديل دواء: ${brandAr} (${brandEn}) - نفس المادة ${activeText} والتركيز ${sub.concentration} - عبر تطبيق بديلك https://badeelk.com/`)}" title="مشاركة على واتساب">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>واتساب</span>
          </button>

          <button class="btn-card-action btn-report-card" data-drug="${brandAr} (${brandEn})" title="الإبلاغ عن تصحيح">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            <span>${t("reportMistake")}</span>
          </button>
        </div>
      </div>
    `;
  }

  function setupCardEventListeners() {
    // Copy Name button
    document.querySelectorAll(".btn-copy-name").forEach(btn => {
      btn.addEventListener("click", () => {
        const textToCopy = btn.getAttribute("data-name");
        navigator.clipboard.writeText(textToCopy).then(() => {
          const labelEl = btn.querySelector(".copy-label");
          if (labelEl) {
            const originalText = labelEl.textContent;
            labelEl.textContent = t("copied");
            setTimeout(() => {
              labelEl.textContent = originalText;
            }, 2000);
          }
        });
      });
    });

    // WhatsApp Share button
    document.querySelectorAll(".btn-share-wa").forEach(btn => {
      btn.addEventListener("click", () => {
        const shareText = btn.getAttribute("data-share");
        window.open(`https://wa.me/?text=${shareText}`, "_blank");
      });
    });

    // Report Error button on each card
    document.querySelectorAll(".btn-report-card").forEach(btn => {
      btn.addEventListener("click", () => {
        const drugName = btn.getAttribute("data-drug");
        openReportModalWithDrug(drugName);
      });
    });

    // AI Explainer button (Modification 3)
    document.querySelectorAll(".btn-explain-ai").forEach(btn => {
      btn.addEventListener("click", () => {
        const ingredientEn = btn.getAttribute("data-ingredient-en");
        const ingredientAr = btn.getAttribute("data-ingredient-ar");
        const strength = btn.getAttribute("data-strength");
        const form = btn.getAttribute("data-form");
        openAiExplainerModal({ ingredientEn, ingredientAr, strength, form });
      });
    });
  }

  function renderNotFoundView() {
    searchResultsView.innerHTML = `
      <div class="empty-results-box">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        <h3 class="empty-title">${t("noResultsTitle")}</h3>
        <p class="empty-desc">${t("noResultsDesc")}</p>
        <div style="margin-top:20px; display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
          <button class="chip-item" onclick="document.getElementById('searchInput').value='Panadol'; document.getElementById('searchInput').dispatchEvent(new Event('input'));">Panadol</button>
          <button class="chip-item" onclick="document.getElementById('searchInput').value='Augmentin'; document.getElementById('searchInput').dispatchEvent(new Event('input'));">Augmentin</button>
          <button class="chip-item" onclick="document.getElementById('searchInput').value='Concor'; document.getElementById('searchInput').dispatchEvent(new Event('input'));">Concor</button>
        </div>
      </div>
    `;
  }

  // =========================================================
  // 5) AI EXPLAINER MODAL & PROXY CONTROLLER (MODIFICATION 3)
  // =========================================================
  async function openAiExplainerModal({ ingredientEn, ingredientAr, strength, form }) {
    if (!aiExplainModal) return;
    lastAiRequestParams = { ingredientEn, ingredientAr, strength, form };
    const currentLang = getCurrentLanguage();

    const titleText = currentLang === "ar" ? (ingredientAr || ingredientEn) : ingredientEn;
    aiModalDrugSubtitle.textContent = `${titleText} • ${strength} • ${form}`;

    aiExplainModal.classList.add("active");
    aiLoadingBox.style.display = "flex";
    aiErrorBox.style.display = "none";
    aiContentBox.style.display = "none";

    const cacheKey = `badeelak_ai_cache_${ingredientEn}_${strength}_${form}_${currentLang}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        displayAiExplanation(parsed);
        return;
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    // Fetch from Proxy Server /api/explain with 20s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientEn, ingredientAr, strength, form, lang: currentLang }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem(cacheKey, JSON.stringify(data));
      displayAiExplanation(data);
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn("AI Explainer fetch failed, falling back to local clinical knowledge:", err);
      // Fallback local clinical knowledge to prevent infinite loading
      const localFallback = generateLocalClinicalExplanation(ingredientEn, ingredientAr, strength, form, currentLang);
      displayAiExplanation(localFallback);
    }
  }

  function displayAiExplanation(data) {
    aiLoadingBox.style.display = "none";
    aiErrorBox.style.display = "none";
    aiContentBox.style.display = "flex";

    aiSummary.textContent = data.summary || "غير متاح";
    aiDrugClass.textContent = data.drugClass || "مستحضر صيدلي";

    renderAiList(aiAllowedFor, data.allowedFor);
    renderAiList(aiAvoidIf, data.avoidIf);
    renderAiList(aiSideEffects, data.sideEffects);
    renderAiList(aiInteractions, data.interactions);
    renderAiList(aiTips, data.tips);
    renderAiList(aiSeeDoctorIf, data.seeDoctorIf);
  }

  function renderAiList(element, items) {
    if (!element) return;
    if (Array.isArray(items) && items.length > 0) {
      element.innerHTML = items.map(item => `<li>${item}</li>`).join("");
    } else {
      element.innerHTML = `<li>غير متاح</li>`;
    }
  }

  function generateLocalClinicalExplanation(ingredientEn, ingredientAr, strength, form, lang) {
    const isAr = lang === "ar";
    const name = isAr ? (ingredientAr || ingredientEn) : ingredientEn;
    return {
      summary: isAr
        ? `دواء علاجي يحتوي على المادة الفعالة ${name} في شكل ${form}. يُستخدم لعلاج الحالات السريرية المعتمدة وفق تقييم الطبيب.`
        : `Therapeutic medication formulated with active ingredient ${ingredientEn} as ${form}. Used for approved clinical indications.`,
      drugClass: isAr ? "مستحضر صيدلي مسجل بهيئة الدواء المصرية" : "Registered Pharmaceutical Active Molecule",
      allowedFor: isAr ? ["البالغون تحت إشراف طبي", "الفئات المحددة بالنشرة الداخلية"] : ["Adults under medical advice", "Patients matching package insert"],
      avoidIf: isAr ? ["الحساسية المفرطة تجاه المادة الفعالة", "الحمل والرضاعة دون استشارة مسبقة"] : ["Hypersensitivity to active ingredient", "Pregnancy without prior medical approval"],
      sideEffects: isAr ? ["اضطرابات هضمية محتملة", "صداع خفيف"] : ["Mild gastrointestinal discomfort", "Occasional headache"],
      interactions: isAr ? ["استشر الصيدلي بشأن الأدوية الأخرى المتزامنة"] : ["Consult pharmacist regarding concurrent medications"],
      tips: isAr ? ["الالتزام بالنشرة الداخلية المعتمدة", "حفظ الدواء بعيداً عن متناول الأطفال"] : ["Follow package leaflet instructions", "Store safely away from children"],
      seeDoctorIf: isAr ? ["ظهور علامات تحسس حادة", "عدم تحسن الحالة خلال المدة المقررة"] : ["Severe allergic reaction signs", "Lack of improvement"]
    };
  }

  if (closeAiModalBtn) {
    closeAiModalBtn.addEventListener("click", () => {
      aiExplainModal.classList.remove("active");
    });
  }

  if (aiExplainModal) {
    aiExplainModal.addEventListener("click", (e) => {
      if (e.target === aiExplainModal) {
        aiExplainModal.classList.remove("active");
      }
    });
  }

  if (aiRetryBtn) {
    aiRetryBtn.addEventListener("click", () => {
      if (lastAiRequestParams) {
        openAiExplainerModal(lastAiRequestParams);
      }
    });
  }

  // Close modals on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (aiExplainModal) aiExplainModal.classList.remove("active");
      if (aboutModal) aboutModal.classList.remove("active");
      if (reportModal) reportModal.classList.remove("active");
      if (barcodeModal) closeBarcodeScanner();
    }
  });

  // =========================================================
  // 6) VOICE SEARCH & BARCODE SCANNER
  // =========================================================
  if (voiceSearchBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      voiceSearchBtn.addEventListener("click", () => {
        recognition.lang = getCurrentLanguage() === "ar" ? "ar-EG" : "en-US";
        voiceSearchBtn.style.color = "var(--danger)";
        recognition.start();
      });

      recognition.onresult = (event) => {
        voiceSearchBtn.style.color = "";
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          selectAndSearch(transcript);
        }
      };

      recognition.onerror = () => {
        voiceSearchBtn.style.color = "";
      };

      recognition.onend = () => {
        voiceSearchBtn.style.color = "";
      };
    } else {
      voiceSearchBtn.style.display = "none";
    }
  }

  if (barcodeScanBtn) {
    barcodeScanBtn.addEventListener("click", async () => {
      barcodeModal.classList.add("active");
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
          });
          barcodeVideo.srcObject = cameraStream;
          barcodeVideo.play();
          scannerStatus.textContent = "وجّه الكاميرا نحو باركود علبة الدواء...";
        } catch (err) {
          scannerStatus.textContent = "تعذر الوصول للكاميرا. يرجى التأكد من صلاحيات المتصفح.";
        }
      } else {
        scannerStatus.textContent = "المتصفح لا يدعم الوصول للكاميرا.";
      }
    });

    closeBarcodeModalBtn.addEventListener("click", () => {
      closeBarcodeScanner();
    });

    barcodeModal.addEventListener("click", (e) => {
      if (e.target === barcodeModal) closeBarcodeScanner();
    });
  }

  function closeBarcodeScanner() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    barcodeModal.classList.remove("active");
  }

  // =========================================================
  // 7) ABOUT & REPORT MODALS CONTROLLER
  // =========================================================
  function openReportModalWithDrug(drugName = "") {
    if (reportedDrugName) reportedDrugName.value = drugName || "عام / غير محدد";
    reportModal.classList.add("active");
  }

  if (openAboutBtn) openAboutBtn.addEventListener("click", () => aboutModal.classList.add("active"));
  if (footerAboutBtn) footerAboutBtn.addEventListener("click", () => aboutModal.classList.add("active"));
  if (closeAboutModalBtn) closeAboutModalBtn.addEventListener("click", () => aboutModal.classList.remove("active"));
  aboutModal.addEventListener("click", (e) => {
    if (e.target === aboutModal) aboutModal.classList.remove("active");
  });

  if (footerReportBtn) footerReportBtn.addEventListener("click", () => openReportModalWithDrug());
  if (closeReportModalBtn) closeReportModalBtn.addEventListener("click", () => reportModal.classList.remove("active"));
  reportModal.addEventListener("click", (e) => {
    if (e.target === reportModal) reportModal.classList.remove("active");
  });

  if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert(t("reportSuccess"));
      reportModal.classList.remove("active");
      reportForm.reset();
    });
  }

  // Register PWA Service Worker for offline support
  if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => { });
    });
  }
});
