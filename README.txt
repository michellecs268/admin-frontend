# RockQuest Admin Web – First-Time Setup

## 1. Allow Script Execution (Windows PowerShell)
Run this ONLY if you get a script permission error:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

## 2. Install Dependencies
npm install --legacy-peer-deps

## 3. Run the Admin Web
npm run dev
The admin panel will usually be available at:
http://localhost:3000

## 4. Backend API Connection
The admin web must connect to the RockQuest backend API.
Make sure the backend is running BEFORE opening the admin panel.

Example to run FastAPI backend:
uvicorn app.main:app --reload

This will start the backend at:
http://localhost:8000

## 5. .env Example
Create a file named `.env` in the root of the admin web project and paste:

NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

Replace YOUR_GOOGLE_MAPS_API_KEY with your valid Google Maps API key.

## 6. Admin Login Credentials (for testing)
Email: admin@rockquest.com
Password: admin123

## 7. Notes
- You must log in with the above credentials to access admin features.
- Google Maps features (e.g., Rock Distribution map) require a valid Google Maps API key.
- If you change the backend port or domain, update NEXT_PUBLIC_API_BASE_URL in your `.env`.

