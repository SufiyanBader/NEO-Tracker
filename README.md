# NEO Tracker

<img width="1900" height="621" alt="Screenshot 2025-08-20 172317" src="https://github.com/user-attachments/assets/50a584bb-446e-4ba2-8f51-23ca57783828" />

---





<img width="1889" height="535" alt="Screenshot 2025-08-20 172639" src="https://github.com/user-attachments/assets/f0c4cd39-decb-4658-b28b-41d4220e8783" />

---




<img width="1901" height="752" alt="image" src="https://github.com/user-attachments/assets/7cd77787-cd46-447a-87aa-643ae886c1f3" />

---




<img width="1893" height="895" alt="image" src="https://github.com/user-attachments/assets/85d1ce1f-fd30-4033-9561-6b3b37296faa" />

---




<img width="1895" height="932" alt="image" src="https://github.com/user-attachments/assets/a1c8b2bd-35ba-4d22-b514-999450a9cddf" />

---




## 🌌 Project Overview

The **NEO Tracker** is a modern web application designed to track and visualize data about Near-Earth Objects (NEOs), such as asteroids and comets. Built as a hands-on project to demonstrate modern web development and DevOps practices, this application provides users with powerful tools to explore celestial data. It's built with a focus on a clean, professional user interface, robust data handling, and is structured for easy deployment.

---

## ✨ Key Features

* **Dynamic Dashboard**: A real-time dashboard displaying key statistics about NEOs, including the total number of asteroids, potentially hazardous objects, and other critical metrics.

* **Search Functionality**: Users can search for asteroids within a specific 7-day date range, retrieving a list of objects that were tracked during that period.

* **Real-Time Data**: A dedicated "Real-Time" tab that fetches and displays the most current asteroid data for the present day.

* **Asteroid Lookup**: A lookup feature that allows users to search for a specific asteroid by its unique NASA JPL ID and view its complete details.

* **Detailed Information**: Clicking on any asteroid provides a comprehensive view of its physical properties, orbital data, and close approach details.

* **Persistent Search History**: The application saves the last five search queries to local storage, allowing for quick and convenient access to previous searches.

* **Professional UI/UX**: The user interface is built with **React** and styled using **Tailwind CSS**, providing a responsive and visually appealing experience across all devices.

---

## 🚀 Technology Stack

* **Frontend**: React (with Vite)

* **Styling**: Tailwind CSS, Lucide React (for icons)

* **Data Visualization**: Recharts for charts and graphs

* **API**: NASA's Near-Earth Object Web Service (NeoWs) API

* **State Management**: React Hooks (`useState`, `useEffect`)

---

## 🔧 Getting Started

### Prerequisites

* Node.js (LTS version recommended)

* npm (comes with Node.js)

### Installation

1.  **Clone the repository:**

    ```
    git clone [https://github.com/](https://github.com/)<YOUR_GITHUB_USERNAME>/nasa-neo-tracker.git
    cd nasa-neo-tracker
    ```

2.  **Install project dependencies:**

    ```
    npm install
    ```

3.  **Run the development server:**

    ```
    npm run dev
    ```

The application will be available at `http://localhost:5173` (or another port if specified by Vite).

---

## 🌍 API Configuration

This project uses the NASA NEO API. The API key is included in the code as a string variable. For a production environment, it is highly recommended to secure this key by using environment variables or a backend proxy service.

---

## 📄 License

This project is open-source and available under the MIT License.



