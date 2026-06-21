# TAD 12 - Plataforma de Análisis del Mercado Laboral (Vercel Edition)

Esta es la versión mejorada y optimizada para **Vercel** de la plataforma TAD 12. Se ha reescrito la interfaz para ser un SPA (Single Page Application) más fluido, se han integrado gráficos interactivos con Chart.js y se ha embebido el reporte de Power BI.

## Mejoras incluidas

1. **Migración a Vercel:** Función serverless `grok.js` migrada de Netlify a la estructura de Vercel (`api/grok.js`).
2. **Diseño UI/UX:** Interfaz completamente rediseñada, moderna, responsiva y con navegación SPA (sin recargar la página).
3. **Gráficos Dinámicos:** Se incluyeron 6 gráficos interactivos con Chart.js basados en los datos del DANE (2010-2025).
4. **Integración Power BI:** Sección dedicada con el dashboard embebido y enlaces directos.
5. **CI/CD:** Configuración de GitHub Actions para despliegue automático en Vercel.

## Cómo desplegar en Vercel

Tienes dos opciones para desplegar este proyecto:

### Opción 1: Despliegue rápido desde GitHub (Recomendado)

1. Sube todo este código a tu repositorio de GitHub (reemplazando el código anterior).
2. Entra a [Vercel](https://vercel.com/) e inicia sesión con GitHub.
3. Haz clic en **Add New...** -> **Project**.
4. Importa tu repositorio `Pagina-TAD_12`.
5. En la sección **Environment Variables**, añade:
   - Name: `GROK_API_KEY`
   - Value: `(tu_clave_de_api_aqui)`
6. Haz clic en **Deploy**. ¡Listo!

### Opción 2: Usando Vercel CLI

Si prefieres usar la terminal:

```bash
# 1. Instala Vercel CLI
npm i -g vercel

# 2. Inicia sesión
vercel login

# 3. Despliega el proyecto
vercel

# 4. Despliega a producción
vercel --prod
```

Recuerda configurar la variable de entorno `GROK_API_KEY` en el dashboard de Vercel (Settings -> Environment Variables) para que el asistente de IA funcione correctamente.

## Estructura del Proyecto

- `index.html`: Estructura principal y contenido de todas las secciones.
- `styles.css`: Estilos rediseñados y modernos.
- `script.js`: Lógica de navegación SPA, datos históricos y configuración de gráficos Chart.js.
- `asistente-tad12.js`: Lógica del chatbot conectado a la API serverless.
- `api/grok.js`: Función serverless de Vercel (antiguo `netlify/functions/grok.js`).
- `vercel.json`: Configuración de enrutamiento y headers para Vercel.
- `.github/workflows/vercel-deploy.yml`: Pipeline de despliegue continuo.
