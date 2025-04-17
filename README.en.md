## Documentation

[ZH-CN](README.md) | [EN](README.en.md)

---

# Food Delivery SaaS

A modern, scalable, and feature-rich food delivery platform built with cutting-edge technologies. This project is designed to serve as a SaaS (Software as a Service) solution for food delivery businesses, providing both client-facing and server-side functionalities.

---

## Features

### 🌟 Client-Side (User Interface)

- **Responsive Design**: Fully responsive UI optimized for mobile, tablet, and desktop devices.
- **Localization**: Multi-language support with dynamic locale-based routing.
- **Dynamic Home Page**: Includes a visually appealing home introduction section with statistics and call-to-action buttons.
- **Authentication**:
  - Google OAuth integration for seamless login.
  - Session management with JWT-based authentication.
- **Order Management**:
  - Real-time order tracking for users.
  - Order history and details page.
- **Payment Integration**:
  - Secure payment gateway integration (e.g., Stripe, PayPal).
  - Support for multiple payment methods (credit card, digital wallets, etc.).
- **Notifications**:
  - Push notifications for order updates.
  - Email notifications for order confirmations and promotions.
- **Reusable Components**:
  - Customizable button components with multiple variants and sizes.
  - Utility functions for class merging and styling.

### 🔧 Server-Side

- **Authentication**:
  - Google OAuth integration with token refresh support.
  - Custom Prisma adapter for user creation with encrypted passwords and avatar management.
  - Session callbacks to enrich session data with user-specific details.
- **Database Integration**:
  - Prisma ORM for database operations.
  - Global Prisma client instance to optimize database connections.
- **Order Management**:
  - APIs for creating, updating, and retrieving orders.
  - Real-time order status updates using WebSockets.
- **Payment Processing**:
  - Secure payment handling with third-party payment gateways.
  - Webhook support for payment status updates.
- **Notification System**:
  - Email and push notification services.
  - Configurable notification templates for different events.
- **GraphQL Gateway**:
  - Apollo Gateway for API aggregation.
  - Subgraph architecture for modular GraphQL services.

---

## Technology Stack

### 🖥️ Frontend

- **Frameworks**:
  - [Next.js](https://nextjs.org/) 15 with App Router and Server Components.
  - React 19 for building reusable components.
- **Styling**:
  - Tailwind CSS for rapid UI development.
  - `clsx` and `tailwind-merge` for class name management.
- **State Management**:
  - Zustand for lightweight state management.
- **Form Handling**:
  - React Hook Form for form validation and management.
- **Utilities**:
  - `lucide-react` for icons.
  - `react-hot-toast` for notifications.

### 🛠️ Backend

- **Frameworks**:
  - Node.js with Prisma ORM for database operations.
  - NestJS for building scalable server-side applications.
- **GraphQL**:
  - Apollo Gateway and Subgraph for API aggregation.
  - GraphQL Query Complexity for query optimization.
- **Authentication**:
  - Passport.js and JWT for secure authentication.
  - Google OAuth for third-party login.
- **Caching**:
  - Redis for caching and session management.
- **Email Services**:
  - Nodemailer with EJS templates for email notifications.
- **Real-Time Communication**:
  - WebSockets for live updates.

### 🗄️ Database

- **Relational Database**:
  - Prisma ORM with support for MongoDB、PostgreSQL、MySQL or SQLite.
- **Schema Management**:
  - Prisma migrations for database schema updates.

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- A relational database (e.g., MongoDB、PostgreSQL, MySQL)
- Google OAuth credentials

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zengzjie/food-delivery-sass.git
   cd food-delivery-sass
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   - Copy the `.env.example` file and create files named `.env.development` and `.env.production`, and fill in the corresponding variable values.

4. Run database migrations:

   [How to migrate existing data to match the Prisma schema](https://zhuanlan.zhihu.com/p/568353578)

   ```bash
   pnpm run prisma:generate
   pnpm run prisma:push
   ```

5. Start the development server:
   ```bash
   pnpm run dev --port 6001
   ```

---

## License

This project is licensed under the [MIT License](LICENSE).
