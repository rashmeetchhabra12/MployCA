# Role-Based User Dashboard

This is a small full-stack dashboard built for the Angular/Node assignment. It has a role-based login flow, user-specific records, and an admin section for managing users stored in MongoDB.

## Tech Stack

- Angular
- Node.js
- Express
- TypeScript
- MongoDB Atlas

## Features

- Login with User ID, Password, and Role.
- Two roles are supported: `General User` and `Admin`.
- Logged-in users can see their profile details.
- Records are loaded from the API and shown in a table.
- Admin users can view, create, update status, and delete users.
- The records API accepts a `delayMs` parameter to show async loading behavior.
- The code is split into Angular services, route guards, Express routes, controllers, services, and models.


## Application Screenshot:
   <img width="1918" height="856" alt="Screenshot 2026-05-29 192231" src="https://github.com/user-attachments/assets/2d20eae1-2d22-4469-8acd-72872f1c8f0d" />
 
<img width="1905" height="775" alt="image" src="https://github.com/user-attachments/assets/ef425216-22af-406a-9779-f0d0253c8543" />

<img width="1919" height="858" alt="image" src="https://github.com/user-attachments/assets/bd0bdd97-6e6c-432e-a3d1-303b1c95bb98" />


## Test Users

| Role | User ID | Password |
| --- | --- | --- |
| Admin | `admin01` | `admin123` |
| General User | `user01` | `user123` |
| General User | `user02` | `user123` |

## Project Structure

```txt
client/   Angular application
server/   Express + TypeScript API
```

## Environment Setup

Create `server/.env` using `server/.env.example` as a reference.

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:4200
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret
DNS_SERVERS=8.8.8.8,1.1.1.1
```

`DNS_SERVERS` is optional, but it helps on networks where Node.js has trouble resolving MongoDB Atlas SRV records.

## Run Locally

Install dependencies:

```bash
npm --prefix server install
npm --prefix client install
```

Start the API:

```bash
npm run server:dev
```

Start the Angular app:

```bash
npm run client:dev
```

Development URLs:

```txt
Angular: http://localhost:4200
API:     http://localhost:4000
```

## Production Build

The Express server can also serve the Angular production build.

```bash
npm start
```

Open:

```txt
http://localhost:4000
```

## API Routes

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/auth/login` | Public |
| GET | `/api/users/me` | Logged-in user |
| GET | `/api/records?delayMs=1500` | Logged-in user |
| GET | `/api/users` | Admin |
| POST | `/api/users` | Admin |
| PUT | `/api/users/:id` | Admin |
| DELETE | `/api/users/:id` | Admin |

## Notes

The server seeds initial users and records when the MongoDB collections are empty. If MongoDB is not configured, the API falls back to in-memory seed data so the frontend can still be checked locally.
