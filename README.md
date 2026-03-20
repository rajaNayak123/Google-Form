# Google Forms Clone

A full-stack application that replicates the core functionality of Google Forms, allowing users to create custom forms, manage questions, and collect responses.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify

### Backend
- **Framework**: Spring Boot 3.2.3
- **Language**: Java 17
- **Database**: MongoDB
- **Build Tool**: Maven
- **Utilities**: Lombok

## 🛠️ Project Structure

The project is organized into a decoupled frontend and backend architecture:

- **`/backend`**: A Spring Boot application providing a RESTful API for form management and response storage.
- **`/frontend`**: A React application for the administrative dashboard (Form Builder) and the public-facing form views.

## ⚙️ Configuration & Setup

### Backend Setup (`/backend`)
The backend communicates with a MongoDB database and handles cross-origin requests from the frontend.

1.  **Database**: The application is configured to connect to a MongoDB instance named `gforms`.
2.  **Environment**: Update `src/main/resources/application.properties` with your connection string:
    ```properties
    spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster.mongodb.net/gforms
    ```
3.  **Run**:
    ```bash
    ./mvnw spring-boot:run
    ```
    *The server will start on port **8080**.*

### Frontend Setup (`/frontend`)
The frontend includes a development proxy to seamlessly route API requests to the backend.

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run Development Server**:
    ```bash
    npm start
    ```
    *The app will be available at [http://localhost:3000](http://localhost:3000).*

## 📖 Key Features

- **Form Builder**: Dynamic interface to create and edit form questions.
- **Response Tracking**: View and manage submissions for each form.
- **Public Links**: Generates shareable links for users to submit responses.
- **Responsive Design**: Built with Tailwind CSS for compatibility across devices.

## 📜 Available Scripts

### Frontend
- `npm start`: Runs the app in development mode.
- `npm run build`: Bundles the app for production.
- `npm test`: Launches the test runner.

### Backend
- `./mvnw clean install`: Builds the project and installs dependencies.
- `./mvnw spring-boot:run`: Launches the Spring Boot application.
