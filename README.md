# Monaragala District Development Projects Management System

A comprehensive web application designed to track, manage, and visualize various development projects across the Monaragala District. This system provides a public interface for transparency and an administrative portal for project management.

## 🚀 Features

### Public Interface
- **Project Explorer**: Browse projects with advanced filtering by DS Division, GN Division, and Status.
- **Interactive Map**: Visualize project locations using Leaflet.js.
- **Analytics Dashboard**: Dynamic charts and statistics using Recharts.
- **Project Details**: Comprehensive view of individual projects including financial data and progress.

### Administrative Portal
- **Secure Authentication**: Role-based access control for administrators.
- **Project Management**: Full CRUD operations for development projects.
- **Media Management**: Image uploads and hosting via Cloudinary.
- **Author Tracking**: Track project creation and modifications by specific admins.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router 7
- **Mapping**: Leaflet & React Leaflet
- **Charts**: Recharts
- **Styling**: Vanilla CSS (Premium Custom Design)
- **Icons**: Lucide React / Custom SVG

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT & Bcrypt.js
- **File Uploads**: Multer & Cloudinary

## 📦 Project Structure

```text
├── backend/            # Express.js API
│   ├── src/
│   │   ├── models/     # Database Schemas
│   │   ├── routes/     # API Endpoints
│   │   └── seeders/    # Initial Data Scripts
│   └── .env            # Environment Variables
└── frontend/           # React Application
    ├── src/
    │   ├── components/ # Reusable UI Components
    │   ├── pages/      # Page Containers
    │   └── context/    # Global State Management
    └── public/         # Static Assets
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
4. Seed the database (optional):
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🎨 Aesthetics
The application features a premium dark-themed design with:
- **Custom Backgrounds**: Professional wavy patterns (`pngwing.com-2.png`) blended with navy tones.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **Micro-interactions**: Smooth transitions and hover effects for a modern feel.

## 📄 License
This project is for internal use for Monaragala District development tracking.
