# ReLoad

**Smart return-load optimization — turn empty miles into profitable journeys.**

ReLoad is an AI-powered return-load optimization platform that connects trucks completing deliveries with suitable shipments waiting along their return routes. Instead of letting trucks travel back empty, ReLoad identifies compatible return loads based on route, location, timing, vehicle capacity, equipment requirements, and verified trust — and backs every booking with a locked fare and an escrow-protected payment.

> Built as a fullstack monorepo: a Next.js 14 frontend across three portals (Shipper, Driver, Admin) and a FastAPI backend with three purpose-built ML models — demand forecasting, telematics safety detection, and an explainable trust score.

---

## The Problem

A large number of trucks complete deliveries and return without cargo, while businesses simultaneously struggle to find suitable transport for their shipments.

| Effect | Impact |
|---|---|
| Empty / deadhead kilometers | Wasted fuel and time |
| Idle capacity | Lower transporter earnings |
| Poor coordination | Higher logistics costs |
| Low vehicle utilization | Unnecessary carbon emissions |

The core problem isn't a shortage of trucks or loads — it's the **lack of intelligent, trustworthy coordination** between them.

---

## How It Works

The flow is built around 3 specialized intelligence systems and an escrow safety gate:

```
[1. Shipper Requests Load]
         │
         ▼
[2. Verified Matching & Locked Fare] ──► matching_service (strictly verified fleet)
         │                                + fare_service (0 hidden surcharges)
         │                                + Displays Driver TrustScore (0-100)
         ▼
[3. Booking Created & Demand Logged] ──► Writes to demand_logs to feed ML model
         │
         ▼
[4. Payment Held in Escrow] ───────────► PaymentRecordStatus.held (funds locked safely)
         │
         ▼
[5. Pickup Handoff Verification] ──────► Multi-party OTP + photo inspection proof
         │
         ▼
[6. Transit & Telematics Monitoring] ──► Live WebSocket GPS pings evaluated by
         │                                app.ml.safety.detector for route deviations
         │
         ├─► [Optional Surcharge Request] ──► Driver submits detour/toll adjustment;
         │                                    must be approved by shipper or dispatch
         ▼
[7. Dropoff Handoff Verification] ─────► Consignee confirms delivery with signed proof
         │
         ▼
[8. Escrow Released to Transporter] ───► Funds auto-released on dual handoff validation
         │
         ▼
[9. Return Load & Demand Forecasting] ─► Driver portal calls app.ml.demand to view
                                         hourly demand hotspots on the return corridor
```

### How the 3 ML models plug into the flow

**Explainable Trust Score** (`app.services.trust_service`)
- **When:** Displayed at booking time and on the driver profile.
- **How:** Evaluates KYC document verification status (VAHAN/ULIP validity), historical dispute count, and completed shipments to produce a transparent 0–100 trust rating.

**Surcharge Recommendation & Arbitration** (`app.routers.surcharges`)
- **When:** During active transit, not at initial booking.
- **How:** If unexpected route detours or toll variations occur, drivers request a surcharge with evidence. It's never silently added — the customer must explicitly accept or dispute it.

**Corridor Demand Forecasting** (`app.ml.demand`)
- **When:** Post-trip or on the driver's return leg.
- **How:** A scikit-learn model trained on corridor trip volume (`demand_logs`) forecasts the next 1–24 hour freight demand by geographical zone (e.g. Chakan MIDC vs. Nhava Sheva), guiding drivers to return-freight opportunities and eliminating empty deadhead kilometers.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 Frontend                      │
│        (TypeScript + Tailwind CSS + Lucide + Web Speech)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST & WebSockets (Port 3000 -> 8000)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                        │
│            (Uvicorn + Pydantic v2 + Python-Jose JWT)        │
├──────────────────────────────┬──────────────────────────────┤
│         ML Service           │          ORM Layer           │
│   (Scikit-Learn + Pandas)    │      (SQLAlchemy 2.0)        │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │ psycopg2
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Supabase PostgreSQL Database                │
│    (14 Relational Tables + Demand Logs + Alembic Migration) │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend Layer:** Next.js 14 App Router, Tailwind CSS, Material Symbols & Lucide, Web Speech synthesis for audio guidance in Hindi, Marathi, Gujarati, Punjabi, and English.
- **API / Application Layer:** FastAPI on Uvicorn with auto-reload, Pydantic v2 schemas, standard CORS middleware for cross-origin requests.
- **Live Communication:** Native WebSockets at `/api/v1/ws/chat/{booking_id}` (driver-shipper in-transit messaging) and `/api/v1/ws/gps/{booking_id}` (telematics GPS stream).
- **Persistence Layer:** PostgreSQL hosted on Supabase via the AWS ap-southeast-2 connection pooler (port 5432). Managed with 14 SQLAlchemy ORM models, version-controlled with Alembic.
- **Cache / Storage:** Browser `localStorage` for JWT bearer tokens and active session context; file/evidence URLs stored as cloud-compatible paths.

---

## Tech Stack

