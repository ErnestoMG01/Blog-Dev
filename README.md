# Blog-Dev 🚀

Un Headless CMS y portafolio personal moderno y responsivo. Diseñado con una arquitectura separada (Frontend/Backend) que permite gestionar artículos del blog, proyectos y perfil profesional desde un panel de administración seguro.

**Live Demo:** [https://ernestomg01.github.io/Blog-Dev/](https://ernestomg01.github.io/Blog-Dev/)

## 🛠 Tecnologías Utilizadas

**Frontend:**
* React 18 + TypeScript
* Vite (Bundler)
* React Router DOM (Navegación)
* Axios (Cliente HTTP)

**Backend:**
* FastAPI (Python)
* SQLAlchemy (ORM)
* PostgreSQL (Producción en Supabase vía IPv4 Pooler)
* SQLite (Desarrollo Local)
* Uvicorn (Servidor ASGI)
* JWT (Autenticación)

**Despliegue:**
* Frontend alojado en **GitHub Pages** (CI/CD con GitHub Actions).
* Backend API alojada en **Render**.

## Características Principales

* **Gestión de Contenido:** Panel de administración protegido por JWT para crear, editar y eliminar artículos (Drafts/Published).
* **Métricas Integradas:** Registro automático de vistas (`/view`) por cada artículo.
* **Adaptabilidad de Base de Datos:** Entorno local ágil con SQLite y conexión robusta a PostgreSQL en la nube para producción.
* **Seguridad:** Configuración estricta de CORS y contraseñas encriptadas.
