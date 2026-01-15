# 📚 KnowledgeHub Frontend: Angular Learning Management System

**KnowledgeHub Frontend** is a modern Angular application that provides a beautiful, responsive interface for the KnowledgeHub learning management system. It connects to the Express.js backend API to enable tutorial creation, browsing, and user management.

* Design: [Stitch Design](https://stitch.withgoogle.com/projects/16073747385846946227)

---

## 🚀 Features

* **Modern UI/UX:** Clean, responsive design built with Tailwind CSS and Material Icons.
* **JWT Authentication:** Secure login/signup with token-based authentication stored in localStorage.
* **Role-Based Views:** Different UI elements displayed based on user role (User/Admin).
* **Tutorial Management:** Create, edit, publish, and delete tutorials with a rich editor.
* **Category System:** Filter tutorials by categories (Development, Design, Data Science, and custom categories).
* **User Dashboard:** Personal dashboard showing all user's tutorials with status indicators.
* **Profile Page:** User statistics including total tutorials, published/draft counts, and category breakdown.
* **Admin Panel:** Category management for administrators.
* **Search Functionality:** Find tutorials by title keywords.
* **Responsive Design:** Works seamlessly on desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

* **Framework:** Angular 17+ (Standalone Components)
* **Styling:** Tailwind CSS
* **Icons:** Google Material Symbols
* **State Management:** Angular Signals
* **HTTP Client:** Angular HttpClient with Interceptors
* **Routing:** Angular Router with Hash Location Strategy
* **Forms:** Reactive Forms

---

## 📁 Project Structure

```
src/
├── app.component.ts          # Root component with router outlet
├── components/
│   ├── home/                 # Public homepage with tutorial grid
│   ├── login/                # Authentication (login/signup)
│   ├── dashboard/            # User's tutorial management
│   ├── editor/               # Tutorial create/edit editor
│   ├── tutorial-detail/      # Full tutorial view page
│   ├── profile/              # User profile with statistics
│   └── admin/                # Admin category management
├── services/
│   ├── auth.service.ts       # Authentication & user state
│   ├── tutorial.service.ts   # Tutorial CRUD operations
│   └── category.service.ts   # Category management
index.tsx                     # Application bootstrap & routes
index.html                    # HTML entry point
```

---

## 🧩 Components

### Public Pages
| Component | Route | Description |
| :--- | :--- | :--- |
| `HomeComponent` | `/` | Landing page with tutorial grid and category filters |
| `LoginComponent` | `/login` | User authentication (login & signup) |
| `TutorialDetailComponent` | `/tutorial/:id` | Full tutorial view page |

### Protected Pages (Requires Authentication)
| Component | Route | Description |
| :--- | :--- | :--- |
| `DashboardComponent` | `/dashboard` | User's tutorial management dashboard |
| `EditorComponent` | `/editor` | Create new tutorial |
| `EditorComponent` | `/editor/:id` | Edit existing tutorial |
| `ProfileComponent` | `/profile` | User profile with statistics |
| `AdminComponent` | `/admin` | Category management (Admin only) |

---

## 🔐 Services

### AuthService
Handles user authentication and session management.

```typescript
// Key methods
login(credentials)      // Authenticate user & store JWT
register(data)          // Create new user account
logout()                // Clear session & redirect
isAuthenticated()       // Check if user is logged in
currentUser()           // Get current user signal
```

### TutorialService
Manages tutorial CRUD operations via the backend API.

```typescript
// Key methods
getAll(title?)          // Get all tutorials (with optional search)
getById(id)             // Get single tutorial
getMyTutorials()        // Get current user's tutorials
create(data)            // Create new tutorial
update(id, data)        // Update existing tutorial
delete(id)              // Delete tutorial
```

### CategoryService
Manages tutorial categories.

```typescript
// Key methods
categories()            // Signal with all categories
addCategory(category)   // Add new category (Admin)
deleteCategory(id)      // Remove category (Admin)
getCategoryBySlug(slug) // Find category by slug
```

---

## 🎨 UI Features

### Tutorial Cards
- Cover image with fallback placeholders
- Category badge
- Author avatar and name
- Hover effects and animations

### Dashboard
- Tutorial list with status indicators (Published/Draft)
- Search/filter functionality
- Quick edit and delete actions
- Sidebar navigation

### Profile Page
- User statistics (Total, Published, Drafts)
- Category breakdown chart
- Recent tutorials list
- Quick action buttons

### Editor
- Rich text editing
- Category selection dropdown
- Cover image URL input
- Source link field
- Save as Draft or Publish options

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ionesscuaandrei/knowledge-hub.git
   cd knowledge-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL**
   Update the API URL in the services if needed:
   ```typescript
   // src/services/auth.service.ts
   const API_URL = 'http://localhost:3001/api/auth';
   
   // src/services/tutorial.service.ts
   const API_URL = 'http://localhost:3001/api/tutorials';
   ```

4. **Run the development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   Navigate to `http://localhost:4200`

---

## 🔗 Backend Integration

This frontend requires the KnowledgeHub Backend API to be running. 

### Required API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/tutorials` | Get all tutorials |
| `GET` | `/api/tutorials/:id` | Get tutorial by ID |
| `POST` | `/api/tutorials` | Create tutorial |
| `PUT` | `/api/tutorials/:id` | Update tutorial |
| `DELETE` | `/api/tutorials/:id` | Delete tutorial |
| `GET` | `/api/tutorials/user/me` | Get user's tutorials |

### Authentication Header
The app automatically includes the JWT token in all requests:
```
Authorization: Bearer <token>
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Description |
| :--- | :--- | :--- |
| `sm` | 640px | Small devices |
| `md` | 768px | Medium devices |
| `lg` | 1024px | Large devices |
| `xl` | 1280px | Extra large devices |

---

## 🎯 Default Categories

The application comes with three default categories:

| Category | Slug | Icon |
| :--- | :--- | :--- |
| Development | `development` | `code` |
| Design | `design` | `palette` |
| Data Science | `data-science` | `analytics` |

Admins can add custom categories via the Admin Panel.

---

## 📄 License

MIT License - © 2026 Knowledge Hub Inc.

