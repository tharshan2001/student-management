# Student Management App

A modern **Next.js + React + TailwindCSS** application to manage student information, view profiles, and perform CRUD operations. This project includes a responsive, mobile-friendly UI with yellow-themed accents.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Components](#components)
- [API Endpoints](#api-endpoints)
- [Styling & Design](#styling--design)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

---

## Demo

You can view the students list, search for students, paginate, and click to view detailed profiles. Each profile shows:

- Personal information (name, birth date, age, email, phone)
- Address (city, district)
- Academic status
- Stylish yellow-themed UI with responsive design

---

## Features

- **Student List Table**
  - Search by name or other fields
  - Pagination with previous/next and page numbers
  - Loading states and empty states
  - Mobile-friendly layout with compact buttons

- **Add Student Modal**
  - Create new student
  - Auto-refresh list after adding

- **Student Profile Page**
  - Shows student initials with accent card
  - Personal info: full name, birth date, email, age
  - Contact info: phone number
  - Address details
  - Yellow-themed accents and responsive design
  - Back navigation

- **Responsive Design**
  - Mobile-first design
  - Add button aligned right on mobile
  - Compact card for mobile devices

---

## Technologies

- [Next.js 14](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [TailwindCSS 3](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- TypeScript

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/student-directory.git
   cd student-directory

2. **Install dependencies:**
   ```bash
   npm install

3. **Run the development server:**
    ```bash
    npm run dev

# Student Directory Components

## StudentList Component (`app/students/StudentList.tsx`)
**Responsibilities:**
- Fetches students from `/api/students` endpoint
- Implements search functionality
- Handles pagination for large datasets
- Contains "Add Student" button to open CreateStudentModal

**Features:**
- Loading and error states
- Responsive grid/list layout
- Search input with debouncing
- Pagination controls (previous/next, page numbers)
- Integration with StudentItem components

## StudentItem Component (`components/StudentItem.tsx`)
**Responsibilities:**
- Displays a single student in the list
- Shows student name, ID, and key details
- Provides action buttons for student operations

**Visual Elements:**
- Student avatar/initials
- Name and identification number
- Contact information (truncated)
- Status indicators (if applicable)

**Actions:**
- **Edit**: Opens edit modal/form (if implemented)
- **Delete**: Shows confirmation and removes student (if implemented)
- **View Profile**: Links to `/students/[id]` page

## CreateStudentModal Component (`components/CreateStudentModal.tsx`)
**Responsibilities:**
- Modal form for creating new students
- Validates input data before submission
- Calls POST `/api/students` endpoint
- Refreshes StudentList upon success

**Form Fields:**
- First Name (required)
- Last Name (required)
- Email (with validation)
- Phone Number
- Age
- Address fields
- Course/Program selection

**Features:**
- Success/error notifications
- Form validation
- Loading state during submission
- Auto-close on success

## StudentProfile Component (`app/students/[id]/StudentProfile.tsx`)
**Responsibilities:**
- Displays detailed student information
- Fetches student data from `/api/students/[id]`
- Two-column responsive layout with yellow accent design

**Layout Design:**

### Left Card (Yellow Accent)
```jsx
// Visual Elements:
- Large initials/avatar circle with yellow background
- Contact Information:
  - Phone number with icon
  - Email with icon
  - Age with icon
- Quick action buttons
- Yellow accent border/background elements

# Student Directory API Endpoints

**Note:** These endpoints can be adapted for any backend (MongoDB, Prisma, PostgreSQL, MySQL, Firebase, etc.)

## Base URL
`/api/students`

---

# API Endpoints

## GET `/api/students`
**Query params:** `search`, `page`, `limit`  
**Returns:** `{ data: Student[], totalPages: number }`

## GET `/api/students/:id`
**Returns:** Detailed student info

## POST `/api/students`
**Body:** JSON with student fields  
**Action:** Create a new student

## PUT `/api/students/:id`
**Action:** Update a student

## DELETE `/api/students/:id`
**Action:** Delete a student


# Styling & Design

## Tech Stack
- **TailwindCSS** for responsive, utility-first styling
- **Mobile-first** design approach
- **React Icons** or **Lucide React** for consistent iconography


