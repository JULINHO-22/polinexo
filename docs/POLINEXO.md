> Archivo de arquitectura de la fase anterior (asistente local). La implementación vigente usa Gemma; consultar GEMMA.md. Se conserva como trazabilidad, no como descripción del producto actual.

# PoliNexo · decisiones, herramientas y validación

## Arquitectura implementada
src/polinexo/engine.ts: funciones puras sobre catálogo y perfil; sin acceso a red ni mutación del expediente. tools expone consulta de expediente y materias, elegibilidad, generación, créditos, dependencias, comparación y carga. PoliNexo.tsx comparte un único estado entre plan, simulación, Nexi y rendimiento; persistencia versionada local. Polinexo.css incluye SVG Nexi original con expresión de restricción, gesto de oportunidad, ojos y reposo ocasional; reduced-motion elimina animaciones. Se usó frontend-design para conservar la identidad y dar jerarquía a la exploración progresiva, no para rehacer Inicio.

Las reglas pendientes excluyen cursos de la generación. Correquisitos se cierran sobre cada conjunto completo. Aprobar un prerrequisito en el mismo PAO no lo satisface para matrícula actual. En escenarios posteriores solo se proyectan aprobadas materias indicadas como exitosas. Las dependencias se recorren con control de ciclos. Elegibilidad futura con correquisitos no satisfechos no se cuenta como elegibilidad completa; la malla lo distingue.

La búsqueda enumera subconjuntos de los candidatos que pasan filtros de requisitos anteriores y verifica el conjunto final. No usa las antiguas listas preparadas. Su complejidad es exponencial; apropiado para el catálogo/expediente actual, no promesa de escalabilidad institucional. Para producción: poda por créditos, optimización incremental y trabajo en worker con cancelación. Devuelve hasta seis alternativas ordenadas de manera determinista. Catálogos incompletos producen abstención, no cursos inventados.

## Ranking explicable, no probabilidad
Puntuación = nuevas elegibilidades × peso de avance + media personal de las áreas de los cursos × peso de afinidad - 2 × horas sobre disponibilidad - 12 × distancia al objetivo de créditos - cantidad de materias de matemáticas/ciencias × peso de ritmo. Pesos: avance 8 si prioridad avance, 3 en otro caso; afinidad 3 si prioridad promedio, 1 en otro caso; ritmo 3 tranquilo, 1 resto. Son decisiones heurísticas explícitas sin validez predictiva. El ritmo también propone objetivo de 9/11/15 editable. La aplicación no obliga a maximizar créditos ni infiere capacidad del estudiante a partir de una nota.

Las agrupaciones por prefijos para analítica son heurísticas de la demo, no categorías curriculares oficiales. Las medias incluyen todos los intentos, incluidos reprobados. Una materia aprobada en intento posterior permanece aprobada. Mejorar una media histórica de área no implica que otra nota futura vaya a mejorar.

## Horas y estadísticas
extract-workload.py lee las cifras de docencia, prácticas y trabajo autónomo publicadas en los sílabos ya descargados; src/data/workload.json guarda procedencia. Se presentan como carga semanal orientativa del sílabo, no mediciones empíricas ni dificultad individual. Se informa si falta un dato. No se encontraron tablas verificables por asignatura de CI013v3 que permitan publicar notas medias, tasas de aprobación, tamaños de muestra y periodos. Esos valores permanecen no disponibles. Tampoco hay probabilidades individuales inventadas ni índices 0–100 que puedan confundirse con ellas.

Se revisó nuevamente ICora: https://www.cti.espol.edu.ec/es/CCSH%20ICora y su publicación primaria CHI 2021 https://www.cti.espol.edu.ec/sites/default/files/docs_pdf/Showing%20Academic%20Performance%20Predictions.pdf . El trabajo describe rangos de notas con modelos basados en árboles y una evaluación que utiliza datos sintéticos para controlar aspectos experimentales. Este antecedente no proporciona una calibración reutilizable para nuestro expediente. No se trasladaron sus porcentajes ni resultados a la interfaz.

Probabilidad futura: contrato Prediction {studentPseudonym, courseId, curriculumVersion, period, modelVersion, calibratedProbability:null|number, validationPopulation, sampleSize, calibrationDate, limitations}. El valor permanece null. Entrenamiento autorizado, separación temporal, prevención de fuga de información, calibración, Brier/log loss y revisión de subgrupos siguen pendientes como se detalla en FUTURO.md.

## Simulador de promedio
No está verificada la fórmula institucional aplicable: se muestra exclusivamente media simple ilustrativa. Proyección = (suma de notas de intentos ficticios + suma de notas hipotéticas) / (cantidad de intentos + cantidad de notas hipotéticas). Cada nota entre 0 y 10. El objetivo resuelve algebraicamente la media requerida en nuevas notas. Más de 10 se informa inalcanzable bajo esa fórmula. No pondera créditos, no sustituye el promedio oficial y no promete resultados. Marcar una reprobación en escenario usa 5/10 como supuesto visible; esa nota queda fija mientras ese resultado esté marcado.

## Nexi sin respuestas genéricas
Intenciones: recomendaciones, créditos, sustitución de materia seleccionada, matemáticas/promedio, postergación, resultados adversos, requisitos, integradora y estado del plan. Los valores y nombres proceden de funciones del motor con el estado del momento. Consultas no reconocidas reciben abstención. Una propuesta lleva ids de materias, se muestra y exige botón Confirmar; no modifica perfil ni calificaciones. El panel permite minimizar/ocultar/mostrar con persistencia. Mensajes no se persisten, pero el estado sí.

Para LLM opcional futuro: adaptador server-side POST /api/academic-agent con claves solo en entorno del servidor. Entrada de intención y contexto minimizado, herramientas con esquema y salida validada; modelo solo solicita herramientas, no escribe el historial. Propuesta debe pasar validate y confirmación humana. El frontend actual no contiene claves, endpoints externos ni selector engañoso de un servicio no implementado. La alternativa local funciona completa sin ese adaptador.

## Pruebas y límites
9 pruebas automatizadas del motor y flujo de UI a 360/390/412/1280px. Se comprueban propuestas, confirmación, persistencia, retiro de correquisitos, notas y reinicio. Capturas en research/polinexo. Conservamos catálogo e investigación; reglas verificadas limitadas a fuentes publicadas y requisitos adicionales pendientes excluidos. No se garantiza oferta, cupos, horarios o fecha de graduación.
