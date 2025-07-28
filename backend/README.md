# Task Management System

A comprehensive task management system built with Laravel (Backend API) and React (Frontend) for managing tasks across different divisions.

## 🚀 Features

### Admin Features
- **Dashboard**: Overview of all divisions and their tasks
- **Task Management**: Create, edit, and assign tasks to divisions
- **Division Management**: Manage divisions and their responsible persons
- **Statistics**: View detailed statistics and analytics
- **Settings**: System configuration and user management

### Division Responsible Features
- **Dashboard**: Division-specific overview with task statistics
- **Task Details**: View and update task status
- **Task Management**: Manage pending tasks for the division
- **History**: Track task progress and add documentation
- **Profile**: User profile management

## 🛠️ Technology Stack

### Backend
- **Laravel 10** - PHP framework
- **MySQL** - Database
- **Laravel Sanctum** - API authentication
- **PHPUnit** - Testing framework

### Frontend
- **React 18** - JavaScript library
- **Material-UI** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization

## 📋 Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 16 or higher
- MySQL 8.0 or higher
- Apache/Nginx web server

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd gestion_taches
```

### 2. Backend Setup (Laravel)

```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestion_taches
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed the database
php artisan db:seed

# Create storage link
php artisan storage:link

# Start the development server
php artisan serve
```

### 3. Frontend Setup (React)

```bash
# Navigate to React directory
cd react

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📊 Database Structure

### Tables
- **admin** - Admin users
- **division** - Divisions and their responsible persons
- **task** - Tasks assigned to divisions
- **status** - Task status history
- **historique** - Task progress history with documents
- **documentpath** - Document file paths

### Relationships
- Division has many Tasks
- Task has many Statuses
- Task has many Historiques
- Task has many Documentpaths
- Historique has many Documentpaths

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - User login (admin/division responsable)

### Tasks
- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/{id}` - Get specific task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task

### Divisions
- `GET /api/v1/divisions` - Get all divisions
- `POST /api/v1/divisions` - Create new division
- `GET /api/v1/divisions/{id}` - Get specific division
- `PUT /api/v1/divisions/{id}` - Update division
- `DELETE /api/v1/divisions/{id}` - Delete division

### Status
- `GET /api/v1/statuses` - Get all statuses
- `POST /api/v1/statuses` - Create new status
- `PUT /api/v1/statuses/{id}` - Update status
- `DELETE /api/v1/statuses/{id}` - Delete status

### Historique
- `GET /api/v1/historiques` - Get all historiques
- `POST /api/v1/historiques` - Create new historique (with file upload)
- `PUT /api/v1/historiques/{id}` - Update historique
- `DELETE /api/v1/historiques/{id}` - Delete historique

### Document Paths
- `GET /api/v1/documentpaths` - Get all document paths
- `POST /api/v1/documentpaths` - Upload document
- `PUT /api/v1/documentpaths/{id}` - Update document path
- `DELETE /api/v1/documentpaths/{id}` - Delete document

## 🧪 Testing

### Run Backend Tests
```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/TaskApiTest.php

# Run with coverage
php artisan test --coverage
```

### Run Frontend Tests
```bash
cd react
npm test
```

## 📁 Project Structure

```
gestion_taches/
├── app/
│   ├── Http/Controllers/
│   │   ├── API/           # API controllers
│   │   └── Controller.php # Base controller
│   └── Models/            # Eloquent models
├── database/
│   ├── migrations/        # Database migrations
│   └── seeders/          # Database seeders
├── react/
│   ├── src/
│   │   ├── pages/        # React components
│   │   ├── styles/       # CSS files
│   │   └── utils/        # Utility functions
│   └── package.json
├── routes/
│   └── api.php          # API routes
└── tests/               # PHPUnit tests
```

## 🔐 Authentication

The system supports two types of users:

### Admin Users
- Full access to all features
- Can manage divisions and tasks
- Access to system statistics and settings

### Division Responsables
- Limited to their assigned division
- Can view and update tasks for their division
- Can add history entries and documents

## 📝 Usage

### Admin Workflow
1. Login with admin credentials
2. Create divisions and assign responsables
3. Create tasks and assign to divisions
4. Monitor progress through dashboard
5. View statistics and reports

### Division Responsable Workflow
1. Login with division credentials
2. View assigned tasks on dashboard
3. Update task status as work progresses
4. Add history entries with documentation
5. Upload supporting documents

## 🚀 Deployment

### Production Setup
1. Configure production environment variables
2. Set up database with proper credentials
3. Run migrations and seeders
4. Build React application: `npm run build`
5. Configure web server (Apache/Nginx)
6. Set up SSL certificates
7. Configure file storage for document uploads

### Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
DB_HOST=your-db-host
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with basic task management
- **v1.1.0** - Added document upload functionality
- **v1.2.0** - Enhanced statistics and reporting
- **v1.3.0** - Improved UI/UX and mobile responsiveness

---

**Note**: This is a task management system designed for organizational use. Ensure proper security measures are in place before deploying to production.