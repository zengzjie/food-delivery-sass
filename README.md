## 文档

- [中文文档](README.md)
- [English Version](README.en.md)

---

# 食品配送 SaaS 平台

一个现代化、可扩展且功能丰富的食品配送平台，采用最先进的技术构建。本项目旨在为食品配送业务提供 SaaS（软件即服务）解决方案，涵盖客户端和服务端功能。

---

## 功能特性

### 🌟 客户端（用户界面）

- **响应式设计**：完全响应式的用户界面，适配移动端、平板和桌面设备。
- **本地化支持**：支持多语言，基于动态路由的本地化功能。
- **动态主页**：包含视觉吸引力的主页介绍部分，展示统计信息和行动按钮。
- **用户认证**：
  - 集成 Google OAuth，实现无缝登录。
  - 基于 JWT 的会话管理。
- **订单管理**：
  - 实时订单跟踪。
  - 订单历史和详情页面。
- **支付集成**：
  - 安全的支付网关集成（如 Stripe、PayPal）。
  - 支持多种支付方式（信用卡、数字钱包等）。
- **通知系统**：
  - 推送通知，用于订单更新。
  - 邮件通知，用于订单确认和促销活动。
- **可复用组件**：
  - 可定制的按钮组件，支持多种样式和尺寸。
  - 用于合并和管理样式的实用函数。

### 🔧 服务端

- **用户认证**：
  - 集成 Google OAuth，支持令牌刷新。
  - 自定义 Prisma 适配器，用于加密密码和用户头像管理。
  - 会话回调，丰富会话数据，提供用户特定的详细信息。
- **数据库集成**：
  - 使用 Prisma ORM 进行数据库操作。
  - 全局 Prisma 客户端实例，优化数据库连接。
- **订单管理**：
  - 提供创建、更新和检索订单的 API。
  - 使用 WebSockets 实现实时订单状态更新。
- **支付处理**：
  - 与第三方支付网关集成，安全处理支付。
  - 支持支付状态更新的 Webhook。
- **通知系统**：
  - 提供邮件和推送通知服务。
  - 可配置的通知模板，用于不同事件。
- **GraphQL 网关**：
  - 使用 Apollo Gateway 实现 API 聚合。
  - 基于子图架构的模块化 GraphQL 服务。

---

## 技术栈

### 🖥️ 前端

- **框架**：
  - [Next.js](https://nextjs.org/) 15，支持 App Router 和 Server Components。
  - React 19，用于构建可复用组件。
- **样式**：
  - Tailwind CSS，用于快速开发用户界面。
  - `clsx` 和 `tailwind-merge`，用于管理类名。
- **状态管理**：
  - Zustand，用于轻量级状态管理。
- **表单处理**：
  - React Hook Form，用于表单验证和管理。
- **实用工具**：
  - `lucide-react`，用于图标。
  - `react-hot-toast`，用于通知。

### 🛠️ 后端

- **框架**：
  - 使用 Prisma ORM 的 Node.js，用于数据库操作。
  - NestJS，用于构建可扩展的服务端应用。
- **GraphQL**：
  - Apollo Gateway 和 Subgraph，用于 API 聚合。
  - GraphQL Query Complexity，用于查询优化。
- **用户认证**：
  - Passport.js 和 JWT，用于安全认证。
  - Google OAuth，用于第三方登录。
- **缓存**：
  - Redis，用于缓存和会话管理。
- **邮件服务**：
  - 使用 Nodemailer 和 EJS 模板发送邮件通知。
- **实时通信**：
  - 使用 WebSockets 实现实时更新。

### 🗄️ 数据库

- **关系型数据库**：
  - 使用 Prisma ORM，支持 PostgreSQL、MySQL 和 SQLite。
- **模式管理**：
  - 使用 Prisma 迁移工具更新数据库模式。

---

## 快速开始

### 前置条件

- Node.js（版本 18 或更高）
- 一个关系型数据库（如 PostgreSQL、MySQL）
- Google OAuth 凭据

### 安装步骤

1. 克隆代码库：

   ```bash
   git clone https://github.com/zengzjie/food-delivery-sass.git
   cd food-delivery-sass
   ```

2. 安装依赖：

   ```bash
   pnpm install
   ```

3. 配置环境变量：

   - 复制 `.env.example` 文件，并填写相应的变量值。

4. 运行数据库迁移：

   [如何迁移现有数据以匹配 Prisma 模式](https://zhuanlan.zhihu.com/p/568353578)

   ```bash
   pnpm run prisma:generate
   pnpm run prisma:push
   ```

5. 启动开发服务器：
   ```bash
   pnpm run dev --port 6001
   ```

---

## 许可证

本项目基于 [MIT License](LICENSE) 许可。
