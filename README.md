# CivicSphere – Frontend Client

A modern Single-Page Application (SPA) for the **CivicSphere** local news and public engagement platform, built with **React 18**, **Vite**, **React Router v6**, **Axios**, and **Leaflet / OpenStreetMap**.

---

## 🚀 Features

- **Informed Consent Geolocation**:
  - Modal prompt before requesting device coordinates.
  - Device GPS opt-in with fallback manual neighborhood selection.
  - Interactive Leaflet OpenStreetMap with user radius overlay.
- **Location-Based News & Radius Filtering**:
  - Distance calculation and proximity slider (1 to 100 km).
  - Category filters and search across approved local news.
- **Secure File & Image Upload Components**:
  - `ImageUploader.jsx`: Drag-and-drop, preview thumbnail, upload progress bar, removal.
  - `FileUploader.jsx`: Document uploader for candidate credentials.
- **Role-Based Views & Portals**:
  - **Citizen Dashboard**: Civic reward coins wallet, interactive civic literacy quizzes, municipal feedback.
  - **Candidate Dashboard**: News creation with coordinates/photo/attachments, profile manifesto editor, document verification upload.
  - **Admin Console**: Candidate vetting queue, news moderation pipeline, platform content reports, audit log inspection.
- **Authentication & Security**:
  - Stateless JWT token storage in `localStorage`.
  - Axios request interceptor automatically attaching `Authorization: Bearer <token>`.
  - Automatic session cleanup on 401 Unauthorized responses.
  - `ErrorBoundary` component protecting against runtime crashes.

---

## 📁 Directory Structure

```
frontend/
├── index.html                      # HTML5 shell with Leaflet and FontAwesome CDN
├── package.json                    # Dependencies & build scripts
├── package-lock.json               # Locked dependency tree
├── vite.config.js                  # Vite dev server and /api proxy configuration
├── vercel.json                     # SPA rewrite configuration for Vercel
├── .env.example                    # Environment variable template
├── .gitignore                      # Git ignore rules for node_modules & dist
├── public/
│   └── favicon.svg                 # Platform icon
└── src/
    ├── main.jsx                    # React root entry wrapped in ErrorBoundary & Providers
    ├── App.jsx                     # Application routing & ProtectedRoute guards
    ├── App.css                     # Global design system & theme variables
    ├── index.css                   # CSS reset & base utility classes
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx          # Role-aware responsive navigation bar
    │   │   ├── Footer.jsx          # Platform footer
    │   │   ├── ProtectedRoute.jsx  # Role-based route guard
    │   │   └── ErrorBoundary.jsx  # Runtime error boundary
    │   ├── upload/
    │   │   ├── ImageUploader.jsx   # Drag-and-drop image uploader with progress
    │   │   └── FileUploader.jsx    # Candidate verification document uploader
    │   ├── location/
    │   │   ├── LocationConsentModal.jsx # Explicit location consent modal
    │   │   ├── LeafletMap.jsx      # OpenStreetMap with radius circle & pins
    │   │   ├── LocalitySelector.jsx# Predefined neighborhood dropdown
    │   │   └── RadiusSlider.jsx    # Proximity filter slider (1-100 km)
    │   ├── news/
    │   │   ├── NewsCard.jsx        # News article card with badges
    │   │   └── NearbyNewsFilter.jsx# Nearby proximity toolbar
    │   └── candidates/
    │       └── CandidateCard.jsx   # Verified candidate profile card
    ├── context/
    │   ├── AuthContext.jsx         # Authentication, user roles & JWT management
    │   └── LocationContext.jsx     # Geolocation state, consent & manual locality
    ├── services/
    │   ├── api.js                  # Axios instance with JWT interceptor
    │   ├── authService.js          # Login, citizen/candidate/admin registration
    │   ├── newsService.js          # Public, nearby, and candidate news operations
    │   ├── mediaService.js         # Image & document upload APIs
    │   ├── candidateService.js     # Public candidates & candidate profile APIs
    │   ├── citizenService.js       # Quizzes, feedback, reward coins wallet
    │   ├── adminService.js         # Candidate vetting, news approvals, reports
    │   └── locationService.js      # Municipal localities & preferences
    └── pages/
        ├── Home.jsx                # Landing page with hero & featured items
        ├── NewsPage.jsx            # Geotagged news feed with Leaflet map
        ├── NewsDetailPage.jsx      # Full article, attachments & feedback
        ├── CandidatesPage.jsx      # Directory of verified local leaders
        ├── CandidateDetailPage.jsx # Candidate manifesto & public documents
        ├── Login.jsx               # Universal multi-role sign-in
        ├── RegisterCitizen.jsx     # Citizen registration
        ├── RegisterCandidate.jsx   # Candidate registration
        ├── RegisterAdmin.jsx       # Admin registration
        ├── AdminDashboard.jsx      # Admin verification & moderation console
        ├── CandidateDashboard.jsx  # Candidate portal & news publisher
        ├── CitizenDashboard.jsx    # Citizen wallet, quizzes & preferences
        └── NotFound.jsx            # 404 page
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
```bash
cd frontend
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configuration variables:
```env
# URL of the Spring Boot backend REST API
# In local development, the Vite proxy handles /api -> http://localhost:8080
VITE_API_BASE_URL=/api
```

### Development Server
```bash
npm run dev
```
The application will start on `http://localhost:5173`. API requests to `/api/*` are automatically proxied to `http://localhost:8080`.

### Production Build
```bash
npm run build
```
Generates optimized, minified production assets in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deployment

### Vercel
1. Connect the repository to Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Configure Environment Variable: `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`.
5. The included `vercel.json` automatically manages single-page application route rewrites:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### Netlify
1. Connect the repository to Netlify.
2. Base directory: `frontend`.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Environment Variable: `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`.
