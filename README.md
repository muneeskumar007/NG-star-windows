# NG star windows uPVC Windows & Doors Website

A production-ready React website for a premium uPVC windows and doors business with advanced 3D visualization, animation, and lead generation features.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173
```

## 🏗️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | Frontend framework + build tool |
| Tailwind CSS 3 | Utility-first styling |
| React Router 6 | Client-side routing |
| React Hook Form | Form validation |
| Three.js + R3F | 3D rendering engine |
| @react-three/drei | Three.js helpers (OrbitControls, Float, etc.) |
| Framer Motion | Page transitions + animations |

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky nav with mobile menu
│   ├── Footer.jsx          # Full footer with links
│   ├── ProductCard.jsx     # Reusable product card
│   ├── Reveal.jsx          # Scroll-triggered fade animation
│   └── Toast.jsx           # Notification stub
│
├── pages/
│   ├── HomePage.jsx        # Hero, stats, AI advisor, testimonials
│   ├── ProductsPage.jsx    # Full catalogue + comparison table
│   ├── ProductDetail.jsx   # Individual product + 3D + specs
│   ├── ConfiguratorPage.jsx# Full 3D studio with all controls
│   ├── GalleryPage.jsx     # Portfolio + before/after slider
│   ├── ContactPage.jsx     # Quote form + WhatsApp + map
│   └── AdminPage.jsx       # Lead management dashboard
│
├── three/
│   ├── WindowModel.jsx     # Procedural 3D window geometry (R3F)
│   ├── Hero3D.jsx          # Hero section canvas scene
│   └── Configurator3D.jsx  # Full configurator scene
│
├── features/
│   └── estimator/
│       └── priceEngine.js  # Dynamic pricing calculations
│
├── services/
│   └── leadsService.js     # Lead CRUD (localStorage / swap to Firebase)
│
└── utils/
    ├── data.js             # All product data, testimonials, gallery
    └── toast.jsx           # Global toast notification context
```

## 🎯 Key Features

### 3D Configurator
- Real-time frame colour changes (8 colours)
- 5 glass types with visual feedback
- Width/height sliders with live price update
- **Open animation** — casement swings open, sliding panel slides
- **Exploded view** — frame, glass, and seal separate in 3D
- OrbitControls for full rotation + zoom

### Price Engine (`src/features/estimator/priceEngine.js`)
```
Price = (basePrice + glassAddon + colourAddon) × area(sqft) × 1.18
```
Flat pricing for doors, per-sqft for windows. Size premium for >3m² panels.

### AI Product Advisor
Takes room type + budget → matches against `AI_SUGGESTIONS` map → auto-suggests best product with reason text + direct link to configurator.

### Lead Management
- Form submissions saved to `localStorage` (swap `submitLead` in `leadsService.js` for Firebase/API)
- Admin dashboard at `/admin` with status tracking, WhatsApp follow-up links, product breakdown chart

## 🔌 Connecting a Real Backend

Replace the `submitLead` function in `src/services/leadsService.js`:

```js
// Firebase example
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

export async function submitLead(formData) {
  const docRef = await addDoc(collection(db, 'leads'), {
    ...formData,
    createdAt: new Date().toISOString(),
    status: 'new',
  })
  return { id: docRef.id, ...formData }
}
```

## 📱 Mobile Performance

- 3D scenes are lazy-loaded (`React.lazy`)
- `Suspense` fallback spinners shown while Three.js loads
- OrbitControls disabled on hero for performance
- All pages have graceful non-3D fallbacks

## 🎨 Design Tokens (CSS Variables)

```css
--green:   #1F7A63   /* Primary */
--green2:  #2ECC71   /* Secondary */
--accent:  #A3E4D7   /* Accent */
--bg:      #F8F9F9   /* Background */
--text:    #1C1C1C   /* Body text */
--muted:   #6b7c79   /* Muted text */
--border:  #e2e8e6   /* Borders */
```

## 📦 Build for Production

```bash
npm run build
# Output in /dist — deploy to Vercel, Netlify, or any static host
```
