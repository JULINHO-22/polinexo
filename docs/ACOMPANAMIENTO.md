> Registro histórico de la revisión anterior. El comportamiento vigente, las fuentes y las pruebas se describen en [EXPERIENCIA-ACTUAL.md](EXPERIENCIA-ACTUAL.md).

# Mejoras de acompañamiento y contexto · 29 octubre 2026

- Clave configurada únicamente en .env del servidor, excluida de Git. Nunca se envía al frontend ni se incluye en los archivos públicos.
- Se verificaron respuestas reales de gemma-4-26b-a4b-it y gemma-4-31b-it. El modelo seleccionado vuelve a ser gemma-4-26b-a4b-it. Se desactivó pensamiento extenso para mejorar latencia, manteniendo el motor académico como autoridad. Hubo errores transitorios 500/504 y cuota gratuita; el código los informa sin sustituir el modelo.
- Se corrigió la extracción de JSON cuando Gemma acompaña el objeto con una explicación y bloque Markdown. Se valida el objeto completo con Zod y cualquier propuesta con el motor. Se envían nombres, requisitos y contexto profesional con las opciones para evitar consultas redundantes por materia. Los créditos explícitos en la petición se preservan como restricción del cálculo.
- Reiniciar el proceso de Vite es necesario para recargar módulos del backend importados nativamente; no basta el HMR del frontend. La evidencia de pruebas reales reside en research/gemma/live-e2e.json y availability.json, sin credenciales.

## Nexi
El toque activa de nuevo el saludo; el botón Nexi acompáñame lo convierte en un personaje móvil arrastrable, con recorrido pequeño dentro de su espacio y gestos de brazos/cabeza/ojos/pies. El usuario puede moverlo y devolverlo a su sitio. No navega ni aplica planes por su cuenta. Respeta reduced-motion. El movimiento libre es optativo para no tapar controles sin consentimiento.

## Lenguaje profesional
21 asignaturas de la unidad profesional tienen propósito, ejemplo laboral y ámbito, redactados en lenguaje cotidiano y guardados en career-context.json. Son interpretaciones editoriales orientativas basadas en contenido de sílabo, con fuente por registro; no una descripción oficial de empleos ni una garantía laboral. Se muestran en el detalle y se entregan al agente al consultar una asignatura. No se alteran códigos, requisitos ni créditos.

## PoliRecomienda
Se revisó públicamente https://polirecomienda.robtrivi.com/ . Hay Ranking por materia y Comparador. La página describe un promedio ajustado que considera notas y cantidad de evaluaciones, con columna Promedio en SAAC. No significa tasa de aprobación ni resultado individual. La selección de Álgebra lineal incluye nombres duplicados sin código visible en la selección; no se asumió equivalencia entre mallas. No se identificó un contrato público de API, permiso de reutilización, número de evaluaciones por fila o periodo que permitan agregar esos resultados con rigor.

La integración actual ofrece acceso a la fuente y un contrato en community-reviews.json para integrar registros autorizados con código, docente, escala, muestra, periodo y fecha. records permanece vacío, de forma explícita. No se extrajeron comentarios personales ni se inventaron valoraciones. Para sumar docentes en una materia se necesita definir la métrica y sus denominadores; no es correcto promediar porcentajes de poblaciones distintas ni convertir reputación en probabilidad de aprobar.

## Escenarios de avance
simulateHorizon calcula hasta tres PAO con el plan actual, aprobación hipotética salvo fallos marcados y máximo de cuatro materias en las propuestas posteriores. Cada conjunto se valida con prerrequisitos y correquisitos respecto del PAO anterior. Si no hay combinación completa se detiene y explica. Compara avance del plan anterior y actual bajo esos mismos supuestos, sin afirmar una fecha exacta de graduación ni que un retraso sea inevitable. Oferta y condiciones sin verificar no se suponen disponibles.

## OpenAI
No se invocó ninguna API de OpenAI. Se revisó documentación oficial sobre facturación: https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform . Suscripción y API se facturan separadamente; puede haber promociones según elegibilidad, pero no se asumen créditos API por tener un plan de ChatGPT. Se aplicó openai-docs para esa consulta, no para integrar un proveedor adicional.

## Pruebas
20 pruebas de motor/contexto/backend. scripts/test-experience-v3.mjs revisa saludo táctil, mascota móvil, utilidad profesional y escenario de tres PAO a 360, 390, 412 y 1280px; capturas en research/experience-v3. scripts/test-live-paced.mjs espacia los tres escenarios reales para respetar la cuota. La evidencia real no se sustituye por dobles de prueba.

## Revisión de explicaciones
Una prueba real encontró que el modelo mencionó Diseño de software al explicar la postergación de Estructuras de datos, aunque esa dependencia no figura en el grafo. Se retiraron opciones de plan no relacionadas del resultado de inspect_course y se añadió una comprobación de nombres de materias contra el conjunto de requisitos/dependencias verificados. Si una explicación menciona otra materia no respaldada, se sustituye por una explicación conservadora del grafo y la interfaz muestra que fue ajustada. No es una garantía general contra errores de un LLM; es un control concreto, cubierto por prueba de regresión. Las explicaciones generativas siguen sujetas a revisión y las fechas de graduación no se infieren.
