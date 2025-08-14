# Vyapar Drishti
Vyapar Drishti is a smart AI-powered billing and inventory management platform designed to automate inventory control, bills tracking, and document-based data extraction for users and administrators. This repository contains the **frontend** codebase built using **React.js**, **TypeScript**, and **Material UI**, optimized for a clean, responsive, and role-based interface.

## 🔍 Overview

The Vyapar Drishti frontend acts as the client-side layer of the full-stack pharmacy system, providing role-specific views for **Admins** and **Users**. It includes modules for managing inventory, creating and reviewing bills, uploading invoices for AI-powered extraction (via Gemini API), and generating insights through visual dashboards (for admin).

## 🚀 Live Demo

Coming soon...

## 🎯 Features

### 🧾 Authentication
- Secure sign-up and login flow for Admins and Chemists
- JWT-based session management with protected routes
- Role-based UI rendering

### 📦 Inventory Management
- View real-time stock levels and product attributes
- Add, edit, and remove items with category, state, quantity, price, and expiry
- Perform stock-out operations (sell/update quantities)

### 📤 Orders & Timeline
- Create new orders manually or via document upload
- View pending and shipped orders with full status tracking
- Visual timeline of pharmacy operations (inventory updates, orders, returns)

### 🧠 Document Upload & Extraction
- Upload supplier invoices (PDF/Image)
- Extract structured data using OpenAI API
- Auto-update inventory from parsed document content

### 📊 Admin Controls
- Admin dashboard to manage chemists, stockists, and product configurations
- View orders, inventory trends, and usage analytics

---

## ✅ Functional Requirements

1. **Role-Based Dashboards**
   - Admin: Manage users, and analytics
   - Users: Create bills, create products, track stock, upload bills, manage sales

2. **Document Upload Integration**
   - Uploads go to the backend which forwards to Gemini API
   - Results displayed in form for review before submission

3. **Real-Time Inventory Sync**
   - All actions update inventory and order states live using Redux

4. **UI/UX**
   - Built with Material UI for responsive, professional design
   - Navigation drawer, badges, tooltips, and interactive tables

---

## 🛠 Tech Stack

- **Framework:** React.js (v18+)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (optional), Material UI (primary)
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **API Client:** Axios
- **Auth:** JWT stored securely in localStorage/cookies
- **Others:** React Hook Form, React Icons, Date Pickers, Skeleton Loaders

---

## 🧩 Folder Structure
**-DristiDocs/**: Contains the React frontend code.
- **public/**: Holds static files like `index.html` and the favicon.
- **src/**: Main source code for the application.
  - **api/**: Contains Axios instances and API-related functions.
  - **assets/**: Includes images, logos, and icons.
  - **components/**: Houses reusable UI components like buttons, modals, and headers.
  - **features/**: Contains domain-specific logic and functionality for various features:
    - **auth/**: Handles user authentication (login/register).
    - **orders/**: Manages the order-related UI and logic.
    - **inventory/**: Manages the inventory system.
    - **upload/**: Provides file upload and extraction functionality.
  - **pages/**: Page-level routes and views.
  - **store/**: Redux slices, actions, and store setup.
  - **utils/**: Helper functions, constants, and validation utilities.
  - **App.tsx**: Main app layout, routing, and rendering logic.
  - **main.tsx**: Entry point for rendering the application, including Redux provider.
- **package.json**: Contains configuration for dependencies, scripts, and other settings.



---

## ⚛️ State Management

Vyapar Drishti uses **Redux Toolkit** for global state management, ensuring consistent data flow across the app. Each feature module (e.g., invoices, inventory, auth) has its own slice, defined with actions and reducers.

- **Global State:**  
  - `authSlice`: Handles user login state and JWT tokens.
  - `invoicesSlice`: Stores invoice list, status, and active invioce details.
  - `inventorySlice`: Manages inventory records and stock updates.

- **Local State:**  
  - Managed via `useState`, `useEffect`, and `React Hook Form` for form data.
  - Modal visibility, table filters, and input values.

Benefits:
- Predictable state transitions.
- Centralized error handling and loading status.
- Easy integration with debugging tools (Redux DevTools).

---

## 🌐 API Integration

All frontend HTTP communication is handled using **Axios**. The API base URL is dynamically set using the `REACT_APP_API_URL` environment variable.

### Axios Configuration

A global Axios instance is created in `/src/api/axiosInstance.ts`, which automatically attaches the JWT token to the Authorization header for secure endpoints.

```ts
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```


---
## 📱 How to Use the App

### Once installed and running:

1. **Login or Register**
   - Visit [https://vyapar-drishti.vercel.app](https://vyapar-drishti.vercel.app/).
   - Fill up the info and sign up and login.

2. **Chemist Dashboard**
   - **Navigate to Inventory** to view and update stock.
   - **Use Invoices** to view past invoices or create new ones.
   - **Use Upload Bills** to upload a PDF/image and extract data.
   - **Use Customers** to add new customers or vendors.

3. **Admin Dashboard**
   - **Access Manage Users** to view or deactivate accounts.
   - **View user trends, users movement, and analytics.**

4. **Uploading a Bill**
   - Navigate to **Upload Bills**.
   - Select a file (image/pdf) and review the extracted data.
   - Confirm to update inventory instantly.

5. **Creating Orders**
   - Click **New Invoices**, select customer, add products, and submit.
   
6. **Secure Session**
   - JWT token is saved locally (e.g., in `localStorage`).
   - Sessions auto-expire, and users must log in again after expiration.

---

## ⚙️ Installation & Setup

### 📦 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend running locally at `http://localhost:8000`

### 🧪 Setup Steps

1. **Clone the repository:**

```bash
git clone https://github.com/tohidkhan2464/vyapar-drishti-frontend.git
cd vyapar-drishti-frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

```bash
  VITE_LOCAL_BACKEND_BASE_URL=""
```

4. **Run the Application**
```bash
  npm run dev
```
The app will start on http://localhost:3000.

## 🔄 State Management

The app uses **Redux Toolkit** for managing application-wide state such as:

- Auth tokens and user data
- Inventory lists and actions
- Orders, bills, and UI feedback messages

Local state is managed using **useState** and **React Hook Form** for forms.

---

## 🌐 API Integration

- **Axios** is used to handle HTTP requests to the backend.
- All protected routes send **JWT** in Authorization headers.
- Modular API service files are organized under `/src/api/`.

---

## 📚 License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute this software in accordance with the license terms.

---

## 📬 Contact

For any questions, suggestions, or issues, feel free to reach out to the project maintainer:

- **Tohid Khan**  
  📧 tohidkhan1193407@gmail.com  
  🔗 [LinkedIn](https://www.linkedin.com/in/tohid-khan/)

---

## 🤝 Contributors

Thanks to the following individuals for their contributions to this project:

- **Tohid Khan**
- **Jinesh Prajapat**  
- **Yatin Badeja**

