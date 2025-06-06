# ChatAPI (Backend)

API RESTful para gestión de usuarios, empresas y mensajería.

---

## 🚀 Características principales

- **Gestión de usuarios y empresas**: Registra, autentica, consulta y administra usuarios y empresas.
- **Mensajería**: Envía, recibe y elimina mensajes entre usuarios.
- **Validación y autenticación**: Soporte JWT, validación de cuentas por token y cookies seguras.
- **Pruebas automatizadas**: Tests con Jest y Supertest para endpoints críticos.
- **CORS habilitado**: Permite peticiones desde el frontend (`http://localhost:5173` por defecto).

---

## 🛠️ Tecnologías usadas

- Node.js + Express
- MongoDB (Mongoose)
- JWT
- dotenv
- Jest + Supertest (testing)

---

## ⚙️ Instalación y configuración

### Clona el repositorio

```bash
git clone https://github.com/FGordillo12/ChatAPI.git
cd ChatAPI
```

### Instala dependencias

```bash
npm install
```

### Configura el archivo `.env`

Ejemplo:

```env
PORT=3000
CONNECTION_DATABASE_APP=mongodb+srv://user:pass@cluster0.mongodb.net/chat_api?retryWrites=true&w=majority
CONNECTION_STRING_PRUEBAS=mongodb+srv://user:pass@cluster0.mongodb.net/chat_api_pruebas?retryWrites=true&w=majority
JWT_TOKEN=tu_token_super_secreto
ETHEREAL_USER=usuario_generado@ethereal.email
ETHEREAL_PASS=contraseña_generada
```

### Inicia el servidor

```bash
npm start
```

Accede a la API en `http://localhost:3000`.

---

## 🔐 Variables de entorno obligatorias

| Variable                   | Descripción                                     |
|---------------------------|-------------------------------------------------|
| PORT                      | Puerto en el que se ejecuta la API              |
| CONNECTION_DATABASE_APP   | Cadena de conexión a la base de datos (prod)    |
| CONNECTION_STRING_PRUEBAS | Cadena de conexión a la base de datos (test)    |
| JWT_TOKEN                 | Clave secreta para JWT                          |
| ETHEREAL_USER             | Usuario para pruebas de email                   |
| ETHEREAL_PASS             | Contraseña para pruebas de email                |

---

## 🌍 Endpoints principales

Todos los endpoints están bajo el prefijo `/api/`.

### Usuarios y Empresas

- `GET /usuarios` — Lista usuarios (no empresas)
- `POST /usuarios` — Registrar usuario
- `GET /empresas` — Lista empresas
- `POST /empresas` — Registrar empresa

### Mensajes

- `POST /mensajes` — Enviar mensaje
- `GET /mensajes` — Obtener mensajes
- `DELETE /mensajes/:id` — Eliminar mensaje

### Autenticación y Validación

- `POST /auth/login` — Login de usuario
- `POST /auth/register` — Registro
- `GET /validacion/:token` — Valida cuenta y redirige a `/login` en el frontend

---

## 🧪 Pruebas automatizadas

Las pruebas (Jest + Supertest) están en la carpeta `carpetaPruebas/`.

Ejecuta:

```bash
npm test
```

### Las pruebas cubren:

- Eliminación de mensajes (`DELETE /api/mensajes/:id`)
- Validación de cuenta (`GET /api/validacion/:token`)
- Listado de usuarios y empresas (`GET /api/usuarios`, `GET /api/empresas`)

---

## 🗂️ Estructura del proyecto

```
ChatAPI/
├── app.js
├── .env
├── .gitignore
├── carpetaPruebas/
│   ├── Delete/
│   ├── Get/
│   └── Patch/
├── server/
│   ├── models/
│   └── routes/
├── node_modules/
└── ...
```

---

## 📝 Ejemplo de consumo desde frontend

### Autenticación

```js
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email: 'usuario@mail.com', password: 'tuPassword' })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Obtener usuarios

```js
fetch('http://localhost:3000/api/usuarios', { credentials: 'include' })
  .then(res => res.json())
  .then(data => console.log(data.usuarios));
```

---

## 🙌 Contribuciones

1. Haz fork del proyecto
2. Crea una rama: `git checkout -b feature/nueva-feature`
3. Haz tus cambios y push: `git push origin feature/nueva-feature`
4. Abre un Pull Request

---
