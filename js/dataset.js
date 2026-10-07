// dataset.js - Complete Egyptian Medication Database (Indexed by Active Ingredient)
// Built from the official "بديلك" dataset pages

export const DRUG_DATABASE = [
  {
    id: "esomeprazole-40",
    activeIngredientEn: "ESOMEPRAZOLE",
    activeIngredientAr: "إيسوميبرازول",
    concentration: "40 MG",
    form: "كبسولات/اقراص",
    category: "جهاز هضمي (حموضة وقرحة)",
    isSensitive: false,
    mechanismAr: "مُثبّط لمضخة البروتون بيقلل إفراز حمض المعدة وبيساعد في علاج الارتجاع وقرحة المعدة والقولون.",
    brandsEn: [
      "ESOMEPRAZOLE GIA", "ESOMEPRAZOLE", "ARDOXIMAG", "ATMIPRAZOLE", "BIORAZO", 
      "ESOMEPEX", "ESOMELODAN", "ESOGERDAZOLE", "ESO-PROTOCOL", "ESMORAP", "ESMOPUMP", 
      "ESMOPROTON", "PROTON", "NEXIUM", "EZOGAST", "ESOVAXOLE", "ROXANESOP", "EVA-ESOP", 
      "ESOMEPRAZOLE EVA"
    ],
    brandsAr: [
      "إيسوميبرازول جيا", "إيسوميبرازول", "أردوكسيماج", "أتميبرازول", "بيورازو",
      "إيسومبيكس", "إيسوميلودان", "إيسوجيردازول", "إيسو بروتوكول", "إيسوراب", "إيسومبامب",
      "إيسومبروتون", "بروتون", "نيكسيوم", "إيزوجاست", "إيسوفاكسول", "روكسانيسوب", "إيفا إيسوب"
    ]
  },
  {
    id: "levofloxacin-500",
    activeIngredientEn: "LEVOFLOXACIN",
    activeIngredientAr: "ليفوفلوكساسين",
    concentration: "500 MG",
    form: "كبسولات/اقراص",
    category: "مضادات حيوية",
    isSensitive: false,
    mechanismAr: "مضاد حيوي واسع المجال من عائلة الفلوروكينولون لعلاج التهابات الجهاز التنفسي والمسالك البولية.",
    brandsEn: [
      "NICAXOLFOVEL", "ALFASEPCT", "AWADIL EVO", "BITOICAFLOX", "BIOWORLD", "EKOFELKOON",
      "LEVOFLOXACIN-MPI", "LEVOFLOTANET", "LEVODEL", "LEVANIC", "LEE-FLOX", "KEVORK", "ATAV"
    ],
    brandsAr: [
      "نيفولوكساسين", " ألفاسبيكت", "عواديل إيفو", "بيوتيكافلوكس", "بيو وورلد", "إيكوفيلكون",
      "ليفوفلوكساسين ام بي اي", "ليفوفلوتانين", "ليفوديل", "ليفانيك", "لي فلوكس", "كيفورك", "أتاف"
    ]
  },
  {
    id: "pregabalin-75",
    activeIngredientEn: "PREGABALIN",
    activeIngredientAr: "بريجابالين",
    concentration: "75 MG",
    form: "كبسولات/اقراص",
    category: "أعصاب وصرع ومسكن للآلام",
    isSensitive: true,
    mechanismAr: "منظم للإشارات العصبية يُستخدم لعلاج آلام الأعصاب الناتجة عن السكر وتصلب الأعصاب والتهاب الأعصاب.",
    brandsEn: [
      "NILBAGODNA", "BALIZONAR", "CURAPEGIRX", "DEPAPALIN", "PROFERGAB",
      "LYRICA", "LYRIBALIN", "KEMIRICA", "IRENYPATHIC", "HEXGABALIN", "NERVYA", "LYRINEUR"
    ],
    brandsAr: [
      "أندوجابالين", "رانوليزين", "كيورابيجيركس", "ديبابالين", "بروفيرجاب",
      "ليريكا", "ليريبالين", "كيميريكا", "إيرينيباثيك", "هيكسجابالين", "نيرفيا", "ليرين يور"
    ]
  },
  {
    id: "sildenafil-100",
    activeIngredientEn: "SILDENAFIL",
    activeIngredientAr: "سيلدينافيل",
    concentration: "100 MG",
    form: "كبسولات/اقراص",
    category: "أوعية دموية وصحة الرجل",
    isSensitive: false,
    mechanismAr: "موسع للأوعية الدموية يزيد من تدفق الدم ومفيد في حالات تحسين الدورة الدموية.",
    brandsEn: [
      "LIFANEDLIS", "ARGADNA", "DORICATFIL", "ETGACOR", "EREC", "EZEQUEEL", "FAROVI",
      "SILDENAFIL", "ORGODENAFIL", "ORAGAWELL", "NAPIFIT", "KEMAGRA", "VIAGRA"
    ],
    brandsAr: [
      "سيلدينافيل", "أرجادنا", "دوريكاتفيل", "إيتجاكور", "إيريك", "إيزيكيل", "فاروفي",
      "فياجرا", "أورجودينافيل", "أوراجاويل", "نابيفيت", "كيماجرا"
    ]
  },
  {
    id: "rosuvastatin-10",
    activeIngredientEn: "ROSUVASTATIN",
    activeIngredientAr: "روسوفاستاتين",
    concentration: "10 MG",
    form: "كبسولات/اقراص",
    category: "القلب والدهون والكوليسترول",
    isSensitive: true,
    mechanismAr: "مُثبّط لإنزيم الكوليسترول بالكبـد بيقلل الدهون الضارة والثلثية وبيحمي القلب والأوعية.",
    brandsEn: [
      "NITATSAVUSOR", "ADVOCHOL", "BEMASTIRM", "BIOROSUVIN", "CEMICRESTO", "CHOLERESOL",
      "ROSUVASTATIN", "FROSITOR", "ESTERO-MAP", "EPIROVASTATIN", "DECONADAL", "CRESTOR", "CRESTOLIP"
    ],
    brandsAr: [
      "روسوفاستاتين", "أدفوكول", "بيماستيرم", "بيوروسوفين", "سيميكريستو", "كوليريسول",
      "كريستور", "فروسيتور", "إيستيرو ماب", "إيبي روكستاتين", "ديكونادال", "كريستوليب"
    ]
  },
  {
    id: "azithromycin-500",
    activeIngredientEn: "AZITHROMYCIN",
    activeIngredientAr: "أزيثرومايسين",
    concentration: "500 MG",
    form: "كبسولات/اقراص",
    category: "مضادات حيوية",
    isSensitive: false,
    mechanismAr: "مضاد حيوي ماكرولايد فعال لعلاج التهابات الحلق والشعب الهوائية والجلد والجيوب الأنفية.",
    brandsEn: [
      "NICYMORHTIZA", "AZILIDE", "AZATRABIC", "AZIMARCON", "AZINOMAD", "AZITANAD", "AZI",
      "ZITHROMAX", "EPIZITHRO", "DISTABCIN", "DELZOSIN", "AZROLID", "AZITHROMYCIN-AUG", "ZITHROMASH"
    ],
    brandsAr: [
      "أزيثرومايسين", "أزيليد", "أزاترابيك", "أزي ماركون", "أزينوماد", "أزيتاناد", "أزي",
      "زيثروماكس", "إيبيزيثرو", "ديستابسين", "ديلزوسين", "أزروليد", "أزيثرومايسين أوج", "زيثروماتش"
    ]
  },
  {
    id: "etoricoxib-90",
    activeIngredientEn: "ETORICOXIB",
    activeIngredientAr: "إيتوريكوكسيب",
    concentration: "90 MG",
    form: "كبسولات/اقراص",
    category: "مسكنات ومضادات التهاب",
    isSensitive: false,
    mechanismAr: "مُثبّط انتقائي لإنزيم COX-2 مُسكن قوي ومضاد لالتهاب المفاصل والعظام والروماتيزم.",
    brandsEn: [
      "BIXOCIROTE", "ANSALECOX", "ARCOXIA", "ACTOCOXIB", "AVEREXOCOIB", "COXINIRON", "XOCORI",
      "ARCOXIA 90", "FUTACOX B", "FABUCOX", "ETORICOX-HEXAL", "ETICOX A", "COXTOR", "COXRITOR"
    ],
    brandsAr: [
      "إيتوريكوكسيب", "أنساليكوكس", "أركوكسيا", "أكتوكوكسيب", "أفيريكسوكويب", "كوكسينيرون", "كسوكوري",
      "فمتاكوكس بي", "فابوكوكس", "إيتوريكوكس هيكسال", "إيتيكوكس أي", "كو كستور", "كوكسريتور"
    ]
  },
  {
    id: "ceftriaxone-1000",
    activeIngredientEn: "CEFTRIAXONE",
    activeIngredientAr: "سيفترياكسون",
    concentration: "1000 MG (1G)",
    form: "حقن",
    category: "مضادات حيوية",
    isSensitive: false,
    mechanismAr: "مضاد حيوي سيفالوسبورين من الجيل الثالث محقون بالوريد/العضل لعلاج العدوى البكتيرية الشديدة.",
    brandsEn: [
      "ENOXAIRTFEC", "CEFAXONE", "CEFTRIAXONE", "CERTOXAFEC", "CEFTOIRX", "SODIUM CEFTRIAXONE",
      "CEFTRIAXONE-SANDOZ", "CEFTRIAXONE-SEDICO", "DREVAXEM", "ENOXARIT", "EPICEPHIN", "KEMPOXONE", "LONGACEF"
    ],
    brandsAr: [
      "سيفترياكسون", "سيفاكسون", "سيرتوكشافيك", "سيفتويركس", "صوديوم سيفترياكسون",
      "سيفترياكسون ساندوز", "سيفترياكسون سيديكو", "دريفاكسم", "إنوكساريت", "إيبيسيفين", "كيمبوكسون", "لونجاسيف"
    ]
  },
  {
    id: "clopidogrel-75",
    activeIngredientEn: "CLOPIDOGREL",
    activeIngredientAr: "كلوبيدوجريل",
    concentration: "75 MG",
    form: "كبسولات/اقراص",
    category: "القلب ومميعات الدم",
    isSensitive: true,
    mechanismAr: "مضاد للتجلط يمنع تجمع الصفائح الدموية ويحمي من السكتات الدماغية والجلطات القلبية.",
    brandsEn: [
      "LERGODIPOLC", "ANSOMESMOOTH", "BLOTGARIL", "GROGAVIX", "CLATEX", "PLAVIX", "CLOPIDOGREL",
      "AGREL", "CLOPDOGREL", "CONTRASTROKE", "FIBROGREL", "DAVIX", "TOLAVIX", "MYOGREL"
    ],
    brandsAr: [
      "كلوبيدوجريل", "أنسوسموث", "بلوتجاريل", "جروجافيكس", "كلاتيكس", "بلافيكس",
      "أجريل", "كلوب دوجريل", "كونترا ستروك", "فيبروجريل", "دافيكس", "تولافيكس", "ميوجريل"
    ]
  },
  {
    id: "tadalafil-20",
    activeIngredientEn: "TADALAFIL",
    activeIngredientAr: "تادالافيل",
    concentration: "20 MG",
    form: "كبسولات/اقراص",
    category: "أوعية دموية وصحة الرجل",
    isSensitive: false,
    mechanismAr: "موسع للأوعية الدموية طويل المفعول (يستمر حتى 36 ساعة) ومفيد للضغط الشرياني الرئوي.",
    brandsEn: [
      "LIFALADATE", "CIALIS", "CIALONG", "CIPALAFIL", "COPADA", "DIAMONITE", "ERECTABACK",
      "TADALAFIL", "STARKOPREX", "TADAGOLD", "TADALANDRO", "TADALAPART", "TADALONG", "TADARAX"
    ],
    brandsAr: [
      "تادالافيل", "سياليس", "سيالونج", "سيبالافيل", "كوبادا", "دايمونايت", "إيريكتاباك",
      "ستاركوبريكس", "تاداجولد", "تادالاندرو", "تادالابارت", "تادالونج", "تاداركس"
    ]
  },
  {
    id: "ciprofloxacin-500",
    activeIngredientEn: "CIPROFLOXACIN",
    activeIngredientAr: "سيبروفلوكساسين",
    concentration: "500 MG",
    form: "كبسولات/اقراص",
    category: "مضادات حيوية",
    isSensitive: false,
    mechanismAr: "مضاد حيوي واسع المجال لعلاج التهابات المسالك البولية والمعدة والجلد والمفاصل.",
    brandsEn: [
      "NICAXOLFORPIC", "AWADICIPRO", "BACTIFLOX", "CIPRO", "CIPROFLOXACIN", "CIPROBAY",
      "PROFLOXACIN-AMRIYA", "PROFLOXACIN-ORGANO", "PROFLOX RAZ", "PROMAX", "PROMEGA XL", "PROQUIN"
    ],
    brandsAr: [
      "سيبروفلوكساسين", "عواديسبرو", "باكتيفلوكس", "سيبرو", "سيبروباي",
      "بروفلوكساسين العامرية", "بروفلوكساسين أورجانو", "بروفلوكس راز", "بروماكس", "بروميجا اكس ال", "بروكين"
    ]
  },
  {
    id: "atorvastatin-20",
    activeIngredientEn: "ATORVASTATIN",
    activeIngredientAr: "أتورفاستاتين",
    concentration: "20 MG",
    form: "كبسولات/اقراص",
    category: "القلب والدهون والكوليسترول",
    isSensitive: true,
    mechanismAr: "مخفض فعال للدهون الثلاثية والكوليسترول الضار للوقاية من تصلب الشرايين والذبحة الصدرية.",
    brandsEn: [
      "NITATSAVROTA", "ANTIOLICHT", "ACTOLIPOX", "ATOR", "ATORSTAT", "BORGASTASTATIN", "LIPITOR",
      "ATORVASTATIN", "LIPLESS", "LIPONORM", "LIPOTOR", "LIPOMAX", "ATORCHOL"
    ],
    brandsAr: [
      "أتورفاستاتين", "أنتيوليشت", "أكتوليبوكس", "أتور", "أتورستات", "بورجاستاتين", "ليبيتور",
      "ليبليس", "ليبونورم", "ليبوتور", "ليبوماتش", "أتوركول"
    ]
  },
  {
    id: "pantoprazole-40",
    activeIngredientEn: "PANTOPRAZOLE",
    activeIngredientAr: "بانتوبرازول",
    concentration: "40 MG",
    form: "كبسولات/اقراص",
    category: "جهاز هضمي (حموضة وقرحة)",
    isSensitive: false,
    mechanismAr: "مُقلل قاطـع لحموضة المعدة يحمي جدار المعدة والمريء من الارتجاع والقرح الحادة.",
    brandsEn: [
      "ELOZARPOTNAP", "PANTOPRAZOLE", "CONTROLOC", "DELPATNO", "EKORIZ", "FUTAPAN", "ZEDARLOZ",
      "PANTOZOL", "PANTOLOC", "PANTOMEDRA", "PANTOMERCAN", "NOVAPANTOL", "PANGESTAZOL"
    ],
    brandsAr: [
      "بانتوبرازول", "كونترولوك", "ديلباتنو", "إيكوريز", "فوتابان", "زيدارلوز",
      "بانتوزول", "بانتولوك", "بانتوميدرا", "بانتوميركان", "نوفابانتول", "بانجيستازول"
    ]
  },
  {
    id: "vonoprazan-20",
    activeIngredientEn: "VONOPRAZAN",
    activeIngredientAr: "فونوبرازان",
    concentration: "20 MG",
    form: "كبسولات/اقراص",
    category: "جهاز هضمي (حموضة وقرحة)",
    isSensitive: false,
    mechanismAr: "جيل حديث ومتطور جداً لمُثبطات الحمض (P-CAB) يُعطي مفعول سريع جداً وقوي للقرحة المترددة.",
    brandsEn: [
      "NAZARPONOVP", "ACTI", "ARROMAPRAZAN", "COPADA", "GASTROPYXE", "PROTOPRANAZ",
      "VONOPRAZAN", "VONAFUT", "VONASP RE", "VONDALOUS", "VONOGASTRIC", "VONOPEP", "VONOPRAMER"
    ],
    brandsAr: [
      "فونوبرازان", "أكتي", "أروما برازان", "كوبادا", "جاستروبيكس", "بروتوبراناز",
      "فونا فوت", "فونا سب", "فون دالوس", "فونوجاستريك", "فونو بيب", "فونوبرامر"
    ]
  },
  {
    id: "lactoferrin-100",
    activeIngredientEn: "LACTOFERRIN",
    activeIngredientAr: "لاكتوفيرين",
    concentration: "100 MG",
    form: "فوار",
    category: "مكملات ومقويات المناعة والأنيميا",
    isSensitive: false,
    mechanismAr: "بروتين طبيعي مُرتبط بالحديد يُعزز امتصاص الحديد بالجسم ويرفع المناعة ضد العدوى.",
    brandsEn: [
      "NIRREFOTCAL", "ACTIMO", "AMOIX", "DRAVO", "DRAVOSACH", "DELUFER", "ECIFERIN", "EIRIRA", "LIMITLE",
      "LACTOFERRIN", "MIXOLIN", "NATROL", "OMEX", "ONAEM"
    ],
    brandsAr: [
      "لاكتوفيرين", "أكتيمو", "أمويكس", "درافو", "درافوساتش", "ديلوفرين", "إيسيفيرين", "إيريرا", "ليميتليس",
      "ميكسولين", "ناترول", "أوميكس", "أونايم"
    ]
  },
  {
    id: "escitalopram-10",
    activeIngredientEn: "ESCITALOPRAM",
    activeIngredientAr: "إس سيتالوبرام",
    concentration: "10 MG",
    form: "كبسولات/اقراص",
    category: "أعصاب وصحة نفسية",
    isSensitive: false,
    mechanismAr: "مُثبّط استرداد السيروتونين الانتقائي يُحسن المزاج ويعالج القلق والتوتر والاكتئاب.",
    brandsEn: [
      "MARPOLATICSE", "ATMIPICIA", "AICIPERX", "CIPRAMIL", "ESCITALOPRAM", "ESTALOPRAM", "CIPRALEX",
      "EXCELSA", "FUTAPRAM", "HERMPRO", "JOVIAPRAM", "MOODAMASH"
    ],
    brandsAr: [
      "إس سيتالوبرام", "أتمبيشيا", "أيسيبيركس", "سيبراميل", "إس سيتالوبرام إيفا", "سيبـرالكس",
      "إيكسلسا", "فوتابرام", "هيرمبرو", "جوفيا برام", "موداماش"
    ]
  },
  {
    id: "levetiracetam-500",
    activeIngredientEn: "LEVETIRACETAM",
    activeIngredientAr: "ليفيتيراسيتام",
    concentration: "500 MG",
    form: "كبسولات/اقراص",
    category: "أعصاب وصرع ومسكن للآلام",
    isSensitive: true,
    mechanismAr: "مضاد للصرع والتشنجات يعمل على تهدئة الشحنات الكهربائية الزائدة في الدماغ.",
    brandsEn: [
      "MATECARITEVEL", "FUTATREAT", "KEPPRA", "KEPPRAL", "LIDARPEK", "LEVETIRACETAM",
      "LETERAL", "KEPPRA 500", "TIRALEPSY", "SUNSET", "SYCOCETAM"
    ],
    brandsAr: [
      "ليفيتيراسيتام", "فوتاتريت", "كيبـرا", "كيبرال", "ليداربيك", "ليفيتيراسيتام",
      "ليتيرال", "تيراليبسي", "سانسيت", "سيكوسيتام"
    ]
  },
  {
    id: "montelukast-10",
    activeIngredientEn: "MONTELUKAST",
    activeIngredientAr: "مونتيلوكاست",
    concentration: "10 MG",
    form: "كبسولات/اقراص",
    category: "حساسية وصدر وزكام",
    isSensitive: false,
    mechanismAr: "مُغلق لمستقبلات اللوكوترين يقلل تورم وحساسية الشعب الهوائية ويمنع أزمات الربو.",
    brandsEn: [
      "TSAKULETNOM", "AMSAKAST", "ASMALAIR", "CLEAR AIR", "DELMONKAST", "DUALAIR", "INTELAI",
      "SINGULAIR", "KAST", "KOKAST", "LELIPEL", "MONTEKAL", "MONTEL", "MONTELOSAB"
    ],
    brandsAr: [
      "مونتيلوكاست", "أمساكاست", "أسما لير", "كلير إير", "ديلمونكاست", "دوال إير", "إنتلاي",
      "سينجولير", "كاست", "كوكاست", "ليليبيل", "مونتيكال", "مونتيل", "مونتيلوساب"
    ]
  },
  {
    id: "gabapentin-300",
    activeIngredientEn: "GABAPENTIN",
    activeIngredientAr: "جابابنتين",
    concentration: "300 MG",
    form: "كبسولات/اقراص",
    category: "أعصاب وصرع ومسكن للآلام",
    isSensitive: true,
    mechanismAr: "مخفف لآلام الأعصاب المبرحة والتشنجات يعمل عن طريق تعديل حركة الكالسيوم بالأعصاب.",
    brandsEn: [
      "GABAPENTIN", "NEURONTIN", "GABIMASH", "GABALEPSY", "GABAVERONA", "GAPTIN", "GRALIPENTIN",
      "EZAPENTIN", "CONVEX", "STABLENTIN"
    ],
    brandsAr: [
      "جابابنتين", "نيورونتين", "جابيماش", "جاباليبسي", "جابافيرونا", "جابتين", "جراليبنتين",
      "إيزابنتين", "كونفيكس", "ستابلينتين"
    ]
  },
  {
    id: "amoxicillin-clavulanate-1000",
    activeIngredientEn: "AMOXICILLIN + CLAVULANIC ACID",
    activeIngredientAr: "أموكسايسيلين + حمض الكلافولانيك",
    concentration: "1000 MG (1G)",
    form: "كبسولات/اقراص",
    category: "مضادات حيوية",
    isSensitive: false,
    mechanismAr: "مضاد حيوي واسع المجال مدعوم بحمض الكلافولانيك للتغلب على مقاومة البكتيريا لعلاج التهابات الزور والأذن والرئة.",
    brandsEn: [
      "AUGMENTIN", "CURAM", "DELTACLAV", "DEX CLAVE", "FONDACLAV", "HIBIOTIC", "KLAVOX",
      "MEGAMOX", "CLAVOCILLIN", "JULMENTIN", "E-MOXCLAV"
    ],
    brandsAr: [
      "أوجمنتين", "كيورام", "ديلتاكلاف", "ديكس كلاف", "فونداكلاف", "هايبايوتك", "كلافوكس",
      "ميجاموكس", "كلافوسيلين", "جولمنتين", "إي موكسكلاف"
    ]
  },
  {
    id: "paracetamol-500",
    activeIngredientEn: "PARACETAMOL",
    activeIngredientAr: "باراسيتامول",
    concentration: "500 MG",
    form: "كبسولات/اقراص",
    category: "مسكنات ومضادات التهاب",
    isSensitive: false,
    mechanismAr: "مسكن آلام آمن ومخفض للحرارة يعمل بفاعلية على آلام الصداع والأسنـان والعضلات.",
    brandsEn: [
      "PANADOL", "PARACETAMOL", "PARAMOL", "ABIMOL", "CEDOMOL", "CETAL", "ADOL",
      "PARACETAMOL-CID", "PARACETAMOL-MUP", "DOLIPRANE"
    ],
    brandsAr: [
      "بانادول", "باراسيتامول", "بارامول", "أبيمول", "سيدومول", "سيتال", "أدول",
      "باراسيتامول سيد", "باراسيتامول ماب", "دولبران"
    ]
  },
  {
    id: "vardenafil-20",
    activeIngredientEn: "VARDENAFIL",
    activeIngredientAr: "فاردينافيل",
    concentration: "20 MG",
    form: "كبسولات/اقراص",
    category: "أوعية دموية وصحة الرجل",
    isSensitive: false,
    mechanismAr: "موسع للأوعية الدموية يزيد الاستجابة ويُحسن تدفق الدم الشرياني.",
    brandsEn: [
      "LEVITRA", "VARDAPEX", "VARDATRIN", "VARDECTION", "VARDENA", "SOLVETRA", "TURBO V"
    ],
    brandsAr: [
      "ليفيترا", "فاردا بيكس", "فاردا ترين", "فار ديكشن", "فاردينا", "سولفيترا", "توربو في"
    ]
  },
  {
    id: "orlistat-120",
    activeIngredientEn: "ORLISTAT",
    activeIngredientAr: "أورليستات",
    concentration: "120 MG",
    form: "كبسولات/اقراص",
    category: "تخسيس وجهاز هضمي",
    isSensitive: false,
    mechanismAr: "مُثبّط لإنزيم الليباز بالمعدة والإنزيمات يُقلل امتصاص الدهون من الوجبات بنسبة 30%.",
    brandsEn: [
      "ORLI", "ORLISTAT", "QUICK SLIM", "EASY SLIM", "REGIMAX", "ORGANO-ORL", "SMART ORL"
    ],
    brandsAr: [
      "أورلي", "أورليستات", "كويك سليم", "إيزي سليم", "ريجيماكس", "أورجانو أورل", "سمارت أورل"
    ]
  },
  {
    id: "fluconazole-150",
    activeIngredientEn: "FLUCONAZOLE",
    activeIngredientAr: "فلوكونازول",
    concentration: "150 MG",
    form: "كبسولات/اقراص",
    category: "مضادات فطريات",
    isSensitive: false,
    mechanismAr: "مضاد فطريات قوي يُقضي على الالتهابات الفطرية الجلدية والتناسلية بجرعة موحدة.",
    brandsEn: [
      "DIFFLUCAN", "FLUCORAL", "FLUDCONAZOLE", "FUNGI CAN", "JENFUNGA", "NAZOWELL"
    ],
    brandsAr: [
      "ديفلوكان", "فلوكـورال", "فلودكونازول", "فنجي كان", "جينفنجا", "نازويل"
    ]
  },
  {
    id: "diclofenac-potassium-50",
    activeIngredientEn: "DICLOFENAC POTASSIUM",
    activeIngredientAr: "ديكلوفيناك بوتاسيوم",
    concentration: "50 MG",
    form: "كبسولات/اقراص",
    category: "مسكنات ومضادات التهاب",
    isSensitive: false,
    mechanismAr: "مُسكن سريع المفعول ومضاد تورم لالتهاب المفاصل والآلام الحادة والصداع النصفي.",
    brandsEn: [
      "CATAFLAM", "RAPIDUS", "OFLAM", "DICLORAPID", "DOLPHIN K", "POTAFEN", "FLAMIFAST"
    ],
    brandsAr: [
      "كتافلام", "رابيدوس", "أوفلام", "ديك لورابيد", "دولفين كي", "بوتافين", "فلامي فاست"
    ]
  },
  {
    id: "metformin-1000",
    activeIngredientEn: "METFORMIN HYDROCHLORIDE",
    activeIngredientAr: "ميتفورمين هيدروكلورايد",
    concentration: "1000 MG",
    form: "كبسولات/اقراص",
    category: "السكر والعمليات الأيضية",
    isSensitive: true,
    mechanismAr: "منظم سكر ينتمي لعائلة البيجوانيد يزيد حساسية الخلايا للأنسولين ويقلل إنتاج الجلوكوز بالكبد.",
    brandsEn: [
      "GLUCOPHAGE", "GLUCOPHAGE XR", "DIABEFAGE", "GLUCOLIGHT", "MAXOPHAGE", "MEPAPHAGE"
    ],
    brandsAr: [
      "جلوكوفاج", "جلوكوفاج اكس ار", "ديابيفاج", "جلوكولايت", "ماكسوفاج", "ميبافاج"
    ]
  },
  {
    id: "fexofenadine-120",
    activeIngredientEn: "FEXOFENADINE",
    activeIngredientAr: "فيكسوفينادين",
    concentration: "120 MG",
    form: "كبسولات/اقراص",
    category: "حساسية وصدر وزكام",
    isSensitive: false,
    mechanismAr: "مضاد حساسـية من الجيل الثاني لا يسبب النعاس يُعالج حساسية الأنف والارتيكاريا.",
    brandsEn: [
      "TELFAST", "FEXON", "FEXOSTAD", "FASTEL", "HISTAFREE", "ORGOFEXADINE"
    ],
    brandsAr: [
      "تيلفاست", "فيكسون", "فيكسوستاد", "فاستيل", "هيستافري", "أورجوفيكسادين"
    ]
  },
  {
    id: "empagliflozin-25",
    activeIngredientEn: "EMPAGLIFLOZIN",
    activeIngredientAr: "إمباجليفروزين",
    concentration: "25 MG",
    form: "كبسولات/اقراص",
    category: "السكر والعمليات الأيضية",
    isSensitive: true,
    mechanismAr: "مُثبط SGLT2 يطرد السكر الزائد عن طريق الكلية ويحمي وظائف القلب والكليتين.",
    brandsEn: [
      "JARDIANCE", "EMPA", "FAGLOZ", "GLEMPOZIN", "MELLITOFEX", "EMPAGLUTECH"
    ],
    brandsAr: [
      "جارديانس", "إمبا", "فاجلوز", "جليمبوزين", "ميليتوفيكس", "إمباجليتك"
    ]
  },
  {
    id: "dapagliflozin-10",
    activeIngredientEn: "DAPAGLIFLOZIN",
    activeIngredientAr: "داباجليفروزين",
    concentration: "10 MG",
    form: "كبسولات/اقراص",
    category: "السكر والعمليات الأيضية",
    isSensitive: true,
    mechanismAr: "مُثبط SGLT2 متطور يخفض مستويات السكر والوزن والضغط ويحمي من الفشل القلبي.",
    brandsEn: [
      "FORXIGA", "DIGLIFLOZ", "FORFLOZIN", "GLIFLOZIN", "DAPAVEL", "DAPILART"
    ],
    brandsAr: [
      "فوركسيجا", "ديجليفلوز", "فورفلوزين", "جليفلوزين", "دابافيل", "دابيلارت"
    ]
  },
  {
    id: "bisoprolol-5",
    activeIngredientEn: "BISOPROLOL FUMARATE",
    activeIngredientAr: "بيسوبرولول فومارات",
    concentration: "5 MG",
    form: "كبسولات/اقراص",
    category: "القلب والضغط",
    isSensitive: true,
    mechanismAr: "مُغلق بيتا 1 انتقائي يُنظم ضربات القلب ويخفض ضغط الدم المرتفع ويقلل إجهاد العضلة القلبية.",
    brandsEn: [
      "CONCOR", "EGYPRO", "MEPHACOR", "NORMOCARD", "SOPROL", "BISOLOCK"
    ],
    brandsAr: [
      "كونكور", "إيجيبرو", "ميفاكور", "نورموكارد", "سوبرول", "بيسولوك"
    ]
  },
  {
    id: "rivaroxaban-20",
    activeIngredientEn: "RIVAROXABAN",
    activeIngredientAr: "ريفاروكسابان",
    concentration: "20 MG",
    form: "كبسولات/اقراص",
    category: "القلب ومميعات الدم",
    isSensitive: true,
    mechanismAr: "مُضاد تجلط مباشر (مُثبط عامل Xa) يمنع تكوّن الجلطات بالوريد والشرايين بعد العمليات أو بالقلب.",
    brandsEn: [
      "XARELTO", "THROMOXIBAN", "VAROXABAN", "RIVAXARELT", "RIVAROSPIRE", "THORMOX"
    ],
    brandsAr: [
      "كساريلتو", "ثروموكسبان", "فاروكسابان", "ريفاكساريلت", "ريفاروسبير", "ثورموكس"
    ]
  },
  {
    id: "diclofenac-sodium-75-inj",
    activeIngredientEn: "DICLOFENAC SODIUM",
    activeIngredientAr: "ديكلوفيناك صوديوم",
    concentration: "75 MG / 3ML",
    form: "حقن",
    category: "مسكنات ومضادات التهاب",
    isSensitive: false,
    mechanismAr: "حقن مُسكنة ومضادة لالتهابات العظام والمفاصل وآلام المغص الكلوي الحاد.",
    brandsEn: [
      "VOLTAREN", "RHEUMARENE", "ROMALEX", "ZACAGLONE", "RHEUMAFEN", "FLAGESIC"
    ],
    brandsAr: [
      "فولتارين", "روماتين", "روماليكس", "زاكاجلون", "روماتين", "فلاجسيك"
    ]
  },
  {
    id: "omeprazole-20",
    activeIngredientEn: "OMEPRAZOLE",
    activeIngredientAr: "أوميبرازول",
    concentration: "20 MG",
    form: "كبسولات/اقراص",
    category: "جهاز هضمي (حموضة وقرحة)",
    isSensitive: false,
    mechanismAr: "مُثبّط حمض المعدة التقليدي، يعالج حرقان فم المعدة وقرحة الاثني عشر.",
    brandsEn: [
      "LOSEC", "OMEZ", "OMEPRAL", "OMEPAK", "OMEGASTAZOLE", "NAPIZOLE"
    ],
    brandsAr: [
      "لوسيك", "أوميز", "أوميبرال", "أوميباك", "أومي جاستازول", "نابيزول"
    ]
  },
  {
    id: "levothyroxine-100",
    activeIngredientEn: "LEVOTHYROXINE",
    activeIngredientAr: "ليفوثيروكسين",
    concentration: "100 MCG",
    form: "كبسولات/اقراص",
    category: "الغدة الدرقية والهرمونات",
    isSensitive: true,
    mechanismAr: "بديل هرمون الغدة الدرقية الطبيعي (T4) لعلاج خمول الغدة الدرقية وتنظيم الأيض.",
    brandsEn: [
      "EUTHIROX", "ELTROXIN", "THYROXINE", "TYRAXINE"
    ],
    brandsAr: [
      "إيوتيروكس", "إلتـروكسين", "ثيروكسين", "تيراكسين"
    ]
  }
];

