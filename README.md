# XenoInsights — Multi-Tenant Shopify Data Ingestion & Insights Service

A full-stack, multi-tenant solution to ingest, store, and visualize Shopify data for multiple stores with tenant isolation.

Live Deployment  
- Frontend: https://xenoaquib.vercel.app/  
- Backend:  https://xeno-backend-3ddp.onrender.com 
- Demo Video: *[Link to your Loom/YouTube Video]*  

---

## 🧠 Project Overview

**What is XenoInsights**  
Xeno is designed to help Shopify store owners pull data from Shopify, store it in a central database, and view analytics via a dashboard — all while keeping each store’s data isolated from others.  

**Why this?**  
Managing multiple Shopify stores often means dealing with fragmented data, export/import hassles, and isolated analytics. Xeno offers a unified, scalable way to ingest Shopify data (orders, customers, products) and visualize insights per store (tenant), while maintaining data privacy and separation using a “tenant identifier” strategy.  

**Tech Stack**

| Layer        | Technology / Library               |
|--------------|----------------------------------- |
| Frontend     | React.js, Chart.js                 |
| Backend      | Node.js, Express.js, Sequelize ORM |
| Database     | PostgreSQL (hosted on Neon.tech)   |
| Security     | bcryptjs (password hashing), CORS  |
| Utilities    | Axios, dotenv, nodemon             |  

## 📦 Architecture & Data Flow

![Architecture Diagram](./images/architecture.png)

**Data Flow**  
- **Ingestion**: When a user (tenant) triggers a sync → the server calls the Shopify Admin API → fetched data (Orders, Customers, Products) are upserted into the database with `shop_domain`.  
- **Visualization**: The React frontend requests analytics/stats → server queries PostgreSQL with `WHERE shop_domain = 'tenant_shop_domain'` → returns data only for that tenant.  

---

## ⚙️ Setup Instructions (Local Development)

1. **Clone the repository**  
    ```bash
    git clone https://github.com/Aquibyounis/xeno.git
    cd xeno-assignment
    ```

2. **Backend Setup**  
    ```bash
    cd server
    npm install
    ```  
    Create a `.env` file inside the `server/` folder with:
    ```
    PORT=5000
    DATABASE_URL=postgres://neondb_owner:YOUR_PASSWORD@ep-cool-cloud.neon.tech/neondb?sslmode=require
    SHOPIFY_ACCESS_TOKEN=shpat_YOUR_TOKEN
    SHOPIFY_STORE_URL=your-store.myshopify.com
    ```  
    Start the backend:
    ```bash
    npm run dev
    ```  
    You should see a log indicating database tables have synced successfully.

3. **Frontend Setup**  
    In a separate terminal:
    ```bash
    cd ../client
    npm install
    npm start
    ```  
    The app should open in your browser at `http://localhost:3000`.

---

## 🔌 API Endpoints

| Method | Endpoint               | Description |
|--------|------------------------|-------------|
| POST   | `/api/auth/signup`     | Register a new tenant (Shop owner) |
| POST   | `/api/auth/login`      | Login and receive user data / token |
| POST   | `/api/ingest`          | Trigger data fetch from Shopify (requires `shop` param) |
| GET    | `/api/dashboard-stats` | Fetch aggregated data (revenue, orders, charts) — supports `?shop=<shop_domain>` filter |

---

## 🗄️ Database Schema (PostgreSQL via Sequelize)

### **Users** table

| Column      | Type   | Description             |
|-------------|--------|-------------------------|
| id          | UUID   | Primary Key             |
| username    | String | Unique login identifier |
| password    | String | Hashed password         |
| shop_domain | String | Tenant identifier       |

### **Orders** table

| Column         | Type     | Description               |
|----------------|----------|---------------------------|
| shopify_id     | BigInt   | Original Shopify order ID |
| total_price    | Decimal  | Total value of the order  |
| customer_email | String   | Buyer's email             |
| shop_domain    | String   | Tenant identifier         |

### **Customers** table

| Column      | Type     | Description                     |
|-------------|----------|---------------------------------|
| shopify_id  | BigInt   | Original Shopify customer ID    |
| first_name  | String   | Customer’s first name           |
| email       | String   | Customer’s email (unique)       |
| shop_domain | String   | Tenant identifier               |

### **Products** table (if implemented — adjust per your code)

| Column      | Type     | Description                 |
|-------------|----------|-----------------------------|
| shopify_id  | BigInt   | Shopify product ID          |
| title       | String   | Product title / name        |
| price       | Decimal  | Product price (if stored)   |
| shop_domain | String   | Tenant identifier           |

> **Multi-tenancy strategy**: Every table includes a `shop_domain` (discriminator) column to identify which tenant (shop) a record belongs to. This enables data isolation in a shared database rather than separate databases per tenant.

---

## 🤔 Assumptions & Limitations

- **Polling vs Webhooks**:  
  Currently, data ingestion is implemented with a scheduler (polling every hour) rather than using Shopify Webhooks.  
  - *Why?* Webhooks require a publicly accessible URL (e.g. via Ngrok), which may not be reliable for local development.  
  - *Note*: For production setup, switching to Shopify Webhooks (e.g. `orders/create`) is strongly recommended for real-time updates.

- **Data Scope**:  
  Presently supports ingestion of **Orders**, **Customers**, and **Products** only. Entities such as “Carts” and “Checkouts” are either mocked or not included, because the default Admin API scope may not expose them.

- **No Rate-Limit Handling or Quota Management**:  
  The service currently does not include logic to handle Shopify API rate limits or per-tenant quotas — which may lead to throttling or API failures under heavy usage or many tenants.

- **Simplistic Authentication & Security**:  
  Uses basic username/password login with hashed passwords (`bcryptjs`) and CORS protection. There is no 2FA, role-based permissions, or advanced security measures, as this is a basic website for now.
---

## ✅ Features (Implemented)

- ✅ Multi-tenant architecture with data isolation  
- ✅ Automated data ingestion from Shopify (polling)  
- ✅ Analytics dashboard with aggregated stats & charts  
- ✅ Date range filtering for analytics  
- ✅ Secure authentication for tenants  
- ✅ Live deployment support (Frontend on Vercel / Backend on Render)  

---

## 🛠️ Future Enhancements (What’s Next)

- Switch to Shopify Webhooks for real-time data sync instead of polling  
- Add support for more Shopify entities (e.g. Carts, Checkouts, Inventory, etc.)  
- Implement rate-limiting or quota management per tenant to respect Shopify API limits  
- Add role/permissions and more secure auth (e.g. OAuth, 2FA, session/token renewal)  
- Add unit & integration tests, CI/CD pipeline  
- Improve UI/UX — richer dashboards, more visualizations, exportable reports (CSV/PDF), custom filters, etc.  

---

**[PULA AQUIB YOUNIS]**  