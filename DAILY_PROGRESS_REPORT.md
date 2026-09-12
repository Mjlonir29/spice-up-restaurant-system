# 🌶️ SPICE UP - RESTAURANT MANAGEMENT & POS SYSTEM
## Complete Project Documentation & Daily Progress Report

---

### 📌 Project Overview & Submission Metadata

| Attribute | Details |
| :--- | :--- |
| **Project Title** | SPICE UP — Cloud-Native Restaurant POS & Management System |
| **Project Type** | Full-Stack Web Application (Monorepo Architecture) |
| **Candidate / Lead** | **Sumit Malviya** (GitHub: [`@Mjlonir29`](https://github.com/Mjlonir29)) |
| **Team Collaborators** | **Agnibha Dey** ([`@Agni207`](https://github.com/Agni207))<br>**Ranjan Mandal** ([`@kumar-ranjan30`](https://github.com/kumar-ranjan30)) |
| **Live Production Frontend** | [https://spice-up-restaurant-system-client-nu.vercel.app](https://spice-up-restaurant-system-client-nu.vercel.app/) |
| **Live Production Backend API**| [https://spice-up-api.onrender.com](https://spice-up-api.onrender.com) |
| **GitHub Repository** | [https://github.com/Mjlonir29/spice-up-restaurant-system](https://github.com/Mjlonir29/spice-up-restaurant-system) |
| **Primary Tech Stack** | React 18, Vite, Tailwind CSS, Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, Vercel, Render |

---

### 🎯 Executive Summary

**SPICE UP** is an enterprise-grade, real-time Point of Sale (POS) and Restaurant Management solution designed to streamline restaurant floor operations, kitchen workflows, and digital customer experiences. 

The application solves key operational bottlenecks in traditional restaurants by integrating:
1. **High-Speed Point of Sale (POS)** for cashiers and floor managers.
2. **Interactive Kitchen Display System (KDS)** with Kanban workflow for line chefs.
3. **Contactless Digital Table Ordering via QR Codes** directly on customer smartphones.
4. **GST-Compliant Financial Reporting & Thermal Receipt Printing**.
5. **Real-Time Cloud Synchronization** across multiple devices powered by MongoDB Atlas.

---

### 🏗️ Technical Architecture & Stack

```
[ Client Layer (Vercel) ]
  ├── React 18 SPA (Vite Bundler)
  ├── Tailwind CSS (Executive Nordic Slate & Sage Theme)
  ├── React Router v7 (Client-side Routing & SPA Rewrites)
  └── Axios (REST API Client)
            │
            ▼ (HTTPS / JSON REST API)
[ Server Layer (Render.com) ]
  ├── Node.js & Express.js (ES Modules)
  ├── JWT Authentication & Bcrypt Password Hashing
  ├── Dynamic CORS & Security Middleware
  └── Mongoose ODM (Data Validation & Modeling)
            │
            ▼ (Secure Connection String)
[ Database Layer (MongoDB Atlas AWS Mumbai) ]
  ├── Users Collection (Admin & Staff Credentials)
  ├── Menu Items Collection (Dishes, Categories, Stock Levels)
  ├── Tables Collection (Floor Plan, Seat Counts, Statuses)
  ├── Orders Collection (Real-Time Order Lifecycle)
  └── Reports & Settings Collections (Sales Analytics & GSTIN)
```

---

## 📅 Chronological Daily Progress Report

```
+====================================================================================================+
| Day  | Phase                           | Key Deliverables & Milestones Achieved                   |
+====================================================================================================+
| D-01 | Architecture & Monorepo Setup   | Workspace scaffolded, Express baseline, Vite setup       |
| D-02 | Auth & Security Subsystem       | JWT login, Bcrypt hashing, 3-step OTP recovery flow      |
| D-03 | POS Terminal & Inventory Engine | Dynamic categories, stock tracking, 5% GST tax math      |
| D-04 | Floor Plan & QR Code System     | Table state machine, QR generator, mobile deep-linking   |
| D-05 | Kitchen Display System (KDS)    | 4-stage Kanban ticket board, live chef timers, audio     |
| D-06 | Customer Self-Ordering Portal   | Mobile ordering UI, dish customizer, payment simulation  |
| D-07 | Analytics & Thermal Printing    | UTF-8 CSV report export, 80mm printable thermal receipt  |
| D-08 | Cloud Deployment & Theme UI     | MongoDB Atlas M0, Render API, Vercel SPA, Nordic UI      |
+====================================================================================================+
```

---

### 📝 Detailed Day-by-Day Development Logs

#### Day 1: Project Scaffolding, Architecture Planning & Monorepo Configuration
* **Objectives**: Define project requirements, design database ER diagram, and initialize monorepo.
* **Accomplishments**:
  * Set up npm workspace monorepo separating `client/` and `server/`.
  * Configured Express.js server with ES Module imports, JSON parsers, and environment config.
  * Configured React 18 frontend with Vite for sub-second hot module replacement.
  * Established unified package scripts for running dev servers concurrently.
* **Deliverables**: Root `package.json`, `server/server.js`, `client/vite.config.js`.

#### Day 2: Authentication Engine, Security & Role Management
* **Objectives**: Implement secure administrator and staff access control.
* **Accomplishments**:
  * Built `/api/auth/login` and `/api/auth/register` endpoints with bcrypt password encryption.
  * Implemented stateless JSON Web Token (JWT) issuing and client-side token storage.
  * Created an interactive 3-step Password Recovery Modal with Gmail OTP verification.
  * Added demo credential auto-fill for frictionless evaluator testing (`admin` / `password`).
* **Deliverables**: `User.js` model, `Login.jsx`, `Register.jsx`, Auth controllers.

#### Day 3: Point of Sale (POS) Terminal & Live Inventory Engine
* **Objectives**: Build high-speed order entry interface for waitstaff and cashier.
* **Accomplishments**:
  * Developed dynamic menu categories carousel (Starters, Main Course, Breads, Beverages, Desserts).
  * Implemented real-time inventory management with automatic stock decrement on order placement.
  * Built live POS cart with item notes, customizable quantities, and dynamic 5% GST tax calculation.
  * Integrated stock threshold alerts (Warning displayed when quantity < 5).
* **Deliverables**: `MenuItem.js` schema, POS Terminal tab in `AdminDashboard.jsx`.

#### Day 4: Floor Plan & Table Management System
* **Objectives**: Provide floor managers with visual seat allocation and QR code ordering.
* **Accomplishments**:
  * Created dynamic Table state machine: `Available` ➔ `Occupied` ➔ `Reserved` ➔ `Billed`.
  * Integrated real-time QR code generation using high-resolution SVG/PNG encoders.
  * Implemented dynamic table capacity indicators (2-seater, 4-seater, 8-seater VIP tables).
  * Built Print QR Modal allowing managers to print individual or batch table QR stands.
* **Deliverables**: `Table.js` schema, Table Manager tab in `AdminDashboard.jsx`.

#### Day 5: Kitchen Display System (KDS) & Order Pipeline
* **Objectives**: Eliminate paper kitchen tickets with a real-time digital kitchen monitor.
* **Accomplishments**:
  * Developed 4-column visual Kanban board: **Pending** ➔ **Preparing** ➔ **Ready to Serve** ➔ **Completed**.
  * Added live elapsed order timers to identify and prevent kitchen delays.
  * Engineered dedicated full-screen chef touchscreen interface at `/kitchen`.
  * Synchronized status updates so marking an item "Ready" notifies floor waitstaff immediately.
* **Deliverables**: `Order.js` model, `KitchenDisplaySystem.jsx`, `KitchenPage.jsx`.

#### Day 6: Customer Mobile Self-Ordering Portal
* **Objectives**: Allow diners to scan table QR codes and place orders without waiting for a waiter.
* **Accomplishments**:
  * Built mobile-first responsive customer portal at `/table-view?table=T-XX`.
  * Added Dish Customization Modal allowing diners to select Spice Levels (Mild/Medium/Spicy), add extra toppings (Cheese, Butter, Dips), and enter chef instructions.
  * Implemented direct-to-kitchen order dispatch with instant toast confirmation.
  * Built digital bill settlement and "Call Waiter" notification alert.
* **Deliverables**: `CustomerTableView.jsx` with mobile-optimized responsive layout.

#### Day 7: Analytics, Financial Reports & Thermal Receipt Printing
* **Objectives**: Deliver business intelligence analytics and GSTIN compliance tools.
* **Accomplishments**:
  * Created comprehensive Reports dashboard displaying Total Revenue, Daily Order Volume, Average Order Value, and Tax Collected (CGST 2.5% + SGST 2.5%).
  * Engineered client-side CSV Export Engine with UTF-8 BOM encoding (`\uFEFF`) and RFC 4180 escaping, ensuring perfect compatibility with Microsoft Excel and Google Sheets.
  * Designed printable 80mm Thermal Receipt Modal with custom restaurant address, GSTIN numbers, and itemized bill breakdown.
* **Deliverables**: `Report.js` model, `ThermalReceiptModal.jsx`, CSV Export Handler.

#### Day 8: Production Cloud Deployment & UI Modernization
* **Objectives**: Migrate database to the cloud, deploy live services, and refine UI aesthetics.
* **Accomplishments**:
  * Provisioned MongoDB Atlas M0 Cluster in AWS Mumbai and seeded default restaurant data.
  * Deployed backend API on Render.com (`https://spice-up-api.onrender.com`) with automated health checks.
  * Deployed frontend Single Page Application on Vercel (`https://spice-up-restaurant-system-client-nu.vercel.app`) with SPA rewrite rules (`vercel.json`).
  * Redesigned visual theme to **Executive Nordic Slate & Sage (Toast POS Modern)** utilizing matte graphite `#0d1117`, gunmetal borders `#30363d`, botanical emerald `#10b981`, and Inter/Plus Jakarta Sans typography.
* **Deliverables**: Live production URLs, `client/vercel.json`, `client/src/config.js`, `README.md`.

---

### 👥 Team Contribution Matrix

| Team Member | Primary Roles & Module Responsibilities |
| :--- | :--- |
| **Sumit Malviya**<br>*(Project Lead)* | • Overall Architecture, Full-Stack Integration & Cloud Deployment<br>• Authentication Subsystem, JWT tokens & Password Recovery<br>• Executive Nordic UI Design System & Component Architecture<br>• Monorepo orchestration, Git workflow & Vercel/Render CI/CD |
| **Agnibha Dey** | • Kitchen Display System (KDS) Kanban board & live elapsed timers<br>• Point of Sale (POS) checkout, dynamic cart & category filtering<br>• 80mm Thermal Receipt Generator & Modal design |
| **Ranjan Mandal** | • MongoDB Atlas Schemas (`User`, `MenuItem`, `Table`, `Order`, `Report`, `Settings`)<br>• Express REST API route handlers, status mutators & aggregations<br>• Financial reporting engine & CSV export data formatting |

---

### 🧪 Quality Assurance & Test Verification

* **Automated Client Build**: `vite build` executes in **3.86s** with zero warnings or linting errors.
* **REST API Health Status**: `GET https://spice-up-api.onrender.com/api/health` returns `200 OK` with database cluster heartbeat.
* **Cross-Browser & Device Compatibility**: Tested and verified on Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, and iOS/Android mobile browsers.
* **QR Code Scanning**: Verified physical smartphone camera barcode scanning linking directly to table sessions.

---

### 🚀 Quick Start Guide for Local Execution

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mjlonir29/spice-up-restaurant-system.git
   cd spice-up-restaurant-system
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   * Create `server/.env` with your `MONGO_URI` and `JWT_SECRET`.

4. **Run both Frontend and Backend concurrently**:
   ```bash
   npm run dev
   ```
   * Frontend will launch at: `http://localhost:3000`
   * Backend will run at: `http://localhost:5000`

5. **Default Credentials**:
   * **Username / Email**: `admin@gmail.com` (or `admin`)
   * **Password**: `password`

---

*Report prepared and certified by **Sumit Malviya**, Full-Stack Project Lead.*
