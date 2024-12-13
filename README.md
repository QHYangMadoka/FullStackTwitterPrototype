# Social Media App

## Part 1: Overview

### Technologies and Packages Used

**Backend:**
- **Framework:** Node.js with Express
- **Database:** MongoDB (hosted on MongoDB Atlas)
- **Packages:**
  - `mongoose`: For database operations
  - `express`: To handle routing and middleware
  - `bcrypt`: For password hashing
  - `dotenv`: To manage environment variables
  - `cors`: To handle cross-origin requests
  - `body-parser`: To parse incoming request bodies

**Frontend:**
- **Framework:** React
- **Build Tool:** Vite
- **Packages:**
  - `react-router-dom`: For routing between pages
  - `prop-types`: For type-checking React props
  - `vite`: To bundle the app for production

### URLs
- **Frontend:** [https://qhmadoka-twitterapp.onrender.com](https://qhmadoka-twitterapp.onrender.com)
- **Backend:** [https://qhmadoka-twitterapp-backend.onrender.com](https://qhmadoka-twitterapp-backend.onrender.com)

---

## Part 2: User Guide

### How to Use

1. Visit the frontend URL to access the app.
2. **Login:** Use the default user `Alice` with the password `Password123` to log in.
3. **View Posts:** View all existing posts on the homepage.
4. **Create Posts:** Once logged in, create a post by typing content in the text box and clicking "Post."
5. **Delete Posts:** Logged-in users can delete their own posts.
6. **Search Posts:** Use the search functionality to filter posts based on keywords.
7. **Edit Profile Description:** Logged-in users can update their profile description, which will persist across sessions.
8. **Navigate:** Use the navbar to switch between pages (Home and Profile).

### Features Implemented
- User authentication (login/logout)
- Post creation and deletion
- Profile description update and persistence
- Posts search functionality
- Fully responsive frontend design

---

## Part 3: Reflection

### Challenges Faced
- **Cross-Origin Resource Sharing (CORS):** Configuring CORS to allow frontend-backend communication without errors was a significant challenge, especially with the deployment on Render.
- **Deployment:** Ensuring both the frontend and backend were correctly deployed and configured for production took time, particularly when handling environment variables and API base URLs.
- **State Management:** Managing user authentication and ensuring data consistency across components required careful handling of React’s `useContext` and `useState` hooks.

### Additional Features with More Time
- **File Uploads:** Allowing users to upload profile pictures or images with their posts.
- **Real-Time Updates:** Implementing WebSockets to update posts and user data in real-time.
- **Enhanced Search:** Adding filters for date, user, or hashtags.
- **Pagination:** Improving performance by implementing pagination for posts.
- **Dark Mode:** Adding a dark mode toggle for better user experience.

### Assumptions Made
- Default credentials (`Alice` and `Password123`) were assumed to be sufficient for testing.
- Users only delete their own posts.
- Security measures like HTTPS, input sanitization, and advanced error handling are outside the scope of this assignment but are crucial for production.
- The app will only handle text-based posts without file uploads.

### Time Taken
This assignment took approximately **30 hours** to complete, including:
- Initial setup and local development: 10 hours
- Backend and database integration: 8 hours
- Frontend implementation: 7 hours
- Deployment and debugging: 5 hours

