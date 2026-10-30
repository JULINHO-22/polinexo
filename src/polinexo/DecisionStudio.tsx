import React,{useState} from 'react';
import saac from '../data/saac-reviews.json';
import community from '../data/community-reviews.json';
export function TeacherEvidence({id}:{id:string}){
 const [source,setSource]=useState<'saac'|'poli'>('saac');
 const official=saac.records.filter(r=>r.courseCode===id);const external=community.records.filter(r=>r.courseCode===id);
 const active=official.length?source:external.length?'poli':source;
 return <section className="teacher-evidence teacher-results"><div className="teacher-source-tabs">{official.length>0&&<button aria-pressed={active==='saac'} onClick={()=>setSource('saac')}>SAAC · por periodo</button>}{external.length>0&&<button aria-pressed={active==='poli'} onClick={()=>setSource('poli')}>PoliRecomienda · ajustado</button>}</div>
 {active==='saac'?official.map(r=><details className="professor-card" key={r.teacher+r.period}><summary><span>{r.teacher.toLocaleLowerCase('es')}<small>{r.period}</small></span><b>{(r.sections.reduce((n,x)=>n+x.score,0)/r.sections.length).toFixed(1)}<small>evaluación</small></b></summary><div>{r.sections.map(x=><p key={x.parallel}>Paralelo {x.parallel}<b>{x.score.toFixed(2)} puntos</b><small>{x.responsePercent} % de respuesta</small></p>)}<small>Media simple entre paralelos del periodo, no entre votos individuales.</small></div></details>):external.map(r=><details className="professor-card" key={r.teacherName}><summary><span>{r.teacherName.toLocaleLowerCase('es')}<small>Promedio ajustado</small></span><b>{r.score.toFixed(2)}</b></summary><p>Periodo y número de evaluaciones no publicados. Consulta: {r.checked}.</p></details>)}
 {!official.length&&!external.length&&<p className="empty-evidence">Aún no hemos incorporado esta materia. No significa que no existan evaluaciones en las fuentes.</p>}
 <small className="teacher-footnote">Evaluación del docente, no porcentaje de aprobados. Cobertura parcial.</small><details className="evidence-source"><summary>Datos de la consulta</summary><p>SAAC: media de paralelos por docente y periodo. PoliRecomienda: puntaje ajustado publicado; se muestra separado.</p><a href={'https://saac.espol.edu.ec/heteroevaluacion-reportes/paralelos-materia/'+id+'/1/10'} target="_blank" rel="noreferrer">SAAC ↗</a> · <a href="https://polirecomienda.robtrivi.com/inicio" target="_blank" rel="noreferrer">PoliRecomienda ↗</a></details></section>;
}
