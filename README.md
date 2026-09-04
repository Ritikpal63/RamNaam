# श्री राम नाम लेखन अभियान — React + Express + MySQL

यह responsive full-stack starter/MVP आपके दिए हुए spiritual campaign design और functional specification के आधार पर तैयार किया गया है। UI में maroon/cream/orange devotional theme, readable Hindi typography, large touch targets और mobile-first responsive layouts रखे गए हैं।

## Included

- React + Vite frontend
- Express/Node.js API
- MySQL schema
- Registration/Login with JWT + bcrypt
- Public collective Ram Naam counters
- Online Ram Naam writing/counting module
- User Sadhana dashboard
- Sankalp/Pledge system with Sankalp ID
- Streak summary
- Events/Gallery/News API foundation
- Seva, Daily Sadhana, Bhajan, Devotee Experience UI sections
- Admin overview dashboard
- Offline Ram Naam verification-ready DB model
- Certificate-ready DB model
- Contact and audit-log tables
- Helmet, CORS, API rate limiting
- Responsive desktop/tablet/mobile UI
- Minimum readable typography; no tiny content text

## 1. MySQL Setup

```bash
mysql -u root -p < server/database/schema.sql
```

Then create `server/.env` from `server/.env.example`.

## 2. Start Backend

```bash
cd server
npm install
npm run dev
```

Backend: `http://localhost:8000`
Health: `http://localhost:8000/api/health`

## 3. Start Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## 4. Create First Admin

Register a normal user first, then in MySQL run:

```sql
UPDATE users SET role='admin' WHERE email='your-admin@email.com';
```

Log out and log in again. `/admin` will become available.

## Important implementation note

The current writing board counts a Ram Naam whenever the devotee taps/clicks the writing surface or adds a selected quick count. True handwriting recognition of handwritten “श्री राम” from mouse/finger/stylus strokes requires an OCR/ML recognition layer and should not be faked. The schema and UI can be extended with Canvas + a verified recognition service in the next development phase.

## Recommended production additions

- OTP/email verification
- Image/object storage (S3/Cloudinary or equivalent)
- Real notebook-image upload and admin verification UI
- Admin CRUD for events, gallery, news, sadhana and volunteers
- Notification preferences + email/SMS/WhatsApp provider
- Certificate PDF + QR verification endpoint
- Donation module only after legal/financial compliance is finalized
- Admin 2FA
- CAPTCHA on public forms
- Automated DB backup and audit reports
- CDN and image optimization

## Design

The user-provided homepage screenshot is included in `design-reference/home-reference.jpeg` only as a design reference.

## Ram Naam Writer V2 (अक्षर/मात्रा आधारित)

ऑनलाइन writer में direct click-count और quick/manual bulk-add हटा दिया गया है। अब user एक-एक अक्षर/मात्रा से `श्री राम` बनाता है:

`श` → `्` → `र` → `ी` → `र` → `ा` → `म`

पहले चार inputs से `श्री` बनता है और UI उसके बाद शब्दों के बीच space दिखाता है। पूरा `श्री राम` बनते ही वही एक Ram Naam count होता है और अगला cell active होता है। एक digital page में 108 cells हैं।

Frontend raw number भेजकर digital count add नहीं करता। `POST /api/ramnaam/deposit` completed entries भेजता है और backend exact `श्री राम` entries को verify करके count calculate करता है। एक ही page id दोबारा submit होने पर duplicate deposit reject होता है।

पुराना `/api/ramnaam/add` online digital writing के लिए स्वीकार नहीं किया जाता; वह केवल future manual/offline workflows के लिए है।
# RamNaam
