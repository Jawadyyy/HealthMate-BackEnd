# HealthMate – Backend

HealthMate is a modern digital health record and healthcare management platform.
This repository contains the backend application, responsible for handling
business logic, authentication, data storage, and secure API communication
for patients, doctors, and administrators.

---

## 🚀 Features

- 🔐 JWT-based authentication & role-based authorization
- 👤 Separate flows for Patient / Doctor / Admin
- 📋 Digital health records management
- 🩺 Doctor profiles & patient medical history
- 📅 Appointment scheduling & management
- 💊 Prescriptions & medical reports
- 📊 Admin analytics & system management
- 🛡 Secure RESTful APIs with validation

---

## 🛠 Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Runtime:** Node.js
- **Architecture:** Modular (Controllers, Services, Modules)
- **API Type:** RESTful APIs
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT-based authentication
- **Authorization:** Role-based access control (RBAC)
- **Validation:** class-validator & class-transformer
- **Security:** bcrypt
- **Configuration:** @nestjs/config


---

## 📁 Project Structure
```
src/
├── app.module.ts          # Root application module
├── main.ts                # Application entry point
│
├── config/                # App & environment configuration
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
│
├── auth/                  # Authentication & authorization
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── strategies/        # JWT strategies
│   │   └── jwt.strategy.ts
│   └── guards/
│       └── jwt-auth.guard.ts
│
├── users/                 # Base user module
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── schemas/           # DB schemas / entities
│   │   └── user.schema.ts
│   └── dto/
│       └── update-user.dto.ts
│
├── admin/                 # Admin features
│   ├── admin.module.ts
│   ├── admin.controller.ts
│   ├── admin.service.ts
│   ├── dto/
│   └── analytics/
│       └── analytics.service.ts
│
├── doctors/               # Doctor features
│   ├── doctors.module.ts
│   ├── doctors.controller.ts
│   ├── doctors.service.ts
│   ├── dto/
│   └── schemas/
│       └── doctor.schema.ts
│
├── patients/              # Patient features
│   ├── patients.module.ts
│   ├── patients.controller.ts
│   ├── patients.service.ts
│   ├── dto/
│   └── schemas/
│       └── patient.schema.ts
│
├── appointments/          # Appointment management
│   ├── appointments.module.ts
│   ├── appointments.controller.ts
│   ├── appointments.service.ts
│   ├── dto/
│   └── schemas/
│       └── appointment.schema.ts
│
├── prescriptions/         # Prescriptions & medicines
│   ├── prescriptions.module.ts
│   ├── prescriptions.controller.ts
│   ├── prescriptions.service.ts
│   └── schemas/
│       └── prescription.schema.ts
│
├── medical-records/       # Digital health records
│   ├── medical-records.module.ts
│   ├── medical-records.controller.ts
│   ├── medical-records.service.ts
│   └── schemas/
│       └── medical-record.schema.ts


```

---

## ⚙️ Environment Variables
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/healthmate
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```


---

## 📦 Installation & Setup

### Clone the repository
```
git clone https://github.com/Jawadyyy/HealthMate-BackEnd
```

### Navigate to project folder
```
cd HealthMate-BackEnd
```

### Install dependencies
```
npm install
```

### Run development server
```
npm run start:dev
```

---

### 🧪 Scripts
```
npm run start:dev     # Start development server (watch mode)
```
```
npm run build         # Build project
```
```
npm run start         # Start production server
```

---

## 🔗 Frontend

### Frontend repository:  
```
git clone https://github.com/Jawadyyy/HealthMate-FrontEnd
```

