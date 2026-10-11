// i18n.js - Comprehensive Arabic & English internationalization dictionary & switcher
// Updated to remove digitToggleBtn (Mod 2) and add Price Audit & AI Explainer keys (Mod 1 & 3).

export const TRANSLATIONS = {
  ar: {
    siteTitle: "بديلك | بدائل الأدوية في مصر",
    brandTitle: "بديلك",
    brandSubtitle: "بدائل الأدوية في مصر — بنفس المادة الفعالة والتركيز والشكل",
    heroTitle: "اكتب اسم الدوا، وهات البدائل الموثقة في ثوانٍ",
    heroSubtitle: "ابحث بالاسم التجاري أو المادة الفعالة (عربي أو إنجليزي أو فرانكو). النظام يطابق الأدوية بنفس المادة الفعالة والتركيز والشكل الصيدلي تماماً وفقاً لسجلات هيئة الدواء المصرية.",
    searchPlaceholder: "اكتب اسم الدوا... مثال: Panadol, كونكور, Augmentin",
    trySample: "جرب: ",
    popularHeading: "أدوية مشهورة وشائعة",
    recentSearchesHeading: "عمليات البحث الأخيرة",
    clearRecent: "مسح السجل",
    noRecent: "لا توجد عمليات بحث سابقة",
    dbStatsLine: "قاعدة بيانات رسمية موثقة من هيئة الدواء المصرية (EDA) وقوائم الأسعار الرسمية",
    priceLastUpdatedLabel: "آخر تحديث للأسعار: ",
    priceUnderReview: "السعر قيد المراجعة",
    totalRecordsLabel: "دواء مسجل",
    totalGroupsLabel: "مجموعة بدائل متطابقة",
    sortLabel: "ترتيب حسب:",
    sortCheapest: "الأرخص سعراً أولاً",
    sortCompany: "اسم الشركة المصنعة",
    sortName: "اسم الدواء",
    filterFormAll: "جميع الأشكال الدوائية",
    filterCompanyAll: "جميع الشركات",
    priceUnavailable: "السعر غير متوفر",
    currencyEgp: "ج.م",
    copyName: "نسخ الاسم",
    copied: "تم النسخ!",
    shareWhatsapp: "مشاركة واتساب",
    reportMistake: "تصحيح",
    explainWithAi: "✨ اشرح بالذكاء الاصطناعي",
    verifiedFormula: "نفس المادة الفعالة والتركيز والشكل — المراجعة النهائية للصيدلي",
    sensitiveWarning: "استشر الصيدلي أو الطبيب قبل التغيير (دواء دقيق: صرع • غدة • مميعات دم • سكر • ضغط)",
    substitutesFound: "البدائل المتاحة بنفس المادة والتركيز والشكل",
    noResultsTitle: "لم يتم العثور على دواء مطابق",
    noResultsDesc: "تأكد من كتابة الاسم بشكل صحيح أو جرب البحث باسم المادة الفعالة، أو اضغط على أحد الأدوية المقترحة أدناه.",
    howItWorksTitle: "كيف تعمل مطابقة البدائل في بديلك؟",
    howItWorks1Title: "1. بحث فوري ثنائي اللغة",
    howItWorks1Desc: "ابحث بالعربية أو الإنجليزية أو بالفرانكو، مع تحمل الأخطاء الإملائية الشائعة واقتراح لحظي من أول حرف.",
    howItWorks2Title: "2. مطابقة علمية دقيقة فقط",
    howItWorks2Desc: "البدائل تتحدد بقاعدة علمية ثابتة: نفس المادة الفعالة + نفس التركيز + نفس الشكل الصيدلي. لا اقتراحات عشوائية.",
    howItWorks3Title: "3. بيانات رسمية معتمدة",
    howItWorks3Desc: "جميع السجلات مستخرجة من سجلات هيئة الدواء المصرية (EDA) ومؤشر الأسعار مع كود المصدر وتاريخ التحديث.",
    disclaimerTitle: "إخلاء مسؤولية طبي",
    disclaimerText: "المعلومات الواردة في هذا الموقع استرشادية فقط ومخصصة للمساعدة في العثور على البدائل التجارية المسجلة، ولا تُعد بأي حال من الأحوال بديلاً عن الاستشارة الطبية أو الصيدلانية. القرار النهائي لاختيار وتناول أي دواء يعود للصيدلي المرخص أو الطبيب المعالج.",
    privacyTitle: "الخصوصية والأمان",
    privacyText: "كل عمليات البحث تتم محلياً بنسبة 100% داخل متصفحك. لا يتم تخزين أو مشاركة أي استفسارات أو بيانات طبية مع أي خوادم خارجية.",
    aboutLink: "عن بديلك ومصادر البيانات",
    aboutModalTitle: "عن منصة بديلك ومصادر البيانات الرسمية",
    aboutIntro: "بديلك هو محرك بحث مستقل ومفتوح للبحث عن بدائل الأدوية المسجلة في جمهورية مصر العربية.",
    aboutSourcesTitle: "مصادر البيانات المعتمدة:",
    aboutSource1: "1. السجل الرسمي لهيئة الدواء المصرية (Egyptian Drug Authority - EDA).",
    aboutSource2: "2. المؤشر العام لأسعار الأدوية المصرية 2026.",
    aboutSource3: "3. فهرس منظمة الصحة العالمية للمواد الفعالة (WHO ATC/DDD Index).",
    aboutSource4: "4. السجل الدولي للأسماء العلمية والتحذيرات الطبية (openFDA / RxNorm).",
    aboutLicense: "البيانات مرخصة ومتاحة للأغراض البحثية والاسترشادية وفق السياسات العامة. لا نقوم بتوليد أو تأليف أي دواء غير مسجل.",
    aboutLastUpdated: "آخر تحديث لقاعدة البيانات:",
    langToggle: "English",
    themeToggleDark: "الوضع الليلي",
    themeToggleLight: "الوضع النهاري",
    closeModal: "إغلاق",
    reportModalHeader: "الإبلاغ عن خطأ أو تحديث بيانات",
    reportModalDrugLabel: "الدواء المعني:",
    reportModalDetailsLabel: "تفاصيل الملاحظة أو التصحيح المطلوب:",
    reportModalDetailsPlaceholder: "اكتب ملاحظتك بالتفصيل (مثل: تحديث السعر، تعديل الشكل الصيدلي، إضافة بديل مسجل)...",
    reportModalSubmit: "إرسال الملاحظة للمراجعة الصيدلانية",
    reportSuccess: "شكراً لك! تم استلام الملاحظة وسوف تخضع للمراجعة الصيدلانية في التحديث القادم.",
    
    // AI Explainer
    aiModalTitle: "شرح الدواء بالذكاء الاصطناعي",
    aiDisclaimer: "هذه معلومات توعوية عامة ولا تغني عن استشارة الطبيب أو الصيدلي. الجرعة يحددها الطبيب أو الصيدلي أو النشرة الداخلية فقط.",
    aiLoading: "جاري تجهيز الشرح الطبي الموثق بالذكاء الاصطناعي...",
    aiRetry: "إعادة المحاولة",
    aiError: "تعذر تحميل الشرح حالياً، يرجى المحاولة مرة أخرى.",
    whatIsDrug: "ما هو الدواء؟",
    drugClass: "التصنيف الدوائي",
    allowedFor: "مسموح لمن؟",
    avoidIf: "ممنوع أو بحذر لمن؟",
    sideEffects: "الأعراض الجانبية الشائعة",
    interactions: "تفاعلات دوائية مهمة",
    tips: "نصائح الاستخدام",
    seeDoctorIf: "متى تراجع الطبيب فورا؟"
  },
  en: {
    siteTitle: "Badeelk | Egyptian Drug Substitutes Engine",
    brandTitle: "Badeelk",
    brandSubtitle: "Egyptian Medication Substitutes — Same Active Ingredient, Strength & Form",
    heroTitle: "Type any drug name, find verified substitutes in seconds",
    heroSubtitle: "Search by brand name or active ingredient (Arabic, English, or Franco-Arabic). Matches are made strictly on identical active ingredient, concentration, and dosage form as registered with the Egyptian Drug Authority.",
    searchPlaceholder: "Type drug name... e.g. Panadol, Concor, Augmentin",
    trySample: "Try: ",
    popularHeading: "Popular & Frequently Searched",
    recentSearchesHeading: "Recent Searches",
    clearRecent: "Clear Recent",
    noRecent: "No recent searches",
    dbStatsLine: "Official database sourced from Egyptian Drug Authority (EDA) & Price Index",
    priceLastUpdatedLabel: "Prices last updated: ",
    priceUnderReview: "Price under review",
    totalRecordsLabel: "Registered Drugs",
    totalGroupsLabel: "Substitute Groups",
    sortLabel: "Sort by:",
    sortCheapest: "Cheapest First",
    sortCompany: "Manufacturer",
    sortName: "Drug Name",
    filterFormAll: "All Dosage Forms",
    filterCompanyAll: "All Manufacturers",
    priceUnavailable: "Price unavailable",
    currencyEgp: "EGP",
    copyName: "Copy Name",
    copied: "Copied!",
    shareWhatsapp: "Share on WhatsApp",
    reportMistake: "Report",
    explainWithAi: "✨ Explain with AI",
    verifiedFormula: "Identical active ingredient, concentration, and form — Final review by your pharmacist",
    sensitiveWarning: "Consult your doctor or pharmacist before switching (Critical medication: Epilepsy • Thyroid • Blood Thinners • Diabetes • Blood Pressure)",
    substitutesFound: "Available Substitutes with Same Active Ingredient, Strength & Form",
    noResultsTitle: "No matching medication found",
    noResultsDesc: "Please verify the spelling, try searching by the scientific active ingredient, or click one of the suggested popular medicines below.",
    howItWorksTitle: "How Substitutes Are Matched in Badeelk",
    howItWorks1Title: "1. Instant Bilingual Search",
    howItWorks1Desc: "Search in Arabic, English, or Franco-Arabic with typo tolerance and live suggestions starting from the very first letter.",
    howItWorks2Title: "2. Strictly Scientific Matching",
    howItWorks2Desc: "Substitutes are strictly matched by: same active ingredient + same concentration + same dosage form. No hallucinated suggestions.",
    howItWorks3Title: "3. Official Verified Registry",
    howItWorks3Desc: "Records are imported from the Egyptian Drug Authority (EDA) public registry and verified price index with source traceability.",
    disclaimerTitle: "Medical Disclaimer",
    disclaimerText: "The information provided on this website is for educational and informational purposes only and is not a substitute for professional medical or pharmaceutical advice. The final decision regarding any medication substitution must be made by a licensed healthcare professional.",
    privacyTitle: "Privacy & Security",
    privacyText: "All searches run 100% locally in your web browser. No medical queries or search records are tracked, logged, or sent to any server.",
    aboutLink: "About Badeelk & Official Data Sources",
    aboutModalTitle: "About Badeelk & Official Data Sources",
    aboutIntro: "Badeelk is an open, independent search platform for registered medications in Egypt.",
    aboutSourcesTitle: "Official Sourced Registries:",
    aboutSource1: "1. Egyptian Drug Authority (EDA) Public Registry.",
    aboutSource2: "2. Official Egyptian Pharmaceutical Price Index 2026.",
    aboutSource3: "3. World Health Organization ATC/DDD Chemical Index.",
    aboutSource4: "4. International Generic Reference Registries (openFDA / RxNorm).",
    aboutLicense: "Data is indexed for informational and research purposes in compliance with public health transparency. We do not invent unregistered medications.",
    aboutLastUpdated: "Database Last Updated:",
    langToggle: "عربي",
    themeToggleDark: "Dark Mode",
    themeToggleLight: "Light Mode",
    closeModal: "Close",
    reportModalHeader: "Report Drug Data Correction",
    reportModalDrugLabel: "Subject Drug:",
    reportModalDetailsLabel: "Correction Details:",
    reportModalDetailsPlaceholder: "Please describe the error in detail (e.g. updated price, corrected dosage form, missing registered alternative)...",
    reportModalSubmit: "Submit Report for Review",
    reportSuccess: "Thank you! Your feedback has been received and will be verified by a pharmacist for the next database update.",
    
    // AI Explainer
    aiModalTitle: "AI Clinical Medication Explainer",
    aiDisclaimer: "This is general educational information and does not replace medical or pharmaceutical advice. Dosages must only be prescribed by a physician or pharmacist.",
    aiLoading: "Preparing AI clinical explanation...",
    aiRetry: "Retry",
    aiError: "Could not load explanation at the moment, please try again.",
    whatIsDrug: "What is this medication?",
    drugClass: "Drug Class",
    allowedFor: "Who can take it?",
    avoidIf: "Contraindications & Precautions",
    sideEffects: "Common Side Effects",
    interactions: "Important Drug Interactions",
    tips: "Usage Tips",
    seeDoctorIf: "When to see a doctor immediately?"
  }
};

let currentLanguage = localStorage.getItem("badeelak_lang") || "ar";

export function getCurrentLanguage() {
  return currentLanguage;
}

export function t(key) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.ar;
  return dict[key] || TRANSLATIONS.ar[key] || key;
}

export function setLanguage(lang) {
  if (lang !== "ar" && lang !== "en") return;
  currentLanguage = lang;
  localStorage.setItem("badeelak_lang", lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  applyTranslationsToDOM();

  window.dispatchEvent(new CustomEvent("badeelak:langChanged", { detail: { lang } }));
}

export function toggleLanguage() {
  setLanguage(currentLanguage === "ar" ? "en" : "ar");
}

export function applyTranslationsToDOM() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const translated = t(key);
    if (translated) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.setAttribute("placeholder", translated);
      } else {
        el.textContent = translated;
      }
    }
  });

  const langBtn = document.getElementById("langToggleBtn");
  if (langBtn) {
    langBtn.textContent = t("langToggle");
    langBtn.setAttribute("aria-label", currentLanguage === "ar" ? "Switch to English" : "التبديل إلى العربية");
  }
}
