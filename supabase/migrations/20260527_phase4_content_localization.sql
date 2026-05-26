-- Add settings JSONB column for editable content
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Seed default content for existing admin profiles
UPDATE profiles SET settings = '{
  "tagline": "Don''t Panic, It''s Organic",
  "hero_welcome": "Welcome to {businessName}, your trusted licensed cannabis dispensary in {county}.",
  "hero_description": "We''re committed to providing premium, organic cannabis products with the highest standards of quality and compliance.",
  "about_story": "{businessName} was founded on the belief that everyone deserves access to high-quality, natural cannabis products in a safe, welcoming environment. We''re more than just a dispensary — we''re your partners in wellness and advocates for responsible cannabis use.",
  "about_features": [
    {"title": "Licensed & Compliant", "description": "Fully licensed cannabis dispensary operating in full compliance with local regulations."},
    {"title": "Organic & Natural", "description": "Premium organic cannabis products sourced from trusted growers committed to sustainability."},
    {"title": "Quality Assured", "description": "Every product is rigorously tested for potency, purity, and safety before reaching our shelves."},
    {"title": "Expert Guidance", "description": "Our knowledgeable staff provides personalized recommendations for your wellness journey."}
  ],
  "about_compliance_text": "As a licensed cannabis dispensary, we take our responsibility seriously. We operate under strict compliance with all local and state regulations, ensuring every transaction is legal, documented, and conducted with the highest standards of professionalism.",
  "address": "123 Main Street",
  "store_hours": "Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 11:00 AM - 5:00 PM",
  "footer_mission": "Your trusted licensed cannabis dispensary in {county}, committed to quality, compliance, and responsible cannabis education.",
  "legal_disclaimer": "All cannabis products are for medical or recreational use only where permitted by law. Cannabis has not been analyzed or approved by the FDA. You must be 21 years of age or older to purchase cannabis products. Please consume responsibly. Keep out of reach of children and pets. Do not operate vehicles or machinery after use. This website is for informational purposes only and does not constitute an e-commerce platform — no online sales are conducted here.",
  "admin_welcome": "Welcome back, {name} 👑"
}'::jsonb WHERE settings = '{}'::jsonb OR settings IS NULL;
