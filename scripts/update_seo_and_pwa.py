# scripts/update_seo_and_pwa.py
# Updates sitemap.xml and manifest.json for SEO & PWA compliance (Section 5 & 6)

SITEMAP_XML = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>./</loc>
    <lastmod>2026-10-11</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
"""

MANIFEST_JSON = """{
  "name": "بديلك - بدائل الأدوية في مصر",
  "short_name": "بديلك",
  "description": "أسرع محرك بحث عن بدائل الأدوية المصرية بالاسم والمادة الفعالة والتركيز.",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#0F5A46",
  "theme_color": "#0F5A46",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
"""

with open("../sitemap.xml", "w", encoding="utf-8") as f:
    f.write(SITEMAP_XML)

with open("../manifest.json", "w", encoding="utf-8") as f:
    f.write(MANIFEST_JSON)

print("Updated sitemap.xml and manifest.json successfully!")
