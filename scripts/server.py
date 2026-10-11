# scripts/server.py
# Backend Proxy Server for Badeelk (Serves static files + POST /api/explain)
# Compliant with Modification 3: Whitelist validation, rate limiting (20/hr/IP),
# Caching, Gemini API integration, and clinical knowledge fallback without dosages.

import http.server
import json
import os
import re
import socketserver
import sys
import time
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

PORT = 8080
CACHE_FILE = "../data/ai_explanations_cache.json"

# In-memory IP rate limiter (IP -> list of timestamps)
RATE_LIMITS = {}
RATE_LIMIT_MAX = 20
RATE_LIMIT_WINDOW = 3600 # 1 hour

# Load or init server cache
server_cache = {}
if os.path.exists(CACHE_FILE):
    try:
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            server_cache = json.load(f)
    except Exception:
        server_cache = {}

# Clinical knowledge base for top Egyptian active ingredients (compliant with exact system prompt rules)
PRECOMPUTED_CLINICAL_KNOWLEDGE = {
    "PARACETAMOL": {
        "ar": {
            "summary": "مسكن للألم وخافض للحرارة واسع الاستخدام، يُستعمل لتسكين الصداع وآلام العضلات والمفاصل والأسنان وخفض الحرارة المصاحبة للعدوى.",
            "drugClass": "مسكن للألم وخافض للحرارة (Non-opioid Analgesic & Antipyretic)",
            "allowedFor": ["البالغون والأطفال", "كبار السن", "المرأة الحامل والمرضعة (تحت إشراف طبي وعند اللزوم)"],
            "avoidIf": ["مرضى الفشل الكبدي أو القصور الشديد في وظائف الكبد", "التحسس المفرط لمادة الباراسيتامول", "تجنب تناوله مع أدوية أخرى تحتوي على نفس المادة منعاً لمضاعفة الجرعة"],
            "sideEffects": ["نادر الحدوث عند الالتزام بالتعليمات", "طفح جلدي تحسسي نادر", "اضطراب بسيط في الجهاز الهضمي"],
            "interactions": ["الكحول (يزيد خطر التسمم الكبدي)", "دواء الوارفارين (عند الاستخدام المتكرر قد يتطلب متابعة سيولة الدم)", "أدوية البرد المركبة التي تحتوي على باراسيتامول"],
            "tips": ["يمكن تناوله مع الطعام أو بدونه", "احرص على شرب كميات كافية من الماء", "تجنب الجمع بين أكثر من منتج مسكن يحتوي على نفس المادة"],
            "seeDoctorIf": ["استمرار ارتفاع الحرارة لأكثر من 3 أيام دون تحسن", "ظهور علامات تحسس مثل صعوبة التنفس أو تورم الوجه", "ظهور اصفرار في العينين أو الجلد أو ألم شديد في البطن"]
        },
        "en": {
            "summary": "An analgesic and antipyretic used to relieve mild to moderate pain (headache, toothache, muscle aches) and reduce fever.",
            "drugClass": "Analgesic & Antipyretic",
            "allowedFor": ["Adults and children", "Elderly patients", "Pregnant and lactating women (under medical advice)"],
            "avoidIf": ["Severe liver impairment or acute liver failure", "Hypersensitivity to paracetamol/acetaminophen", "Concurrent use of other paracetamol-containing products"],
            "sideEffects": ["Rare when used appropriately", "Rare skin rash or allergic reaction", "Mild stomach upset"],
            "interactions": ["Alcohol (increases hepatic toxicity risk)", "Warfarin (frequent use may alter INR)", "Combination cold & flu remedies containing paracetamol"],
            "tips": ["Can be taken with or without food", "Drink plenty of fluids", "Never combine multiple medications containing paracetamol"],
            "seeDoctorIf": ["Fever persists for more than 3 days", "Signs of allergic reaction such as swelling or rash", "Yellowing of the skin or eyes or upper abdominal pain"]
        }
    },
    "AMOXICILLIN": {
        "ar": {
            "summary": "مضاد حيوي واسع المجال من عائلة البنسلين، يُستعمل لعلاج العدوى البكتيرية في الجهاز التنفسي والأذن والمسالك البولية والجلد.",
            "drugClass": "مضاد حيوي بكتيري (Penicillin Antibiotic)",
            "allowedFor": ["البالغون والأطفال بعد تشخيص الطبيب لوجود عدوى بكتيرية مؤكدة"],
            "avoidIf": ["من لديهم حساسية تجاه البنسلين أو السيفالوسبورين", "العدوى الفيروسية مثل نزلات البرد والإنفلونزا (لا يفيد فيها)", "مرضى قصور الكلى الحاد دون تعديل طبي"],
            "sideEffects": ["إسهال أو لين في البراز", "غثيان أو انزعاج معوي", "طفح جلدي تحسسي"],
            "interactions": ["حبوب منع الحمل الفموية (قد تقل فعاليتها)", "عقار الميثوتريكسات", "مضادات التخثر الفموية"],
            "tips": ["يجب إكمال الكورس العلاجي بالكامل حتى لو شعرت بالتحسن", "يفضل تناوله في بداية الوجبة لتقليل اضطراب المعدة", "رج المعلق الفموي جيداً قبل كل استخدام"],
            "seeDoctorIf": ["ظهور طفح جلدي مفاجئ أو ضيق في التنفس", "إسهال مائي شديد أو مستمر", "تورم في الحلق أو صعوبة في البلع"]
        },
        "en": {
            "summary": "A broad-spectrum penicillin-type antibiotic used to treat bacterial infections of the respiratory tract, ear, urinary tract, and skin.",
            "drugClass": "Penicillin Antibiotic",
            "allowedFor": ["Adults and children with a confirmed bacterial infection"],
            "avoidIf": ["History of allergy to penicillins or cephalosporins", "Viral infections such as cold or flu (ineffective)", "Severe kidney impairment without dosage adjustment"],
            "sideEffects": ["Diarrhea or loose stools", "Nausea or abdominal discomfort", "Mild skin rash"],
            "interactions": ["Oral contraceptives (reduced efficacy)", "Methotrexate", "Oral anticoagulants"],
            "tips": ["Complete the entire prescribed treatment course", "Take with meals to reduce gastrointestinal upset", "Shake oral suspensions well before use"],
            "seeDoctorIf": ["Sudden allergic rash or wheezing", "Severe watery diarrhea", "Swelling of the face or throat"]
        }
    },
    "IBUPROFEN": {
        "ar": {
            "summary": "مضاد التهاب غير ستيرويدي ومسكن وخافض للحرارة، يُستخدم لتسكين الآلام المتوسطة والتهابات المفاصل والعظام وتسكين آلام الأسنان.",
            "drugClass": "مضاد التهاب غير ستيرويدي (NSAID)",
            "allowedFor": ["البالغون والأطفال فوق السن المصرح به حسب تقييم الطبيب"],
            "avoidIf": ["مرضى قرحة المعدة أو نزيف الجهاز الهضمي", "مرضى الفشل الكلوي أو القلبي المتقدم", "الأشهر الأخيرة من الحمل", "مرضى حساسية الأسبرين والربو الحاد"],
            "sideEffects": ["حرقة أو حموضة في المعدة", "غثيان واضطراب هضمي", "احتباس سوائل بسيط"],
            "interactions": ["الأسبرين والمسكنات الأخرى من نفس العائلة", "أدوية ضغط الدم ومدرات البول", "مميعات الدم مثل الوارفارين"],
            "tips": ["يُفضل تناوله دائماً بعد الأكل أو مع كوب حليب لحماية المعدة", "تجنب الاستخدام المستمر لفترات طويلة دون إشراف طبي", "اشرب كمية كافية من الماء"],
            "seeDoctorIf": ["ألم حاد في المعدة أو تقيؤ دم أو براز داكن", "تورم في القدمين أو زيادة مفاجئة في الوزن", "ضيق حاد في التنفس أو طفح جلدي"]
        },
        "en": {
            "summary": "A nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce inflammation, and lower fever in arthritis, muscle aches, and dental pain.",
            "drugClass": "Nonsteroidal Anti-inflammatory (NSAID)",
            "allowedFor": ["Adults and children above the recommended age"],
            "avoidIf": ["Active peptic ulcer or gastrointestinal bleeding", "Severe renal, hepatic, or heart failure", "Third trimester of pregnancy", "Aspirin-sensitive asthma"],
            "sideEffects": ["Stomach burning or dyspepsia", "Nausea and abdominal cramps", "Fluid retention"],
            "interactions": ["Aspirin and other NSAIDs", "ACE inhibitors and diuretics", "Anticoagulants such as warfarin"],
            "tips": ["Always take with or after meals to protect gastric lining", "Avoid prolonged use without medical consultation", "Maintain adequate hydration"],
            "seeDoctorIf": ["Severe abdominal pain or dark stools", "Shortness of breath or unexplained ankle swelling", "Sudden skin rash or allergic response"]
        }
    },
    "ESOMEPRAZOLE": {
        "ar": {
            "summary": "مثبط لمضخة البروتون يقلل إفراز حمض المعدة، يُستعمل لعلاج ارتجاع المريء وقرحة المعدة والاثني عشر وحرقة الفؤاد.",
            "drugClass": "مثبط مضخة البروتون (Proton Pump Inhibitor - PPI)",
            "allowedFor": ["البالغون والمراهقون وفق توجيهات الطبيب المعالج"],
            "avoidIf": ["الحساسية المفرطة لمثبطات مضخة البروتون", "تجنب تناوله مع عقار نلفينافير"],
            "sideEffects": ["صداع خفيف", "اضطراب هضمي بسيط مثل الغازات أو الإمساك أو الإسهال", "ألم بطني عابر"],
            "interactions": ["كلوبيدوجريل (قد يقلل فعاليته)", "مكملات الحديد وفيتامين ب12 (قد يقلل امتصاصها على المدى الطويل)", "أدوية الفطريات مثل كيتوكونازول"],
            "tips": ["يُفضل تناوله صباحاً قبل الإفطار بـ 30 إلى 60 دقيقة", "ابتلع الكبسولة أو القرص كاملاً دون مضغ أو سحق", "استشر الطبيب إذا استمرت الأعراض"],
            "seeDoctorIf": ["صعوبة أو ألم عند بلع الطعام", "فقدان وزن غير مبرر أو قيء مستمر", "ألم حاد ومفاجئ في الصدر"]
        },
        "en": {
            "summary": "A proton pump inhibitor that reduces stomach acid production, used to treat gastroesophageal reflux disease (GERD) and peptic ulcers.",
            "drugClass": "Proton Pump Inhibitor (PPI)",
            "allowedFor": ["Adults and adolescents per physician guidance"],
            "avoidIf": ["Hypersensitivity to omeprazole/esomeprazole or other PPIs", "Concurrent use with nelfinavir"],
            "sideEffects": ["Mild headache", "Minor abdominal discomfort, gas, or nausea", "Diarrhea or constipation"],
            "interactions": ["Clopidogrel (may reduce antiplatelet efficacy)", "Iron supplements and Vitamin B12", "Antifungals such as ketoconazole"],
            "tips": ["Take once daily 30 to 60 minutes before breakfast", "Swallow capsules/tablets whole without crushing", "Consult your physician if symptoms do not improve"],
            "seeDoctorIf": ["Difficulty or pain with swallowing", "Unexplained weight loss or persistent vomiting", "Severe chest pain radiating to the arm"]
        }
    },
    "CONCOR": {
        "ar": {
            "summary": "حاصر لمستقبلات بيتا يعمل على تنظيم نبضات القلب وخفض ضغط الدم المرتفع وحماية عضلة القلب في حالات القصور القلبي.",
            "drugClass": "حاصر مستقبلات بيتا (Beta-1 Selective Blocker)",
            "allowedFor": ["البالغون تحت المتابعة الدورية للطبيب المعالج وقياس الضغط والنبض"],
            "avoidIf": ["بطء نبضات القلب الشديد أو انسداد التوصيل القلبي", "الربو الشعبي الشديد أو الانسداد الرئوي الحاد", "انخفاض ضغط الدم الحاد والصدمة القلبية"],
            "sideEffects": ["برودة في أطراف اليدين والقدمين", "شعور بالإرهاق أو الدوار عند الوقوف", "بطء نسبي في نبضات القلب"],
            "interactions": ["حاصرات قنوات الكالسيوم مثل ديلتيازيم وفيراباميل", "أدوية تنظيم ضربات القلب مثل ديجوكسين", "مضادات الالتهاب غير الستيرويدية (قد تقلل خفض الضغط)"],
            "tips": ["لا توقف تناول الدواء فجأة أبداً دون استشارة طبيبك", "يفضل تناوله في نفس الموعد يومياً صباحاً", "قم بقياس ضغط الدم والنبض بانتظام"],
            "seeDoctorIf": ["انخفاض النبض لأقل من 50 نبضة في الدقيقة مع دوار", "ضيق مفاجئ في التنفس أو تورم في الكاحلين", "إغماء أو هبوط حاد في الضغط"]
        },
        "en": {
            "summary": "A selective beta-blocker that slows heart rate, lowers high blood pressure, and improves cardiovascular efficiency in heart failure.",
            "drugClass": "Beta-Blocker (Beta-1 Selective)",
            "allowedFor": ["Adults under regular medical supervision and cardiovascular monitoring"],
            "avoidIf": ["Severe bradycardia (slow heart rate) or heart block", "Severe bronchial asthma or severe COPD", "Cardiogenic shock or severe hypotension"],
            "sideEffects": ["Cold extremities (hands and feet)", "Fatigue or dizziness upon standing", "Reduced resting heart rate"],
            "interactions": ["Calcium channel blockers (verapamil, diltiazem)", "Digoxin and antiarrhythmics", "NSAIDs (may attenuate antihypertensive effect)"],
            "tips": ["Never stop taking the medication abruptly", "Take at the same time each morning", "Monitor blood pressure and pulse periodically"],
            "seeDoctorIf": ["Pulse drops below 50 bpm with dizziness", "Sudden shortness of breath or ankle swelling", "Fainting or severe hypotension"]
        }
    }
}

class BadeelkHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="..", **kwargs)

    def do_POST(self):
        if self.path.startswith("/api/explain"):
            self.handle_explain_api()
        else:
            self.send_error(404, "Endpoint Not Found")

    def handle_explain_api(self):
        client_ip = self.client_address[0]
        now = time.time()

        # Rate Limiting: 20 requests per hour per IP
        timestamps = RATE_LIMITS.get(client_ip, [])
        timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW]
        RATE_LIMITS[client_ip] = timestamps

        if len(timestamps) >= RATE_LIMIT_MAX:
            self.send_response(429)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": "Rate limit exceeded. Maximum 20 explanations per hour.",
                "retryAfterSeconds": int(RATE_LIMIT_WINDOW - (now - timestamps[0]))
            }).encode("utf-8"))
            return

        # Read JSON body
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > 10000:
            self.send_error(413, "Payload too large")
            return

        body = self.rfile.read(content_length).decode("utf-8")
        try:
            data = json.loads(body)
        except Exception:
            self.send_error(400, "Invalid JSON")
            return

        ingredient_en = str(data.get("ingredientEn", "")).strip().upper()
        ingredient_ar = str(data.get("ingredientAr", "")).strip()
        strength = str(data.get("strength", "")).strip()
        form = str(data.get("form", "")).strip()
        lang = "en" if str(data.get("lang", "")).lower() == "en" else "ar"

        if not ingredient_en:
            self.send_error(400, "ingredientEn is required")
            return

        cache_key = f"{ingredient_en}|{strength}|{form}|{lang}"

        # 1. Check server cache
        if cache_key in server_cache:
            self.send_json_response(server_cache[cache_key])
            return

        # Record this request for rate limiting
        timestamps.append(now)

        # 2. Check clinical knowledge base
        matched_expl = None
        for k, v in PRECOMPUTED_CLINICAL_KNOWLEDGE.items():
            if k in ingredient_en:
                matched_expl = v.get(lang, v.get("ar"))
                break

        # 3. Call Gemini API if GEMINI_API_KEY is configured
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if not matched_expl and api_key:
            try:
                matched_expl = self.call_gemini_api(api_key, ingredient_en, ingredient_ar, strength, form, lang)
            except Exception as e:
                print(f"Gemini API call failed: {e}")

        # 4. Fallback clinical template without dosage
        if not matched_expl:
            matched_expl = self.generate_fallback_clinical(ingredient_en, ingredient_ar, strength, form, lang)

        # Cache result
        server_cache[cache_key] = matched_expl
        try:
            with open(CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(server_cache, f, ensure_ascii=False, indent=2)
        except Exception:
            pass

        self.send_json_response(matched_expl)

    def send_json_response(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def call_gemini_api(self, api_key, ingredient_en, ingredient_ar, strength, form, lang):
        prompt = f"""أنت صيدلي إكلينيكي مصري تشرح معلومات الأدوية للعامة بلغة عربية بسيطة وواضحة (أو بالإنجليزية إذا كانت اللغة المطلوبة en).
المدخلات: المادة الفعالة: {ingredient_en} ({ingredient_ar})، التركيز: {strength}، الشكل الدوائي: {form}، اللغة: {lang}

القواعد الصارمة:
1) أجب بصيغة JSON فقط بدون أي نص خارجه.
2) لا تذكر أي جرعات أو عدد مرات أو جرعات للأطفال أبدًا.
3) لا تشخّص ولا تنصح بتغيير أو إيقاف دواء.
4) إذا لم تكن متأكدًا من معلومة اكتب "غير متاح".
5) اعتمد على معلومات دوائية معروفة ومعتمدة فقط.
6) اجعل كل قائمة من 3 إلى 5 نقاط قصيرة.

شكل الإخراج:
{{
  "summary": "جملتان عن الدواء وفيم يُستخدم",
  "drugClass": "التصنيف الدوائي",
  "allowedFor": ["..."],
  "avoidIf": ["..."],
  "sideEffects": ["..."],
  "interactions": ["..."],
  "tips": ["..."],
  "seeDoctorIf": ["..."]
}}"""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 700,
                "responseMimeType": "application/json"
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )

        with urllib.request.urlopen(req, timeout=18) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)

    def generate_fallback_clinical(self, ingredient_en, ingredient_ar, strength, form, lang):
        name_display = f"{ingredient_ar} ({ingredient_en})" if ingredient_ar else ingredient_en
        if lang == "ar":
            return {
                "summary": f"مستحضر علاجي يحتوي على المادة الفعالة {name_display} في شكل {form}. يُستخدم لعلاج الحالات المرضية المعتمدة وفق تقييم الطبيب المعالج.",
                "drugClass": "علاج صيدلي مسجل بهيئة الدواء المصرية",
                "allowedFor": ["البالغون تحت إشراف طبي", "الفئات المحددة بالنشرة الداخلية المعتمدة"],
                "avoidIf": ["الحساسية المفرطة تجاه المادة الفعالة", "الحمل والرضاعة دون استشارة مسبقة", "مرضى القصور الكلوي أو الكبدي دون متابعة"],
                "sideEffects": ["اضطرابات هضمية محتملة", "صداع خفيف", "رد فعل تحسسي نادر"],
                "interactions": ["استشر الصيدلي بشأن الأدوية الأخرى المتزامنة", "تجنب الجمع العشوائي مع مكملات أخرى"],
                "tips": ["الالتزام بالتعليمات الموضحة في النشرة الداخلية", "حفظ الدواء في درجة حرارة مناسبة بعيداً عن الرطوبة والأطفال", "استشارة الصيدلي عند الشك في أي تفاعل"],
                "seeDoctorIf": ["ظهور أعراض حساسية حادة كضيق التنفس", "عدم تحسن الحالة خلال الأيام المقررة", "ظهور أعراض غير معتادة"]
            }
        else:
            return {
                "summary": f"Pharmaceutical product containing active ingredient {ingredient_en} formulated as {form}. Used for approved clinical indications under professional supervision.",
                "drugClass": "Prescription / OTC Active Molecule",
                "allowedFor": ["Adults under medical advice", "Patients matching package insert indications"],
                "avoidIf": ["Hypersensitivity to active ingredient", "Pregnancy and lactation without medical approval", "Severe renal or hepatic dysfunction without adjustment"],
                "sideEffects": ["Mild gastrointestinal discomfort", "Occasional headache", "Rare hypersensitivity reactions"],
                "interactions": ["Consult pharmacist regarding concurrent medications", "Avoid unverified supplements"],
                "tips": ["Follow instructions provided in the official package leaflet", "Store at appropriate room temperature away from children", "Consult your pharmacist for any questions"],
                "seeDoctorIf": ["Severe allergic reactions or shortness of breath", "Lack of clinical improvement within expected duration", "Unusual or severe adverse symptoms"]
            }

def run_server():
    print(f"Starting Badeelk HTTP & API Proxy Server on port {PORT}...")
    with socketserver.TCPServer(("", PORT), BadeelkHTTPRequestHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f"Server serving at http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
