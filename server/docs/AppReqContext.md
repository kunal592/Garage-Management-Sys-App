Act as a senior backend architect specializing in Node.js, Express, Prisma ORM, and scalable SQL system design.

Goal
Design and implement the backend API for a **Garage Management System** that currently runs on mock data. The backend must replace the mock data with a scalable production-ready architecture.

Tech Stack Requirements

* Node.js
* Express.js
* Prisma ORM
* SQL Database (PostgreSQL preferred)
* Follow clean architecture and scalable backend practices.

Use:

* Controllers
* Services layer
* Route modules
* Prisma schema models
* Proper validation and error handling.

System Overview

The Garage Management System manages:

* Customers
* Vehicles
* Service Records
* Parts & Consumables
* Dashboard analytics
* Service reminders
* Optional vehicle image uploads for safety documentation.

All APIs should follow REST standards.

---

1. Dashboard & Analytics APIs

Endpoint
GET /api/dashboard/stats

Returns:

* todayRevenue
* todayServicesCount
* totalCustomers

Used on the **Home dashboard cards**.

---

Endpoint
GET /api/dashboard/recent-activity

Returns:
Latest 5–10 service records with:

* vehicleName
* customerName
* serviceType
* serviceCost
* serviceStatus (Pending / Performed)
* serviceTime

Used in **Recent Activity cards**.

---

Endpoint
GET /api/analytics/business-insights

Returns chart data:

* monthlyRevenueTrend
* serviceCategoryDistribution
* topCustomersLeaderboard

Used in the **Analytics screen**.

---

2. Customer APIs

Resource: Customers

GET /api/customers

Query Params:
search → filter by name or phone.

Returns:
Customer directory list.

---

POST /api/customers

Body:
name
phone
address

Creates a new customer.

---

GET /api/customers/:id

Returns:
Customer profile including:

* vehicles
* full service history.

---

GET /api/customers/search-by-phone/:phone

Logic:
Used on **Add Service screen** to autofill existing customers.

---

3. Vehicle APIs

POST /api/customers/:id/vehicles

Body:
model
vehicleNumber

Logic:
Attach vehicle to a customer.

---

PATCH /api/vehicles/:id

Body:
lastServiceDate
nextServiceDate

Logic:
Update vehicle service metadata.

---

4. Service Record APIs

Resource: Services

GET /api/services

Supports filters:

* pending
* performed

Used in **service history page**.

---

POST /api/services

Body:
customerId
vehicleId
serviceItems
selectedParts
customParts
serviceCost
partsCost
totalCost
nextServiceDate

Logic:

1. Create service record
2. Store selected parts and quantities
3. Update vehicle.nextServiceDate
4. Update vehicle.lastServiceDate

---

GET /api/services/:id

Returns:
Detailed service invoice including:

* service items
* parts used
* cost breakdown.

---

PATCH /api/services/:id/status

Body:
{
status: "Performed"
}

Used by dashboard to update service completion.

---

5. Service Alerts & Reminder APIs

Endpoint

GET /api/services/upcoming

Logic:
Return services where:

nextServiceDate <= NOW + 24 HOURS

Return data:

customerName
phone
vehicleModel
vehicleNumber
nextServiceDate
serviceId

Used in **Service Alerts screen** to trigger manual reminders via mobile share dialog.

---

6. Parts & Inventory APIs

Resource: Parts

GET /api/parts

Returns master list of parts including:

name
category
brand
price

Used for:

* Parts selector
* Price list page.

---

7. Vehicle Image Upload (Safety Feature)

Endpoint

POST /api/upload-image-vehicle

Purpose:
Sometimes customers claim the garage damaged their vehicle. To protect the garage, the manager can optionally take a photo of the vehicle when it arrives.

Behavior

* Accept image upload
* Link image to serviceId or vehicleId
* Store image for **7 days only**
* Automatically delete after expiration.

Fields

serviceId
vehicleId
imageFile

Storage Recommendation

Use:

* local storage with scheduled cleanup
  OR
* object storage (S3 compatible)

Create background cleanup logic to remove images older than 7 days.

---

Database Relationship Design (Prisma)

Customer

* id
* name
* phone
* address
* createdAt

Customer → hasMany → Vehicles

---

Vehicle

* id
* model
* vehicleNumber
* customerId
* lastServiceDate
* nextServiceDate

Vehicle → belongsTo → Customer
Vehicle → hasMany → Services

---

Service

* id
* customerId
* vehicleId
* status
* serviceItems
* serviceCost
* partsCost
* totalCost
* nextServiceDate
* createdAt

Service → belongsTo → Vehicle

---

Part

* id
* name
* category
* brand
* price

---

ServicePart (join table)

* serviceId
* partId
* quantity
* priceAtTime

---

Architecture Requirements

Follow scalable Node backend structure:

src/
controllers/
services/
routes/
middlewares/
utils/
prisma/
config/

Use:

* Input validation
* Error middleware
* Async handlers
* Clean service layer
* Environment configs

---

Output Required

Generate:

1. Prisma schema models
2. Express route structure
3. Controllers
4. Service layer logic
5. Upload handler for vehicle images
6. Example database queries
7. Folder structure for scalable backend
