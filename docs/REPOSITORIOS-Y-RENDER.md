# Repositorios y categorías

## Presentación pública: polinexo
Código funcional completo y original bajo MIT, Nexi, catálogo con fuentes, expediente ficticio, pruebas y documentación. Sin claves, capturas originales, PDFs ajenos, archivos de investigación en bruto ni credenciales. Los recursos institucionales se sustituyen por imágenes propias de referencia. La licencia MIT no concede derechos sobre marcas ni datos de terceros.

## Despliegue privado: polinexo-render
Mismo código funcional verificado y configuración render.yaml. Tampoco contiene claves. La clave se configura únicamente en Environment de Render. El repositorio privado no sustituye el público requerido para el premio.

## Best Open-Source AI Project
Gemma 4 es el modelo abierto central del agente. Interpreta preguntas, consulta herramientas académicas y explica combinaciones, comparaciones y escenarios. El motor determinista valida requisitos y créditos: la IA no puede alterar esas reglas. El código original tiene licencia MIT. La originalidad y aceptación definitiva dependen del jurado.

## Best Use of Google Gemma
Modelo exacto: **gemma-4-26b-a4b-it**, consumido por **Gemini API** mediante @google/genai. Alternativa explícita gemma-4-31b-it; no hay sustitución silenciosa por Gemini u OpenAI.
- server/http.mjs: cliente GoogleGenAI y llamada models.generateContent.
- server/agent.mjs: orquestación del agente y herramientas.
- src/polinexo/AcademicReview.tsx: revisión automática del plan.
- src/polinexo/PoliNexo.tsx: conversación con Nexi y propuestas confirmables.
- scripts/verify-gemma.mjs: verificación real con clave propia; sin clave no acredita uso real.

Demo: seleccionar materias, pulsar Revisar selección y mostrar respuesta, nombre del modelo y cálculos consultados. Realizar también una consulta libre. La cuota o indisponibilidad del proveedor puede interrumpir la demo; no se simula éxito.

Fuentes oficiales: https://www.mlh.com/partners/gemma y https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api

## Render
Crear Web Service Node desde polinexo-render, rama main. Build `npm ci && npm run build`. Start `npm start`. Node 24. Usar el plan gratuito; no activar servicios de pago. render.yaml prepara esos valores. No usar Static Site: el agente necesita servidor.

Configurar GEMINI_API_KEY en Environment y GEMMA_MODEL=gemma-4-26b-a4b-it. Render suministra PORT y RENDER_EXTERNAL_HOSTNAME. Frontend y API comparten origen. No subir .env ni poner la clave en variables VITE_. La clave que se compartió en el chat debe reemplazarse antes de una demo pública. El código no la incorpora.

Esta preparación no crea servicios de Render ni publica la aplicación automáticamente. La información académica personal es ficticia; las valoraciones docentes no son tasas de aprobación. La fuente pública debe mantener las atribuciones y límites de cobertura.
