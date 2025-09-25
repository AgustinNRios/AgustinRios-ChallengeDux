# Challenge Frontend Dux - Agustin Rios

🔗 **[Ver Deploy en Vercel](https://agustin-rios-challenge-dux.vercel.app/)**

---

## 🚀 Stack Principal y Plus

- **React**
- **Next.js** (componentización, ISR)
- **Tailwind CSS** (design system, consistencia visual)
- **PrimeReact** (componentes UI profesionales)
- **GitHub** (flujo profesional: ramas, PRs, convenciones de commits)
- **TypeScript** (tipado seguro y robusto)
- **ISR (Incremental Static Regeneration)** (rendimiento optimizado)
- **Testing:** Jest, React Testing Library (calidad y confianza)
- **CI/CD:** GitHub Actions + Vercel (deploy automático, feedback rápido)

---

## 🧩 Módulos y Features Clave

- **ISR (Incremental Static Regeneration):**  
  Implementación de ISR para cargar datos pre-generados instantáneamente, mejorando significativamente la experiencia del usuario en la primera carga.
  
- **Gestión de Usuarios:**  
  CRUD completo con filtros avanzados, paginación y validaciones.
  
- **Arquitectura Modular:**  
  Separación clara entre Server Components (ISR) y Client Components (interactividad).
  
- **Optimización de Performance:**  
  Cache inteligente, skeleton loading y revalidación automática cada 60 segundos.

---

## 🛠️ Buenas Prácticas y Conocimientos Demostrados

<!-- - **Diseño Responsive Fiel al Original:**
  Implementación responsive que respeta el diseño en todos los dispositivos, demostrando atención al detalle más allá de los requisitos explícitos.
- **Animaciónes**  
  Animaciónes de entrada y card con tilt.
- **Buenas prácticas y atención al detalle:**  
  Componentización, variables de color, tipografía y componentes reutilizables.
- **Testing:**  
  Pruebas unitarias y de integración para lógica y UI.
- **CI/CD:**  
  Workflows automáticos para lint, build, test y deploy en Vercel.
- **SEO:**  
  Metadatos, sitemaps, etiquetas accesibles y semantic HTML.
- **SSR:**  
  Uso de server-side rendering.
- **Performance:**  
  Lazy loading, optimización de imágenes y Core Web Vitals monitoreados con PageSpeed Insights.

--- -->

## 🖼️ Screenshots y Resultados

### Vista de Escritorio
![Vista de Escritorio]()

### Vistas Móviles

| Vista Principal | Menú Abierto |
| :---: | :---: |
| ![Vista Móvil]() | ![Menú Móvil]() |

<!-- ### Reporte de PageSpeed Insights
![Reporte de PageSpeed Insights]() -->

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

### 🚀 Configuración de ISR

La aplicación está configurada con **Incremental Static Regeneration** para optimizar el rendimiento:

- **Revalidación:** Cada 120 segundos
- **Cache:** `s-maxage=60, stale-while-revalidate=300`
- **Fallback:** Skeleton loading mientras se cargan datos frescos
- **Beneficios:** Primera carga instantánea + datos siempre actualizados

#### ⚠️ Importante sobre ISR:

**ISR NO funciona en modo desarrollo (`npm run dev`)**. Para probar ISR real:

```bash
# Probar ISR en producción
npm run test-isr

# O manualmente:
npm run build
npm start
```

En desarrollo verás la lentitud normal, pero en producción será instantáneo.

---

**¡Gracias por la oportunidad! Estoy listo para aportar valor y calidad en su equipo.**
