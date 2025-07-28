# 🎯 Gestion des Tâches - Task Management System

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-8.1+-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

*A comprehensive task management system for organizational workflow optimization*

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📖 Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [📊 Database Schema](#-database-schema)
- [🔌 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Overview

**Gestion des Tâches** is a modern, full-stack task management system designed for organizational efficiency. Built with Laravel 10 (Backend API) and React 18 (Frontend), it provides a comprehensive solution for managing tasks across different divisions with role-based access control, real-time updates, and advanced reporting capabilities.

### 🎯 Key Highlights

- **🔐 Role-Based Access Control** - Superadmin, Admin, and Division Responsible roles
- **📊 Real-Time Dashboard** - Live statistics and progress tracking
- **📅 Advanced Calendar System** - Full-page agenda with PDF export capabilities
- **📁 Document Management** - File upload and version control
- **📈 Analytics & Reporting** - Comprehensive statistics and insights
- **🎨 Modern UI/UX** - Responsive design with smooth animations
- **🔒 Secure Authentication** - Laravel Sanctum with token-based auth

---

## ✨ Features

### 👑 Superadmin Features
- **System Administration** - Manage all system settings and users
- **User Management** - Create and manage admins and divisions
- **Global Statistics** - Organization-wide analytics and reports
- **System Configuration** - Database and application settings

### 🔧 Admin Features
- **📊 Dashboard** - Overview of all divisions and their tasks
- **📋 Task Management** - Create, edit, and assign tasks to divisions
- **🏢 Division Management** - Manage divisions and their responsible persons
- **📈 Statistics** - View detailed statistics and analytics
- **⚙️ Settings** - System configuration and user management
- **📅 Agenda Management** - Full-page calendar with appointment scheduling
- **📄 PDF Export** - Export day, week, and month reports

### 👥 Division Responsible Features
- **📊 Dashboard** - Division-specific overview with task statistics
- **📋 Task Details** - View and update task status
- **🔄 Task Management** - Manage pending tasks for the division
- **📚 History** - Track task progress and add documentation
- **👤 Profile** - User profile management
- **📁 Document Upload** - Attach files to task progress

---

## 🛠️ Tech Stack

### 🎯 Backend (Laravel 10)
| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel** | 10.x | PHP Framework |
| **MySQL** | 8.0+ | Database |
| **Laravel Sanctum** | Latest | API Authentication |
| **PHPUnit** | Latest | Testing Framework |
| **Eloquent ORM** | Built-in | Database Operations |

### 🎨 Frontend (React 18)
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI Library |
| **Vite** | 4.x | Build Tool |
| **React Router** | 6.x | Client-side Routing |
| **Axios** | Latest | HTTP Client |
| **FullCalendar** | Latest | Calendar Component |
| **jsPDF** | Latest | PDF Generation |
| **React Icons** | Latest | Icon Library |

### 🛠️ Development Tools
| Tool | Purpose |
|------|---------|
| **Composer** | PHP Dependency Management |
| **npm** | Node.js Package Manager |
| **Git** | Version Control |
| **ESLint** | Code Quality |
| **PHPUnit** | Backend Testing |

---

## 🚀 Quick Start

### Prerequisites
- **PHP** 8.1 or higher
- **Composer** (PHP package manager)
- **Node.js** 16 or higher
- **MySQL** 8.0 or higher
- **Apache/Nginx** web server

### 🚀 One-Command Setup
```bash
# Clone the repository
git clone <repository-url>
cd gestion_taches

# Run the setup script (if available)
./setup.sh
```

---

## 📦 Installation

### 1️⃣ Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd backend

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

# Run database migrations
php artisan migrate

# Seed the database with initial data
php artisan db:seed

# Create storage link for file uploads
php artisan storage:link

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Start the development server
php artisan serve
```

### 2️⃣ Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

### 3️⃣ Database Setup

```sql
-- Create the database
CREATE DATABASE gestion_taches CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create a user (optional)
CREATE USER 'gestion_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON gestion_taches.* TO 'gestion_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Application
APP_NAME="Gestion des Tâches"
APP_ENV=local
APP_KEY=base64:your-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestion_taches
DB_USERNAME=your_username
DB_PASSWORD=your_password

# File Storage
FILESYSTEM_DISK=local

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME="Gestion des Tâches"
```

### 🔐 Default Users

After running the seeders, you'll have these default users:

| Role | Username | Password | Access |
|------|----------|----------|--------|
| **Superadmin** | `gouverneur` | `1234` | Full system access |
| **Superadmin** | `secretaire_general` | `1234` | Full system access |
| **Admin** | `secretaire_sguhiio` | `1234` | Admin features |
| **Admin** | `secretaire_ssg` | `1234` | Admin features |

---

## 📊 Database Schema

### 🗄️ Core Tables

#### Users & Authentication
```sql
-- Superadmins table
superadmins (superadmin_id, username, password, role, created_at, updated_at)

-- Admins table  
admins (admin_id, username, password, role, superadmin_id, created_at, updated_at)

-- Divisions table
divisions (division_id, division_nom, division_responsable, password, created_at, updated_at)
```

#### Task Management
```sql
-- Tasks table
tasks (id, title, description, division_id, status, priority, due_date, created_at, updated_at)

-- Status history
statuses (id, task_id, status, comment, created_at, updated_at)

-- Task history with documents
historiques (id, task_id, description, document_path, created_at, updated_at)

-- Document paths
documentpaths (id, historique_id, file_path, file_name, created_at, updated_at)
```

#### Calendar & Appointments
```sql
-- Rendezvous (appointments)
rendezvouses (id, date, time, person, subject, location, notes, admin_id, superadmin_id, created_at, updated_at)
```

### 🔗 Relationships
- **Division** → has many **Tasks**
- **Task** → has many **Statuses**
- **Task** → has many **Historiques**
- **Historique** → has many **Documentpaths**
- **Admin** → has many **Rendezvouses**

---

## 🔌 API Documentation

### 🔐 Authentication
All API endpoints require authentication via Laravel Sanctum tokens.

```bash
# Login to get token
POST /api/login
Content-Type: application/json

{
  "username": "gouverneur",
  "password": "1234"
}
```

### 📋 Core Endpoints

#### Tasks
```bash
GET    /api/v1/tasks              # Get all tasks
POST   /api/v1/tasks              # Create new task
GET    /api/v1/tasks/{id}         # Get specific task
PUT    /api/v1/tasks/{id}         # Update task
DELETE /api/v1/tasks/{id}         # Delete task
```

#### Divisions
```bash
GET    /api/v1/divisions          # Get all divisions
POST   /api/v1/divisions          # Create new division
GET    /api/v1/divisions/{id}     # Get specific division
PUT    /api/v1/divisions/{id}     # Update division
DELETE /api/v1/divisions/{id}     # Delete division
```

#### Users
```bash
GET    /api/v1/superadmins        # Get all superadmins
POST   /api/v1/superadmins        # Create superadmin
PUT    /api/v1/superadmins/{id}   # Update superadmin
DELETE /api/v1/superadmins/{id}   # Delete superadmin

GET    /api/v1/admins             # Get all admins
POST   /api/v1/admins             # Create admin
PUT    /api/v1/admins/{id}        # Update admin
DELETE /api/v1/admins/{id}        # Delete admin
```

#### Documents
```bash
GET    /api/v1/documentpaths      # Get all documents
POST   /api/v1/documentpaths      # Upload document
GET    /api/v1/documentpaths/{id}/download  # Download document
DELETE /api/v1/documentpaths/{id} # Delete document
```

#### Calendar
```bash
GET    /api/v1/rendezvous         # Get all appointments
POST   /api/v1/rendezvous         # Create appointment
PUT    /api/v1/rendezvous/{id}    # Update appointment
DELETE /api/v1/rendezvous/{id}    # Delete appointment
```

### 📊 Response Format
```json
{
  "message": "Success message",
  "data": {
    // Response data
  },
  "errors": {
    // Validation errors (if any)
  }
}
```

---

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/TaskApiTest.php

# Run with coverage
php artisan test --coverage

# Run tests in parallel
php artisan test --parallel
```

### Frontend Testing
```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### 🧪 Test Structure
```
tests/
├── Feature/
│   ├── AuthApiTest.php
│   ├── TaskApiTest.php
│   ├── DocumentApiTest.php
│   └── ExampleTest.php
└── Unit/
    └── ExampleTest.php
```

---

## 🚀 Deployment

### 🐳 Docker Deployment (Recommended)

```dockerfile
# Backend Dockerfile
FROM php:8.1-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www
```

### 🌐 Production Setup

1. **Environment Configuration**
   ```bash
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-domain.com
   ```

2. **Database Setup**
   ```bash
   # Run migrations
   php artisan migrate --force
   
   # Seed production data
   php artisan db:seed --class=ProductionSeeder
   ```

3. **Frontend Build**
   ```bash
   cd frontend
   npm run build
   ```

4. **Web Server Configuration**
   ```nginx
   # Nginx configuration
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/public;
       
       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }
       
       location ~ \.php$ {
           fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
           fastcgi_index index.php;
           fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
           include fastcgi_params;
       }
   }
   ```

### 🔒 Security Checklist

- [ ] **HTTPS** - SSL certificates configured
- [ ] **Environment Variables** - Sensitive data in .env
- [ ] **Database Security** - Strong passwords and limited access
- [ ] **File Permissions** - Proper file and directory permissions
- [ ] **CORS** - Configured for production domains
- [ ] **Rate Limiting** - API rate limiting enabled
- [ ] **Backup Strategy** - Database and file backups

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 🍴 Fork & Clone
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/gestion_taches.git
cd gestion_taches

# Add upstream remote
git remote add upstream https://github.com/original-owner/gestion_taches.git
```

