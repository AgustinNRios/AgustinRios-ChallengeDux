# Challenge Frontend Dux - Agustin Rios

🔗 **[Ver Deploy en Vercel](https://agustin-rios-challenge-dux.vercel.app/)**

---

## Consignas Cumplidas

- ✅ **Listado de usuarios:** Visualización de todos los usuarios obtenidos desde la API.
- ✅ **CRUD en Modal:** Formulario para **crear** y **editar** usuarios dentro de un modal para una experiencia de usuario fluida y sin recargas de página.
- ✅ **Validaciones de Formulario:** Comprobaciones robustas tanto en cliente como (simulado) en servidor para asegurar la integridad de los datos.
- ✅ **Eliminación de usuarios:** Funcionalidad para borrar usuarios con un diálogo de confirmación para evitar acciones accidentales.
- ✅ **Filtros y Paginación:** Búsqueda por nombre y paginación eficiente para manejar grandes volúmenes de datos.
- ✅ **Diseño Responsive:** Adaptación fiel de la interfaz a diferentes tamaños de pantalla (móvil, tablet y escritorio).

---

## ✨ Extras y Mejoras

Este proyecto va más allá de los requisitos solicitados, incorporando prácticas y tecnologías modernas para entregar un producto de alta calidad, organizado en las siguientes áreas:

## Nota

- **Actualmente al realizar las operaciones CRUD: Aveces no actualiza la lista** Parece que tarda en reflejarse la mutación en la "base de datos" Note que a medida que utilice la API se fue volviendo mas lenta.
---

### Arquitectura y Patrones de Diseño
- **Atomic Design:** Estructura de componentes organizada en átomos, moléculas y organismos para maximizar la reutilización y consistencia.
- **Separación de Responsabilidades:** Clara distinción entre Server Components (para fetching de datos y renderizado estático) y Client Components (para interactividad), aprovechando lo mejor de Next.js.
- **Prevención de Prop-Drilling:** Uso de composición de componentes y una estructura lógica para evitar el paso innecesario de props a través de múltiples niveles.

### Experiencia de Usuario (UX) y Performance
- **ISR (Incremental Static Regeneration):** Carga de datos pre-generada para una performance inicial instantánea y revalidación automática.
- **React Suspense:** Implementado para manejar estados de carga de forma declarativa, mostrando `fallbacks` (como skeletons) mientras los datos o componentes se cargan.
- **Optimistic UI (UI Optimista):** Las acciones del usuario (como agregar o eliminar) se reflejan instantáneamente en la UI mientras la petición se completa en segundo plano.
- **Mejoras Visuales:** Animaciones sutiles, `Skeleton Loading` y un diseño pulido para una experiencia de usuario más agradable y profesional.

### Calidad de Código y Mantenibilidad
- **CI/CD (Integración y Despliegue Continuo):** Workflow automatizado con GitHub Actions y Vercel para linting, builds, tests y deploys automáticos.
- **Testing Riguroso:** Se ha configurado el pipeline de CI/CD en GitHub Actions para ejecutar tests y reportar el coverage a Coveralls. **(Pendiente: Implementación de los tests unitarios y de integración con Jest y React Testing Library)**.
- **Documentación de Código:** Componentes, hooks y funciones complejas documentadas con JSDoc para facilitar el entendimiento y mantenimiento del código.

---

## 🚀 Stack Utilizado

- **React** y **Next.js**
- **TypeScript**
- **CSS Modules** y **PrimeReact**
- **Jest** y **React Testing Library**
- **GitHub Actions** y **Vercel** para CI/CD

---

## 🏗️ Setup y Ejecución

```bash
git clone https://github.com/AgustinNRios/AgustinRios-ChallengeDux
cd client 
yarn install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tu URL de API

yarn dev
```

**¡Gracias por revisar el proyecto! hasta la próxima!**
