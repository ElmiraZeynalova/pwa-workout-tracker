<div align="center">

<img src="frontend/src/assets/logo.png" alt="Forge" width="80" /> 
<h1 style="display:inline">Forge</h1>

Forge is an offline-first workout tracking PWA built with React, TypeScript, Node.js, and PostgreSQL. It supports local data storage, cross-device synchronization, authentication, and installable PWA functionality.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-orange?style=for-the-badge&logo=vercel)](https://pwa-workout-tracker-2ymf.vercel.app/landing)

<br/>

![Preview](frontend/screenshots/preview2.png)

</div>

---

## ✨ Features

* 📋 **Workout Logging** — Log exercises with sets, reps, and weight
* 🗓️ **Workout History** — Browse training history through an interactive calendar
* 💪 **Routines** — Create, edit, and start reusable workout templates
* 📲 **Progressive Web App** — Installable on mobile and desktop with offline support
* ✈️ **Offline-First Data** — Workout data remains available without an internet connection
* 🔄 **Cross-Device Sync** — Synchronize locally stored workouts with the backend when connectivity is restored
* 🔐 **Authentication** — JWT authentication with short-lived access tokens and rotating refresh tokens stored in HTTP-only cookies
* 📱 **Responsive UI** — Mobile-first workout logging with desktop support for history and routine management

> 💡 **Desktop** is a companion experience — view history and manage routines. Workout logging is optimized for mobile.

---

## 🧩 Technical Highlights

* Designed an **offline-first data flow** using IndexedDB as the local source of data with background synchronization to the backend.
* Implemented **cross-device synchronization** between local client data and PostgreSQL.
* Built a REST API with **Node.js and Express** and integrated PostgreSQL through Prisma.
* Implemented **JWT-based authentication** with short-lived access tokens, rotating refresh tokens, HTTP-only cookies, and server-side session storage.
* Added automatic access token renewal through Axios interceptors when the access token expires.
* Added **PWA support** with service worker caching and installability.
* Handled online/offline transitions and synchronization of locally created and modified workout data.
* Used **TypeScript** across the frontend and backend to improve type safety.

---

## 🛠️ Tech Stack

| Technology                  | Purpose                               |
| --------------------------- | ------------------------------------- |
| **React 19 + TypeScript**   | Frontend UI                           |
| **Vite**                    | Frontend build tool                   |
| **CSS**                     | Styling and responsive UI             |
| **Zustand**                 | Client-side state management          |
| **IndexedDB**               | Local storage for offline-first data  |
| **vite-plugin-pwa**         | Service worker and PWA functionality  |
| **Node.js + Express**       | REST API backend                      |
| **Prisma**                  | ORM and database access               |
| **PostgreSQL (Supabase)**   | Persistent database                   |
| **JWT + HTTP-only Cookies** | Authentication and session management |
| **Vercel / Render**         | Frontend / backend deployment         |

