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
app/
├── admin/            # Admin panel
│   ├── dashboard
│   ├── doctors
│   ├── patients
│   └── billing
│
├── auth/             # Authentication flows
│   ├── admin
│   ├── doctor
│   └── patient
│
├── doctor/           # Doctor dashboard
│   ├── appointments
│   ├── patients
│   ├── prescriptions
│   ├── records
│   └── profile
│
├── patient/          # Patient dashboard
│   ├── appointments
│   ├── med-records
│   ├── prescriptions
│   └── profile
│
├── layout.tsx        # Root layout
└── page.tsx          # Landing page

components/           # Shared UI components
assets/               # Images & static assets

lib/                  # Core logic
├── api               # API calls
├── auth              # Auth helpers
├── hooks             # Custom hooks
└── utils             # Utility functions

```

---

## ⚙️ Environment Variables



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
npm run dev
```

---

### 🧪 Scripts
```
npm run dev        # Start server with nodemon
```
```
npm run start      # Start production server
```

---

## 🔗 Frontend

### Frontend repository:  
```
git clone https://github.com/Jawadyyy/HealthMate-FrontEnd
```

