# Correcciones visuales y académicas — versión 2

## 1. Hallazgos del proyecto que se recibió

- Inicio independiente de Mi ESPOL (avatar pequeño, estructura de otra web, favoritos poco relacionados con la captura, navegación inferior distinta).
- Una ruta de ejemplo con 7 créditos y por tanto fuera del intervalo ordinario de 9–15 para condición de regularidad.
- Resumen visual y tarjetas poco consistentes con la pantalla original.
- Rutas estáticas con apariencia de recomendaciones personalizadas, sin motor real.

## 2. Solución aplicada

- Portada reconstruida visualmente a partir de las capturas que adjuntó el estudiante, pero usando una ilustración y recursos propios; sin copiar nombre, matrícula ni foto de terceros.
- Mantener los seis servicios que aparecen en la captura, y añadir Mi Ruta como un favorito natural. En Académico existe otra entrada a la función. Las áreas externas a Mi Ruta permanecen ilustrativas.
- Tres escenarios de demostración de **9, 11 y 15 créditos**:
  - Ligera: `TICG1018`, `IDIG1008`, `CCPG1039`, `CCPG1046` = 9.
  - Equilibrada: `CCPG1034`, `MATG1051`, `TICG1018`, `IDIG1008` = 11.
  - Intensiva: `CCPG1034`, `MATG1051`, `TICG1018`, `IDIG1008`, `CCPG1042`, `CCPG1039` = 15.
- Verificador de dependencias que compara el historial simulado con los prerrequisitos y correquisitos registrados en el catálogo, además de comprobar el intervalo de créditos.
- Vista de materia con espacio de probabilidad 0–100 %, pero sin generar una predicción ficticia.

## 3. Límites que no deben ocultarse

Las rutas son demostraciones estáticas y solo validan las dependencias y los créditos **conocidos**. No son recomendaciones calculadas, no consultan horarios ni cupos, y los datos del historial son ficticios.

Las mallas por cohorte, excepciones de matrícula, requisitos de integración curricular y créditos de prácticas deben confirmarse en cada PAO. En particular, nueve créditos constituyen el umbral ordinario de regularidad y no una obligación universal de matrícula.

## 4. Pruebas de esta entrega

- Comprobación TypeScript con `tsc --noEmit`.
- Renderizado estático de Inicio, Académico, Mi Ruta, Planifica y materias.
- Revisión visual a 390 × 844, sin desbordamiento horizontal en las cuatro vistas principales.
- Cálculo de las sumas: 9, 11 y 15 créditos. Verificación programática de dependencias conocidas.

La compilación Vite completa no se pudo ejecutar en este contenedor porque la instalación original de las dependencias traía binarios para Windows; en Windows debe ejecutarse `npm install` para recuperar las dependencias nativas correctas antes de `npm run build`.
