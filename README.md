# CallPilot AI

CallPilot AI is a production-style SaaS MVP for AI-powered phone reception, lead capture, call follow-up, appointment scheduling, customer management, team administration, and billing readiness.

The application is split into a Spring Boot API and a React/Vite frontend. It includes JWT demo authentication, PostgreSQL persistence, Flyway migrations, protected frontend routing, RTK Query API access, and dev-profile demo data for local MVP testing.

## Tech Stack

Frontend:
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui-style primitives
- Redux Toolkit
- RTK Query
- React Router
- React Hook Form
- Zod
- Recharts

Backend:
- Spring Boot 3
- Java 21
- PostgreSQL
- Flyway
- Spring Security
- JWT authentication
- Jakarta Bean Validation
- RFC 9457-style `ProblemDetail` error responses

## Folder Structure

```text
.
|-- backend/
|   |-- src/main/java/com/callpilotai/
|   |   |-- aiconfig/          AI receptionist settings
|   |   |-- appointments/      Appointment management
|   |   |-- auth/              Demo auth and login
|   |   |-- billing/           Billing placeholder
|   |   |-- business/          Business onboarding/profile
|   |   |-- calls/             Call records and AI summaries
|   |   |-- customers/         Customer management
|   |   |-- dashboard/         Dashboard summary
|   |   |-- demo/              Dev-profile demo data seeding
|   |   |-- exception/         Global exception handling
|   |   |-- leads/             Lead management
|   |   |-- messages/          SMS follow-up placeholder
|   |   |-- security/          JWT security
|   |   |-- status/            Health/status endpoint
|   |   `-- team/              Team management
|   `-- src/main/resources/
|       |-- application.yml
|       |-- application-dev.yml
|       `-- db/migration/      Flyway SQL migrations
|-- frontend/
|   |-- src/app/               Store and app providers
|   |-- src/components/        Layout, common, and UI primitives
|   |-- src/features/          RTK Query slices and feature components
|   |-- src/pages/             Route pages
|   |-- src/routes/            Protected/public routing
|   `-- src/services/api/      Base API client
|-- docker-compose.yml
`-- README.md
```

## Prerequisites

- Java 21
- Maven 3.9+
- Node.js 20+
- npm 10+
- Docker Desktop, or a local PostgreSQL 16+ instance

## Local PostgreSQL Setup

The fastest local path is Docker Compose:

```bash
docker compose up -d postgres
```

This starts PostgreSQL on `localhost:5432` with:

```text
Database: callpilot_ai
Username: callpilot
Password: callpilot
```

If you prefer a manual PostgreSQL install, create the same database and user:

```sql
CREATE DATABASE callpilot_ai;
CREATE USER callpilot WITH PASSWORD 'callpilot';
GRANT ALL PRIVILEGES ON DATABASE callpilot_ai TO callpilot;
```

Flyway runs automatically when the backend starts and applies all migrations in:

```text
backend/src/main/resources/db/migration
```

## Environment Variables

Copy the example files before running locally:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Spring Boot does not automatically load `.env` files by itself. Use these files as documented values for your IDE, shell, Docker, or deployment environment.

Backend variables:

```text
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/callpilot_ai
SPRING_DATASOURCE_USERNAME=callpilot
SPRING_DATASOURCE_PASSWORD=callpilot
JWT_SECRET=replace-with-at-least-32-characters
JWT_ISSUER=callpilot-ai
JWT_ACCESS_TOKEN_EXPIRATION=PT15M
CORS_ALLOWED_ORIGINS=http://localhost:5173
DEMO_AUTH_NAME=Demo Admin
DEMO_AUTH_EMAIL=admin@callpilot.ai
DEMO_AUTH_PASSWORD=Password@123
```

Frontend variables:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

## Backend Setup

From the backend directory:

```bash
cd backend
mvn spring-boot:run
```

To run with the local Docker Postgres defaults and seed demo MVP data:

```bash
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

The `dev` profile loads `application-dev.yml` and enables `DemoDataSeeder`.

Dev seed includes:
- Demo business: Austin Prime HVAC, HVAC, `+1 512-555-0199`
- Demo customers
- Demo leads
- Demo calls and AI summaries
- Demo appointments
- Demo messages
- Demo AI receptionist config
- Demo team member
- Demo billing plan

Backend URLs:

```text
API base: http://localhost:8080/api
Status:   http://localhost:8080/api/status
Health:   http://localhost:8080/api/actuator/health
```

## Frontend Setup

From the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

Production build check:

```bash
npm run build
```

## Demo Login

```text
Email: admin@callpilot.ai
Password: Password@123
```

For a useful MVP demo, start the backend with the `dev` profile before logging in.

## MVP Testing Checklist

1. Start PostgreSQL: `docker compose up -d postgres`
2. Start backend with demo data: `mvn spring-boot:run "-Dspring-boot.run.profiles=dev"`
3. Start frontend: `npm run dev`
4. Log in with the demo credentials.
5. Confirm Dashboard stats load and reflect seeded records.
6. Open Leads, Customers, Calls, Appointments, Messages, AI Settings, Team, Billing, and Settings from the Sidebar.
7. Create/edit/delete at least one lead, customer, appointment, and team member.
8. Send a mock SMS from Messages.
9. Save AI receptionist settings.
10. Refresh the browser and confirm protected routes still work while the JWT is valid.
11. Check backend validation by submitting an invalid phone number or email.
12. Run frontend verification:

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

13. Run backend verification when Maven is installed:

```bash
cd backend
mvn test
```

## Deployment Notes

- Use environment variables for all secrets and deployment-specific values.
- Replace the local `JWT_SECRET` before deploying.
- Keep `spring.jpa.hibernate.ddl-auto=validate`; schema changes should go through Flyway migrations.
- Configure CORS for the deployed frontend origin.
- Real Twilio, Stripe, and OpenAI integrations are intentionally not connected yet.
- The `dev` profile is for local demo seeding only and should not be enabled in production.
