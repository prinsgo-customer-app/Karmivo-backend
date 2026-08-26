# Karmivo Backend

This is the central backend API for the complete KARMIVO platform, including the Customer App, Partner App, and Admin Panel.

## Architecture

- **Node.js** and **Express.js** for the API server.
- **MongoDB** and **Mongoose** for data storage.
- **JWT** for secure authentication and authorization (RBAC).
- Modular architecture: controllers, models, routes, middleware, services, utils.
- Centralized error handling and standard API responses.

## Setup Instructions

1. Install dependencies: `npm install`
2. Environment Variables: Copy `.env.example` to `.env` and fill in secrets.
3. Seed Database Roles: `npm run seed`
4. Run Development: `npm run dev`
5. Run Tests: `npm test`

## API Documentation
Swagger documentation is available at `/api-docs` when running the application.

## Deployment to Render

- Ensure `PORT`, `MONGO_URI`, and `NODE_ENV=production` are set.
- Start Command: `npm start`

## Core Modules

- Authentication & RBAC
- Services & Categories Management
- Order Management
- Payment & Wallet System
- CMS & Banners (Admin)
