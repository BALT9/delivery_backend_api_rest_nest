# 🚀 Delivery System Backend

Backend de un sistema web de delivery para un único negocio (hamburguesería, cafetería o restaurante), desarrollado con **NestJS**, **TypeORM** y **PostgreSQL**.

Permite la gestión de productos, usuarios y pedidos con autenticación basada en JWT y control de roles (cliente y administrador).

---

## 📌 Tecnologías utilizadas

- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Bcrypt (encriptación de contraseñas)
- Class Validator / Class Transformer

---

## 🧩 Arquitectura del sistema

### 🔹 Entidades principales

- User
- Product
- Order
- OrderItem

---

## 🧑‍💻 Roles del sistema

### 👤 Cliente
- Registrarse
- Iniciar sesión
- Ver productos
- Agregar productos al carrito (frontend)
- Realizar pedidos
- Ver historial de pedidos

### 👑 Administrador
- Gestionar productos (CRUD)
- Ver todos los pedidos
- Cambiar estado de pedidos
- Gestionar stock

---

## 📦 Módulos principales

### 🔐 Auth
- Login con JWT
- Protección de rutas con guards
- Control de roles (ADMIN / CUSTOMER)

---

### 👤 Users
- Registro de usuarios
- Gestión de usuarios (admin)

---

### 🍔 Products
- Crear productos
- Editar productos
- Eliminar productos
- Actualizar stock
- Cambiar disponibilidad

---

### 📦 Orders
- Crear pedidos desde carrito
- Registrar Order + OrderItems
- Cálculo automático de total
- Descuento automático de stock
- Historial de pedidos por usuario
- Gestión de estados del pedido


---

## 🗄️ Modelo de base de datos

### USERS
- id (UUID)
- name
- email
- password
- role
- created_at

---

### PRODUCTS
- id (UUID)
- name
- description
- price
- image
- stock
- is_available
- created_at

---

### ORDERS
- id (UUID)
- user_id (FK)
- status
- total
- created_at

---

### ORDER_ITEMS
- id (UUID)
- order_id (FK)
- product_id (FK)
- quantity
- price (precio al momento de compra)
- subtotal

---

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación con JWT
- Protección de rutas con AuthGuard
- Control de acceso por roles (RolesGuard)

---

## 📡 Endpoints principales

### Auth
- POST `/auth/login`

### Users
- POST `/users` (admin)
- GET `/users` (admin)

### Products
- GET `/products`
- POST `/products` (admin)
- PATCH `/products/:id`
- DELETE `/products/:id`

### Orders
- POST `/orders` (cliente)
- GET `/orders/my-orders` (cliente)
- GET `/orders` (admin)
- GET `/orders/:id` (admin)
- PATCH `/orders/:id/status` (admin)

---

## 🛒 Carrito

El carrito **no se almacena en el backend**.

Se maneja en el frontend y se envía al backend al momento de realizar el pedido.

---

## ⚙️ Instalación

```bash
npm install
