# 🍳 CookEase – Smart Meal & Diet Recommendation App

CookEase is a smart mobile and web application designed to help users discover daily meal ideas and receive personalized diet recommendations based on their available ingredients and health metrics. The app aims to promote healthier eating habits by providing tailored meal suggestions with convenience and precision.

---

## 🚀 Features

### 1. 🥗 Daily Meal Recommendation
- Get meal suggestions based on ingredients you have at home.
- Add, edit, or delete ingredients.
- Generate and view reports on suggested meals.

### 2. 🍱 Personalized Diet Plans
- Create diet plans using personal health data: age, weight, height, medical conditions, and calorie targets.
- Country-specific food customization.
- Full CRUD operations for diet plans (create, read, update, delete).
- View generated plans through a dedicated UI (`GeneratedDiet.jsx`).

### 3. 👤 User Management
- Admin panel to manage users (Web only).
- CRUD operations for users.
- User authentication and profile management.

### 4. 📷 Ingredient Scanning
- Use Google Vision API to scan and recognize ingredients via camera or image upload.
- Seamless integration with the meal suggestion engine.

---

## 🛠️ Tech Stack

| Layer        | Technologies Used                         |
|--------------|--------------------------------------------|
| **Frontend** | React Native (Mobile), React (Web)         |
| **Backend**  | Node.js (Unifying logic for mobile/web)    |
| **Database** | Firebase Firestore                         |
| **AI/ML**    | Google Vision API (for ingredient scanning)|
| **State Mgmt**| Redux                                      |

---

## 📦 Project Structure (Simplified)

