# Corrección de fidelidad visual · versión 3

Se corrigió el frontend extraído del ZIP, en carpeta independiente para conservar tanto el adjunto como el trabajo local anterior. El catálogo y los documentos académicos de entrada permanecen sin modificaciones.

## Referencia y recursos
Capturas originales de 576 × 1280. Para comparación se excluyeron 40px superiores y 20px inferiores de barras del sistema. Se anonimizó el bloque de identidad en la referencia comparativa. Se recortaron logo, herramientas superiores, avatar, historia, seis íconos de servicio, íconos inferiores y favorito. Assets en public/assets/miespol; coordenadas y procedencia en research/recortes.json. No se incorporaron datos personales ni se usó la pantalla completa como fondo.

Los recursos son rasterizados de las capturas y conservan sus limitaciones de compresión/resolución. Para producción conviene solicitar a ESPOL los originales vectoriales autorizados. Se aplicó transparencia a fondos neutros y al ícono de favorito. No se usaron emojis ni sustitutos genéricos para los servicios originales. El ícono nuevo de Mi Ruta usa Phosphor, el sistema existente.

## Comparación y correcciones
Comparación lado a lado: research/correccion/comparacion-576.png. Se alinearon dimensiones relativas del encabezado, avatar, banda histórica, retícula 3 × 2, paginador y favoritos. La identidad ficticia ocupa el lugar del perfil real. El contenido original era una pantalla capturada con desplazamiento; los favoritos se completan con la segunda referencia y siguen accesibles al desplazarse.

Barra única de seis accesos: Inicio / Sirena / QR / Mi Ruta / Huella / Perfil. Solo Inicio y Mi Ruta navegan; los demás son elementos visuales sin enlace. Mi Ruta aparece activa en todas sus vistas. Favoritos conserva tarjeta verde y azul con signo más, sin recomendaciones añadidas. No se recrearon servicios externos.

La navegación fija puede pasar visualmente sobre contenido durante el desplazamiento, como en la referencia; existe espacio inferior de reserva para desplazar el último contenido completamente por encima. No está fijada a la mitad del documento ni bloquea la interacción con el contenido al final.

## Académico y pruebas
El ZIP ya incluía rutas de 9, 11 y 15 créditos; se conservaron y verificaron contra el catálogo y el historial importados del mismo archivo TS, no contra una copia de datos. Validaciones: suma con créditos existentes, unicidad, no aprobadas ni en curso, prerrequisitos aprobados, correquisitos aprobados o simultáneos y ausencia de condiciones numéricas desconocidas. Una materia reprobada previamente puede repetirse si cumple las reglas conocidas: el intento de Álgebra está reprobado pero la asignatura ya fue aprobada posteriormente y no aparece en rutas.

No se presume validez de matrícula: oferta, cupos, horarios y autorizaciones se confirman institucionalmente. Se preservan las excepciones e incertidumbres de special-rules.json. No hay predicciones ni acceso a cuentas.

review-correction.mjs recorre siete vistas en 360, 390, 412 y 1280px y la portada en 576px: 29 combinaciones; revisa desbordamiento, imágenes, errores, estado activo y seis accesos. Comprueba clic en Inicio y Mi Ruta. Capturas reales y resultados en research/correccion. validate-correction.mjs prueba las combinaciones con los datos vigentes. Compilación: npm run build.

## Skills
Se aplicó frontend-design para una reconstrucción que preserva identidad; se reutilizó la inspección de Niot de la fase anterior. Sus guías taste-skill no se aplicaron como plantilla de landing. Niot no se modificó. Recortes con Pillow por instrucción expresa del usuario, pruebas con Playwright y Chrome local. Sin nuevas dependencias ni servicios de pago.
