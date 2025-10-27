# 🌐 SocialApp

A **modern social media backend** built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**.  
SocialApp provides all the essential features of a full-fledged social network — including **authentication**, **user management**, **posts**, **comments**, **real-time chat**, and **media uploads** — all designed for scalability and clean architecture.

---

## 🚀 Features

### 🔐 Authentication & Security
- User registration & login  
- Email confirmation with OTP  
- JWT-based authentication  
- Two-Factor Authentication (2FA)  
- Password recovery & reset  
- Email update & verification  
- Refresh token support  
- Session management & logout  
- Protected routes with middleware  

### 👤 User Management
- Full user profile system  
- Upload profile image, video, and avatar  
- Cover image support  
- Update personal information (bio, name, etc.)  
- Friend requests (send, accept, delete)  
- Block / unblock users  
- View public user profiles  

### 📝 Posts
- Create posts with text & media attachments  
- Upload up to 4 files per post  
- Like / Unlike posts  
- Edit existing posts  
- Soft delete & hard delete options  
- Retrieve posts by ID  

### 💬 Comments
- Add, edit, or delete comments  
- Supports nested comments  
- Retrieve comments per post  

### ⚡ Real-Time Chat
- One-on-one messaging  
- Group chat support  
- Real-time updates via **Socket.IO**  
- Scalable WebSocket-based communication layer  

### 📁 File Management
- Upload & manage files using **AWS S3**  
- Generate presigned URLs for secure file access  
- Delete single or multiple files easily  

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Runtime** | Node.js |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Real-Time** | Socket.IO |
| **Cloud Storage** | AWS S3 |
| **Email Service** | Nodemailer |
| **Validation** | Zod |
| **Security** | JWT, bcrypt, Helmet, CORS |
| **GraphQL** | GraphQL (basic setup) |

---

## ⚙️ Prerequisites

Make sure you have the following installed and configured:

- 🟢 **Node.js** (v18 or higher)  
- 🍃 **MongoDB** (local or Atlas)  
- ☁️ **AWS S3** account (for file uploads)  
- 📧 Email service credentials (e.g., Gmail SMTP or custom provider)

---

## 🧩 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SocialApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** inside the `src/` directory and include:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/socialapp
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   EMAIL_SERVICE_USER=youremail@example.com
   EMAIL_SERVICE_PASS=your_email_password
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_region
   AWS_BUCKET_NAME=your_bucket_name
   ```

4. **Start MongoDB**
   ```bash
   # Ensure MongoDB is running locally
   mongod
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

6. **Run the server**
   ```bash
   npm start
   ```

Your backend will be live on [http://localhost:5000](http://localhost:5000)

---

## 🗂️ Project Structure

```
src/
├── bootstrap.ts             # Application bootstrap and configuration
├── index.ts                 # Main entry point
├── routes.ts                # Global route registration
│
├── DB/
│   ├── db.connection.ts     # MongoDB connection setup
│   ├── models/              # Mongoose models
│   └── repos/               # Repository layer for data operations
│
├── middlewares/
│   ├── auth.middleware.ts           # JWT authentication middleware
│   ├── authorization.middleware.ts  # Role-based access control
│   ├── emailConfirmed.middleware.ts # Email confirmation check
│   └── validation.middleware.ts     # Request validation middleware
│
├── modules/
│   ├── auth/               # Authentication module
│   ├── user/               # User management module
│   ├── post/               # Post CRUD operations
│   ├── comment/            # Comment handling
│   └── chat/               # Chat & Socket.IO setup
│
└── utils/
    ├── bcrypt.ts            # Password hashing utilities
    ├── jwt.ts               # JWT creation & verification helpers
    ├── sendEmail/           # Email sending logic
    ├── multer/              # Multer configuration for uploads
    └── socketio/            # Socket.IO server integration
```

---

## 🧠 GraphQL Endpoint

A minimal GraphQL setup is available at:
```
/graphql
```

**Example Query:**
```graphql
{
  hello
}
```

**Response:**
```json
{
  "data": {
    "hello": "Hello from graphql"
  }
}
```

---

## ⚡ Real-Time Communication

Real-time features are powered by **Socket.IO** and initialized in  
`src/utils/socketio/socketio.server.ts`.

Used for:
- 💬 Instant messaging  
- 🔔 Notifications  
- 🔄 Live updates (posts, reactions, comments, etc.)

---

## 🚨 Error Handling

Centralized error middleware provides structured responses:
```json
{
  "errMsg": "Invalid token",
  "status": 401,
  "stack": "Error stack trace..."
}
```

All custom exceptions extend from a shared `ApplicationException` class for consistency.

---

## 🧾 License

This project is licensed under the **MIT License** — free for personal and commercial use.

---

## 👨‍💻 Author

**Abdulrahim Sakr**  
Front-End & Node.js Developer  
🌐 [Portfolio](https://abdulrahim01.netlify.app/)  
💼 [LinkedIn](https://www.linkedin.com/in/abdulrahim-sakr-336937258/)
