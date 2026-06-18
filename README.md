# CallPilot AI

Production-grade SaaS foundation for CallPilot AI.

## Workspace

- `frontend/` - React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Redux Toolkit, RTK Query, React Router, React Hook Form, Zod, Recharts.
- `backend/` - Spring Boot 3, Java 21, PostgreSQL, Flyway, JWT security, validation, and global exception handling.

## Local Services

```bash
docker compose up -d postgres
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
mvn spring-boot:run
```

## Boundaries

This scaffold intentionally contains only foundation code. Business modules, domain entities, application services, and product workflows have not been created yet.