### Frontend
- Next.js 14.2.35 (App Router — React Server Components + Client Components)
- React 18.3.1 & React DOM 18.3.1
- TypeScript 5.7.3
- Tailwind CSS 3.4.17, PostCSS & Autoprefixer, `tailwind-merge` & `clsx`
- Google Material Symbols Outlined, Lucide React 0.475.0
- Web Speech API (`window.speechSynthesis`) — multi-lingual audio guidance in Hindi, Marathi, Gujarati, Punjabi, English
- React Context API (`LanguageContext.tsx`) for i18n + RTL/LTR script rendering
- Custom typed HTTP client (`src/lib/api.ts`) with Bearer token authentication

### Backend
- FastAPI 0.141.1 (ASGI)
- Uvicorn 0.52.4 (httptools + watchfiles for hot reload)
- Python 3.14 (3.10+ compatible)
- Pydantic 2.13.5 & pydantic-core 2.46.5, pydantic-settings 2.15.0
- WebSockets 17.1 — live GPS telemetry & fleet pinging
- python-jose 3.5.0 (JWT, HS256), passlib 1.7.4 + bcrypt 4.0.1, cryptography 50.0.1 & rsa 4.9.1

### Database & ORM
- PostgreSQL, cloud-hosted via Supabase
- AWS Transaction Pooler (port 5432, ap-southeast-2)
- psycopg2-binary 2.9.12
- SQLAlchemy 2.0.52 (declarative 2.x, async/sync sessions)
- Alembic 1.19.2 (version-controlled migrations)

### Machine Learning & Predictive Analytics
- NumPy 2.5.2 & SciPy 1.18.1
- Pandas 3.0.5
- scikit-learn 1.9.0
- joblib 1.6.0 & cloudpickle 3.1.2
- **Demand Forecasting:** predicts freight demand across National Highway corridors from historical trip coordinates and timestamps (`demand_logs`)
- **Dynamic Surcharge Recommendation:** recommends toll/detour adjustments from corridor density and congestion indices
- **Explainable Trust Score:** real-time multi-variable scoring for drivers/shippers based on punctuality, KYC status, and handoff proof verification

### Third-Party Integrations & Compliance
- FASTag & OBD-II cold-chain temperature telemetry (-18°C reefer tracking)
- National Logistics Portal / Unified Logistics Interface Platform (ULIP)
- VAHAN/SARATHI e-KYC compliance verification

---

## Payment Model

The active build uses an **Automated Escrow & Multi-Signature Handoff Protocol** — not the x402/Algorand testnet flow (that was an early hackathon ideation note and is not part of the operational build).

```
Shipper checks out ──► Payment created in `held` status
         │
Driver completes pickup ──► OTP + photographic handoff proof
         │
Driver completes dropoff ──► Receiver confirmation
         │
validate_handoff_proofs_for_release() passes ──► Status transitions to `released`
         │
(if unresolved issue) ──► Status can transition to `disputed` or `refunded`
```

---

## Project Structure

Fullstack monorepo — no separate `ai-service/` or `shared/` folder; ML models and services live directly inside `backend/app/ml/`.