### 🌿 Create Feature Branch
```bash
# Create and switch to feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Test thoroughly
# Commit with descriptive message
git commit -m "feat: add amazing new feature"
```

### 📤 Submit Pull Request
1. Push to your fork
2. Create Pull Request
3. Describe changes clearly
4. Include tests if applicable

### 📋 Development Guidelines

#### Code Style
- **PHP**: Follow PSR-12 standards
- **JavaScript**: Use ESLint configuration
- **CSS**: Follow BEM methodology
- **Git**: Conventional commits format

#### Testing
- Write tests for new features
- Ensure all tests pass
- Maintain good test coverage

#### Documentation
- Update README if needed
- Add inline code comments
- Document API changes

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Gestion des Tâches

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🆘 Support & Community

### 📞 Getting Help
- **🐛 Bug Reports**: [Create an issue](https://github.com/your-repo/issues)
- **💡 Feature Requests**: [Submit feature request](https://github.com/your-repo/issues)
- **📖 Documentation**: Check the [Wiki](https://github.com/your-repo/wiki)
- **💬 Discussions**: [Join discussions](https://github.com/your-repo/discussions)

### 🔗 Useful Links
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [MySQL Documentation](https://dev.mysql.com/doc)
- [Vite Documentation](https://vitejs.dev)

### 👥 Contributors

<div align="center">

**Made with ❤️ by the Gestion des Tâches Team**

[![GitHub contributors](https://img.shields.io/github/contributors/your-repo/gestion_taches?style=for-the-badge)](https://github.com/your-repo/gestion_taches/graphs/contributors)

</div>

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/your-repo/gestion_taches?style=social)](https://github.com/your-repo/gestion_taches/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-repo/gestion_taches?style=social)](https://github.com/your-repo/gestion_taches/network/members)
[![GitHub issues](https://img.shields.io/github/issues/your-repo/gestion_taches)](https://github.com/your-repo/gestion_taches/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/your-repo/gestion_taches)](https://github.com/your-repo/gestion_taches/pulls)

</div> 