# PoliNexo · Nexi + Gemma 4

Acompañamiento académico explicable para estudiantes de ESPOL. Evoluciona el proyecto existente: el estudiante plantea un objetivo, Gemma interpreta y consulta herramientas, el motor calcula y Nexi presenta propuestas que requieren confirmación.

## Equipo

**Club: IEEE Computer Society**

- Mirka Valentina Velez Molina
- Julinho Jesus Plua Mendosa
- Andy Javier Cobeña Ponce

## Iniciar
Node.js **24**. No se necesita base de datos.

    npm ci
    # Copiar .env.example a .env y configurar la clave solo si se va a usar IA.
    npm run dev -- --port 5174

Abrir http://127.0.0.1:5174/polinexo o /inicio. `npm run build` compila; `npm run preview` también monta la API local para revisar el resultado de producción.

Sin clave, el planificador y los simuladores funcionan con el motor local; la conversación muestra **IA desconectada** y no inventa respuestas de Gemma. No hay un chatbot de palabras clave usado como sustituto silencioso.

## Google Gemma mediante Gemini API
Modelo predeterminado exacto: **gemma-4-26b-a4b-it**. Alternativa explícita: **gemma-4-31b-it**, configurando GEMMA_MODEL y reiniciando. SDK oficial **@google/genai 2.32.0**; invocación `models.generateContent` en server/http.mjs, orquestada por server/agent.mjs. Nunca se sustituye por un modelo Gemini.

En `.env` privado:

    GEMINI_API_KEY=tu_clave_local
    GEMMA_MODEL=gemma-4-26b-a4b-it

La clave no lleva prefijo VITE_, no aparece en navegador ni Git. Reiniciar el servidor después de modificarla. Consultar https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api para obtener acceso; no se activa facturación ni se crea una cuenta desde el proyecto.

Gemma comprende español libre y conversación contextual; solicita herramientas para consultar expediente y requisitos, buscar combinaciones, comparar cambios y simular medias. El motor decide créditos, prerrequisitos, correquisitos, carga y consecuencias. Toda propuesta vuelve a validarse y exige confirmación. Una explicación generativa puede contener errores y no representa una decisión institucional.

**Estado de esta entrega:** ambos modelos devolvieron respuestas reales con la clave privada local. La disponibilidad puede variar por cuota o errores del proveedor; los escenarios reales y sus resultados se registran en research/gemma/live-e2e.json. El paquete público no contiene esa clave y requiere configurar una propia. Las pruebas unitarias con dobles no acreditan por sí solas uso real.

## Prueba para el hackathon

    npm run verify:gemma
    npm run test:live

El primer comando prueba los dos modelos con la clave local y guarda evidencia sin secretos. El segundo, con el servidor activo, prueba las tres conversaciones reales. Sin clave informa SKIP, nunca éxito ficticio. El panel avanzado muestra modelo y última llamada real verificada. docs/GEMMA.md explica las trazas, límites y criterios pendientes para los premios.

## Experiencia actual
- **Elegir próximas materias:** lista de materias disponibles por nivel → selección propia → revisión → confirmación. El modo separado Ver sugerencias ofrece 3, 4, 5 materias o las verificadas del nivel. En el ejemplo suman 9, 11, 14 y 13 créditos.
- **Mejorar promedio:** resultados por áreas y una propuesta de carga para dejar margen de estudio; no empieza por notas hipotéticas ni promete que una materia sea fácil.
- **Consecuencias:** sustitución concreta y comparación del plan por PAO, con dependencias confirmadas y supuestos explícitos. Incluye escenarios de reprobación y hasta cinco PAO. No predice graduación ni inventa horarios de clases; se pueden ingresar horas propias para comprobar cruces, sin presentarlas como oferta oficial.

Las tres opciones están en Inicio y abren vistas independientes; el chat se despliega a petición. Revisar selección consulta automáticamente a Gemma en la misma pantalla. Nexi tiene gestos de saludo, salto y baile; Acompañar permite colocarlo a mano, sin recorrido automático. Se puede tocar para saludar, animar, ocultar y recuperar. Reduced-motion desactiva animaciones. El borrador puede estar incompleto, pero todo plan confirmado debe ser válido y sumar 9–15 créditos. La conversación usa Gemma real, con motor de requisitos y propuestas que necesitan confirmación.

Consultar docs/REVISION-30-OCTUBRE.md y docs/EXPERIENCIA-ACTUAL.md para decisiones, fuentes y límites vigentes. docs/ACOMPANAMIENTO.md conserva el historial de la revisión anterior.

## Calidad

    npm test
    npm run test:ui
    npm run build

