# Maskani — Dormitory Booking Platform

Maskani is a full-stack web application that connects university students with dormitory owners near universities in Jordan. The platform enables students to search, compare, and book dormitories, while allowing property owners to manage listings, rooms, and reservations through a dedicated dashboard.

---

## Features

### Student
- Search dormitories by location
- Filter listings by price and preferences
- View dormitories on an interactive map
- Book available rooms
- Manage bookings
- Edit personal profile

### Dormitory Owner
- Owner registration and authentication
- Add, edit, and delete properties
- Manage rooms and availability
- View booking requests
- Manage property information

### Administrator
- Manage users
- Monitor platform activity
- Oversee dormitory listings

### Security
- JWT Authentication
- Role-based authorization
- Protected routes

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React, TypeScript, Tailwind CSS, Axios |
| Backend | ASP.NET Core Web API (.NET 7), C# |
| Database | Microsoft SQL Server |
| Authentication | JWT |
| Architecture | Layered Architecture, RESTful APIs |
| Version Control | Git & GitHub |

---

## Project Structure

```text
Maskani
│
├── Maskani Frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── hooks
│   │   ├── contexts
│   │   └── utils
│   ├── package.json
│   └── vite.config.ts
│
├── Maskani Backend
│   └── Maskani Project
│       ├── MaskaniAPIs
│       ├── DataAccessLayer
│       ├── MaskaniBusinessLayer
│       └── MaskaniEntities
│
├── README.md
└── .gitignore
```

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Maherdia/Maskani-full-project.git
cd Maskani-full-project
```

### Frontend

```bash
cd "Maskani Frontend"
npm install
npm run dev
```

The frontend uses **Vite** as the development server.

### Backend

1. Open the backend solution in **Visual Studio 2022**.
2. Restore the NuGet packages.
3. Configure the SQL Server connection string in `appsettings.json`.
4. Run the ASP.NET Core Web API.

---

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- ASP.NET Core Web API
- C#
- SQL Server
- JWT Authentication
- RESTful APIs
- Git
- GitHub

---

## Future Improvements

- Email verification
- Online payment integration
- Notifications
- Image upload optimization
- Mobile responsiveness improvements

---

## Developer

**Mohammed Maher Dia**

Software Engineer

Graduation Project — Mu'tah University (January 2026)

- **GitHub:** https://github.com/Maherdia
- **LinkedIn:** https://www.linkedin.com/in/maher-dia

---

## License

This project was developed as a university graduation project and is intended for educational and portfolio purposes.