```
ReLoad/
├── README.md
├── .vscode/
│   └── tasks.json                     # VS Code one-click tasks for running fullstack
├── backend/
│   ├── .env.example
│   ├── requirements.txt
│   ├── alembic/                       # Schema migrations
│   │   ├── env.py
│   │   └── versions/
│   ├── app/
│   │   ├── main.py                    # FastAPI entrypoint, CORS, WebSocket mounts
│   │   ├── seed.py                    # Database seeder (users, vehicles, demand logs)
│   │   ├── core/
│   │   │   ├── config.py              # Pydantic BaseSettings (.env loader)
│   │   │   ├── database.py            # SQLAlchemy engine, SessionLocal, Base
│   │   │   └── security.py            # JWT (HS256), bcrypt password hashing, RBAC
│   │   ├── models/                    # 14 SQLAlchemy ORM models
│   │   │   ├── booking.py, user.py, vehicle.py, payment.py
│   │   │   ├── demand_log.py, gps_ping.py, handoff_proof.py
│   │   │   ├── safety_flag.py, surcharge_request.py, trust_score.py
│   │   │   └── document.py, message.py, notification.py, report.py
│   │   ├── schemas/                   # Pydantic v2 validation schemas
│   │   ├── routers/                   # 12 FastAPI REST/WebSocket route modules
│   │   │   ├── auth.py, bookings.py, vehicles.py, payments.py
│   │   │   ├── surcharges.py, handoffs.py, trust.py, ml.py
│   │   │   └── safety.py, gps.py, chat.py, notifications.py
│   │   ├── services/                  # Core domain logic
│   │   │   ├── matching_service.py    # Strict verified-vehicle matching
│   │   │   ├── fare_service.py        # Locked base fare + cargo multiplier calculation
│   │   │   ├── booking_state_machine.py # Valid status transitions
│   │   │   ├── payment_service.py     # Handoff-proof escrow release gate
│   │   │   ├── trust_service.py       # Multi-variable driver/shipper trust score
│   │   │   └── notification_service.py
│   │   └── ml/                        # ML models & inference pipelines
│   │       ├── demand/
│   │       │   ├── model.pkl          # Trained Random Forest demand forecasting model (38MB)
│   │       │   ├── features.py        # Spatio-temporal feature extractor
│   │       │   ├── predict.py         # Hourly demand inference engine
│   │       │   ├── train.py           # Training script (scikit-learn)
│   │       │   ├── zone.py            # Corridor zone partitioner (Zones 1-8)
│   │       │   └── generate_demand_data.py
│   │       └── safety/
│   │           ├── detector.py        # Telematics route deviation & anomaly detector
│   │           └── thresholds.py      # Geofence, speed, night-driving rules
│   └── tests/                         # Test suite (730+ LOC)
│       ├── test_person4_flows.py      # Escrow, surcharges, handoff, WS tests
│       └── test_trust_module.py       # Trust scores & document expiry tests
└── frontend/
    ├── package.json                   # Next.js 14, Tailwind CSS, Lucide
    ├── .env.local                     # NEXT_PUBLIC_API_URL=http://localhost:8000
    ├── next.config.mjs
    ├── tailwind.config.ts
    └── src/
        ├── lib/
        │   └── api.ts                 # Typed fetch client connecting to FastAPI
        ├── context/
        │   └── LanguageContext.tsx    # 5-dialect i18n + Web Speech audio assistance
        ├── components/
        │   ├── ScreenSwitcher.tsx     # Quick navigator across all 23 screens
        │   ├── admin/                 # Admin sidebar & header layouts
        │   ├── customer/              # Customer bottom navigation bar
        │   └── driver/                # Driver navigation controls
        └── app/                       # Next.js App Router
            ├── page.tsx               # Splash / entry screen
            ├── landing/page.tsx       # 3-persona selection (Shipper, Driver, Admin)
            ├── customer/              # Shipper Portal
            │   └── login/, home/, vehicles/, tracking/, bookings/, profile/, receipt/, support/
            ├── driver/                # Driver Sarathi Portal
            │   └── login/, home/, navigation/, handoff/, forecast/, profile/
            └── admin/                 # Operational Dispatch Console
                └── login/, dashboard/, drivers/, reports/, surcharges/, bookings/[id]/
```

---

## Status at a Glance

| Component | Status | Implementation Details |
|---|---|---|
| FastAPI Backend Core | ✅ Done | 12 routers, RBAC (customer, driver, company_admin), JWT authentication |
| Supabase PostgreSQL | ✅ Done | 14 tables created, Alembic migrations applied, 45+ seed users & 120+ trips |
| Next.js Frontend | ✅ Done | 23 screens across Shipper, Driver, and Admin portals, fully functional |
| Frontend-Backend API | ✅ Done | Central typed client in `frontend/src/lib/api.ts` connecting all portals |
| ML: Demand Forecasting | ✅ Done | Trained `model.pkl` (Random Forest, 38MB) + `/api/v1/demand/forecast` |
| ML: Telematics Safety | ✅ Done | `detector.py` rule-based anomaly detector for stops, night driving, deviation |
| Trust Score Engine | ✅ Done | Dynamic formula based on VAHAN compliance, reports, and handoffs |
| Payment Escrow Gating | ✅ Done | Escrow checkout (`held` status), released only after dual handoff proof validation |
| WebSockets | ✅ Done | Dual WebSocket endpoints for GPS pings and live chat |
| VAHAN / ULIP / FASTag | 🔶 Simulated/Integrated | Vehicle age-cap checks (5-year limit), fitness expiry dates, locked toll calculations |
| Test Suite | ✅ Ready | 730+ lines of tests in `backend/tests/`, SQLite in-memory mock engine |

---

## Getting Started

### Required Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://<user>:<password>@<supabase-pooler-host>:5432/postgres
JWT_SECRET_KEY=<generate-a-strong-secret>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
VEHICLE_AGE_CAP_YEARS=5
VERIFICATION_DUE_MONTHS=6
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> ⚠️ Never commit real Supabase credentials or JWT secrets to `.env` — use `.env.example` as the template and keep the filled `.env` gitignored.

### Setup Commands

**Terminal 1 — Backend:**
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Run tests:**
```bash
cd backend
pytest tests/
```

---

## Impact

ReLoad aims to:

- Reduce empty truck kilometers
- Increase vehicle utilization
- Improve transporter profitability
- Reduce logistics costs and fuel wastage
- Lower unnecessary emissions
- Make return logistics more predictable and trustworthy
- Improve supply-chain efficiency

---

## Future Scope

- Advanced demand prediction across more corridors and seasons
- Real-time traffic and weather integration
- Dynamic pricing
- IoT/GPS-based vehicle telemetry expansion
- Automated load negotiation
- Deeper multilingual support beyond the current 5 languages
- Large-scale logistics-platform integrations (full ULIP/VAHAN production APIs, not simulated)
- Advanced fraud and trust scoring
- Cross-region and international expansion

---

## Repository & Licensing

- **GitHub Repository:** [aditiT09/ReLoad](https://github.com/aditiT09/ReLoad/tree/main)
- **License:** MIT (recommended) — currently open for hackathon evaluation