Pruebas de motor, presupuesto de búsqueda, contrato de herramientas, validación de propuestas, errores de servidor y cálculos de valoraciones. El script de navegador comprueba los tres flujos separados, selección, correquisitos, modalidades de carga, ficha y reduced-motion. Las pruebas de navegador utilizan Chrome instalado en la ruta declarada en scripts/test-flows-ui.mjs. No se instala un navegador ni una extensión. Capturas locales de la revisión actual en research/flows; no se incluyen en la fuente pública para evitar redistribuir gráficos institucionales.

## Repositorio y licencias
LICENSE MIT para código original y Nexi. THIRD_PARTY_NOTICES.md distingue material propio de los recortes de Mi ESPOL. **No se asume autorización de redistribución de esos recortes.** La demo local los conserva; la fuente pública los sustituye por imágenes originales de referencia. No es una actualización oficial de ESPOL.

`npm run export:public` prepara release/polinexo-public, inicializa Git local y genera inventario de licencias. No publica en GitHub. Exportar requiere Python/Pillow solo para generar los sustitutos; ejecutar la aplicación pública ya exportada solo requiere Node. El repositorio público excluye claves, node_modules, copias antiguas, documentos ajenos y PDFs de investigación. Obtener autorización antes de volver a incluir imágenes de Mi ESPOL. Repositorio público: https://github.com/JULINHO-22/polinexo · Repositorio privado de despliegue: https://github.com/JULINHO-22/polinexo-render.

Investigación académica preservada en docs/INVESTIGACION.md, docs/CATALOGO.md y src/data. Condiciones no verificadas se excluyen de recomendaciones. Oferta, cupos, horarios y vigencia por cohorte deben ratificarse con ESPOL. Tasas históricas y probabilidades individuales siguen no disponibles.

## Fuentes de las recomendaciones
Las propuestas emplean requisitos verificados de la malla, carga de sílabos y rendimiento **ficticio** por áreas. Hay explicaciones laborales orientativas para 21 materias, visibles junto a sus nombres y ampliadas en el detalle con fuente.

Se verificaron manualmente 13 puntajes docentes de dos materias en PoliRecomienda, por código exacto. Se muestran todos los de esa muestra y se calculan media y mediana entre puntajes publicados. No es el promedio de votos individuales; muestra y periodo no están publicados. No hay integración automática ni cobertura de todos los profesores.

No se encontraron en las fuentes públicas consultadas tasas verificables de aprobados/reprobados para cada materia y profesor de esta malla. Las cifras antiguas agregadas por universidad, facultad o admisión no se trasladan a asignaturas. No se inventan probabilidades de aprobar.

## Premios y despliegue
Modelo exacto **gemma-4-26b-a4b-it**, mediante **Gemini API**, SDK @google/genai. Gemma interpreta consultas y explica planes en el chat y la revisión automática; el motor valida sus propuestas. Código original bajo MIT. Ver [categorías, integración y Render](docs/REPOSITORIOS-Y-RENDER.md). Render: Web Service Node 24, build `npm ci && npm run build`, start `npm start`; GEMINI_API_KEY solo en Environment.

### Revisión de recomendaciones y docentes
Mejorar mi promedio presenta una sola propuesta y permite conversar sobre esa selección. La ficha separa Materia y Profesores. SAAC cubre una muestra de seis materias y PoliRecomienda una muestra de tres; no hay sincronización automática ni cobertura completa. Datos por código y periodo, sin convertir evaluaciones en probabilidades. Ver [revisión y fuentes](docs/REVISION-RECOMENDACION-UNICA.md).

## Entrega y contribuciones
[Guía de entrega y demo](docs/ENTREGA-HACKATHON.md). Contribuciones declaradas por el equipo: Julinho Jesus Plua Mendosa: código y diapositivas; Mirka Valentina Velez Molina: investigación y diapositivas; Andy Javier Cobeña Ponce: investigación y diapositivas. Antes del hackathon ya existía una base de código desarrollada por Julinho; no se presenta todo el código como creado durante el evento. Se utilizó Codex como asistente para investigación, implementación y revisión, y Gemma dentro del producto. El equipo debe poder explicar el código y sus decisiones.

Tecnologías: React, TypeScript, Vite, Node.js 24, @google/genai y Gemma 4 mediante Gemini API. Modelo predeterminado: gemma-4-26b-a4b-it. Licencia MIT para código original; atribuciones y excepciones en THIRD_PARTY_NOTICES.md. Datos personales ficticios; evaluaciones docentes no equivalen a aprobación. No hay integración privada con Académico ESPOL.
