# Arquitectura y siguiente fase
## Separación actual
src/data/catalog.json: información institucional por versión y procedencia por campo. sources.json: registro de fuentes. special-rules.json: reglas y vigencia limitada. student.ts: identidad y expediente sintéticos y rutas preparadas. Los estados de la malla son una proyección de demostración, no un permiso para matrícula. Los helpers de presentación no son un recomendador.

## Tres módulos independientes futuros
1. Elegibilidad: motor determinista de reglas versionadas (AND/OR, aprobado, cursando, correquisito simultáneo, mínimos de créditos/materias, prácticas, autorizaciones). Resultado triestado: cumple / no cumple / información insuficiente, con evidencia y regla. Cierre de correquisitos sobre la combinación completa. Una regla pendiente nunca produce elegibilidad definitiva.
2. Conveniencia: carga de sílabo, preferencias explícitas, disponibilidad, intentos y características longitudinales. El promedio es un atributo contextual, no un veto ni mandato de carga máxima. Presentar alternativas y razones comprensibles.
3. Avance: grafo dirigido por versión, dependencias directas y transitivas, cuellos de botella y escenarios condicionados a oferta. No convertir conexiones en fecha garantizada de graduación.

Contratos propuestos: EligibilityResult {courseId, curriculumVersion, outcome, ruleEvidence, missingData}; CourseStatistics {courseId, population, termRange, n, gradeMean, passRate, source, synthetic}; Prediction {studentPseudonym, courseId, modelVersion, probability, calibrationVersion, interval, missingness}; RouteExplanation {courses, eligibilityEvidence, workloadAssumptions, tradeoffs, conditionalUnlocks}. Mantener corequisitos separados de prerrequisitos; desbloqueo no significa que todos los demás requisitos se satisfagan.

## Modelo real, aún no implementado
Solo con datos autorizados y seudonimizados: fijar población y definición de aprobación/retiro; conocer versiones curriculares e intentos; separar cohortes temporalmente; evitar usar notas futuras y filtrar información del mismo estudiante entre particiones cuando corresponda. Comparar contra baselines sencillos. Empezar con regresión logística interpretable; evaluar modelos más complejos únicamente con beneficio demostrado. Medir Brier score, log loss y curvas de calibración además de discriminación; calibrar en partición separada, evaluar subgrupos y deriva por periodo. Exigir tamaño de muestra suficiente y abstención si falta evidencia. Una nota predicha no es probabilidad de aprobar: requiere definición y validación distintas.

Evaluación prospectiva con estudiantes y consejeros: comprensión de consecuencias, utilidad, carga percibida, decisiones autónomas, rendimiento sin penalizar perfiles. Validación experta de reglas y comparación del grafo. No prometer 95% ni graduación anticipada. Revisar ICora y publicaciones originales antes de reivindicar novedad o resultados.

Integración institucional futura mediante contrato autorizado y autenticación institucional; nunca almacenar contraseñas en frontend. Aplicar roles, minimización de datos, auditoría y consentimiento. No hay backend ni cuenta institucional en esta entrega.
