# 🎯 Task Management System

A comprehensive task management system built with **React** frontend and **Laravel** backend, featuring role-based access control, appointment scheduling, and real-time updates.

## ✨ Features

### 🔐 Role-Based Access Control
- **Superadmins** (`governeur`, `secretaire_general`): Manage superadmins and admins
- **Admins** (`secretaire_sg`, `secretaire_ssg`): Manage tasks, divisions, and appointments
- **Division Responsables**: Manage their own division tasks and settings

### 📅 Appointment Management
- Full-page calendar interface
- Add, edit, and delete appointments
- Day-specific appointment views
- PDF export functionality (day, week, month)
- Real-time updates

### 📊 Task Management
- Create and assign tasks to divisions
- Track task status and progress
- Historical data and statistics
- Document management system

### ⚙️ Settings Management
- Role-specific settings pages
- Real-time data updates
- Modern UI with success/error feedback
- Responsive design

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **FullCalendar** - Calendar component
- **Axios** - HTTP client
- **jsPDF** - PDF generation
- **React Icons** - Icon library

### Backend
- **Laravel 10** - PHP framework
- **MySQL** - Database
- **Eloquent ORM** - Database abstraction
- **RESTful API** - Backend services

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- PHP 8.1 or higher
- Composer
- MySQL/MariaDB
- XAMPP (recommended for local development)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your database credentials

4. **Generate application key**
   ```bash
   php artisan key:generate
   ```

5. **Run database migrations**
   ```bash
   php artisan migrate
   ```

6. **Seed the database**
   ```bash
   php artisan db:seed
   ```

7. **Start the server**
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
gestion_taches/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/API/
│   │   ├── Models/
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── user/
│   │   │       ├── admin/
│   │   │       ├── superadmin/
│   │   │       └── divisionresponsable/
│   │   ├── utils/
│   │   └── styles/
│   └── public/
└── README.md
```

## 🔑 Default Users

### Superadmins
- **Username**: `gouverneur` | **Password**: `1234` | **Role**: `governeur`
- **Username**: `secretaire_general` | **Password**: `1234` | **Role**: `secretaire_general`

### Admins
- **Username**: `secretaire_sg` | **Password**: `1234` | **Role**: `secretaire_sg`
- **Username**: `secretaire_ssg` | **Password**: `1234` | **Role**: `secretaire_ssg`

### Division Responsables
- **Username**: `division1` | **Password**: `1234` | **Role**: `division_responsable`

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/login` - User login
- `POST /api/v1/logout` - User logout

### Superadmins
- `GET /api/v1/superadmins` - Get all superadmins
- `PUT /api/v1/superadmins/{id}` - Update superadmin

### Admins
- `GET /api/v1/admins` - Get all admins
- `PUT /api/v1/admins/{id}` - Update admin

### Divisions
- `GET /api/v1/divisions` - Get all divisions
- `PUT /api/v1/divisions/{id}` - Update division

### Tasks
- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task

### Appointments
- `GET /api/v1/rendezvous` - Get all appointments
- `POST /api/v1/rendezvous` - Create appointment
- `PUT /api/v1/rendezvous/{id}` - Update appointment
- `DELETE /api/v1/rendezvous/{id}` - Delete appointment

## 🎨 UI Features

### Modern Design
- Clean, responsive interface
- Project color scheme consistency
- Smooth animations and transitions
- Mobile-friendly design

### Real-time Updates
- Immediate UI feedback
- Green success messages
- Error handling with red alerts
- Loading states

### Export Functionality
- PDF generation for appointments
- Day, week, and month views
- Download icons for better UX

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Backend:**
```bash
php artisan serve    # Start development server
php artisan migrate  # Run migrations
php artisan db:seed  # Seed database
```

### Code Style
- ESLint configuration for frontend
- PSR-12 coding standards for backend
- Consistent naming conventions

## 🚀 Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your web server
3. Configure your web server to serve the React app

### Backend Deployment
1. Upload backend files to your server
2. Run `composer install --optimize-autoloader --no-dev`
3. Set up environment variables
4. Run migrations: `php artisan migrate --force`
5. Configure your web server (Apache/Nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ using React & Laravel**
