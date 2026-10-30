> La revisión más reciente se describe en [REVISION-30-OCTUBRE.md](REVISION-30-OCTUBRE.md).

# Experiencia vigente · 29 de octubre de 2026

Esta revisión reemplaza el flujo común de tarjetas que mezclaba selección, promedio y consecuencias. Se aplicó la guía local frontend-design para simplificar jerarquía, composición móvil y lenguaje. La identidad y los recursos de Mi ESPOL se conservan en la demostración local.

## Tres tareas distintas

**Elegir materias:** abre directamente nueve materias con requisitos anteriores cumplidos en el expediente ficticio. Se agrupan por nivel de referencia, pendientes anteriores y posibles adelantos. Marcar una materia modifica un borrador; no cambia el plan vigente. Una selección inválida no se puede confirmar. La revisión es una segunda pantalla. El modo independiente «Ver sugerencias» permite comparar 3, 4, 5 materias o las materias verificadas del nivel; en el perfil base suman 9, 11, 14 y 13 créditos respectivamente.

**Mejorar promedio:** muestra la comparación personal entre áreas y una propuesta según el margen de tiempo deseado. No empieza por inventar notas futuras. Los resultados de ejemplo son 9.10 en computación (dos intentos) y 7.06 en matemáticas y ciencias (cinco intentos). No se consideran mediciones de dificultad ni probabilidades de aprobar.

**Consecuencias:** parte del plan guardado, permite escoger una materia que se pospondría y genera una sustitución válida. Presenta qué mantener, quitar y añadir, una dependencia confirmada y una comparación por PAO. En el ejemplo de Estructuras de datos, se conserva Matemáticas discretas, Bases de datos e Inglés III y se propone Programación de sistemas. Los PAO posteriores suponen aprobación y oferta, excluyen condiciones desconocidas y no predicen graduación.

Nexi se anima en su sitio. Se eliminó el recorrido por la pantalla y la segunda mascota flotante. Saludo y celebración se reinician al tocarlo o pulsar Animar. Los controles para ocultar y recuperar siguen disponibles.

## Evidencia sobre profesores y aprobación

Se consultó manualmente la interfaz pública de [PoliRecomienda](https://polirecomienda.robtrivi.com/inicio), verificando el código seleccionado: CCPG1034 (6 filas) y TICG1018 (7 filas). Los 13 valores son puntajes publicados en la columna «Promedio en SAAC», descritos por el sitio como promedios ajustados. Se preservan fecha, origen y datos ausentes en community-reviews.json. No hay sincronización automática ni cobertura de todos los profesores de ESPOL.

review-statistics.ts calcula cantidad, media, mediana, mínimo y máximo **entre esos puntajes docentes**. No se conoce el número de evaluaciones, periodo ni escala documentada por fila. Por ello no calcula una media de votos individuales ni una tasa de aprobación. Un promedio ponderado solo se calcula con denominadores completos, periodo y métrica compatibles; esto se comprueba con datos sintéticos en tests/reviews.test.mjs. No se usan estas referencias como garantía de calidad actual ni para asignar una franja de matrícula.

Se volvió a buscar evidencia de aprobaciones por asignatura en fuentes institucionales. [CTI presenta iCora y sus publicaciones](https://www.cti.espol.edu.ec/en/CCSH%20ICora), pero esa página no entrega una tabla de aprobados/reprobados por código y profesor. Los [lineamientos del ajuste curricular](https://www.dspace.espol.edu.ec/xmlui/bitstream/handle/123456789/49475/2.%20LINEAMIENTOS%20AJUSTE%20CURRICULAR%20CARRERAS%20DE%20GRADO.pdf?isAllowed=y&sequence=1) describen antecedentes de aprobación de Fundamentos de Programación y su relación con formación previa; no proporcionan una tasa actual para cada materia de CI013v3. Se identificó además la tesis de Reyes Aguirre y Rodríguez Salvatierra, «Análisis de la tasa de reprobación de los estudiantes de ESPOL. Un comparativo entre el periodo presencial (2011–2019) y el virtual (2020)», en el repositorio institucional. Es un antecedente agregado y antiguo, no una base actual por asignatura/docente.

La [rendición de cuentas 2022](https://planificacion.espol.edu.ec/sites/default/files/Rencicion%20de%20cuentas%202022.pdf) ofrece cifras de nivelación; no se trasladan a materias de carrera. **No se encontraron en las fuentes consultadas datos públicos verificables suficientes para calcular las tasas solicitadas por cada materia y profesor.** El recomendador usa los requisitos verificados, referencias de carga y el historial ficticio; no afirma estar basado en esas tasas ausentes.

Para incorporar tasas reales se necesitarían, por código, versión de malla, PAO y docente: matriculados evaluables, aprobados, reprobados y retirados por separado; definición del denominador, fecha de corte y autorización de uso. Se puede calcular aprobados/evaluables y reprobados/evaluables sin confundir retirados con reprobados. Deben conservarse tamaños muestrales e incertidumbre; la tasa de un grupo no es la probabilidad de un estudiante.

## Conversación

Se acortó el historial enviado a cuatro mensajes de hasta 650 caracteres y se limitaron los resultados y rondas de herramientas para reducir consumo de cuota. Un fallo de formato, un fallo temporal, el tiempo agotado y el límite de cuota tienen mensajes distintos. Los errores 500/503 del proveedor permiten un único reintento al mismo Gemma. No hay sustitución por otro modelo ni respuesta inventada.

Se añadió «Reintentar mi pregunta». Si Gemma responde en texto sin elegir un índice de propuesta, las combinaciones realmente calculadas pueden inspeccionarse aparte, sin fingir que el modelo eligió una. Cada cambio vuelve a pasar la validación 9–15 antes de aplicarse. Una comprobación de dependencias corrige afirmaciones formales incompatibles sin borrar un consejo de estudio por contener palabras corrientes como «comunicación».

Una API gratuita puede seguir fallando por disponibilidad o cuota. Las pruebas reales se guardan aparte de las pruebas unitarias. No se promete disponibilidad continua ni validez científica de toda explicación generativa.

La prueba real de la pregunta «quisiera ver 3 materias, porque ingresaré a trabajar» detectó un error en la continuación nativa de function calling y una restricción exacta de créditos no solicitada. Se conservaron las llamadas nativas iniciales, pero sus resultados se entregan al siguiente turno como hechos JSON en texto, sin functionResponse nativo. Se distingue el crédito explícito del usuario de la meta asumida por el modelo. La consulta corregida devolvió una respuesta real en dos llamadas a Gemma y una propuesta validada de tres materias y nueve créditos. Se añadieron dos regresiones específicas.

Se normaliza el historial a pares completos usuario/modelo: una solicitud fallida no se reenvía como turno sin respuesta. Se verificaron después en la interfaz una propuesta de tres materias/nueve créditos y un consejo de estudio sobre Matemáticas discretas. La comprobación de explicaciones distingue también las materias que requieren llevar otra simultáneamente; una relación inversa de correquisito no debe borrarse por no estar en la lista de prerrequisitos posteriores.