// Part 3 Arabic -> English Mapping Dictionary
export const ARABIC_NAME_MAP = {
  "بانادول": "PANADOL",
  "بنادول": "PANADOL",
  "بارامول": "PARAMOL",
  "أبيمول": "ABIMOL",
  "ابيمول": "ABIMOL",
  "سيتال": "CETAL",
  "دولبران": "DOLIPRANE",
  "أوجمنتين": "AUGMENTIN",
  "وجمنتين": "AUGMENTIN",
  "اجمنتين": "AUGMENTIN",
  "كيورام": "CURAM",
  "هايبايوتك": "HIBIOTIC",
  "هاي بيوتك": "HIBIOTIC",
  "كونكور": "CONCOR",
  "ليريكا": "LYRICA",
  "ليريبالين": "LYRIBALIN",
  "كتافلام": "CATAFLAM",
  "فولتارين": "VOLTAREN",
  "كساريلتو": "XARELTO",
  "جارديانس": "JARDIANCE",
  "فوركسيجا": "FORXIGA",
  "جلوكوفاج": "GLUCOPHAGE",
  "تيلفاست": "TELFAST",
  "أوميز": "OMEZ",
  "نيكسيوم": "NEXIUM",
  "كونترولوك": "CONTROLOC",
  "إيوتيروكس": "EUTHIROX",
  "التبروكسين": "ELTROXIN",
  "التروكسين": "ELTROXIN",
  "سيبروباي": "CIPROBAY",
  "سيبروفلوكساسين": "CIPROFLOXACIN",
  "أزيثروماكس": "ZITHROMAX",
  "زيثروماكس": "ZITHROMAX",
  "زيثرودوز": "ZITHROMAX",
  "سياليس": "CIALIS",
  "فياجرا": "VIAGRA",
  "ليفيترا": "LEVITRA",
  "أورلي": "ORLI",
  "ديفلوكان": "DIFFLUCAN",
  "كيبرا": "KEPPRA",
  "سينجولير": "SINGULAIR",
  "نيورونتين": "NEURONTIN",
  "جابابنتين": "GABAPENTIN",
  "بلافيكس": "PLAVIX"
};
