# 🐦 Pajaronea · Bitácora y Guía de Campo de Aves de Chile

**Pajaronea** es una aplicación web responsiva, interactiva y educativa diseñada para el avistamiento e identificación de aves de Chile (con foco especial en Santiago y la Región Metropolitana), desarrollada bajo una arquitectura escalable y **100% a costo cero**.

---

## 🌟 Características Principales

1. **Arquitectura a Costo Cero con Google Workspace:**
   - **Base de Datos:** Google Sheets almacena usuarios autorizados y el registro cronológico de avistamientos (fecha, hora y notas).
   - **Almacenamiento de Fotos:** Google Drive guarda las fotos capturadas en terreno en una carpeta pública designada.
   - **Backend Serverless:** Google Apps Script (`Code.gs`) actúa como API REST gestionando autenticación, registros y desmarcado.
2. **Identidad Visual y Experiencia:**
   - Estética *Kawaii* personalizada con paleta pastel, tipografía *Quicksand* y microanimaciones suaves.
   - Tarjetas interactivas con giro 3D (cara frontal para identificación rápida y cara posterior con ficha pedagógica de campo).
   - **Solución al Encuadre de Fotos:** Minuciosamente corregido mediante `object-position: center 25%` para mantener la cabeza y ojos del ave en foco sin cortes inferiores, complementado con un **Visor Ampliado (Lightbox Modal)** en alta resolución.
3. **Filtros Pedagógicos para Aprender:**
   - **Tipo de Alimentación:** Granívoro (semillas), Insectívoro (lombrices/bichitos), Nectarívoro/Frugívoro (flores), Rapaz/Carnívoro (presas) y Acuático (peces).
   - **Entorno Habitual:** Parques urbanos de Santiago, Cerros isla y matorral nativo, Humedales y lagunas, Cordillera de los Andes.
   - **Tamaño Relativo:** Desde muy pequeño (< 12 cm tipo Picaflor/Chercán) hasta muy grande/rapaz (> 80 cm tipo Cóndor Andino).
   - **Zona Geográfica:** Santiago / RM, Centro, Norte, Sur, Austral.
   - **Búsqueda Reactiva:** Por nombre común chileno, nombre científico o apodo.
4. **Cámara y Fotos desde Dispositivo Móvil:**
   - Botón directo para disparar la cámara del celular o seleccionar de la galería (`capture="environment"`).
   - Compresión ligera en cliente mediante Canvas HTML5 para envíos ultra rápidos que no consumen datos ni exceden cuotas de Google Apps Script.
   - Modal de revisión posterior de la foto guardada con enlace directo a Google Drive.
5. **Autenticación y Modo Demo:**
   - Pantalla de bienvenida / Landing page con identificación por contraseña (valida contra la hoja `Usuarios` de tu Google Sheet).
   - Botón **Ver Demo de la Web (20 Aves)**: permite explorar 20 especies emblemáticas de forma 100% offline y local sin necesidad de vincular cuentas.
   - Saludo personalizado: `Hola, [nombre de usuario] 👋`.
6. **Catálogo Extendido (API aves.ninjas.cl):**
   - Botón para cargar dinámicamente más de 200 especies de aves de todo Chile mediante la API de *Chilean Birds*.
7. **Firma Oficial:**
   - `Code x VINI` en el pie de página con animación de colores neón sobre la palabra **VINI**, vinculada a [marco.lara.vera@gmail.com](mailto:marco.lara.vera@gmail.com).

---

## 📁 Estructura del Proyecto

```text
pajaronea/
├── index.html        # Estructura semántica y modular HTML5
├── styles.css        # Hoja de estilos con efectos 3D, neón y corrección de encuadre
├── app.js            # Lógica cliente, estado, compresión de fotos, filtros y llamadas API
├── Code.gs           # Backend Google Apps Script para Google Sheets y Google Drive
└── README.md         # Documentación y guía de despliegue paso a paso
```

---

## 🚀 Guía de Instalación y Despliegue Paso a Paso (100% Gratuito)

### Paso 1: Configurar la Hoja de Google Sheets y Google Apps Script
1. Abre tu navegador e ingresa a [Google Drive](https://drive.google.com).
2. Crea una nueva **Hoja de cálculo de Google** y nómbrala `Pajaronea_DB`.
3. En el menú superior de la hoja, ve a **Extensiones > Apps Script**.
4. Borra el código por defecto en el archivo `Código.gs` y pega todo el contenido de `Code.gs`.
5. En la barra de herramientas del editor, selecciona la función `setupInitialSheets` y pulsa **Ejecutar**.
   - Concede los permisos que Google te solicitará (acceso a la hoja y a Google Drive).
   - Esto creará automáticamente dos hojas: `Usuarios` (con usuarios por defecto como `Marco` con clave `pajareo2024`) y `Avistamientos`, además de la carpeta `Pajaronea_Fotos_Avistamientos` en tu Drive.

### Paso 2: Implementar la Aplicación Web (GAS Web App)
1. En la esquina superior derecha del editor de Apps Script, haz clic en el botón azul **Implementar > Nueva implementación**.
2. Haz clic en el ícono de engranaje ⚙️ (Seleccionar tipo) y elige **Aplicación web**.
3. Configura los siguientes campos exactamente así:
   - **Descripción:** `Pajaronea API v1`
   - **Ejecutar como:** `Yo (tu correo de Google)`
   - **Quién tiene acceso:** `Cualquier usuario` *(Esto permite que tu web en HTML/JS pueda enviar y recibir datos sin exigir inicio de sesión de Google a cada visitante)*.
4. Haz clic en **Implementar**.
5. Copia la **URL de la aplicación web** generada (termina en `/exec`).

### Paso 3: Conectar la Web Pajaronea
1. Abre `index.html` (o `pajaronea.html`) en cualquier navegador web o súbelo a un hosting estático gratuito como GitHub Pages, Netlify o Vercel.
2. En la pantalla inicial o en el ícono de **⚙️ Ajustes**, pega la URL de tu aplicación web copiada en el paso anterior y pulsa **Guardar Cambios**.
3. ¡Listo! Ingresa con tu contraseña (`pajareo2024` o la que definas en la hoja `Usuarios`) y todos los avistamientos y fotos quedarán permanentemente guardados en tu Google Drive y Google Sheet.

---

## 📝 Créditos y Firma
- **Desarrollado por:** Code x [VINI](mailto:marco.lara.vera@gmail.com)
- **Contacto:** `marco.lara.vera@gmail.com`
- **Fuentes de Datos:** Buscaves.cl, aves.ninjas.cl, Wikimedia Commons y Wikipedia en Español.
