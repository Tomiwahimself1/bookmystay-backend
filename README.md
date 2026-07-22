# 🏨 BookMyStay - Hotel Booking & Reservation System API

**BookMyStay** is a robust RESTful backend application built for managing hotel listings, room inventories, user authentication, customer bookings, and payment processing[cite: 3, 4]. Designed with a modular architecture using Node.js, Express, and MongoDB, this API integrates key external services like Google Maps geocoding, Paystack payments, Cloudinary image hosting, and Nodemailer email notifications[cite: 3, 4].

---

## 🚀 Features

* **Authentication & Authorization**: User registration, login, JWT token-based auth, and role-based access control (Customer vs Admin)[cite: 3, 4].
* **Hotel Management**: Create, update, view, and filter hotel listings with address geocoding[cite: 3, 4].
* **Room Management**: Manage room categories, pricing, capacities, and real-time availability[cite: 3, 4].
* **Booking & Reservations**: Check room availability, create bookings, view booking history, and manage reservation statuses[cite: 3, 4].
* **Payment Integration**: Seamless transaction initialization and verification via Paystack[cite: 3, 4].
* **Location & Geocoding**: Automatic translation of hotel physical addresses into latitude/longitude coordinates and dynamic Google Maps URLs[cite: 3, 4].
* **Image Hosting**: Cloudinary integration for uploading hotel and room images[cite: 3, 4].
* **Notifications**: Automated email notifications via Nodemailer for booking confirmations[cite: 3, 4].

---

## 🛠️ Tech Stack & Dependencies

* **Runtime Environment**: Node.js[cite: 3, 4]
* **Framework**: Express.js[cite: 3, 4]
* **Database**: MongoDB & Mongoose ORM[cite: 3, 4]
* **Authentication**: JSON Web Tokens (JWT) & BcryptJS[cite: 3, 4]
* **External Services & Libraries**:
  * **Paystack API**: Secure payment processing[cite: 3, 4]
  * **Google Maps Geocoding API**: Location coordinates & maps link generation[cite: 3, 4]
  * **Cloudinary**: Cloud image storage[cite: 3, 4]
  * **Nodemailer**: Transactional email service[cite: 3, 4]
  * **Axios**: HTTP requests[cite: 3, 4]

---

## 📁 Project Structure

```text
bookmystay-backend/
├── config/
│   ├── db.js             # Database connection setup
│   └── cloudinary.js     # Cloudinary service setup
├── controllers/
│   ├── authController.js # User authentication logic
│   ├── hotelController.js# Hotel management logic
│   ├── roomController.js # Room management logic
│   ├── bookingController.js # Booking flow logic
│   └── paymentController.js # Paystack logic
├── middleware/
│   └── authMiddleware.js # Route protection & Admin checks
├── models/
│   ├── User.js           # User schema
│   ├── Hotel.js          # Hotel schema
│   ├── Room.js           # Room schema
│   ├── Booking.js        # Reservation schema
│   └── Payment.js        # Transaction schema
├── routes/
│   ├── authRoutes.js
│   ├── hotelRoutes.js
│   ├── roomRoutes.js
│   ├── bookingRoutes.js
│   └── paymentRoutes.js
├── utils/
│   ├── generateToken.js  # JWT helper
│   ├── googleMaps.js     # Address geocoding helper
│   └── sendEmail.js      # Nodemailer helper
├── .env                  # Environment variables (git-ignored)
├── server.js             # Server entry point
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas instance)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/your-username/bookmystay-backend.git](https://github.com/your-username/bookmystay-backend.git)
   cd bookmystay-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and populate it with your environment credentials:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key

   # Paystack
   PAYSTACK_SECRET_KEY=your_paystack_secret_key

   # Google Maps
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

4. **Run the Application**:
   * For development (with auto-reload):
     ```bash
     npm run dev
     ```
   * For production:
     ```bash
     npm start
     ```

---

## 📌 Key API Endpoints Summary

### Authentication (`/api/auth`)
* `POST /api/auth/register` - Register a new user account[cite: 3]
* `POST /api/auth/login` - Authenticate user & retrieve JWT token[cite: 3]

### Hotels (`/api/hotels`)
* `GET /api/hotels` - Retrieve all hotels[cite: 3]
* `GET /api/hotels/:id` - Get specific hotel details[cite: 3]
* `POST /api/hotels` - Add a new hotel *(Admin only, automatically geocodes address)*[cite: 3]
* `PUT /api/hotels/:id` - Update hotel details *(Admin only)*[cite: 3]
* `DELETE /api/hotels/:id` - Delete hotel *(Admin only)*[cite: 3]

### Rooms (`/api/rooms`)
* `GET /api/rooms` - Fetch rooms[cite: 3]
* `POST /api/rooms` - Add a new room *(Admin only)*[cite: 3]

### Bookings (`/api/bookings`)
* `GET /api/bookings` - Retrieve user bookings[cite: 3]
* `POST /api/bookings` - Create a new reservation[cite: 3]

### Payments (`/api/payments`)
* `POST /api/payments/initialize` - Initialize Paystack payment transaction[cite: 3]
* `GET /api/payments/verify/:reference` - Verify transaction status[cite: 3]

---

## 👥 Authors & Contributors
* **Adedinsewo Adetomiwa**[cite: 4]

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).