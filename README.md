# 💰 Fintrack – Personal Finance Tracker

Fintrack is a backend-focused personal finance tracking application built using **Spring Boot**.  
It allows users to manage their **income and expenses**, view **transaction history**, and track their overall financial health through a simple dashboard.

This project is built with a **real-world backend architecture** and is being actively enhanced with **Spring Security, Docker, and cloud deployment** to make it production-ready.

---

## 🚀 Features

- ➕ Add income with backend validation  
- ➖ Add expenses with backend validation  
- 📊 View transaction history (income + expenses)  
- 📈 Dashboard summary for financial tracking  
- ❌ Prevents invalid values (negative income/expense)  
- 🧩 Clean layered architecture (Controller → Service → Repository)

---

## 🛠️ Tech Stack

- **Java 17**
- **Spring Boot**
- **Spring Data JPA (Hibernate)**
- **MySQL**
- **Maven**
- **HTML, CSS, JavaScript** (basic frontend)

---

## 🏗️ Project Structure

Fintrack

├── controller

├── service

├── repository

├── entity

├── exception

└── config (upcoming)


The project follows a clean and maintainable **layered architecture**, similar to production-grade Spring Boot applications.

---

## ⚙️ How to Run Locally

1. Clone the repository
```bash
git clone https://github.com/<your-username>/Fintrack.git

```
2. Configure MySQL database in application.properties

3. Run the application
```bash
mvn spring-boot:run
```
4. Open in browser
```bash
http://localhost:8080/
```

---

## 🔐 Security & Deployment (Coming Soon)

The project is currently under active development. Planned upgrades include:

🔐 Spring Security with JWT-based authentication

🐳 Dockerization using Docker & Docker Compose

☁️ Cloud deployment (Render / Railway / AWS)

👤 User-specific data isolation

These enhancements are being added incrementally with a clean commit history.

---

## 🎯 Why This Project

Fintrack is designed to demonstrate:

Strong Spring Boot fundamentals

Proper backend validation and error handling

Clean code and layered design

Real-world readiness with upcoming security and DevOps features

It serves as a resume-ready backend project showcasing practical skills expected from a Java/Spring Boot developer.

---

## 📌 Project Status

🚧 Active Development

New features and improvements are being added continuously.

---

## 🤝 Contributions

This is a personal learning project.
Suggestions and improvements are welcome.

## ⭐ If you find this project helpful or interesting, feel free to star the repository!
