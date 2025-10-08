# 🧰 Backend Setup Guide

Este proyecto usa **NestJS**, **Mongoose**, **Socket.IO** y **dotenv** para manejar entornos.

## 📦 Requisitos Previos

- Node.js >= 20
- npm >= 10
- MongoDB en ejecución local o en la nube (Atlas)

---

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Crear los archivos .env
cp .env.example .env
cp .env.example .env.production
```

---

## ⚙️ Variables de Entorno

El backend requiere un archivo `.env` (para desarrollo) y `.env.production` (para producción).

### Ejemplo `.env`

```bash
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/kanban
CORS_ORIGIN=http://localhost:5173
```

### Ejemplo `.env.production`

```bash
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/kanban
CORS_ORIGIN=https://tudominio.com
```

---

## 🧩 Scripts

| Comando | Descripción |
|----------|--------------|
| `npm run start:dev` | Ejecuta el servidor en modo desarrollo |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm run start:prod` | Ejecuta el servidor compilado en modo producción |
| `npm run lint` | Ejecuta ESLint para revisar el código |
| `npm test` | Ejecuta los tests con Jest |

---

## 🧠 Tips de Desarrollo

- Usa `npm run start:dev` para autorecarga con cambios.
- Usa [MongoDB Compass](https://www.mongodb.com/products/compass) para explorar tu base de datos.
- Si usas Docker, puedes crear un contenedor MongoDB fácilmente:

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

---

## 🔌 WebSockets

El backend incluye un Gateway WebSocket (`TasksGateway`, `ColumnGateway`) que funciona con:

```bash
@WebSocketGateway({ cors: { origin: process.env.CORS_ORIGIN } })
```

Asegúrate de configurar correctamente `CORS_ORIGIN`.
