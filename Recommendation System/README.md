# 💎 Lumière — AI Jewelry Recommendation System

An intelligent full-stack web application that recommends jewelry products based on user preferences using rule-based recommendation logic with weighted scoring.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Features

### 🔐 Authentication System
- User registration & login with JWT tokens
- Secure password encryption with bcryptjs
- Protected routes and admin authorization
- User profile management

### 🏠 Premium Home Page
- Luxury jewelry brand aesthetic (black, white, gold palette)
- Hero section with animated CTA
- Featured collections showcase
- "How Our AI Works" section
- Client testimonials
- Responsive design

### 📋 Interactive Preference Form
- 6-step wizard with progress indicator
- Visual card selection for each preference:
  - Occasion (Wedding, Party, Casual, Traditional)
  - Jewelry Type (Necklace, Ring, Earrings, Bracelet, Bangle)
  - Metal (Gold, Silver, Diamond, Rose Gold)
  - Budget Range (Under ₹5K to ₹50K+)
  - Style (Minimal, Royal, Modern, Vintage)
  - Color (Gold, Silver, White, Mixed)
- Real-time validation

### 🧠 AI Recommendation Engine
**Scoring Formula:**
```
Score = (Budget Match × 30) + (Style Match × 30) + (Color Match × 20) + (Occasion Match × 20) + Bonuses
```
- Weighted multi-factor scoring algorithm
- Style affinity matching (e.g., Minimal ↔ Modern)
- Budget proximity scoring (adjacent ranges get partial credit)
- AI-generated recommendation explanations
- Returns top 12 matched products sorted by score

### 📊 Results Page
- Animated product cards with staggered entrance
- Circular match percentage indicator (SVG)
- Recommendation reason tags
- Save to favorites functionality
- Share results feature

### ❤️ Saved Recommendations
- Save/remove favorite jewelry
- Search and filter saved items
- View recommendation history

### ⚙️ Admin Panel
- Add, edit, delete jewelry products
- View recommendation analytics
- Dashboard with statistics
- Recent activity feed

### 🎨 Extra Features
- 🌓 Dark/Light mode toggle
- ⏳ Loading animations & skeleton screens
- 🤖 AI recommendation explanations
- 📱 Fully responsive design
- 🔗 Share recommendation feature
- 🍞 Toast notification system

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ai-jewelry-recommendation.git
cd ai-jewelry-recommendation
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. **Seed the database**
```bash
npm run seed
```
This creates:
- 50 jewelry products across all categories
- Admin account: `admin@jewelry.ai` / `admin123`
- Demo account: `demo@jewelry.ai` / `demo123`

5. **Start the server**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
ai-jewelry-recommendation/
├── server.js                    # Express entry point
├── package.json                 # Dependencies & scripts
├── seed.js                      # Database seeder (50 products)
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── README.md
│
├── config/
│   └── db.js                    # MongoDB connection
│
├── middleware/
│   ├── auth.js                  # JWT authentication
│   └── admin.js                 # Admin role guard
│
├── models/
│   ├── User.js                  # User schema
│   ├── Product.js               # Product schema
│   └── Recommendation.js        # Recommendation history
│
├── routes/
│   ├── auth.js                  # Auth endpoints
│   ├── products.js              # Product CRUD + analytics
│   ├── recommendations.js       # Recommendation engine
│   └── saved.js                 # Save/remove favorites
│
├── utils/
│   └── recommendationEngine.js  # Scoring algorithm
│
└── public/                      # Frontend (served statically)
    ├── index.html               # Home page
    ├── login.html               # Login
    ├── register.html            # Registration
    ├── profile.html             # User profile
    ├── preferences.html         # Preference wizard
    ├── results.html             # Recommendations display
    ├── saved.html               # Saved items
    ├── admin.html               # Admin dashboard
    ├── css/
    │   └── styles.css           # Complete stylesheet
    └── js/
        ├── api.js               # API helper + navbar + toasts
        ├── auth.js              # Auth logic
        ├── home.js              # Home page animations
        ├── preferences.js       # Multi-step form
        ├── results.js           # Results display
        ├── saved.js             # Saved items management
        ├── admin.js             # Admin panel
        └── theme.js             # Dark/light mode
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get profile (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Add product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| GET | `/api/products/analytics` | Get analytics (admin) |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/recommendations` | Get recommendations |
| GET | `/api/recommendations/history` | Get history (protected) |

### Saved Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/saved` | List saved items (protected) |
| POST | `/api/saved/:productId` | Save product (protected) |
| DELETE | `/api/saved/:productId` | Remove saved (protected) |

## 🗄️ Database Schema

### Users
```js
{ name, email, password(hashed), role, savedRecommendations[], timestamps }
```

### Products
```js
{ title, description, category, occasion, style, metal, budgetRange, color, price, image, timestamps }
```

### Recommendations
```js
{ userId, preferences{}, results[{ productId, score, matchPercent, reasons[] }], timestamps }
```

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Gold | `#D4AF37` |
| Background | `#0A0A0A` (dark) / `#FAFAFA` (light) |
| Heading Font | Playfair Display |
| Body Font | Inter |
| Card Radius | 12px |
| Animations | fadeInUp, shimmer, float |

## 📄 License

MIT License — feel free to use this project for learning, portfolios, or production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
