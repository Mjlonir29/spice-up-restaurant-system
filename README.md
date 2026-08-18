# 🌶️ SPICE UP - Restaurant POS & Management System

A full-stack, real-time Restaurant Management & Point of Sale (POS) system built with **React**, **Node.js/Express**, and **MongoDB**. Designed for seamless floor management, kitchen display dispatching, digital table ordering, and GST compliance.

---

## 🚀 Key Features

* **Point of Sale (POS) Terminal**: Quick order placement, live categories carousel (Starters, Mains, Breads, Beverages, Desserts), customizable item notes, coupon codes, and 5% GST tax calculation.
* **Table & Floor Management**: Real-time table status tracking (Available, Occupied, Reserved, Billed), QR code generation for digital ordering, and table capacity indicators.
* **Kitchen Display System (KDS)**: Real-time Kanban order pipeline (Pending ➔ Preparing ➔ Ready to Serve) with live elapsed order timers and dish completion checklists.
* **Reports & Analytics**: Daily sales reports, tax breakdown (CGST 2.5% + SGST 2.5%), staff filter, and one-click **CSV export** with UTF-8 BOM encoding.
* **Thermal Ticket Printing**: Printable restaurant receipts and invoices with custom store details and GST numbers.
* **Authentication & Security**: Secure JWT authentication and bcrypt password encryption.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Material Symbols
* **Backend**: Node.js, Express.js (ES Modules)
* **Database**: MongoDB (Mongoose ODM)
* **Architecture**: Monorepo Workspaces (`client` + `server`)

---

## 📦 Prerequisites

Make sure you have the following installed on your machine:
1. **Node.js** (v18 or higher) & **npm**
2. **MongoDB** (Local MongoDB Community Server / MongoDB Compass or MongoDB Atlas)
3. **Git**

---

## ⚡ Quick Start Guide (For Team Members)

### 1. Clone the Repository
```bash
git clone https://github.com/Mjlonir29/spice-up-restaurant-system.git
cd spice-up-restaurant-system
```

### 2. Install Dependencies
Install dependencies for both client and server:
```bash
npm install
```

### 3. Setup Environment Variables
In the `server/` folder, create a `.env` file from the provided example:
```bash
# Windows PowerShell:
Copy-Item server/.env.example server/.env

# Linux/macOS:
cp server/.env.example server/.env
```

Ensure your `server/.env` contains:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/restaurant-management-system
JWT_SECRET=spice_up_secret_key_2026
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 4. Seed Initial Sample Data (First-time only)
Populate your database with default Admin account, 8 tables, menu items, and sales reports:
```bash
node server/seed.js
```

### 5. Start Development Servers
Run frontend and backend concurrently with a single command:
```bash
npm run dev
```

* **Frontend UI**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔐 Default Admin Credentials

* **Email**: `admin@gmail.com`
* **Password**: `password`

---

## 👥 Contributors
* **Sumit Malviya** ([@Mjlonir29](https://github.com/Mjlonir29))
* **Agnibha Dey** ([@Agni207](https://github.com/Agni207))
* **Ranjan Mandal** ([@kumar-ranjan30](https://github.com/kumar-ranjan30))
