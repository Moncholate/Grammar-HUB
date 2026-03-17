# INSTRUCCIONES DE CONFIGURACIÓN - Grammar HUB

## ✅ Estructura Creada

Grammar HUB está configurado como un **hub de navegación PWA** que enlaza a dos aplicaciones externas.

### 📁 Directorios
```
Grammar HUB/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── favicon (4)/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── components/
│       ├── HeaderNav.jsx
│       ├── HubHome.jsx                ← Pantalla principal
│       └── InstallPrompt.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## 🚀 Para Ejecutar Localmente

```bash
cd "c:\Users\moral\Desktop\Apps\Grammar HUB"
npm run dev
```

La aplicación abrirá en http://localhost:5173

## 🔌 Configuración de Enlaces

Las URLs de las aplicaciones se encuentran en `src/components/HubHome.jsx`:

```javascript
const apps = [
  {
    title: 'Grammaster',
    url: 'https://moncholate.github.io/GramMaster/',
    // ...
  },
  {
    title: 'DesGramatizador',
    url: 'https://moncholate.github.io/Desgramatizador/',
    // ...
  }
];
```

Si necesitas cambiar las URLs:
1. Abre `src/components/HubHome.jsx`
2. Busca la sección `const apps = [`
3. Actualiza las propiedades `url` para cada app

## 📱 Características PWA Implementadas

✅ **Service Worker** - Caché inteligente y modo offline
✅ **Manifest.json** - Instalación en móvil
✅ **Iconos responsive** - 96x96, 192x192, 512x512 + Apple
✅ **Install Prompt** - Invitación a instalar app
✅ **Responsive Design** - Funciona en cualquier dispositivo
✅ **Tailwind CSS** - Estilos modernos

## 🎯 Cómo Funciona

1. **HubHome.jsx** - Renderiza dos cards con información de cada app
2. Cada card contiene un enlace (`<a>`) que apunta a la URL de producción
3. Al hacer clic, se abre la app en una nueva pestaña
4. Grammar HUB permanece disponible en la pestaña actual

## 🔧 Configuración Personalizada

- **Colores**: Definidos en `tailwind.config.js`
- **Theme color**: #1e40af (azul)
- **App name**: "Grammar HUB"
- **Icons**: En `public/favicon (4)/`

## 📦 Tecnologías

- React 18.2.0
- Vite 5.0.8
- Tailwind CSS 3.3.6
- Lucide React
- Service Worker (caché offline)

## ⚠️ Notas Importantes

1. Grammar HUB es un hub puro - no contiene código de las apps
2. Las URLs apuntan a GitHub Pages de cada aplicación
3. El Service Worker permite offline mode (solo el hub, no las apps externas)
4. Los módulos locales fueron eliminados por no ser necesarios

## 🚢 Deployment en GitHub Pages

1. Sube Grammar HUB a tu repositorio en GitHub
2. Configura GitHub Pages en las Settings
3. Ejecuta `npm run build`
4. El contenido de `dist/` será deployado automáticamente

```bash
npm run build
# GitHub Pages servirá el contenido de dist/
```

## 🐛 Troubleshooting

**Si los enlaces no abren:**
- Verifica que las URLs de GitHub Pages sean correctas
- Revisa la consola del navegador (F12)

**Si los iconos no aparecen:**
- Verifica que estén en `public/`
- Recarga la página (Ctrl+Shift+R)

**Si el Service Worker no funciona:**
- Abre DevTools → Application → Service Workers
- Verifica que esté en estado "active"

## 📞 Cambios Rápidos

| Necesidad | Dónde | Qué cambiar |
|-----------|-------|-----------|
| Cambiar URL de una app | `src/components/HubHome.jsx` | Propiedad `url` en el objeto `apps` |
| Cambiar titulo del hub | `src/components/HubHome.jsx` | Texto en `<h1>` |
| Cambiar colores | `tailwind.config.js` | Sección `colors` |
| Cambiar icon del hub | `src/components/HubHome.jsx` | Emoji o icono en el header |


