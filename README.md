# Pantry Genius

Pantry Genius is an ultimate pantry management system that helps you keep track of your pantry items, manage inventory, and receive notifications for low stock and upcoming expiry dates.

## Features

- **User Authentication**: Secure login and signup with Google authentication.
- **Inventory Management**: Add, remove, and delete items in your pantry.
- **Notifications**: Receive pop-up notifications for items that are low in stock or nearing expiry.
- **Category Management**: Categorize items and filter by category.
- **Responsive Design**: Fully responsive design using Material-UI.
- **Demo Mode**: Explore the system with a demo pantry without signing up.

## Technologies Used

- **Next.js**: React framework for server-side rendering and generating static websites.
- **Firebase**: For authentication, Firestore database, and storage.
- **Material-UI**: For user interface components.
- **JavaScript**: Programming language used for development.
- **CSS**: Styling the application.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- Firebase Project Setup

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/pantry-genius.git
cd pantry-genius

2. Install dependencies
```bash
Copy code
npm install

3. Set up Firebase
Create a Firebase project in the Firebase Console.
Copy the Firebase configuration and replace it in the firebase.js file.
javascript
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };

4. Running the Application
Start the development server
```bash
npm run dev

5. Open http://localhost:3000 with your browser to see the result.

### Project Structure
.
├── app
│   ├── components
│   │   ├── Navbar.jsx
│   │   └── ...
│   ├── context
│   │   └── AuthContext.js
│   ├── layout.js
│   └── ...
├── firebase.js
├── public
│   └── ...
├── page.js
├── .gitignore
├── README.md
├── package.json
└── ...

## Usage

### Authentication
Login with Google: Use the Google authentication button to sign in.
Logout: Use the logout button to sign out.

### Inventory Management
- Add Item: Use the add item form to add new items to your pantry.
- Remove Item: Use the remove button next to each item to remove it from your pantry.
- Delete Item: Use the delete button next to each item to permanently delete it.

### Notifications
- Low Stock: Receive notifications when items are running low.
- Expiry Date: Receive notifications for items nearing their expiry date.

### Category Management
- Add Category: Use the category management section to add new categories.
- Filter by Category: Filter items by selecting a category.

## Contributing
Contributions are welcome! Please create an issue or submit a pull request.
