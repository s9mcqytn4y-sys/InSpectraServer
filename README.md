# InSpectraServer

InSpectra Quality Control Backend Server.

## 🚀 Tech Stack

- **Node.js** & **Express.js**
- **TypeScript**
- **Prisma ORM** with **PostgreSQL**
- **Zod** for API Validation
- **Swagger UI** for API Documentation

## 🛠️ Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL Database
- `npm` or `yarn`

## ⚙️ Installation

1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Copy `.env.example` to `.env` and fill in the details.
   ```bash
   cp .env.example .env
   ```

## 🗄️ Database & Seeding

Sync your Prisma schema with the database and run the seeds:

```bash
# Push schema to the database
npx prisma db push

# Seed master data (Parts, Defects, Slot Waktu)
npx prisma db seed
```

## 🚀 Running the App

### Development
```bash
npm run dev
```
The server will run on the port specified in `.env` (default is `8001`).

### Production
```bash
npm run build
npm start
```

## 📖 API Documentation

Once the server is running, the Swagger UI documentation will be available at:

```
http://localhost:8001/api-docs
```

## 🔒 Code Quality

Linting and Formatting:
```bash
npm run format
npm run lint
```
Type Checking:
```bash
npx tsc --noEmit
```

## 📝 License

Internal Use Only.
