# Microservices Architecture Overview

This project consists of multiple microservices, each responsible for specific business domains and functionalities. The services are designed to communicate efficiently to deliver a seamless overall system.

---

## Services and Their Responsibilities

### 1. **analytics-service (Python / FastAPI)**
- Responsible for collecting, processing, and analyzing application data.
- Provides analytical insights, reporting, and metrics.
- Consumes events or data from other services to generate statistics and dashboards.
- Exposes REST API endpoints for querying analytics data.

### 2. **frontend (Next.js)**
- The main user-facing client application.
- Implements UI/UX and handles user interactions.
- Communicates with backend services via REST or GraphQL APIs.
- Handles authentication, navigation, and presentation logic.

### 3. **notification-service (NestJS)**
- Manages all notifications (email, SMS, push notifications).
- Listens for events from other services (e.g., order placed, user registered).
- Sends notifications asynchronously using queues or event buses.
- Provides API endpoints for managing notification preferences.

### 4. **order-service (Laravel)**
- Manages order lifecycle including creation, updating, and status tracking.
- Responsible for business logic related to orders and payments.
- Communicates with `product-service` for inventory checks.
- Emits events when orders are placed or updated (e.g., to notification-service or analytics-service).

### 5. **product-service (NestJS)**
- Manages product catalog, inventory, and pricing.
- Provides APIs to query product details and availability.
- Communicates with `order-service` for stock reservations and updates.
- Emits product update events consumed by other services.

### 6. **user-service (Go / Gin)**
- Handles user management, authentication, and authorization.
- Stores user profiles and credentials.
- Provides secure APIs for user-related operations.
- Emits user lifecycle events (e.g., user registered, updated).

---

## Communication Between Services

- **Frontend** interacts primarily with:
  - `user-service` for authentication and user data.
  - `order-service` for placing and managing orders.
  - `product-service` to display product catalog.
  - `analytics-service` for dashboard and insights.

- **Backend services communicate asynchronously and synchronously:**
  - `order-service` requests inventory checks from `product-service`.
  - `order-service` emits events (e.g., order created) consumed by `notification-service` and `analytics-service`.
  - `user-service` emits user-related events consumed by `notification-service` and `analytics-service`.
  - `notification-service` listens to events from `order-service` and `user-service` to send notifications.
  - `analytics-service` collects events/data from all relevant services to build metrics and reports.

- **Communication methods:**
  - RESTful HTTP APIs for direct service-to-service calls.
  - Event-driven communication via message queues or pub/sub (e.g., Kafka, RabbitMQ) for asynchronous notifications and analytics updates.

---

## Basic Flow of the Full Application

1. **User Registration & Login**
   - User registers or logs in through the **frontend**.
   - `frontend` calls `user-service` APIs to handle authentication and user data.
   - `user-service` emits user registration/login events.

2. **Browsing Products**
   - The `frontend` requests product data from `product-service`.
   - `product-service` returns product catalog and availability.

3. **Placing an Order**
   - User places an order via the `frontend`.
   - `frontend` sends order data to `order-service`.
   - `order-service` checks inventory by calling `product-service`.
   - If stock is available, `order-service` creates the order and updates inventory via `product-service`.
   - `order-service` emits order-created events.

4. **Notification**
   - `notification-service` listens for order and user events.
   - Sends order confirmation and other notifications to users asynchronously.

5. **Analytics**
   - `analytics-service` consumes events from `user-service`, `order-service`, and `product-service`.
   - Aggregates data to generate reports, dashboards, and metrics accessible via frontend or API.

6. **Continuous Interaction**
   - Users continue browsing, ordering, and interacting.
   - Backend services coordinate asynchronously to maintain consistency and provide real-time feedback.

---

## Summary

| Service              | Responsibility                        | Communication                                  |
|----------------------|------------------------------------|------------------------------------------------|
| analytics-service    | Data analytics and reporting       | Consumes events asynchronously                  |
| frontend             | User interface and interaction     | REST API calls to backend services              |
| notification-service | Sends notifications                | Consumes events asynchronously                   |
| order-service        | Order management                   | REST calls + event emission                       |
| product-service      | Product catalog and inventory      | REST calls + event emission                       |
| user-service         | User management and authentication | REST API + event emission                         |

---

## Getting Started

Each service runs independently and can be developed, deployed, and scaled separately. Services communicate over the network using the defined API contracts and event messages.

---

Feel free to reach out for more detailed setup instructions or service-specific documentation!
