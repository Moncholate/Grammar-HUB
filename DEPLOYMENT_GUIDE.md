# Grammar HUB - Guía de Deployment en GitHub Pages

## 📋 Requisitos Previos

- Cuenta en GitHub
- Git instalado en tu máquina
- Node.js y npm instalados

## 🚀 Pasos para Crear Repositorio en GitHub

### 1. Crear un nuevo repositorio en GitHub

1. Ve a [https://github.com/new](https://github.com/new)
2. Nombre del repositorio: `Grammar-HUB` (o el nombre que prefieras)
3. Descripción: "PWA hub para herramientas de gramática inglesa"
4. Selecciona **Public**
5. **NO** inicialices con README, .gitignore o LICENSE (ya los tienes)
6. Haz clic en "Create repository"

### 2. Conectar el repositorio local con GitHub

Después de crear el repo, GitHub te mostrará comandos. Ejecuta en PowerShell:

```bash
cd "c:\Users\moral\Desktop\Apps\Grammar HUB"

# Cambiar rama a main (si no está en main)
git branch -M main

# Agregar el remoto
git remote add origin https://github.com/TU_USUARIO/Grammar-HUB.git

# Push del código
git push -u origin main
```

Reemplaza `TU_USUARIO` con tu usuario de GitHub.

### 3. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings**
3. En el panel izquierdo, busca **Pages**
4. En "Source", selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
   - O mejor aún, si quieres usar una rama para build:
     - Crea una rama `gh-pages` para los archivos compilados

**Opción A: Usar rama `main` (más simple)**

Sube directamente los archivos compilados de `dist/` a `main`.

**Opción B: Usar rama `gh-pages` (recomendado)**

```bash
# Crear rama gh-pages con el contenido de dist/
git subtree push --prefix dist origin gh-pages
```

Luego en GitHub Pages selecciona `gh-pages` como branch.

### 4. Verificar que funciona

- GitHub Pages tardará 1-2 minutos en procesar
- Accede a: `https://tu_usuario.github.io/Grammar-HUB/`

## 🔧 Configuración para Subrutas

Si tu repo NO está en la raíz del usuario (por ejemplo es `usuario/repo`), necesitas actualizar `vite.config.js`:

```javascript
export default defineConfig({
  base: '/Grammar-HUB/',  // Agregar esto
  plugins: [react()],
  // ...
})
```

## 📝 Workflow de Actualizaciones

Después de hacer cambios locales:

```bash
# 1. Compilar para producción
npm run build

# 2. Agregar cambios
git add .

# 3. Crear commit
git commit -m "descripción del cambio"

# 4. Push a GitHub
git push

# 5. Actualizar GitHub Pages (si usas gh-pages)
git subtree push --prefix dist origin gh-pages
```

## ❌ Solución de Problemas

### "404 Not Found" al acceder

- Verifica que GitHub Pages esté habilitado en Settings > Pages
- Comprueba que la rama es correcta (main o gh-pages)
- Espera 2-3 minutos después de hacer push
- Fuerza recarga del navegador (Ctrl+Shift+R)

### Los iconos no cargan

- Verifica que `public/` contiene los archivos
- Recarga con Ctrl+Shift+R para limpiar caché

### Los enlaces a las apps no funcionan

- Verifica que las URLs en `HubHome.jsx` sean correctas
- Comprueba que tus otras apps (Grammaster, DesGramatizador) estén también deployadas en GitHub Pages

## 📦 Estructura de Archivos Publicados

GitHub Pages publica automáticamente el contenido de:
- `main` branch (raíz) si lo configuras así, O
- `gh-pages` branch si usas la rama de deploy

El contenido de `dist/` es lo que se publica para visitantes.

## 🎯 URLs Finales

Una vez configurado, tus URLs serán:

```
Grammar HUB:      https://tu_usuario.github.io/Grammar-HUB/
Grammaster:       https://tu_usuario.github.io/GramMaster/
DesGramatizador:  https://tu_usuario.github.io/Desgramatizador/
```

## 💡 Consejos

1. **Personal access token**: Si te pide autenticación, usa un PAT en lugar de contraseña
   - Ve a GitHub Settings > Developer settings > Personal access tokens

2. **Rama main protegida**: Considera proteger la rama `main` en Settings para evitar cambios accidentales

3. **Automated deployments**: Puedes usar **GitHub Actions** para hacer build automático, pero por ahora no es necesario

## 🔐 En Caso de Necesitar Token

Si Git te pide autenticación:

```bash
git remote set-url origin https://TU_USUARIO:TU_TOKEN@github.com/TU_USUARIO/Grammar-HUB.git
```

Para generar un token:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generar nuevo token con permisos `repo`, `workflow`
3. Copiar el token y usarlo como contraseña

---

**¿Necesitas ayuda con alguno de estos pasos?**
