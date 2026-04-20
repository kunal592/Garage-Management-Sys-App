# Garage Management System - Final Technical Context (Verified)

This document is the result of a final recursive analysis of the codebase. It contains the exact technical specifications, infrastructure dependencies, and logic flows required to build the "Garage Manager" application with 100% accuracy.

---

## 1. Core Architecture
- **Frontend**: React Native (Expo SDK 51+) using **Expo Router v3**.
- **Backend**: Express (Node.js) with **TypeScript**.
- **Data Layer**: Prisma ORM with **PostgreSQL (Hosted on Neon.tech)**.
- **Engine**: The mobile app uses the **Hermes engine** with `newArchEnabled: true` and **React Compiler** experimental features enabled for high performance.

---

## 2. Infrastructure & Environment
### **Server (.env Requirements)**
- `DATABASE_URL`: Connection string (PostgreSQL with SSL).
- `PORT`: Defaulting to `5001`.

### **Mobile App (app.json)**
- **Scheme**: `garagems`
- **Bundle ID**: `com.anonymous.garagems`
- **EAS Project ID**: `9b1a2ac7-6291-4451-889c-88db7f1e9fbd`
- **Typed Routes**: Enabled for compile-time safety.

---

## 3. Advanced Features & Logic Flow

### **A. Dashboard Intelligence**
The dashboard is governed by `DashboardService` which provides three critical endpoints:
1.  **`/api/dashboard/stats`**: Aggregates total customers, total vehicles, and **Daily Revenue** (sum of `totalCost` for today).
2.  **`/api/dashboard/recent-activity`**: Returns the last 10 services with joined customer/vehicle data.
3.  **`/api/dashboard/analytics`**: 
    - Generates a 6-month rolling revenue window.
    - Calculates a "Service Distribution" map (top 5 service types).
    - Identifies "Top Customers" by lifetime spend.

### **B. Reminders & Engagement**
- **Trigger**: Frontend calculates reminders by checking `nextServiceDate` for all customer vehicles.
- **Contact Method**: Uses the **Manual Share Bridge**. It shares a pre-formatted template string containing customer name, vehicle ID, and service date.

### **C. Offline-First Sync Strategy**
- **Storage**: `AsyncStorage` via `@react-native-async-storage/async-storage`.
- **Query Layer**: `QueryClient` configured with:
    - `staleTime`: 24 Hours (Immediate availability on reload).
    - `gcTime`: 7 Days (Cache survival).
- **Persister**: Uses `createAsyncStoragePersister` to survive app process termination.

### **D. Image Lifecycle (TTL Logic)**
- **Upload**: `POST /api/upload-image-vehicle` stores images in `./uploads`.
- **Retention**: Hard-coded **7-day TTL** stored in `expiresAt`.
- **Cleanup Utility**: `cleanupExpiredImages` utility runs on a **24-hour interval**. It performs a double-sync deletion (unlinking the file in the OS and deleting the entry in Prisma).

---

## 4. Database Integrity Rules

| Model | Implementation Rule |
| :--- | :--- |
| **ServicePart** | **Vital**: Stores `priceAtTime`. The inventory part price may change, but the service record must reflect the price at the time of repair. |
| **Vehicle** | `nextServiceDate` is an optional field but is the dependency for all Alert/Reminder widgets. |
| **Service** | Initial status defaults to `Pending`. Transition to `Performed` updates global revenue stats. |

---

## 5. Summary of Screens (Router Structure)
- `/app/(tabs)/index`: Dashboard & Sharing.
- `/app/(tabs)/analytics`: Charting Monthly Revenue.
- `/app/(tabs)/explore`: Service Search/Inventory.
- `/app/(tabs)/alerts`: Next-24hr service list.
- `/app/services/[id]`: Detail view with linked parts/costs.
- `/app/services/add`: Modal flow for service creation.

---

## 6. Build & Deployment Instructions
1.  **Install**: `npm install` in root and `server` directories.
2.  **DB**: `npx prisma generate` and `npx prisma db push`.
3.  **Seed**: `npx ts-node src/prisma/seed.ts` (Requires master parts list).
4.  **Dev**: 
    - Backend: `npm run dev` (Port 5001).
    - Frontend: `npx expo start`.
5.  **Build**: `eas build --platform android/ios`.
