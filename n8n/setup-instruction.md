# 🧾 Setup Instructions for n8n & Backend

## 🧠 Objetivo

Este archivo explica cómo configurar **n8n** junto al **backend NestJS** para entornos de desarrollo y producción.

---

## ⚙️ Configuración del Backend

1. Clona el repositorio y entra al directorio del backend:
   ```bash
   git clone <tu_repo_backend>
   cd backend
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Crea los archivos `.env` y `.env.production` según el ejemplo:
   ```bash
   cp .env.example .env
   cp .env.example .env.production
   ```

4. Inicia MongoDB localmente o usa una conexión de Atlas.

5. Ejecuta el servidor:
   ```bash
   npm run start:dev
   ```

6. (Opcional) Para producción:
   ```bash
   npm run build
   npm run start:prod
   ```

---

## 🤖 Configuración de n8n

1. Instala n8n globalmente (si no lo tienes):
   ```bash
   npm install -g n8n
   ```

2. Inicia n8n localmente:
   ```bash
   n8n
   ```

3. Crea un nuevo workflow y agrega un nodo **HTTP Request** apuntando al backend, por ejemplo:
   ```http
   POST http://localhost:3000/tasks
   ```

4. Puedes usar **n8n** para automatizar:
   - Backups de MongoDB
   - Envío de notificaciones por email
   - Creación de tareas automáticas en tu sistema Kanban

---

## 📦 Ejemplo de Integración (Exportable a n8n)

Guarda este archivo como `kanban-backend-n8n.json` y súbelo a tu instancia de n8n:

```json
{
  "name": "Kanban Backend Trigger",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "GET",
        "path": "tasks",
        "responseMode": "onReceived"
      },
      "name": "Listen Backend",
      "type": "n8n-nodes-base.httpTrigger",
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "http://localhost:3000/tasks",
        "responseFormat": "json"
      },
      "name": "Backend Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1
    }
  ],
  "connections": {
    "Listen Backend": {
      "main": [[{ "node": "Backend Request", "type": "main", "index": 0 }]]
    }
  }
}
```

---

## ✅ Verificación

- Abre [http://localhost:3000](http://localhost:3000) para verificar el backend.
- Abre [http://localhost:5678](http://localhost:5678) para acceder a la interfaz de **n8n**.
