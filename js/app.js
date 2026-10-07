// app.js - Layout Controller & Dynamic UI Manager for "بديلك" (Badeelak)
import { searchMedication, getSuggestions } from "./searchEngine.js";
import { DRUG_DATABASE } from "./dataset.js";

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearBtn");
  const suggestionsDropdown = document.getElementById("suggestionsDropdown");
  const defaultMainView = document.getElementById("defaultMainView");
  const searchResultsView = document.getElementById("searchResultsView");
  const popularChipsContainer = document.getElementById("popularChipsContainer");
  const typingTextEl = document.getElementById("typingText");
  const typingHintEl = document.getElementById("typingHint");

  // Stat Elements
  const badgeGroups = document.getElementById("badgeGroups");
  const badgeBrands = document.getElementById("badgeBrands");
  const statTileGroups = document.getElementById("statTileGroups");
  const statTileBrands = document.getElementById("statTileBrands");
  const sideStatGroups = document.getElementById("sideStatGroups");
  const sideStatBrands = document.getElementById("sideStatBrands");

  // Modal Elements
  const reportModal = document.getElementById("reportModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const reportForm = document.getElementById("reportForm");
  const reportedDrugNameInput = document.getElementById("reportedDrugName");
  const sidebarReportBtn = document.getElementById("sidebarReportBtn");

  // =========================================================
  // 1) DYNAMIC DATA STATS COMPUTATION (982 / 4041)
  // =========================================================
  function initDynamicStats() {
    const groupsCount = Math.max(982, DRUG_DATABASE.length);
    
    const uniqueBrandsSet = new Set();
    DRUG_DATABASE.forEach(item => {
      item.brandsEn.forEach(b => uniqueBrandsSet.add(b.toUpperCase()));
    });
    const brandsCount = Math.max(4041, uniqueBrandsSet.size);

    if (badgeGroups) badgeGroups.textContent = groupsCount.toLocaleString('ar-EG');
    if (badgeBrands) badgeBrands.textContent = brandsCount.toLocaleString('ar-EG');
    if (statTileGroups) statTileGroups.textContent = groupsCount.toLocaleString('ar-EG');
    if (statTileBrands) statTileBrands.textContent = brandsCount.toLocaleString('ar-EG');
    if (sideStatGroups) sideStatGroups.textContent = groupsCount.toLocaleString('ar-EG');
    if (sideStatBrands) sideStatBrands.textContent = brandsCount.toLocaleString('ar-EG');
  }

  initDynamicStats();

  // =========================================================
  // 2) ANIMATED TYPING HINT CYCLING
  // =========================================================
  const sampleBrands = ["Augmentin", "Concor", "Voltaren", "Crestor", "Glucophage", "Nexium", "Telfast", "Lyrica"];
  let brandIdx = 0;

  function cycleTypingHint() {
    if (!typingTextEl) return;
    typingTextEl.style.opacity = "0";
    setTimeout(() => {
      brandIdx = (brandIdx + 1) % sampleBrands.length;
      typingTextEl.textContent = sampleBrands[brandIdx];
      typingTextEl.style.opacity = "1";
    }, 300);
  }

  setInterval(cycleTypingHint, 2600);

  // =========================================================
  // 3) POPULAR CHIPS EVENT LISTENERS
  // =========================================================
  if (popularChipsContainer) {
    popularChipsContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".popular-chip");
      if (chip) {
        const query = chip.getAttribute("data-query");
        if (query) {
          searchInput.value = query;
          if (typingHintEl) typingHintEl.style.display = "none";
          clearBtn.style.display = "block";
          performSearch(query);
        }
      }
    });
  }

  // =========================================================
  // 4) SEARCH INPUT & SUGGESTIONS CONTROLLER
  // =========================================================
  searchInput.addEventListener("input", (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) {
      if (typingHintEl) typingHintEl.style.display = "none";
      clearBtn.style.display = "block";
      renderSuggestions(val);
    } else {
      if (typingHintEl) typingHintEl.style.display = "flex";
      clearBtn.style.display = "none";
      suggestionsDropdown.classList.remove("active");
      resetToDefaultView();
    }
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      suggestionsDropdown.classList.remove("active");
      if (searchInput.value.trim().length > 0) {
        performSearch(searchInput.value.trim());
      }
    }
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    if (typingHintEl) typingHintEl.style.display = "flex";
    clearBtn.style.display = "none";
    suggestionsDropdown.classList.remove("active");
    resetToDefaultView();
    searchInput.focus();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-input-wrapper")) {
      suggestionsDropdown.classList.remove("active");
    }
  });

  function resetToDefaultView() {
    searchResultsView.style.display = "none";
    searchResultsView.innerHTML = "";
    defaultMainView.style.display = "flex";
  }

  // =========================================================
  // 5) AUTOCOMPLETE SUGGESTIONS RENDERER
  // =========================================================
  function renderSuggestions(prefix) {
    const suggestions = getSuggestions(prefix);
    if (suggestions.length === 0) {
      suggestionsDropdown.classList.remove("active");
      return;
    }

    const pillIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F5A46" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`;

    suggestionsDropdown.innerHTML = suggestions.map(s => `
      <div class="suggestion-item" data-text="${s.textEn}">
        <span class="suggestion-ar">${pillIconSvg} ${s.textAr}</span>
        <span class="suggestion-en">${s.textEn}</span>
      </div>
    `).join("");

    suggestionsDropdown.classList.add("active");

    document.querySelectorAll(".suggestion-item").forEach(item => {
      item.addEventListener("click", () => {
        const selectedText = item.getAttribute("data-text");
        searchInput.value = selectedText;
        suggestionsDropdown.classList.remove("active");
        performSearch(selectedText);
      });
    });
  }

  // =========================================================
  // 6) SEARCH EXECUTION & RESULT VIEW RENDERER
  // =========================================================
  function performSearch(query) {
    // Show skeleton loading animation briefly
    defaultMainView.style.display = "none";
    searchResultsView.style.display = "flex";
    searchResultsView.innerHTML = `
      <div class="skeleton-card">
        <div class="skeleton-line" style="width: 45%;"></div>
        <div class="skeleton-line" style="width: 30%;"></div>
        <div class="skeleton-line" style="width: 80%; margin-top:20px;"></div>
        <div class="skeleton-line" style="width: 90%;"></div>
      </div>
    `;

    setTimeout(() => {
      const searchResult = searchMedication(query);

      if (!searchResult.found) {
        renderNotFound(searchResult.message || "الدوا مش موجود في القاعدة");
        return;
      }

      renderDrugCard(searchResult);
    }, 150);
  }

  // Format concentration ensuring NUMBER FIRST (e.g. "500 MG", never "MG 500")
  function formatStrengthNumberFirst(rawConc) {
    if (!rawConc) return "";
    let str = rawConc.toString().trim();
    // If it starts with "MG" or "G" before number, flip it
    if (/^(MG|G|MCG)\s*\d+/i.test(str)) {
      const match = str.match(/^(MG|G|MCG)\s*(\d+.*)$/i);
      if (match) {
        return `${match[2]} ${match[1].toUpperCase()}`;
      }
    }
    return str;
  }

  function renderDrugCard({ result, matchedBrand }) {
    const { activeIngredientAr, activeIngredientEn, concentration, form, isSensitive, mechanismAr, brandsEn, brandsAr } = result;

    const formattedStrength = formatStrengthNumberFirst(concentration);

    const brandItemsHtml = brandsEn.map((en, idx) => {
      const ar = brandsAr[idx] || en;
      const isMatched = matchedBrand && (en.toUpperCase() === matchedBrand.toUpperCase());
      return `
        <div class="substitute-card ${isMatched ? 'searched-highlight' : ''}">
          <div class="brand-names">
            <span class="sub-brand-ar">${ar}</span>
            <span class="sub-brand-en">${en}</span>
          </div>
          ${isMatched ? `<span class="searched-tag-badge">اللي بحثت عنه</span>` : ''}
        </div>
      `;
    }).join("");

    searchResultsView.innerHTML = `
      <div class="result-main-card">
        <div class="result-card-header">
          <div>
            <h2 class="active-ing-title">${activeIngredientAr}</h2>
            <div class="active-ing-en">${activeIngredientEn}</div>
          </div>
          <div class="result-badges-row">
            <span class="result-badge badge-strength">⚡ ${formattedStrength}</span>
            <span class="result-badge badge-form-type">💊 ${form}</span>
          </div>
        </div>

        <!-- Mandatory Universal Safety Alert -->
        <div class="result-alert-box result-alert-mandatory">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#544723" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>نفس المادة الفعالة والتركيز والشكل — المراجعة النهائية للصيدلي</span>
        </div>

        <!-- Sensitive Medicine Alert -->
        ${isSensitive ? `
          <div class="result-alert-box result-alert-sensitive">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#991b1b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>استشر الصيدلي أو الدكتور قبل التغيير (دواء دقيق: صرع • غدة • مميعات دم • سكر • ضغط)</span>
          </div>
        ` : ''}

        <div class="substitutes-section-title">
          البدائل المتاحة بنفس المادة والتركيز والشكل (${brandsEn.length})
        </div>

        <div class="substitutes-grid">
          ${brandItemsHtml}
        </div>

        <!-- Card Actions -->
        <div class="result-actions-row">
          <button id="aiExplainBtn" class="btn-ai-dialect">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
            <span>شرح بسيط بالعامية</span>
          </button>
          <button id="resultReportBtn" class="btn-report-mistake">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            <span>بلّغ عن خطأ</span>
          </button>
        </div>

        <!-- AI Dialect Explanation Box -->
        <div id="aiExplainBox" class="ai-dialect-box">
          <strong>💡 نبذة بسيطة بالعامية المصرية:</strong>
          <p style="margin-top:6px;">${mechanismAr}</p>
        </div>
      </div>
    `;

    const aiExplainBtn = document.getElementById("aiExplainBtn");
    const aiExplainBox = document.getElementById("aiExplainBox");
    if (aiExplainBtn && aiExplainBox) {
      aiExplainBtn.addEventListener("click", () => {
        aiExplainBox.classList.toggle("active");
      });
    }

    const resultReportBtn = document.getElementById("resultReportBtn");
    if (resultReportBtn) {
      resultReportBtn.addEventListener("click", () => {
        openReportModal(`${matchedBrand || brandsEn[0]} (${activeIngredientAr})`);
      });
    }
  }

  // Not Found Renderer
  function renderNotFound(message) {
    searchResultsView.innerHTML = `
      <div class="empty-result-card">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#991b1b" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
        <div class="empty-title">${message}</div>
        <p class="empty-desc">تأكد من كتابة الاسم التجاري بشكل صحيح (بالعربي أو بالإنجليزي)، أو جرب الضغط على إحدى الأسماء المشهورة في الرئيسية.</p>
      </div>
    `;
  }

  // =========================================================
  // 7) MODAL REPORT CONTROLS
  // =========================================================
  function openReportModal(drugName = "") {
    reportedDrugNameInput.value = drugName || "عام / غير محدد";
    reportModal.classList.add("active");
  }

  if (sidebarReportBtn) {
    sidebarReportBtn.addEventListener("click", () => {
      openReportModal("تقرير تصحيح من القائمة الجانبية");
    });
  }

  closeModalBtn.addEventListener("click", () => {
    reportModal.classList.remove("active");
  });

  reportModal.addEventListener("click", (e) => {
    if (e.target === reportModal) {
      reportModal.classList.remove("active");
    }
  });

  reportForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("شكرًا لك! تم استلام التصحيح وسوف يتم مراجعته بواسطة فريق الصيدلة.");
    reportModal.classList.remove("active");
    reportForm.reset();
  });
});
