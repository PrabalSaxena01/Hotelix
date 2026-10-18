# 🏨 Hotelix – Modern Hotel Booking Platform

**Hotelix** is a full-stack hotel booking platform where users can search and book luxury hotel rooms, while hotel owners manage listings, availability, and bookings. Powered by modern technologies including React 19 (Vite), Node.js (Express), PostgreSQL with Prisma ORM, and Clerk for authentication, it delivers an effortless booking experience and robust owner dashboard.

💻 Built with ❤️ for real-world reliability and scalability

---

## ✨ Features

### 👤 User Features
- 🔍 Browse & search hotels by destination, check-in/check-out dates, and guests
- 🛏️ View room details with high-resolution imagery and amenities
- 📅 Instant availability checks with overlap validation
- 💳 Seamless online payments powered by Stripe
- 📬 Automated booking confirmation emails via Nodemailer
- 🔐 Secure Clerk authentication & personal bookings history

### 🛠️ Hotel Owner Features
- 🏨 Register hotel properties with address, city, and contact details
- ➕ Add, edit, and toggle room availability in real-time
- 📊 Owner dashboard tracking total bookings, completed payments, and total revenue
- 📦 High-speed room image hosting via Cloudinary
- 🔒 Role-based access control protecting owner management workflows

---

## 🧰 Tech Stack

| 🧩 Category        | ⚙️ Technologies                                   |
|-------------------|---------------------------------------------------|
| 🖼️ Frontend       | React 19 (Vite), TailwindCSS 4                    |
| 🚀 Backend        | Node.js, Express.js 5                             |
| 💾 Database       | PostgreSQL (Neon Serverless / Local PostgreSQL)   |
| ⚡ ORM            | Prisma ORM `v6.19.3`                              |
| 🔐 Authentication | Clerk                                             |
| 💳 Payments       | Stripe (Checkout & Webhooks)                      |
| ✉️ Emails         | Nodemailer                                        |
| 📦 Media Storage  | Cloudinary                                        |
| 🔄 Background/Sync| Inngest                                           |

---

## 📂 Folder Structure

```bash
Hotelix/
├── client/                     # React 19 Frontend (Vite)
│   ├── src/
│   │   ├── assets/             # Vector icons, logos & illustrations
│   │   ├── components/         # Navbar, Footer, HotelCards, RoomCard, Testimonials
│   │   ├── context/            # AppContext with global state & auth helpers
│   │   ├── pages/              # Home, Rooms, RoomDetails, MyBookings, Owner Dashboard
│   │   └── main.jsx            # React root application entry
│   ├── public/
│   ├── .env                    # Frontend environment variables
│   └── vite.config.js
│
├── server/                     # Express 5 Backend
│   ├── configs/                # Prisma client, Cloudinary, Nodemailer
│   ├── controllers/            # User, Hotel, Room, Booking, Stripe webhooks
│   ├── middleware/             # Clerk authentication middleware
│   ├── prisma/
│   │   └── schema.prisma       # Relational models (User, Hotel, Room, Booking)
│   ├── routes/                 # REST API endpoints
│   ├── inngest/                # Clerk webhook synchronization
│   ├── .env                    # Server environment variables
│   └── server.js               # Express application entry
│
└── docs/
    └── DATABASE_PRISMA_GUIDE.md # PostgreSQL & Prisma ORM architecture guide
```

---

## 🔧 Installation & Setup

### 📦 Backend (Express & Prisma)
```bash
cd server
npm install
npm run prisma:generate   # Generate Prisma client
npm run prisma:push       # Synchronize tables with PostgreSQL
npm run server            # Starts backend at http://localhost:3000
```

### 🌐 Frontend (React Vite)
```bash
cd client
npm install
npm run dev               # Starts frontend at http://localhost:5173
```

---

### 🙌 Acknowledgments
```text
Clerk.dev   – for Secure Authentication
Prisma      – for Next-Generation ORM
Stripe      – for Payment Infrastructure
Cloudinary  – for Media Storage
Inngest     – for Event Synchronization
```

---

### 🏆 Hotelix Mission
*"Travel should be easy. Booking should be effortless."*
