# 🚛 FuelTrip Manager - Trucking Challenge

## 📋 Overview

**FuelTrip Manager** is a full-stack web application for managing fuel transport operations. It provides an administrative dashboard to track trucks, drivers, routes, and fuel deliveries in real-time.

### 🎯 Challenge Requirements

This project was developed as part of a technical challenge with the following specifications:

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Infrastructure**: Docker + Docker Compose
- **Architecture**: Clean Architecture with Domain-Driven Design

---

## ✨ Features

### 🔐 Authentication System

- Secure JWT-based authentication
- Role-based access control (Admin/Operator)
- Protected routes on both frontend and backend
- Auto-logout on token expiration

### 🚛 Trip Management

- **CRUD Operations**: Create, Read, Update, Delete trips
- **Advanced Filtering**: By status, driver, fuel type, search terms
- **Pagination**: Efficient data loading with server-side pagination
- **Real-time Updates**: Automatic refresh when data changes
- **Data Validation**: Business logic validation (max 30,000 liters, future dates only)

### 📊 Dashboard Features

- **Trip Overview**: Complete table with sorting and filtering
- **Status Management**: Track trip progression (Scheduled → In Transit → Delivered)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean interface with Tailwind CSS and shadcn/ui components

---

## 🏗️ Project Structure

```
├── api/                          # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── domain/              # Business entities and interfaces
│   │   │   ├── entities/        # Core business entities (User, Trip)
│   │   │   └── repositories/    # Repository interfaces
│   │   ├── application/         # Use cases and DTOs
│   │   │   ├── dtos/           # Data Transfer Objects
│   │   │   └── use-cases/      # Business logic implementation
│   │   ├── infrastructure/     # External concerns
│   │   │   ├── config/         # Environment configuration
│   │   │   └── database/       # MongoDB schemas, connection, seeders
│   │   ├── presentation/       # Controllers and routes
│   │   │   ├── controllers/    # HTTP request handlers
│   │   │   ├── middleware/     # Authentication, validation, etc.
│   │   │   └── routes/         # Route definitions
│   │   ├── app.ts             # Express app configuration
│   │   └── server.ts          # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── client/                      # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Base UI components (shadcn/ui)
│   │   │   ├── auth/          # Authentication components
│   │   │   └── dashboard/     # Dashboard-specific components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities and API client
│   │   ├── pages/             # Page components
│   │   ├── stores/            # State management (Zustand)
│   │   ├── types/             # TypeScript type definitions
│   │   └── App.tsx            # Main App component
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml           # Multi-container orchestration
├── .dockerignore
├── start.sh                     # Quick start script
├── stop.sh                      # Stop services script
├── reset.sh                     # Reset and rebuild script
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git (to clone the repository)

### 1. Clone and Start

```bash
# Clone the repository
git clone <repository-url>
cd trucking-challenge

# Make scripts executable
chmod +x *.sh

# Start the application
./start.sh
```

### 2. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **MongoDB**: mongodb://localhost:27017

### 3. Login Credentials

The application comes with pre-seeded users and sample data:

| Email                   | Password      | Role     | Description                 |
| ----------------------- | ------------- | -------- | --------------------------- |
| `admin@trucking.com`    | `admin123`    | Admin    | Full access to all features |
| `operator@trucking.com` | `operator123` | Operator | Standard user access        |
| `test@example.com`      | `test123`     | Operator | Additional test user        |

### 4. Sample Data

The application includes **25 realistic sample trips** with:

- Various trip statuses (Scheduled, In Transit, Delivered, Cancelled)
- Realistic Argentine locations (Buenos Aires area)
- Different fuel types and volumes
- Past, present, and future trip dates

---

## 🔧 Development

### Manual Docker Commands

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset database and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Environment Variables

The application uses the following environment variables (configured in docker-compose.yml):

| Variable       | Description               | Default                                               |
| -------------- | ------------------------- | ----------------------------------------------------- |
| `NODE_ENV`     | Environment mode          | `production`                                          |
| `PORT`         | Backend server port       | `3001`                                                |
| `MONGO_URI`    | MongoDB connection string | `mongodb://mongodb:27017/trucking-app`                |
| `JWT_SECRET`   | Secret for JWT signing    | `your-super-secret-jwt-key-change-this-in-production` |
| `VITE_API_URL` | Frontend API base URL     | `http://localhost:3001`                               |

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`

Login with email and password.

**Request Body:**

```json
{
  "email": "admin@trucking.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@trucking.com",
    "name": "Administrator",
    "role": "admin"
  }
}
```

#### POST `/api/auth/logout`

Logout current user (requires authentication).

### Trip Endpoints

All trip endpoints require authentication via `Authorization: Bearer <token>` header.

#### GET `/api/trips`

Get all trips with optional filtering and pagination.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in driver, truck, origin, destination
- `status` (string): Filter by trip status
- `driver` (string): Filter by driver name
- `fuel` (string): Filter by fuel type

**Response:**

```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "truck": "ABC123",
      "driver": "Juan Pérez",
      "origin": "Refinería La Plata",
      "destination": "Estación YPF Recoleta",
      "fuel": "Diesel",
      "liters": 15000,
      "departureDate": "2025-01-15T10:30:00Z",
      "status": "Scheduled",
      "createdAt": "2025-01-10T08:00:00Z",
      "updatedAt": "2025-01-10T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET `/api/trips/:id`

