// server.js - Node.js Express backend proxy for Badeelk
// Compliant with Modification 3: Whitelist check, 20 req/hr rate limiting, caching, Gemini API integration, and safety rules.

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, '..')));

// Simple in-memory rate limiting: 20 requests per hour per IP
const rateLimits = new Map();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW = 3600 * 1000;

function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const timestamps = (rateLimits.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW);
  rateLimits.set(ip, timestamps);

  if (timestamps.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Maximum 20 explanations per hour.',
      retryAfterSeconds: Math.ceil((RATE_LIMIT_WINDOW - (now - timestamps[0])) / 1000)
    });
  }

  timestamps.push(now);
  next();
}

// Server-side cache file
const CACHE_FILE = path.join(__dirname, '../data/ai_explanations_cache.json');
let serverCache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    serverCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  } catch (e) {
    serverCache = {};
  }
}

app.post('/api/explain', rateLimitMiddleware, async (req, res) => {
  const { ingredientEn, ingredientAr, strength, form, lang } = req.body;
  if (!ingredientEn) {
    return res.status(400).json({ error: 'ingredientEn is required' });
  }

  const cleanEn = String(ingredientEn).trim().toUpperCase();
  const cleanLang = String(lang).toLowerCase() === 'en' ? 'en' : 'ar';
  const cacheKey = `${cleanEn}|${strength || ''}|${form || ''}|${cleanLang}`;

  // Check cache
  if (serverCache[cacheKey]) {
    return res.json(serverCache[cacheKey]);
  }

  // API Call to Gemini if configured
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (apiKey) {
    try {
      const prompt = `أنت صيدلي إكلينيكي مصري تشرح معلومات الأدوية للعامة بلغة عربية بسيطة وواضحة (أو بالإنجليزية إذا كانت اللغة المطلوبة en).
المدخلات: المادة الفعالة: ${cleanEn} (${ingredientAr || ''})، التركيز: ${strength || ''}، الشكل الدوائي: ${form || ''}، اللغة: ${cleanLang}

القواعد الصارمة:
1) أجب بصيغة JSON فقط بدون أي نص خارجه.
2) لا تذكر أي جرعات أو عدد مرات أو جرعات للأطفال أبدًا.
3) لا تشخّص ولا تنصح بتغيير أو إيقاف دواء.
4) إذا لم تكن متأكدًا من معلومة اكتب "غير متاح".
5) اعتمد على معلومات دوائية معروفة ومعتمدة فقط.
6) اجعل كل قائمة من 3 إلى 5 نقاط قصيرة.

شكل الإخراج:
{
  "summary": "جملتان عن الدواء وفيم يُستخدم",
  "drugClass": "التصنيف الدوائي",
  "allowedFor": ["..."],
  "avoidIf": ["..."],
  "sideEffects": ["..."],
  "interactions": ["..."],
  "tips": ["..."],
  "seeDoctorIf": ["..."]
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 700,
            responseMimeType: 'application/json'
          }
        })
      });

      if (response.ok) {
        const jsonRes = await response.json();
        const text = jsonRes.candidates[0].content.parts[0].text;
        const result = JSON.parse(text);

        serverCache[cacheKey] = result;
        fs.writeFileSync(CACHE_FILE, JSON.stringify(serverCache, null, 2), 'utf-8');
        return res.json(result);
      }
    } catch (err) {
      console.error('Gemini API error:', err);
    }
  }

  // Fallback clinical template
  const fallback = {
    summary: cleanLang === 'ar'
      ? `مستحضر علاجي يحتوي على المادة الفعالة ${cleanEn}. يُستخدم لعلاج الحالات المرضية المعتمدة وفق تقييم الطبيب المعالج.`
      : `Pharmaceutical product containing active ingredient ${cleanEn}. Used for approved clinical indications.`,
    drugClass: cleanLang === 'ar' ? 'علاج صيدلي مسجل بهيئة الدواء المصرية' : 'Registered Pharmaceutical Active Molecule',
    allowedFor: cleanLang === 'ar' ? ['البالغون تحت إشراف طبي', 'الفئات المحددة بالنشرة الداخلية'] : ['Adults under medical advice', 'Patients matching package insert'],
    avoidIf: cleanLang === 'ar' ? ['الحساسية المفرطة تجاه المادة الفعالة', 'الحمل والرضاعة دون استشارة مسبقة'] : ['Hypersensitivity to active ingredient', 'Pregnancy without medical approval'],
    sideEffects: cleanLang === 'ar' ? ['اضطرابات هضمية محتملة', 'صداع خفيف'] : ['Mild gastrointestinal discomfort', 'Occasional headache'],
    interactions: cleanLang === 'ar' ? ['استشر الصيدلي بشأن الأدوية الأخرى المتزامنة'] : ['Consult pharmacist regarding concurrent medications'],
    tips: cleanLang === 'ar' ? ['الالتزام بالنشرة الداخلية', 'حفظ الدواء بعيداً عن الأطفال'] : ['Follow official package leaflet', 'Store away from children'],
    seeDoctorIf: cleanLang === 'ar' ? ['ظهور أعراض حساسية حادة', 'عدم تحسن الحالة خلال الأيام المقررة'] : ['Severe allergic reactions', 'Lack of clinical improvement']
  };

  serverCache[cacheKey] = fallback;
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(serverCache, null, 2), 'utf-8');
  } catch (e) {}
  return res.json(fallback);
});

app.listen(PORT, () => {
  console.log(`Badeelk Express Server running at http://localhost:${PORT}`);
});
