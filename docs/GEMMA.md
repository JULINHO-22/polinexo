# Configuración de Gemma y evidencia para el hackathon

## Modelo y API
Modelo principal exacto: `gemma-4-26b-a4b-it`. Alternativa explícita: `gemma-4-31b-it`, únicamente cambiando GEMMA_MODEL en .env y reiniciando. Nunca se usa Gemini como sustituto de Gemma. El SDK oficial @google/genai llama models.generateContent desde server/agent.mjs, a través de Gemini API. Se conserva el modelo solicitado y modelVersion devuelto en respuestas y metadatos de verificación. Tener SDK y claves configurados no equivale a una llamada real exitosa.

Documentación consultada 29-10-2026: https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api (modelos soportados, instrucciones, conversación y function calling). MLH: https://www.mlh.com/partners/gemma y evento https://events.mlh.com/events/14746-hacktoberfest-hack-day-guayaquil-x-ieee-hkn-nu-zeta-chapter . La página del evento y partner se revisaron en el navegador del usuario. Los dos requisitos de premios específicos fueron aportados por el usuario; no se presenta eso como una verificación jurídica de elegibilidad ni se promete el premio.

## Configurar sin publicar claves
Node 24. Copiar .env.example a .env. Poner GEMINI_API_KEY solo en ese archivo privado; nunca usar prefijo VITE_. El modelo se selecciona con GEMMA_MODEL. Reiniciar npm run dev después de cambiar .env. Vite carga las variables en configuración de servidor, no en código cliente. .env está excluido de Git y de los paquetes públicos.

No se proporciona una clave ni se crea una cuenta automáticamente. Conseguir acceso en Google AI Studio usando el enlace oficial de la guía. No se activan facturación ni servicios de pago en esta entrega; acceso y cuotas dependen de la cuenta. Gemma se invoca solo al enviar una conversación o ejecutar las pruebas en vivo, no al cargar la portada ni al consultar salud.

## Qué hace Gemma
Entiende la petición libre y el contexto acotado de turnos anteriores. Invoca herramientas tipadas: inspect_history, inspect_course, recommend_courses, compare_plans, simulate_grades. Con esos resultados redacta una explicación breve o solicita aclaración. El cliente muestra los cálculos y la propuesta por separado de la explicación generada. El historial académico viene del expediente ficticio en el servidor; no puede reemplazarse desde el cliente ni por el modelo.

El motor determina requisitos, correquisitos, créditos, carga, dependencias y medias ilustrativas. El backend valida herramientas con Zod, rechaza códigos desconocidos y valida nuevamente cualquier propuesta. La IA no ejecuta cambios: el estudiante confirma. Una explicación generativa todavía podría contener errores; no adquiere carácter institucional. Las estadísticas no disponibles siguen null y no se presentan probabilidades inventadas.

## Conexión, límites y seguridad
Backend ligero HTTP nativo montado en el mismo servidor Vite: /api/health y /api/chat. Disponible también con node --env-file=.env server/http.mjs en 127.0.0.1:8787. Origen local y host restringidos; no CORS abierto. Límite de cuerpo 30 KB, conversación 12 turnos, mensaje 1800 caracteres, 2 consultas concurrentes y 10 por minuto. Máximo siete rondas de modelo/herramientas, timeout global 45s y timeout de proveedor 25s. No se registran claves, prompts ni respuestas del proveedor en logs de error. Cuota/permisos/modelo ausente/timeout se muestran explícitos. No hay fallback silencioso al asistente por expresiones regulares. Las funciones locales permanecen disponibles con el rótulo Cálculo local.

## Verificación real
npm run verify:gemma prueba ambos IDs sin exponer claves y registra solo disponibilidad, versión y fecha en research/gemma/availability.json. npm run test:live requiere el servidor y verifica tres consultas reales: 12 créditos/cuatro materias; postergar Estructuras; proyección ilustrativa de media. Registra trazas sin claves. Si falta clave imprime SKIP y no acredita una prueba real. /api/health solo muestra verified después de una conversación real exitosa en ese proceso.

Las pruebas unitarias del agente usan dobles explícitos: verifican la orquestación pero no acreditan uso real de Gemma. La evidencia de API real debe obtenerse con una clave autorizada antes de presentar el premio Best Use of Google Gemma. Sin esa evidencia no se afirma haber cumplido el criterio.

## Rediseño y personaje
Se evaluaron Rive (runtime JS/WASM y archivos .riv) y Lottie (runtime MIT y archivos de animación). Fuentes: https://rive.app/docs/runtimes/web/web-js y https://github.com/airbnb/lottie-web . Se eligió SVG/CSS propio para no depender de editor, runtime adicional o licencias de animaciones descargadas. Nexi tiene reposo, saludo, escucha, pensamiento, descubrimiento, advertencia y celebración con gestos de cabeza, mirada, brazos y pies. Reacciona a foco/escritura, consultas reales pendientes, resultados, errores y confirmación. Respeta reduced-motion. Está junto a la interacción, no al final de una página larga ni superpuesto al contenido. Ocultar/minimizar no cancela las funciones.

## Búsqueda y consistencia
El frontend usa un Web Worker con búsqueda acotada a 60 000 nodos, poda por créditos y cantidad, y conserva solo seis opciones. Al agotarse el límite informa búsqueda parcial; no presume optimalidad. Cambios académicos invalidan trabajos pendientes mediante identificadores de revisión. Abrir/minimizar conversación no borra alternativas. La sesión conserva conversación y objetivos; las preferencias/plan se almacenan localmente. Restablecer cancela operaciones y vuelve al expediente de demostración.

## Código abierto
LICENSE MIT para código original. Revisar THIRD_PARTY_NOTICES.md. npm run export:public crea release/polinexo-public con fuente limpia y repositorio Git local inicializado; no publica en GitHub ni incluye capturas originales de Mi ESPOL. Las imágenes de sustitución son propias y se distinguen de las institucionales. Antes de registrar el premio deben subir esa fuente a un repositorio público autorizado y confirmar las reglas actuales del organizador. No se afirma originalidad absoluta frente a ICora.
