# Tres opciones, evaluación automática y escenarios

## Lo que se conserva y mejora

Las opciones **Elegir mis próximas materias**, **Mejorar mi promedio** y **Saber si me voy a atrasar** permanecen visibles también dentro de cada sección, incluidas las rutas directas como /planificador. Cada opción mantiene su contenido específico. Inicio de Mi ESPOL, catálogo y documentación académica se conservan.

Al seleccionar materias y pulsar **Revisar selección**, se ejecuta automáticamente una revisión con Gemma en la misma pantalla; no se exige volver a redactar o enviar las materias al chat. El resultado está separado de la comprobación determinista: créditos 9–15, requisitos, media simple de demostración, resultados por áreas, referencia de carga y materias posteriores. Guardar un plan sigue siendo una acción expresa y requiere validación. Una explicación generativa no es una predicción validada.

La revisión usa notas históricas ficticias; no dispone de notas parciales actuales ni de tasas por materia/docente verificadas. Esto figura en la interfaz y en el contexto enviado al modelo. Las valoraciones publicadas de profesores siguen separadas de tasas de aprobación. La revisión automática consume Gemini API, muestra errores reales, conserva las comprobaciones locales y guarda respuestas recientes durante cinco minutos en memoria para no repetir la misma consulta.

En **Mejorar mi promedio**, las materias propuestas tienen motivos específicos por área y tiempo de trabajo autónomo de sílabo. No se identifica un curso como fácil ni se promete subir el promedio por una estadística ausente.

## Análisis de un plan previsto

En **Saber si me voy a atrasar** se puede editar un borrador propio de materias del escenario, sin modificar automáticamente el plan guardado. Se distingue:

- Posponer una materia y comparar una sustitución válida.
- Reprobar una materia del plan, revisar lo que queda bloqueado y priorizar repetirla en el próximo PAO.
- Aprobar todas las materias y revisar opciones posteriores.

Las líneas muestran niveles de la malla, materias aprobadas del historial, materias seleccionadas, opciones habilitadas y requisitos pendientes. La proyección intenta hasta cinco PAO, con tres, cuatro o cinco materias por PAO posterior. Cada etapa construida debe satisfacer requisitos conocidos y 9–15 créditos. Si una combinación resulta imposible o faltan reglas, se detiene y lo explica. No rellena con créditos inventados ni garantiza una fecha de graduación.

**Repetir en el PAO siguiente** es una preferencia de este escenario, no una obligación institucional que se haya verificado. Cuando se activa, la siguiente etapa incluye la materia o informa que no puede construirse una combinación válida con las condiciones solicitadas.

## Horarios de clase: fuentes y límite actual

Se consultaron el [Académico en Línea de ESPOL](https://www.academico.espol.edu.ec/), documentación pública y búsquedas oficiales de planificación. No se obtuvo una oferta pública vigente verificable de Computación con códigos, PAO, paralelos, docentes y horas de clase. El [manual de Consejerías](https://consejerias.espol.edu.ec/manuales/Manual%20de%20usuario%20Consejeria%20Estudiante.pdf) describe horarios **de citas con el consejero**, no clases. No se trasladaron a Computación horarios de admisión, de FCV ni de una tesis sobre la oferta 2016–2017.

Por eso, no se presentan horarios semanales inventados como oficiales. Existe una entrada de **horario ya planificado** para registrar materia, día y hora, identificar cruces, intervalos inválidos y materias sin horario. Las clases que terminan exactamente cuando empieza otra no se consideran solapadas. Los cruces y los horarios faltantes se incorporan como contexto declarado de la revisión del escenario. Cambiar esas horas invalida el análisis anterior hasta volver a evaluar. No se han cargado exámenes, cupos ni franjas oficiales.

offerings-status.json mantiene la limitación y el contrato de datos futuro. Para generar horarios reales se requiere una fuente oficial vigente o una exportación autorizada, con identificación de PAO, versión, paralelo, clase/práctica/examen, docente, día/fecha, intervalo y actualización. No se accedió a cuentas privadas.

## Nexi

Se recupera **Acompañar**: un único personaje flotante, transparente y arrastrable, con posición limitada al área visible y sin recorrido automático. Regresa a su sitio con un botón; también puede moverse con flechas del teclado cuando tiene foco. Los gestos **Saludar, Saltar y Bailar** ocurren en el lugar donde se dejó al personaje.

Los brazos rotan alrededor del punto de unión con el cuerpo en coordenadas SVG; se retiró la traslación que despegaba el brazo. Las preferencias de movimiento reducido desactivan las animaciones. El modo acompañante no aplica planes ni navega por cuenta propia.

## Verificación

37 pruebas del motor, contratos y estadísticas, incluyendo repetición priorizada, combinación imposible de tres materias, intervalos horarios inválidos y cruces. Compilación TypeScript/Vite sin errores. Las comprobaciones con llamadas reales y navegador se guardan en research/revision-2026-10-30; no se confunden con las pruebas unitarias. test-flows-ui.mjs intercepta /api/chat con un error explícito durante su prueba automática de UI para evitar consumir cuota; no presenta un doble como respuesta real de Gemma.
