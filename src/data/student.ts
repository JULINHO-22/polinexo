import catalog from './catalog.json';

// Datos de demostración. No representan un expediente de ESPOL.
export const student = {
 name:'estudiante', registration:'2025*****', career:'Ingeniería en Computación', pao:'2026 · II PAO', level:'200-I',
 approved:['MATG1045','FISG1005','INDG1033','CCPG1043','IDIG1006','MATG1049','MATG1046','CCPG1052','IDIG1007'],
 failed:[], inProgress:['IDIG2012'],
 attempts:[
  {code:'MATG1045',pao:'2025-I',grade:7.1},{code:'FISG1005',pao:'2025-I',grade:7.8},
  {code:'INDG1033',pao:'2025-I',grade:8.9},{code:'CCPG1043',pao:'2025-I',grade:9.2},
  {code:'IDIG1006',pao:'2025-I',grade:8.4},{code:'MATG1049',pao:'2025-II',grade:5.7},
  {code:'MATG1049',pao:'2026-I',grade:7.4},{code:'MATG1046',pao:'2025-II',grade:7.3},
  {code:'CCPG1052',pao:'2025-II',grade:9.0},{code:'IDIG1007',pao:'2025-II',grade:8.8}
 ],
 generalAverage:null as number|null, completedCreditsOverride:null as number|null,
 preferences:{pace:'equilibrada',weeklyAvailability:null},
};
export const completedCredits=student.completedCreditsOverride??catalog.courses.filter(c=>student.approved.includes(c.id)).reduce((s,c)=>s+(c.credits||0),0);
export const average=student.generalAverage??Number((student.attempts.reduce((s,a)=>s+a.grade,0)/student.attempts.length).toFixed(2));

// Los 3 escenarios usan entre 9 y 15 créditos y satisfacen prerrequisitos y correquisitos conocidos
// para el historial ficticio anterior. No equivalen a disponibilidad o matrícula garantizadas.
export const routes=[
 {slug:'tranquila',name:'Ruta tranquila',subtitle:'Más espacio para tus otras actividades',codes:['TICG1018','IDIG1008','CCPG1039','CCPG1046'],load:'Ligera',reason:'Combina una materia técnica, inglés y dos materias de apoyo. Son nueve créditos sin necesidad de añadir asignaturas solo para completar el máximo.',tradeoff:'Estructuras de datos y Matemáticas discretas quedarían pendientes para un siguiente PAO.'},
 {slug:'equilibrada',name:'Ruta equilibrada',subtitle:'Avance constante, con una carga intermedia',codes:['CCPG1034','MATG1051','TICG1018','IDIG1008'],load:'Equilibrada',reason:'Incluye Estructuras de datos y Matemáticas discretas juntas porque comparten una relación de correquisito; añade bases de datos e inglés.',tradeoff:'Combina trabajo de programación y matemáticas: reserva tiempo de estudio para ambas.'},
 {slug:'intensiva',name:'Ruta intensiva',subtitle:'Más materias y mayor dedicación',codes:['CCPG1034','MATG1051','TICG1018','IDIG1008','CCPG1042','CCPG1039'],load:'Alta',reason:'Añade Diseño de software acompañado de su correquisito Sistema de bases de datos y completa quince créditos.',tradeoff:'Seis materias en un PAO pueden representar una carga considerable. El promedio por sí solo no justifica elegirla.'},
];