Get a single trip by ID.

#### POST `/api/trips`

Create a new trip.

**Request Body:**

```json
{
  "truck": "ABC123",
  "driver": "Juan Pérez",
  "origin": "Refinería La Plata",
  "destination": "Estación YPF Recoleta",
  "fuel": "Diesel",
  "liters": 15000,
  "departureDate": "2025-01-15T10:30:00Z"
}
```

**Business Rules:**

- Maximum 30,000 liters
- Departure date must be in the future
- All fields are required

#### PUT `/api/trips/:id`

Update an existing trip.

#### DELETE `/api/trips/:id`

Soft delete a trip (sets status to "Cancelled").

### Data Types

#### Trip Status

- `Scheduled`: Trip is planned but not started
- `In Transit`: Trip is currently in progress
- `Delivered`: Trip completed successfully
- `Cancelled`: Trip was cancelled

#### Fuel Types

- `Diesel`: Diesel fuel
- `Super Gasoline`: Super gasoline
- `Premium Gasoline`: Premium gasoline
- `CNG`: Compressed Natural Gas

---

## 🐳 Docker Configuration

### Services

1. **MongoDB** (`trucking-mongodb`)

   - Image: `mongo:7`
   - Port: `27017`
   - Volume: `mongodb_data` for persistence

2. **Backend** (`trucking-backend`)

   - Built from: `./api/Dockerfile`
   - Port: `3001`
   - Depends on: MongoDB

3. **Frontend** (`trucking-frontend`)
   - Built from: `./client/Dockerfile`
   - Port: `80`
   - Uses Nginx for serving
   - Depends on: Backend

### Network

All services run on the `trucking-network` bridge network for internal communication.

---

## 🔒 Security Considerations

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers for Express
- **Input Validation**: Server-side validation for all inputs
- **Environment Variables**: Sensitive data in environment variables

---

## 🚀 Deployment Notes

### Production Considerations

1. **Environment Variables**: Update `JWT_SECRET` and other sensitive variables
2. **Database**: Use MongoDB Atlas or dedicated MongoDB instance
3. **SSL/HTTPS**: Configure SSL certificates
4. **Domain**: Update `VITE_API_URL` to production domain
5. **Logging**: Implement proper logging strategy
6. **Monitoring**: Add health checks and monitoring

### Scaling

- **Database**: MongoDB supports sharding for large datasets
- **Backend**: Stateless design allows horizontal scaling
- **Frontend**: Static files can be served via CDN
- **Load Balancing**: Nginx can be configured for load balancing

---

## 👨‍💻 Development Process

This project was developed using **AI assistance** (Claude) as requested in the challenge. The AI helped with:

- **Architecture Design**: Clean architecture structure and best practices
- **Code Generation**: TypeScript interfaces, React components, API endpoints
- **Docker Configuration**: Multi-container setup and optimization
- **Documentation**: API documentation and README structure
- **Problem Solving**: Debugging Docker issues and configuration problems

The combination of human creativity and AI assistance resulted in a well-structured, maintainable codebase that follows industry best practices.

---

### Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify all containers are running: `docker ps`
3. Ensure ports 80, 3001, and 27017 are available
4. Try the reset script: `./reset.sh`

---

**Made with ❤️ for the Trucking Challenge**
