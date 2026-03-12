# AdoptMe API

API para gestionar la adopción de mascotas.

## Descripción

Esta API permite gestionar usuarios, mascotas, adopciones y sesiones para una plataforma de adopción de mascotas.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd adoptme_final
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno en un archivo `.env` basado en `.env.example`.

## Uso

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

### Pruebas

```bash
npm run test
```

## Endpoints de la API

- Detalles en la documentacion con SWAGGER.

- /api/docs

## Datos de Prueba

### Mocks

- Endpoints para datos de prueba
- api/generatedata/users/:userscant/pets/:petscant"

### Parametros

- `:userscant` cantidad de usuarios a generar
- `:petscant` cantidad de mascotas a generar

## Imagen de Docker

```dockerfile
docker pull lacruzjd/adoptme-image
```

### Configuración Contenedor Docker

variables de entorno

```
PORT = tu puerto aquí
MONGOURI_ATLAS = tu cadena de conexión a MongoDB Atlas aquí
JWT_SECRET = tu_clave_secreta_aquí

```

## Tecnologías

- Node.js
- Express.js
- MongoDB con Mongoose
- JWT para autenticación
- Swagger para documentación de API
- Multer para subida de archivos
- Mocha y Chai para test

## Estructura del Proyecto

```
src/
├── app.js                 # Punto de entrada de la aplicación
├── config/                # Configuraciones
├── controllers/           # Controladores de rutas
├── dao/                   # Data Access Objects
├── docs/                  # Documentación OpenAPI (YAML)
├── dto/                   # Data Transfer Objects
├── middlerware            # Middlewares
├── mocks/                 # Datos de prueba
├── public/                # Archivos estáticos
├── repository/            # Repositorios
├── routes/                # Definición de rutas
├── services/              # Lógica de negocio
├── tests/                 # Pruebas
└── utils/                 # Utilidades
```

## Licencia

ISC
