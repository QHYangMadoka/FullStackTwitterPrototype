# Social Media App

## Part 1: Overview

### Creator
This project is entirely designed, developed, and deployed by **Qinghao Yang** as an individual assignment.

---

### Technologies and Packages Used

#### **Backend:**
- **Framework:** Node.js with Express
- **Database:** MongoDB (hosted on MongoDB Atlas)
- **Packages:**
  - `mongoose`: For database schema and operations
  - `express`: For handling routing and middleware
  - `bcrypt`: For secure password hashing
  - `dotenv`: To manage environment variables securely
  - `cors`: To enable cross-origin requests
  - `body-parser`: To parse incoming request bodies
  - `jsonwebtoken`: For user authentication using JSON Web Tokens

#### **Frontend:**
- **Framework:** React
- **Build Tool:** Vite
- **Packages:**
  - `react-router-dom`: For client-side routing
  - `prop-types`: For type-checking React props
  - `axios`: To handle HTTP requests between frontend and backend

### URLs
- **Frontend:** [https://qhmadoka-twitterapp.onrender.com](https://qhmadoka-twitterapp.onrender.com)
- **Backend:** [https://qhmadoka-twitterapp-backend.onrender.com](https://qhmadoka-twitterapp-backend.onrender.com)

---

## Part 2: Project Structure and Features

### Backend Structure
#### **Models:**
1. **User:**
   - Stores user credentials (username, password) and profile details (avatar, description).
   - Passwords are hashed using `bcrypt`.
2. **Post:**
   - Represents a social media post with content, timestamp, and likes.
   - Linked to the user who created the post.
3. **Comment:**
   - Represents comments on posts, linked to the corresponding post and user.

#### **Controllers:**
1. **Authentication Controller:**
   - Handles user registration and login.
   - Verifies credentials using `bcrypt` and generates JWT tokens for session management.
2. **User Controller:**
   - Fetches user profiles and their related posts.
   - Allows users to update their profile (avatar and description) or delete their account.
3. **Post Controller:**
   - Implements CRUD operations for posts (Create, Read, Update, Delete).
   - Supports features like liking/unliking posts.
4. **Comment Controller:**
   - Handles fetching, creating, and deleting comments for specific posts.

#### **Routes:**
- `/api/auth`: Authentication routes (login, register).
- `/api/users`: User profile management routes.
- `/api/posts`: Post-related routes.
- `/api/comments`: Comment-related routes.

---

### Frontend Structure
#### **Pages:**
1. **HomePage:**
   - Displays all posts.
   - Allows users to create, delete, and interact with posts (like/unlike, comment).
2. **LoginPage:**
   - Provides user login and registration functionality.
3. **UserPage:**
   - Displays user-specific profile details, posts, and avatar management.
   - Includes an option to delete the account.

#### **Components:**
1. **Navbar:**
   - Provides navigation between HomePage, UserPage, and LoginPage.
2. **ErrorBoundary:**
   - Catches and displays errors gracefully during runtime.

---

### Features
#### **Backend:**
- User authentication with JWT.
- Full CRUD operations for posts and comments.
- Secure password hashing and validation.
- Cross-origin support with `cors`.

#### **Frontend:**
- Responsive design for desktop and mobile.
- Dynamic routing using `react-router-dom`.
- State management using React context.
- Error handling with `ErrorBoundary`.

---

## Part 3: Deployment
- **Frontend:** Deployed on Render.
- **Backend:** Deployed on Render.
- **Database:** Hosted on MongoDB Atlas.

---

## Part 4: Future Enhancements

To further improve the functionality and scalability of this application, the following features and optimizations are planned:

1. **Media Uploads:**
   - Allow users to upload images and videos in their posts, using cloud storage solutions like AWS S3 or Firebase Storage.

2. **Interactive Notifications:**
   - Implement real-time notifications for likes, comments, and new followers.

3. **Real-time Updates:**
   - Use WebSocket or similar technologies to provide real-time updates for posts, comments, and interactions.

4. **Caching Popular Data:**
   - Utilize Redis to cache popular posts and user data, improving response time for frequently accessed resources.

5. **Fuzzy Search:**
   - Implement a fuzzy search feature for posts and users, enabling better user experience when searching.

6. **Database Optimization:**
   - Optimize MongoDB queries by adding indexes on frequently queried fields and using aggregation pipelines.

7. **Analytics and Insights:**
   - Track user engagement and provide insights like most popular posts, top users, and activity trends.

8. **Dark Mode:**
   - Add a dark mode toggle for better user accessibility and experience.

These enhancements aim to make the application more interactive, scalable, and user-friendly.
