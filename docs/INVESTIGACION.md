# Investigación académica · Mi Ruta ESPOL
Consulta: 29 octubre 2026. Prototipo no oficial, sin acceso a datos privados.

## Versión y alcance
FIEC identifica Computación presencial de ocho semestres, resolución RPC-SE-09-NO.086-2020. Su enlace institucional abre CI013 y referencia el archivo CI013v3.svg. Esta es la versión publicada estudiada, no una afirmación sobre cuál aplica a todo estudiante matriculado en 2025. Confirmar con FIEC las fechas y cohortes antes de producción. No se importaron relaciones por coincidencia de nombres de otras mallas.

Se conservaron 45 casilleros del SVG, incluidos itinerarios y componentes genéricos. Se añadió Proyecto integrador por estar explícitamente publicado por FIEC como componente de graduación: 46 registros en total, sin inventar código. Su ubicación en nivel final es de presentación y requiere confirmación. No se inventaron asignaturas específicas para llenar itinerarios. Cada registro incluye créditos, PR, CO, condiciones, relaciones posteriores, fuentes y estado de verificación. Los créditos de componentes no confirmados permanecen null.

## Fuentes reproducibles
- https://www.fiec.espol.edu.ec/es/carreras-de-grado/computacion
- https://mallacurricular.espol.edu.ec/Malla/Imagen?codCarrera=CI013
- https://www.academico.espol.edu.ec/imgMallas/CI013v3.svg
- https://www.fiec.espol.edu.ec/archive/es/node/1816
- https://www.fcsh.espol.edu.ec/es/preguntas-frecuentes
- https://www.cti.espol.edu.ec/es/CCSH%20ICora
- Lineamientos de materia integradora, versión agosto 2024: enlace completo en src/data/sources.json.

Los sílabos EUR-ACE se descargaron del bloque de cada código en FIEC y se extrajeron con pypdf. PDFs y textos están en research/syllabi. El campo syllabus contiene el URL de cada asignatura. La fecha de emisión del PDF es de descarga, no evidencia de una reforma curricular. build_catalog.py conserva extracción reproducible; enrich.py añade texto formal de prerrequisitos. finalize_data.py realiza reconciliación posterior (no ejecutar repetidamente, añade el proyecto).

## Hallazgos y discrepancias
Las aristas PR y CO del SVG se identificaron por sus títulos y se vincularon por casillero, no por proximidad visual. Ejemplo: CCPG1052 es PR de CCPG1034; MATG1051 figura como CO de CCPG1034. CCPG1034 es PR de CCPG1036. El sílabo de Estructuras corrobora el PR pero no enumera el CO en esa sección: se conserva la procedencia del grafo.

Los valores bajo «creditos» del SVG son frecuentemente 9 o 6 cuando FIEC publica 3 o 2 créditos locales; el sílabo usa 5.8 o 3.8 ECTS. No se equiparan estas unidades ni se divide automáticamente el SVG. La aplicación usa los créditos locales publicados en FIEC. No se consideran los conocimientos descritos en el temario como requisitos formales.

Las anotaciones &6, &8, &14, &20, &30 y &39 se conservan literalmente, sin inferir que representen cantidades de materias o créditos. Estos cursos muestran verificación pendiente y no se incluyen en las rutas ilustrativas. «Sin aristas» no equivale a ausencia universal de condiciones institucionales.

FIEC publica 120 créditos de graduación; 240 horas empresariales (5 cr.) y 96 comunitarias (2 cr.); integradora 3 cr. y proyecto integrador 5 cr. El SVG no presenta el proyecto como casillero separado: ambos registros se distinguen y se documenta la discrepancia. La FAQ archivada de FIEC habla de integradora de 8 créditos y otras reglas de 2022: no se traslada ese valor a CCPG1035.

## Reglas especiales: evidencia y límites
La FAQ de FCSH 2026 publica regularidad desde 9 créditos y máximo ordinario 15; también explica cómputo de prácticas para regularidad. Es orientación de otra facultad: requiere ratificación para FIEC. Una carga de 7 créditos no se marca prohibida, sino insuficiente por sí sola para regularidad ordinaria. El estado a prueba tiene tratamiento especial en FAQ: no implementar como regla universal sin norma consolidada vigente.

Los lineamientos de integradora de agosto 2024 requieren prácticas completadas y limitan créditos adicionales pendientes. La FAQ actual de FCSH remite asimismo a requisitos de malla. No se reconcilió definitivamente &39 con esos textos ni se confirmó vigencia de todas las excepciones. No se obtuvo una versión consolidada del Reglamento de Grado que permita activar un validador jurídico-académico actual. Esto queda pendiente explícito.

## Rendimiento y antecedentes
ICora, CTI ESPOL, presenta predicción de rangos de notas y actualización según selección de cursos. Su página vincula trabajos de 2021 sobre decisiones estudiantiles y de 2023 sobre consejeros. Es un antecedente directo; Mi Ruta no se presenta como primera herramienta de esta clase. No se obtuvo una tabla pública verificable de notas medias o tasas de aprobación para cada código de CI013v3. Los sílabos describen horas docentes/prácticas/autónomas, no dificultad empírica individual. No se estimó dificultad a partir del nombre.

Distinguir: media histórica de notas (aclarar población, intentos y periodo); tasa de aprobación (aprobados / población definida); promedio personal (según regla institucional); probabilidad individual calibrada (salida de un modelo validado). Ninguno sustituye a otro. La media personal visible es una media simple de intentos sintéticos, expresamente identificada; no se atribuye al cálculo oficial. No hay porcentajes individuales inventados.

## Pendientes antes de producción
Confirmar cohorte y vigencia; identificar créditos de complementarias e itinerarios; requisitos de proyecto integrador; interpretar anotaciones numéricas; reconciliar documentos; autorizaciones de prácticas; restricciones especiales; política oficial de promedios. Revisión por coordinación de Computación obligatoria antes de etiquetar una materia como formalmente elegible.
