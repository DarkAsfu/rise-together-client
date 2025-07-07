# 🌍 Rise Together (Online Crowdfunding System)

**Rise Together** is a modern, transparent, and secure crowdfunding platform designed to empower disaster-affected communities in Bangladesh and beyond. Built with the **MERN Stack**, it connects donors, NGOs, local authorities, and victims on a single platform to ensure **rapid fundraising, fund distribution, and community support during natural disasters**.

This repository contains the **frontend** source code built using **Next.js**, styled with **Tailwind CSS**, and designed to provide a **seamless user experience** across all devices.

---

## 📌 Table of Contents

- [🌍 Rise Together (Online Crowdfunding System)](#-rise-together-online-crowdfunding-system)
  - [📌 Table of Contents](#-table-of-contents)
  - [🛠️ Installation \& Project Setup](#️-installation--project-setup)
    - [1. Fork the Repository (Optional)](#1-fork-the-repository-optional)
    - [2. Clone the Repository](#2-clone-the-repository)
    - [3. Install Dependencies](#3-install-dependencies)
    - [4. Configure Environment Variables](#4-configure-environment-variables)
    - [5. Run the Development Server](#5-run-the-development-server)
  - [🧭 Introduction](#-introduction)
  - [🔍 Key Problems](#-key-problems)
  - [✅ Solution](#-solution)
  - [🌟 Unique Features](#-unique-features)
  - [🔧 System Overview](#-system-overview)
  - [💞 Social Impact](#-social-impact)
  - [⚙️ Tech Stack](#️-tech-stack)
    - [Frontend:](#frontend)
  - [✨ Frontend Features](#-frontend-features)
  - [🖼️ Screenshots](#️-screenshots)
    - [🏠 Homepage](#-homepage)
    - [📋 Campaign Details Page](#-campaign-details-page)
    - [💳 Donation Modal](#-donation-modal)
    - [🧍 Admin Dashboard](#-admin-dashboard)
    - [🛠️ Fundraiser Panel](#️-fundraiser-panel)
  - [🛠️ Installation](#️-installation)
    - [1. Prerequisites](#1-prerequisites)
    - [2. Clone the Repository](#2-clone-the-repository-1)
    - [3. Install Dependencies](#3-install-dependencies-1)
    - [4. Environment Variables](#4-environment-variables)
    - [5. Run the Development Server](#5-run-the-development-server-1)
    - [6. Build for Production (Optional)](#6-build-for-production-optional)

---

## 🛠️ Installation & Project Setup

Follow these steps to set up the project locally from GitHub:

### 1. Fork the Repository (Optional)
If you want to contribute, first fork this repository to your own GitHub account.

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/rise-together.git
cd rise-together
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory and add the required environment variables:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_KEY=6596fff948fdca8b4049937fcd8c96a3
```

### 5. Run the Development Server
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).


---

## 🧭 Introduction

> "**Rise Together** bridges the gap between donors, organizations, and disaster-affected communities."

In the face of natural disasters, communities often lack a unified, transparent platform for raising and distributing relief funds. **Rise Together** addresses these challenges by providing a secure, scalable, and transparent system that ensures aid reaches those who need it the most—quickly and reliably.

---

## 🔍 Key Problems

- ❌ No centralized platform for emergency fundraising in Bangladesh
- ❌ Lack of transparency and trust in current donation models
- ❌ Delayed fund disbursement and inefficient resource allocation
- ❌ Limited coordination among donors, NGOs, and local responders
- ❌ No real-time reporting or campaign verification

---

## ✅ Solution

**Rise Together** provides a one-stop platform that:
- Verifies each fundraiser through a documentation and approval system
- Tracks every donation and campaign progress in real time
- Enables volunteers to join and contribute to disaster relief tasks
- Provides a dashboard for donors and campaigners
- Supports withdrawal requests with admin approval

---

## 🌟 Unique Features

- 🔐 **Secure Authentication**
- 💳 **Real-Time Donations**
- 🧾 **Fundraiser Verification**
- 🔄 **Withdrawal Requests**
- 📢 **Campaign Updates**
- 📊 **Impact Dashboard**
- 👥 **Volunteer Management**

---

## 🔧 System Overview

- 👤 **User Flow:**
  - Register / Login
  - Explore Campaigns
  - → Donate to campaigns  
  - → Or start your own campaign

- 🧑‍🤝‍🧑 **Volunteer Flow:**
  - Apply to become a volunteer
  - Admin assigns tasks
  - Volunteer completes and updates task status

- 🧾 **Fundraiser Flow:**
  - Request to become a fundraiser with documentation
  - Admin reviews and approves
  - Launch verified campaign
  - Request withdrawal with proof
  - Admin verifies and approves release of funds
## 💞 Social Impact

- Builds trust between donors and recipients
- Accelerates disaster response in under-resourced areas
- Raises awareness of local humanitarian issues
- Encourages youth and student involvement
- Promotes scalable disaster-relief models

---

## ⚙️ Tech Stack

### Frontend:
- **Next.js**
- **Tailwind CSS**
- **Shadcn Ui**
- **Axios**
- **Framer Motion**
- **SSlCOMMERZ**

---

## ✨ Frontend Features

- 🎨 Responsive and modern UI
- 🔐 Protected user roles
- 📃 Campaign pages with updates
- 💸 Donation modal
- 🧾 Withdrawal request system
- 🧑‍🤝‍🧑 Volunteer dashboard
- 📥 Fundraiser application
- 📈 Impact dashboard (coming soon)

---

## 🖼️ Screenshots

> Showcase of the user interface and key pages of the platform.

### 🏠 Homepage
![screencapture-rise-together-client-vercel-app-2025-05-17-22_33_09](https://github.com/user-attachments/assets/f28cb983-d7d5-40fa-b82d-e0624ce5bda4)

### 📋 Campaign Details Page
![screencapture-rise-together-client-vercel-app-campaign-68176df68b21964d84eee49a-2025-05-17-22_34_50](https://github.com/user-attachments/assets/42e10694-12f0-4a24-b12d-6af727e1b0b4)


### 💳 Donation Modal
![image](https://github.com/user-attachments/assets/7eb7bc63-f9c7-46e0-9485-ba72472cda03)
![image](https://github.com/user-attachments/assets/9216c328-e725-4b9b-b534-84fe6a0f5bbb)


### 🧍 Admin Dashboard
![image](https://github.com/user-attachments/assets/880e9fb5-c6fe-4232-a870-f005e426c9d6)
![image](https://github.com/user-attachments/assets/7dfb68dc-3c54-4406-b726-0c98d60345b6)


### 🛠️ Fundraiser Panel
![image](https://github.com/user-attachments/assets/d742bff5-dba8-48de-bede-532370773d7b)
![image](https://github.com/user-attachments/assets/7a6a144f-2452-463b-9518-7998bc389502)

---

## 🛠️ Installation

Follow these steps to set up and run the project locally:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- (Optional) [Git](https://git-scm.com/) for cloning the repository

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/rise-together.git
cd rise-together
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env.local` file in the root directory and add the required environment variables. Example:
```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
# Add other environment variables as needed
```

### 5. Run the Development Server
```bash
npm run dev
```

The app should now be running at [http://localhost:3000](http://localhost:3000).

### 6. Build for Production (Optional)
```bash
npm run build
npm start
```


