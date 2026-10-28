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
## 📝 Créditos y Firma
- **Autoría:** Code x [VINI](mailto:marco.lara.vera@gmail.com)
- **Contacto:** `marco.lara.vera@gmail.com`
---

---

## 📝 Créditos y Firma
- **Desarrollado por:** Code x [VINI](mailto:marco.lara.vera@gmail.com)
- **Contacto:** `marco.lara.vera@gmail.com`
- **Fuentes de Datos:** Buscaves.cl, aves.ninjas.cl, Wikimedia Commons y Wikipedia en Español.
