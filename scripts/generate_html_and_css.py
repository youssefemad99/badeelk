# scripts/generate_html_and_css.py
# Generates updated index.html for Badeelk compliant with Modifications 1, 2, and 3.

HTML_CONTENT = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <meta name="description" content="بديلك - أسرع محرك بحث عن بدائل الأدوية في مصر. مطابقة علمية دقيقة بنفس المادة الفعالة والتركيز والشكل الصيدلي من واقع سجلات هيئة الدواء المصرية.">
  <meta name="keywords" content="بدائل الأدوية, أسعار الأدوية, هيئة الدواء المصرية, صيدلية, بانادول, كونكور, أوجمنتين, بديل الدواء">
  <meta name="author" content="Badeelk">
  <meta name="theme-color" content="#0F5A46">

  <!-- Open Graph / WhatsApp Previews -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="بديلك | محرك بدائل الأدوية المصرية">
  <meta property="og:description" content="ابحث عن بدائل الأدوية بنفس المادة الفعالة والتركيز والشكل الصيدلي وقارن الأسعار الرسمية فوراً.">
  <meta property="og:url" content="./">
  <meta property="og:image" content="icon-512.png">
  <meta property="og:locale" content="ar_EG">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="بديلك | محرك بدائل الأدوية المصرية">
  <meta name="twitter:description" content="ابحث عن بدائل الأدوية بنفس المادة الفعالة والتركيز والشكل الصيدلي وقارن الأسعار الرسمية فوراً.">
  <meta name="twitter:image" content="icon-512.png">

  <link rel="canonical" href="./">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230F5A46'%3E%3Cpath d='m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z'/%3E%3C/svg%3E">

  <title data-i18n="siteTitle">بديلك | بدائل الأدوية في مصر</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body class="theme-light">

  <!-- Accessibility Announcer -->
  <div id="srAnnouncer" class="sr-only" aria-live="polite"></div>

  <!-- 1) TOP NAVIGATION HEADER -->
  <header class="site-header">
    <div class="header-container">
      <div class="brand-wrapper">
        <a href="./" class="brand-logo-link" aria-label="بديلك الصفحة الرئيسية">
          <div class="logo-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
              <path d="m8.5 8.5 7 7"/>
            </svg>
          </div>
          <div class="brand-titles">
            <span class="brand-name" data-i18n="brandTitle">بديلك</span>
            <span class="brand-tagline" data-i18n="brandSubtitle">بدائل الأدوية في مصر — بنفس المادة الفعالة والتركيز والشكل</span>
          </div>
        </a>
      </div>

      <!-- Header Controls: Lang Toggle, Theme Toggle, About -->
      <div class="header-controls">
        <button id="langToggleBtn" class="btn-ctrl" title="تبديل اللغة / Toggle Language" aria-label="Toggle Language">
          English
        </button>
        <button id="themeToggleBtn" class="btn-ctrl btn-icon" title="الوضع الليلي / Dark Mode" aria-label="Toggle Dark Mode">
          <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        </button>
        <button id="openAboutBtn" class="btn-ctrl" title="عن المنصة ومصادر البيانات">
          <span data-i18n="aboutLink">عن بديلك</span>
        </button>
      </div>
    </div>
  </header>

  <!-- 2) HERO SEARCH SECTION -->
  <section class="hero-section">
    <div class="hero-container">
      
      <div class="hero-copy-block">
        <h1 class="hero-main-title" data-i18n="heroTitle">اكتب اسم الدوا، وهات البدائل الموثقة في ثوانٍ</h1>
        <p class="hero-sub-text" data-i18n="heroSubtitle">
          ابحث بالاسم التجاري أو المادة الفعالة (عربي أو إنجليزي أو فرانكو). النظام يطابق الأدوية بنفس المادة الفعالة والتركيز والشكل الصيدلي تماماً وفقاً لسجلات هيئة الدواء المصرية.
        </p>
      </div>

      <!-- Hero Search Bar (Role Combobox with Accessibility) -->
      <div class="search-hero-box" id="searchHeroBox">
        <div class="search-input-container" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-owns="suggestionsDropdown">
          
          <div class="search-leading-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>

          <input 
            type="text" 
            id="searchInput" 
            class="hero-search-input" 
            placeholder="اكتب اسم الدوا... مثال: Panadol, كونكور, Augmentin" 
            data-i18n="searchPlaceholder"
            autocomplete="off" 
            spellcheck="false"
            aria-autocomplete="list" 
            aria-controls="suggestionsDropdown"
            aria-label="حقل البحث عن الدواء أو المادة الفعالة"
          >

          <!-- Action Buttons inside search box: Voice, Barcode, Clear -->
          <div class="search-trailing-actions">
            <button id="voiceSearchBtn" class="btn-search-action" title="البحث بالصوت" aria-label="Voice Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </button>
            <button id="barcodeScanBtn" class="btn-search-action" title="مسح الباركود بالكاميرا" aria-label="Scan Barcode">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="10" height="10" x="7" y="7" rx="1"/></svg>
            </button>
            <button id="clearBtn" class="btn-search-action clear-btn" title="مسح النص" aria-label="Clear Search" style="display:none;">
              ✕
            </button>
          </div>

          <!-- Live Autocomplete Dropdown Listbox -->
          <div id="suggestionsDropdown" class="autocomplete-dropdown" role="listbox" aria-label="اقتراحات البحث">
            <!-- Rendered dynamically -->
          </div>

        </div>

        <!-- Popular Medicines Chips directly below search bar -->
        <div class="popular-chips-bar">
          <span class="popular-label" data-i18n="popularHeading">أدوية شائعة:</span>
          <div class="chips-scroller" id="popularChipsContainer">
            <button class="chip-item" data-query="Panadol">Panadol / بانادول</button>
            <button class="chip-item" data-query="Augmentin">Augmentin / أوجمنتين</button>
            <button class="chip-item" data-query="Concor">Concor / كونكور</button>
            <button class="chip-item" data-query="Voltaren">Voltaren / فولتارين</button>
            <button class="chip-item" data-query="Nexium">Nexium / نيكسيوم</button>
            <button class="chip-item" data-query="Crestor">Crestor / كريستور</button>
            <button class="chip-item" data-query="Glucophage">Glucophage / جلوكوفاج</button>
            <button class="chip-item" data-query="Zyrtec">Zyrtec / زيرتك</button>
            <button class="chip-item" data-query="Cipro">Cipro / سيبرو</button>
            <button class="chip-item" data-query="Brufen">Brufen / بروفين</button>
          </div>
        </div>

        <!-- Single subtle line for Database Statistics & Price Last Updated (Modification 1) -->
        <div class="db-stats-single-line">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F5A46" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span data-i18n="dbStatsLine">قاعدة بيانات رسمية موثقة من هيئة الدواء المصرية (EDA) وقوائم الأسعار الرسمية</span>
          <span class="stats-sep">·</span>
          <span class="price-update-tag"><span data-i18n="priceLastUpdatedLabel">آخر تحديث للأسعار: </span><strong id="priceLastUpdatedText">11 أكتوبر 2026</strong></span>
        </div>

      </div>

    </div>
  </section>

  <!-- 3) MAIN CONTENT CONTAINER -->
  <main class="main-app-container">
    
    <!-- SEARCH RESULTS VIEW -->
    <section id="searchResultsView" class="search-results-section" style="display:none;">
      <!-- Injected dynamically by JavaScript -->
    </section>

    <!-- DEFAULT HOMEPAGE EDUCATIONAL SECTIONS (Positioned neatly at bottom) -->
    <div id="defaultHomeSections" class="default-home-sections">
      
      <!-- Section 1: How It Works Cards -->
      <section class="info-grid-section">
        <h2 class="section-block-title" data-i18n="howItWorksTitle">كيف تعمل مطابقة البدائل في بديلك؟</h2>
        <div class="three-cards-grid">
          
          <div class="feature-card">
            <div class="feature-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F5A46" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <h3 class="feature-title" data-i18n="howItWorks1Title">1. بحث فوري ثنائي اللغة</h3>
            <p class="feature-desc" data-i18n="howItWorks1Desc">
              ابحث بالعربية أو الإنجليزية أو بالفرانكو، مع اقتراحات فورية من أول حرف وتسامح مع الأخطاء الإملائية.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F5A46" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
            </div>
            <h3 class="feature-title" data-i18n="howItWorks2Title">2. مطابقة علمية دقيقة فقط</h3>
            <p class="feature-desc" data-i18n="howItWorks2Desc">
              البدائل تتحدد بقاعدة علمية ثابتة: نفس المادة الفعالة + نفس التركيز + نفس الشكل الصيدلي. لا اقتراحات عشوائية.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F5A46" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 class="feature-title" data-i18n="howItWorks3Title">3. بيانات رسمية معتمدة</h3>
            <p class="feature-desc" data-i18n="howItWorks3Desc">
              جميع السجلات مستخرجة من سجلات هيئة الدواء المصرية (EDA) وقوائم الأسعار الرسمية مع توثيق المصدر وتاريخ التحديث.
            </p>
          </div>

        </div>
      </section>

      <!-- Section 2: Permanent Safety & Sensitive Alert Card -->
      <section class="bottom-notes-grid">
        <div class="note-box alert-beige">
          <div class="note-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c5e10" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <h4 data-i18n="disclaimerTitle">إخلاء مسؤولية طبي</h4>
          </div>
          <p class="note-body" data-i18n="disclaimerText">
            المعلومات الواردة في هذا الموقع استرشادية فقط ومخصصة للمساعدة في العثور على البدائل التجارية المسجلة، ولا تُعد بأي حال من الأحوال بديلاً عن الاستشارة الطبية أو الصيدلانية. القرار النهائي لاختيار وتناول أي دواء يعود للصيدلي المرخص أو الطبيب المعالج.
          </p>
        </div>

        <div class="note-box alert-red">
          <div class="note-header text-danger">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <h4>أدوية حساسة تتطلب عناية خاصة</h4>
          </div>
          <p class="note-body" data-i18n="sensitiveWarning">
            استشر الصيدلي أو الطبيب قبل التغيير (دواء دقيق: صرع • غدة • مميعات دم • سكر • ضغط) لضمان مطابقة التكافؤ الحيوي بدقة.
          </p>
        </div>
      </section>

      <!-- Section 3: Privacy Assurance Banner -->
      <section class="privacy-strip">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F5A46" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span data-i18n="privacyText">كل عمليات البحث تتم محلياً بنسبة 100% داخل متصفحك. لا يتم تخزين أو مشاركة أي استفسارات أو بيانات طبية مع أي خوادم خارجية.</span>
      </section>

    </div>
  </main>

  <!-- 4) FOOTER -->
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand-meta">
        <strong>بديلك (Badeelk)</strong> — محرك مفتوح ومستقل لبدائل الأدوية المصرية المسجلة.
        <div class="footer-sub-meta">المصادر: هيئة الدواء المصرية (EDA) • منظمة الصحة العالمية (WHO ATC/DDD) • openFDA.</div>
      </div>
      <div class="footer-actions">
        <button id="footerAboutBtn" class="footer-link-btn" data-i18n="aboutLink">عن بديلك ومصادر البيانات</button>
        <button id="footerReportBtn" class="footer-link-btn" data-i18n="reportMistake">الإبلاغ عن تصحيح</button>
      </div>
    </div>
  </footer>

  <!-- 5) MODALS -->

  <!-- Modal A: About & Data Sources Modal -->
  <div id="aboutModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="aboutModalTitle">
    <div class="modal-container">
      <button class="modal-close-btn" id="closeAboutModalBtn" aria-label="إغلاق">✕</button>
      <div class="modal-header">
        <div class="modal-icon-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F5A46" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <h3 id="aboutModalTitle" data-i18n="aboutModalTitle">عن منصة بديلك ومصادر البيانات الرسمية</h3>
      </div>
      <div class="modal-body-content">
        <p data-i18n="aboutIntro">بديلك هو محرك بحث مستقل ومفتوح للبحث عن بدائل الأدوية المسجلة في جمهورية مصر العربية.</p>
        
        <h4 data-i18n="aboutSourcesTitle" style="margin-top:16px; margin-bottom:8px;">مصادر البيانات المعتمدة:</h4>
        <ul class="sources-list">
          <li data-i18n="aboutSource1">1. السجل الرسمي لهيئة الدواء المصرية (Egyptian Drug Authority - EDA).</li>
          <li data-i18n="aboutSource2">2. المؤشر العام لأسعار الأدوية المصرية 2026.</li>
          <li data-i18n="aboutSource3">3. فهرس منظمة الصحة العالمية للمواد الفعالة (WHO ATC/DDD Index).</li>
          <li data-i18n="aboutSource4">4. السجل الدولي للأسماء العلمية والتحذيرات الطبية (openFDA / RxNorm).</li>
        </ul>

        <div class="modal-notice-box">
          <strong data-i18n="aboutLicense">البيانات مرخصة ومتاحة للأغراض البحثية والاسترشادية وفق السياسات العامة. لا نقوم بتوليد أو تأليف أي دواء غير مسجل.</strong>
        </div>

        <p style="margin-top:12px; font-size:13px; color:var(--text-muted);">
          <span data-i18n="aboutLastUpdated">آخر تحديث لقاعدة البيانات:</span> <strong>2026-10-11</strong>
        </p>
      </div>
    </div>
  </div>

  <!-- Modal B: Report an Error Modal -->
  <div id="reportModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reportModalTitle">
    <div class="modal-container">
      <button class="modal-close-btn" id="closeReportModalBtn" aria-label="إغلاق">✕</button>
      <div class="modal-header">
        <div class="modal-icon-badge text-danger">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
        </div>
        <h3 id="reportModalTitle" data-i18n="reportModalHeader">الإبلاغ عن خطأ أو تحديث بيانات</h3>
      </div>
      <form id="reportForm" class="modal-form">
        <div class="form-group">
          <label class="form-label" for="reportedDrugName" data-i18n="reportModalDrugLabel">الدواء المعني:</label>
          <input type="text" id="reportedDrugName" class="form-input" readonly>
        </div>
        <div class="form-group">
          <label class="form-label" for="reportDetails" data-i18n="reportModalDetailsLabel">تفاصيل الملاحظة أو التصحيح المطلوب:</label>
          <textarea id="reportDetails" class="form-textarea" rows="4" placeholder="اكتب ملاحظتك بالتفصيل (مثل: تحديث السعر، تعديل الشكل الصيدلي، إضافة بديل مسجل)..." data-i18n="reportModalDetailsPlaceholder" required></textarea>
        </div>
        <button type="submit" class="btn-submit-report" data-i18n="reportModalSubmit">إرسال الملاحظة للمراجعة الصيدلانية</button>
      </form>
    </div>
  </div>

  <!-- Modal C: Barcode Scanner Modal -->
  <div id="barcodeModal" class="modal-overlay" role="dialog" aria-modal="true">
    <div class="modal-container scanner-container">
      <button class="modal-close-btn" id="closeBarcodeModalBtn" aria-label="إغلاق">✕</button>
      <div class="modal-header">
        <h3>مسح الباركود من علبة الدواء</h3>
      </div>
      <div class="scanner-body">
        <div id="scannerStatus" class="scanner-status">جاري تشغيل الكاميرا...</div>
        <video id="barcodeVideo" class="barcode-video" playsinline></video>
        <div class="scanner-guide-box"></div>
      </div>
    </div>
  </div>

  <!-- Modal D: AI Medication Explainer Modal (Modification 3) -->
  <div id="aiExplainModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="aiModalTitle">
    <div class="modal-container ai-modal-container">
      <button class="modal-close-btn" id="closeAiModalBtn" aria-label="إغلاق">✕</button>
      <div class="modal-header">
        <div class="modal-icon-badge ai-icon-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F5A46" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
        </div>
        <div>
          <h3 id="aiModalTitle" data-i18n="aiModalTitle">شرح الدواء بالذكاء الاصطناعي</h3>
          <div id="aiModalDrugSubtitle" class="ai-modal-subtitle"></div>
        </div>
      </div>

      <!-- Loading State -->
      <div id="aiLoadingBox" class="ai-loading-box">
        <div class="ai-spinner"></div>
        <p data-i18n="aiLoading">جاري تجهيز الشرح الطبي الموثق بالذكاء الاصطناعي...</p>
      </div>

      <!-- Error State -->
      <div id="aiErrorBox" class="ai-error-box" style="display:none;">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p id="aiErrorMsg" data-i18n="aiError">تعذر تحميل الشرح حالياً، يرجى المحاولة مرة أخرى.</p>
        <button id="aiRetryBtn" class="btn-ctrl" data-i18n="aiRetry">إعادة المحاولة</button>
      </div>

      <!-- Content State (8 Sections defined in PDF) -->
      <div id="aiContentBox" class="ai-content-box" style="display:none;">
        <div class="ai-section">
          <h4 class="ai-section-title" data-i18n="whatIsDrug">ما هو الدواء؟</h4>
          <p id="aiSummary" class="ai-section-body"></p>
        </div>

        <div class="ai-section">
          <h4 class="ai-section-title" data-i18n="drugClass">التصنيف الدوائي</h4>
          <div id="aiDrugClass" class="ai-badge-class"></div>
        </div>

        <div class="ai-section">
          <h4 class="ai-section-title" data-i18n="allowedFor">مسموح لمن؟</h4>
          <ul id="aiAllowedFor" class="ai-list"></ul>
        </div>

        <div class="ai-section">
          <h4 class="ai-section-title text-danger" data-i18n="avoidIf">ممنوع أو بحذر لمن؟</h4>
          <ul id="aiAvoidIf" class="ai-list list-danger"></ul>
        </div>

        <div class="ai-section">
          <h4 class="ai-section-title" data-i18n="sideEffects">الأعراض الجانبية الشائعة</h4>
          <ul id="aiSideEffects" class="ai-list"></ul>
        </div>

        <div class="ai-section">
          <h4 class="ai-section-title" data-i18n="interactions">تفاعلات دوائية مهمة</h4>
          <ul id="aiInteractions" class="ai-list"></ul>
        </div>

        <div class="ai-section">
          <h4 class="ai-section-title" data-i18n="tips">نصائح الاستخدام</h4>
          <ul id="aiTips" class="ai-list"></ul>
        </div>

        <div class="ai-section">
          <h4 class="ai-section-title text-danger" data-i18n="seeDoctorIf">متى تراجع الطبيب فوراً؟</h4>
          <ul id="aiSeeDoctorIf" class="ai-list list-danger"></ul>
        </div>

        <!-- Mandatory Fixed Clinical Safety Warning -->
        <div class="ai-permanent-disclaimer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c5e10" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span data-i18n="aiDisclaimer">هذه معلومات توعوية عامة ولا تغني عن استشارة الطبيب أو الصيدلي. الجرعة يحددها الطبيب أو الصيدلي أو النشرة الداخلية فقط.</span>
        </div>
      </div>

    </div>
  </div>

  <!-- JAVASCRIPT ENTRYPOINT -->
  <script type="module" src="js/app.js"></script>
</body>
</html>
"""

with open("../index.html", "w", encoding="utf-8") as f:
    f.write(HTML_CONTENT)

print("Updated ../index.html successfully!")
