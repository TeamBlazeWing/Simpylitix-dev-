# SimplyTix - Online Ticket Booking Platform

SimplyTix is a modern web application for seamless online event ticket booking. Users can register, browse events, enroll, purchase tickets, and receive instant notifications and e-tickets. Event organizers can easily manage attendees and verify tickets at the event.

---

## Features

- **User Registration & Login**: Sign up or log in using your email or phone number.
- **Dashboard**: Personalized dashboard after login to manage your events and tickets.
- **Event Browsing**: Explore a variety of events and select those you are interested in.
- **Event Enrollment**: Enroll in events with a single click.
- **Notifications**: Receive real-time updates from event organizers.
- **Online Ticket Purchase**: Buy tickets securely online. After payment, receive your ticket instantly.
- **E-Ticket Delivery**: Get your ticket copy via email for convenience and safety.
- **Event Day Verification**: Organizers can verify tickets using the attendee's email, making entry fast and easy.
- **User-Friendly Interface**: Clean, modern, and responsive design for all devices.

---

## How It Works

1. **Sign Up / Login**
   - Register using your email or phone number.
   - Secure authentication and easy access.

2. **Dashboard**
   - Access your personalized dashboard to view enrolled events and purchased tickets.

3. **Browse & Enroll in Events**
   - Browse available events.
   - Enroll in events you are interested in.

4. **Buy Tickets**
   - Select an event and purchase tickets online.
   - Complete payment securely.
   - Receive your e-ticket instantly and a copy in your email.

5. **Event Day**
   - Show your e-ticket (from email or app) at the event.
   - Organizers verify your ticket using your email for quick entry.

---

## Screenshots

Below are screenshots of each page for a better understanding of the user experience:

- **Login Page**
  ![Login Page](Screenshots/login.png)
- **Signup Page**
  ![Signup Page](Screenshots/signup.png)
- **Dashboard**
  ![Dashboard](Screenshots/dashboard.png)
- **Event List**
  ![Event List](screenshots/Event.png)
- **Event Details**
  ![Event Details](screenshots/event_data.png)
- **Ticket Purchase**
  ![Ticket Purchase](screenshots/buy_tickets.png)
- **Tickets Page**
  ![Tickets Page](Screenshots/tickets.png)
- **Notifications**
  ![Notifications](screenshots/notifications.png)
- **E-Ticket Email**
  ![E-Ticket Email](screenshots/email-ticket.png)

---

## Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/TeamBlazeWing/Simpylitix-dev-.git
   cd Simpylitix-dev-
   ```

2. **Backend Setup**
   - Go to the `Backend/` folder.
   - Install dependencies:
     ```sh
     npm install
     ```
   - Create a `.env` file (see `.env.example` or ask the admin for credentials).
   - Start the backend server:
     ```sh
     npm start
     ```

3. **Frontend Setup**
   - Go to the `Frontend/` folder.
   - Install dependencies:
     ```sh
     npm install
     ```
   - Start the frontend app:
     ```sh
     npm run dev
     ```

4. **Access the App**
   - Open your browser and go to `http://localhost:5173` (or the port shown in your terminal).

---

## Sample .env Structure

Create a `.env` file in the `Backend/` folder with the following structure:

```env
# MongoDB connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT secret for authentication
JWT_SECRET=your_jwt_secret_key

# Server port
PORT=3000

# MSPACE API credentials (if used)
MSPACE_APP_ID=your_mspace_app_id
MSPACE_PASSWORD=your_mspace_password
MSPACE_API_BASE=https://api.mspace.lk

# Cloudinary credentials (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
```

Refer to `.env.example` for a template.

---

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT
- **Email**: Nodemailer/Cloud service
- **Payments**: Integrated payment gateway

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
This project is licensed under the MIT License.

---

## Contact
For support or business inquiries, contact the project maintainers via GitHub Issues or email.

---

Enjoy fast, secure, and easy event ticket booking with SimplyTix!
