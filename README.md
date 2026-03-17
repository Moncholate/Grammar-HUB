# Grammar HUB - Centro de Acceso a Herramientas de Gramática Inglesa

Una PWA (Progressive Web App) que funciona como hub de navegación para acceder a tus herramientas de aprendizaje de inglés.

## 📋 Funcionalidad

Grammar HUB es un **centro de acceso centralizado** a dos aplicaciones independientes:

- **[Grammaster](https://moncholate.github.io/GramMaster/)** - Constructor interactivo de oraciones en inglés
- **[DesGramatizador](https://moncholate.github.io/Desgramatizador/)** - Análisis automático de partes de la oración (POS)

Cada app se abre en una nueva pestaña desde sus repositorios en GitHub Pages.

## 🚀 Instalación y Uso

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa del build
npm run preview
```

### Instalación en Móvil (PWA)

1. Abre Grammar HUB en tu navegador
2. Haz clic en el botón "Instalar" (aparecerá automáticamente)
3. O manualmente: comparte → "Agregar a pantalla de inicio"

## 📁 Estructura del Proyecto

```
Grammar HUB/
├── public/
│   ├── manifest.json      ← Configuración PWA
│   ├── sw.js              ← Service Worker
│   └── favicon (4)/       ← Iconos
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── components/
│       ├── HeaderNav.jsx
│       ├── HubHome.jsx           ← Pantalla principal con enlaces
│       └── InstallPrompt.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🔧 Configuración de URLs

Las URLs de las aplicaciones están configuradas en `src/components/HubHome.jsx`:

```javascript
const apps = [
  {
    url: 'https://moncholate.github.io/GramMaster/',
    // ...
  },
  {
    url: 'https://moncholate.github.io/Desgramatizador/',
    // ...
  }
];
```

## 📱 Características PWA

- ✅ Service Worker para caché y offline support
- ✅ Manifest.json para instalación en móvil
- ✅ Iconos adaptables para diferentes dispositivos
- ✅ Instalable en Android y iOS
- ✅ Funciona sin conexión una vez instalada

## 🎨 Stack Tecnológico

- **React 18** - Framework UI
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Estilos
- **Lucide React** - Iconos

## 🚢 Deployment

### En GitHub Pages

1. Configura el repositorio en GitHub
2. Actualiza `vite.config.js` con tu base path si es necesario
3. Ejecuta `npm run build`
4. Publica la carpeta `dist/` en GitHub Pages

```bash
npm run build
# Subir contenido de dist/ a GitHub Pages
```

## 📄 Licencia

Todos los derechos reservados.

## 🔗 Enlaces Útiles

- [Grammaster Repository](https://github.com/moncholate/GramMaster)
- [DesGramatizador Repository](https://github.com/moncholate/Desgramatizador)

