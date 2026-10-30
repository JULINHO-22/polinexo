// Check claims of formal dependencies, not ordinary words such as "comunicación".
const norm=t=>t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
export function groundExplanation(message,inspected,courses){
 const together=courses.filter(c=>c.corequisites.includes(inspected.course.id)).map(c=>c.id);
 const allowed=new Set([inspected.course.id,...inspected.course.prerequisites,...inspected.course.corequisites,...together,...inspected.related]);
 const forbidden=courses.filter(c=>c.code&&!allowed.has(c.id));
 let adjusted=false;
 const text=message.split(/(?<=[.!?])\s+|\n+/).map(sentence=>{
  const s=norm(sentence);
  const formal=/(prerrequisit|correquisit|requisito|desbloque|habilita|se necesita antes|necesaria para|depende de|dependen de)/.test(s);
  if(!formal||!forbidden.some(c=>s.includes(norm(c.name))))return sentence;
  adjusted=true;
  const names=inspected.related.map(id=>courses.find(c=>c.id===id)?.name).filter(Boolean);
  return names.length?`${inspected.course.name} se necesita antes de ${names.join(', ')}; la oferta y los demás requisitos también cuentan.`:`No hay materias posteriores confirmadas que exijan aprobar ${inspected.course.name} en el catálogo disponible. Sus correquisitos deben revisarse antes de cambiar el plan.`;
 }).join(' ');
 return {message:text,adjusted};
}
