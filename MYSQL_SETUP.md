# MySQL Integration Guide

This guide will help you set up MySQL database integration for your house prediction application.

## Prerequisites

1. **MySQL Server**: Install MySQL 8.0+ on your system
   - Windows: Download from https://dev.mysql.com/downloads/mysql/
   - macOS: `brew install mysql`
   - Linux: `sudo apt install mysql-server`

2. **Create Database**:
   ```sql
   CREATE DATABASE house_predictor;
   CREATE USER 'house_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON house_predictor.* TO 'house_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

## Setup Steps

### 1. Install Dependencies
```bash
pnpm add mysql2 prisma @prisma/client
```

### 2. Configure Environment Variables
Update your `.env.local` file:
```env
DATABASE_URL="mysql://house_user:your_password@localhost:3306/house_predictor"
```

### 3. Initialize Database Schema
```bash
# Generate Prisma client
pnpm run db:generate

# Push schema to database (for development)
pnpm run db:push

# Or create and run migrations (for production)
pnpm run db:migrate
```

### 4. Open Prisma Studio (Database GUI)
```bash
pnpm run db:studio
```
This opens a web interface at http://localhost:5555 to view and edit your data.

## API Usage

### Create Property Prediction
```bash
POST /api/properties
Content-Type: application/json

{
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "bedrooms": 3,
  "bathrooms": 2.5,
  "squareFeet": 2000,
  "yearBuilt": 2010,
  "propertyType": "house"
}
```

### Get Properties
```bash
GET /api/properties?limit=10&offset=0
```

## Database Schema

- **Property**: Stores property information
- **Prediction**: Stores AI predictions for properties
- **User**: User accounts (for future authentication)

## Development Commands

```bash
# View database in browser
pnpm run db:studio

# Reset database (development only)
pnpm run db:push --force-reset

# Create new migration
pnpm run db:migrate

# Update Prisma client after schema changes
pnpm run db:generate
```

## Production Deployment

1. Set up MySQL database on your hosting provider
2. Update `DATABASE_URL` in production environment
3. Run migrations: `npx prisma migrate deploy`
4. Generate Prisma client: `npx prisma generate`

## Troubleshooting

**Connection Issues:**
- Verify MySQL server is running
- Check DATABASE_URL format
- Ensure user has proper permissions

**Migration Issues:**
- Run `npx prisma db push` for quick schema updates
- Use `npx prisma migrate dev` for version-controlled migrations

**Type Errors:**
- Run `pnpm run db:generate` after schema changes
- Restart your development server