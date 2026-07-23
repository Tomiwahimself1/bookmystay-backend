# 🏨 BookMyStay - Hotel Booking & Reservation System API

**BookMyStay** is a robust RESTful backend application built for managing hotel listings, room inventories, user authentication, customer bookings, user profiles, admin metrics, and payment processing. Designed with a modular architecture using Node.js, Express, and MongoDB, this API integrates key external services like Google Maps geocoding, Paystack payments, Cloudinary image hosting, and Nodemailer transactional emails.

---

## 🚀 Features

* **Authentication & Authorization**: User registration, login, JWT token-based auth, and role-based access control (Customer vs Admin).
* **Customer Profile Management**: Fetch and update personal user profiles and passwords.
* **Hotel Management**: Create, update, view, and filter hotel listings with dynamic address geocoding.
* **Room Management**: Manage room categories, pricing, capacities, and real-time availability.
* **Booking & Reservations**: Check room availability, create bookings, view booking history, and cancel reservations.
* **Automated Email Notifications**: Instant booking confirmation emails dispatched via Nodemailer.
* **Payment Integration**: Seamless transaction initialization and verification via Paystack[cite: 3, 4].
* **Location & Geocoding**: Automatic translation of physical hotel addresses into latitude/longitude coordinates and dynamic Google Maps URLs[cite: 3, 4].
* **Admin Analytics Dashboard**: System-wide performance tracking (total revenue, total users, total bookings, recent activity).
* **Image Hosting**: Cloudinary integration for uploading hotel and room photos[cite: 3, 4].

---

## 🛠️ Tech Stack & Dependencies

* **Runtime Environment**: Node.js[cite: 3, 4]
* **Framework**: Express.js[cite: 3, 4]
* **Database**: MongoDB & Mongoose ORM[cite: 3, 4]
* **Authentication**: JSON Web Tokens (JWT) & BcryptJS[cite: 3, 4]
* **External Services**:
  * **Paystack API**: Secure payment gateway[cite: 3, 4]
  * **Google Maps Geocoding API**: Location coordinates & maps link generation[cite: 3, 4]
  * **Cloudinary**: Cloud image storage[cite: 3, 4]
  * **Nodemailer**: Automated transactional email dispatch[cite: 3, 4]

---

## 📁 Project Structure

```text
bookmystay-backend/
├── config/
│   ├── db.js             # Database connection setup
│   └── cloudinary.js     # Cloudinary service setup
├── controllers/
│   ├── adminController.js# Admin dashboard metrics
│   ├── authController.js # User authentication & profiles
│   ├── bookingController.js # Booking flow logic
│   ├── hotelController.js# Hotel management logic
│   ├── paymentController.js # Paystack logic
│   └── roomController.js # Room management logic
├── middleware/
│   └── authMiddleware.js # Route protection & Admin checks
├── models/
│   ├── Booking.js        # Reservation schema
│   ├── Hotel.js          # Hotel schema
│   ├── Payment.js        # Transaction schema
│   ├── Room.js           # Room schema
│   └── User.js           # User schema
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── hotelRoutes.js
│   ├── paymentRoutes.js
│   └── roomRoutes.js
├── utils/
│   ├── generateToken.js  # JWT helper
│   ├── googleMaps.js     # Address geocoding helper
│   └── sendEmail.js      # Nodemailer helper
├── .env                  # Environment variables
├── server.js             # Express entry point
└── package.json