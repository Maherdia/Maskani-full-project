# Maskani — Dormitory Booking Platform

A full-stack web application that connects students with dormitory owners near universities in Jordan. Students can search, browse, and book dormitories, while owners manage their listings through a dedicated dashboard.

## Features
- Search and filter dormitory listings by location and price
- Interactive map showing nearby dormitories
- Student registration and booking management
- Owner dashboard for managing properties and rooms
- Admin dashboard for platform oversight
- Role-based access control (student, owner, admin)
- JWT-based authentication

## Tech Stack
| Layer | Technologies |
|-------|-------------|
| Frontend | React.js, TypeScript, Tailwind CSS, Axios |
| Backend | C#, ASP.NET Web API |
| Database | SQL Server |
| Tools | Git, GitHub, RESTful APIs, Layered Architecture |

## Project Structure
Maskani/
├── Maskani Frontend/        # React.js client application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   ├── lib/api/         # API integration layer
│   │   └── services/        # Business logic
└── Maskani Backend/         # ASP.NET Web API server
└── Maskani Project/     # API controllers and services
## Getting Started

### Frontend
```bash
cd "Maskani Frontend"
npm install
npm run dev
```

### Backend
Open `Maskani Backend` in Visual Studio and run the project.
Make sure SQL Server is running and the connection string is configured in `appsettings.json`.

## Developed By
**Mohammed Maher Dia** — Graduation Project, Mu'tah University (January 2026)  
[LinkedIn](https://linkedin.com/in/maher-dia) • [GitHub](https://github.com/Maherdia)
