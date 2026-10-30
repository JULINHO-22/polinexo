import {PlanGrid} from './PlanGrid';
import React, {useMemo, useState} from 'react';
import {ArrowLeft, ArrowRight, Check, Briefcase, Info, GitBranch, Books, Clock, Plus} from '@phosphor-icons/react';
import catalog from '../data/catalog.json';
import {student} from '../data/student';
import hours from '../data/workload.json';
import careers from '../data/career-context.json';
import {area, areaStats, creditSum, validate, eligibility, search, compare, downstream, future, simulateHorizon, workload, type Preferences} from './engine';
import {TeacherEvidence} from './DecisionStudio';
import './flows.css';
import {AcademicCheck,PlanAdvice,LineMap,DelayWatch} from './AcademicReview';import {ScheduleCheck} from './ScheduleCheck';

const cs=catalog.courses;
const course=(id:string)=>cs.find(c=>c.id===id)!;
const friendly=(s:string)=>cs.reduce((text,c)=>text.replaceAll(c.id,c.name),s).replace('Correquisito simultáneo:','necesitas tomar también').replace('Falta aprobar','primero debes aprobar');
const names=(ids:string[])=>ids.map(id=>course(id)?.name||id).join(', ');
const level=(n:number)=>['100-I','100-II','200-I','200-II','300-I','300-II','400-I','400-II'][n-1]||'Por confirmar';
const careerMap:Record<string,{purpose:string;example:string;field:string;basis:string}>=careers;
const available=cs.filter(c=>c.code&&c.credits!==null&&!c.conditions.length&&!student.approved.includes(c.id)&&!student.inProgress.includes(c.id)&&c.prerequisites.every(id=>student.approved.includes(id)));
type Props={plan:string[];pref:Preferences;onApply:(ids:string[])=>void;onInspect:(id:string)=>void;onAsk:(q:string)=>void;onActivity:(v:'thinking'|'discovery'|'warning')=>void;onEdit:()=>void;onDiscuss?:(ids:string[],q:string)=>void;onReview?:(ids:string[])=>void};

function CourseSummary({id,onInspect,selected,children,explain=false}:{id:string;onInspect:(id:string)=>void;selected?:boolean;children?:React.ReactNode;explain?:boolean}){
 const c=course(id),career=careerMap[id];const stats=areaStats(cs,student).find(a=>a.name===area(c));const time=hours[id as keyof typeof hours];
 return <div className={'flow-course '+(selected?'is-selected':'')}>
  <div className="flow-course-heading">{children}<button className="course-name" onClick={()=>onInspect(id)}>{c.name}<small>{c.code}</small></button><b>{c.credits}<small>créditos</small></b></div>
  <details className="subject-more"><summary>Información y profesores</summary>
  {career&&<p><Briefcase size={14}/> {career.purpose}</p>}
  {explain&&<p>{stats?.mean!=null?`Tu media en esta área: ${stats.mean.toFixed(2)}. `:''}{time?`${time.independent} h de estudio autónomo por semana según sílabo.`:'Carga por verificar.'}</p>}
  {c.corequisites.some(r=>!student.approved.includes(r))&&<p>Tomar junto a {names(c.corequisites.filter(r=>!student.approved.includes(r)))}.</p>}
  <TeacherEvidence id={id}/><button className="subject-link" onClick={()=>onInspect(id)}>Ver requisitos y dependencias <ArrowRight size={14}/></button></details>
 </div>;
}

function PlanFacts({ids,onInspect}:{ids:string[];onInspect:(id:string)=>void}){
 const total=creditSum(ids,cs),load=workload(ids,hours);
 return <><div className="flow-plan-total"><span><strong>{ids.length}</strong> materias</span><span><strong>{total}</strong> créditos</span><span><Clock size={15}/>{load.total} h/sem. de referencia</span></div>{ids.map(id=><CourseSummary key={id} id={id} onInspect={onInspect}/>)}</>;
}

function SourceNote(){return <details className="flow-source"><summary>¿En qué se basa y qué falta confirmar?</summary><p>Créditos y relaciones: malla CI013v3 y sílabos publicados. Rendimiento personal: expediente ficticio. Las horas son una referencia de clases y estudio, no una medida demostrada de dificultad.</p><p>No tenemos tasas verificadas de aprobación por materia y profesor. Los puntajes docentes no son esas tasas. Cupos, profesores ofertados, franjas y horarios reales deben confirmarse en matrícula.</p></details>}

export function ChooseFlow(p:Props){
 const [mode,setMode]=useState<'mine'|'suggested'>('mine');
 const [draft,setDraft]=useState([...p.plan]);
 const [step,setStep]=useState<'select'|'review'>('select');
 const [size,setSize]=useState<number|'level'>(4);
 const validation=validate(draft,cs,student);
 const suggestion=useMemo(()=>{
  if(size==='level')return available.filter(c=>c.level===3).map(c=>c.id);
  return search(cs,student,{...p.pref,target:size===3?9:size===4?11:14,exactCredits:false,courseCount:size},hours).options[0]?.ids||[];
 },[size,p.pref]);
 const selected=mode==='mine'?draft:suggestion;
 const checked=validate(selected,cs,student);
 function choose(id:string){setDraft(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);p.onActivity('discovery');}
 function review(){if(checked.ok)p.onReview?.([...selected]);setStep('review');p.onActivity(checked.ok?'discovery':'warning');window.scrollTo({top:0,behavior:'smooth'});}
 if(step==='review')return <div className="academic-flow choose-flow">
  <button className="flow-back" onClick={()=>setStep('select')}><ArrowLeft size={15}/>Cambiar mi selección</button>
  <header className="flow-heading"><h2>Así quedaría tu próximo PAO</h2><p>Primero revisa el plan. Solo lo guardaremos cuando tú confirmes.</p></header>
  <PlanAdvice ids={selected} pref={p.pref} purpose="selection" onStatus={p.onActivity} onApply={p.onApply}/><AcademicCheck ids={selected} pref={p.pref}/><PlanFacts ids={selected} onInspect={p.onInspect}/>

  <section className="next-opportunities"><h3>¿Qué te permite hacer después?</h3><p>{future(selected,cs,student).length?'Si apruebas este plan, podrías cumplir los requisitos de '+names(future(selected,cs,student))+'.':'No identificamos nuevas materias habilitadas solo con esta selección; puede haber condiciones adicionales pendientes.'}</p></section>
  <LineMap ids={selected} onInspect={p.onInspect}/><div className="flow-confirm"><button className="flow-primary" disabled={!checked.ok} onClick={()=>p.onApply(selected)}>Guardar este plan de prueba<Check size={17}/></button></div><SourceNote/>
 </div>;
 return <div className="academic-flow choose-flow">
  <header className="flow-heading"><h2>Escoge tus próximas materias</h2><p>Estas son las materias que podrías tomar con lo que ya aprobaste.</p></header>
  <div className="flow-switch" aria-label="Forma de elegir"><button aria-pressed={mode==='mine'} onClick={()=>setMode('mine')}>Elegir yo</button><button aria-pressed={mode==='suggested'} onClick={()=>{setMode('suggested');p.onActivity('discovery')}}>Ver sugerencias</button></div>
  {mode==='mine'?<>
   <div className="selection-caption"><span>{draft.length} seleccionadas</span><strong>{creditSum(draft,cs)} / 9–15 créditos</strong></div>
   {[3,2,4].map(n=><section className="available-group" key={n}><h3>{n===3?'De tu nivel · '+level(n):n===2?'Pendiente de un nivel anterior':'También podrías adelantar · '+level(n)}</h3>{available.filter(c=>c.level===n).map(c=><CourseSummary key={c.id} id={c.id} selected={draft.includes(c.id)} onInspect={p.onInspect}><input aria-label={'Seleccionar '+c.name} type="checkbox" checked={draft.includes(c.id)} onChange={()=>choose(c.id)}/></CourseSummary>)}</section>)}
   <details className="flow-source"><summary>¿Por qué no aparecen todas las materias?</summary><p>Las aprobadas y en curso no se repiten. Las que todavía necesitan materias previas o tienen condiciones por verificar quedan fuera de esta lista.</p><p>{cs.filter(c=>c.code&&!student.approved.includes(c.id)&&!student.inProgress.includes(c.id)&&!available.some(a=>a.id===c.id)).map(c=>c.name).join(', ')}.</p></details>
   {!validation.ok&&<div className="selection-guidance" role="status">{validation.errors.map(e=><p key={e}>{friendly(e)}</p>)}</div>}
   <div className="selection-bottom"><span><b>{creditSum(draft,cs)} créditos</b><small>{draft.length} materias · Selección sin guardar</small></span><button className="flow-primary" disabled={!validation.ok} onClick={review}>Revisar selección<ArrowRight size={16}/></button></div>
  </>:<>
   <section className="suggestion-count"><h3>¿Cuántas materias te gustaría llevar?</h3><div>{[3,4,5,'level'].map(n=><button key={n} aria-pressed={size===n} onClick={()=>{setSize(n as number|'level');p.onActivity('discovery')}}>{n==='level'?'Mi nivel':n+' materias'}</button>)}</div></section>
   {suggestion.length>0&&checked.ok?<><div className="suggestion-title"><Books size={20}/><div><h3>{size==='level'?'Las materias verificadas de tu nivel':size===3?'Más espacio para otras actividades':size===4?'Un ritmo constante':'Más avance y más dedicación'}</h3><p>{size==='level'?'No incluye condiciones que aún faltan verificar.':`Nexi: ${size===3?'menos materias para concentrarte':size===4?'equilibra cantidad y avance':'más avance, con más horas de estudio'}. Requisitos revisados.`}</p></div></div><PlanFacts ids={suggestion} onInspect={p.onInspect}/><button className="flow-primary" onClick={review}>Revisar esta propuesta<ArrowRight size={16}/></button></>:<p className="selection-guidance">No se puede armar esta combinación con las condiciones verificadas. Prueba otra cantidad; no añadiremos créditos ni materias inventadas.</p>}
   <SourceNote/>
  </>}
 </div>;
}

export function ImproveFlow(p:Props){
 const stats=areaStats(cs,student).filter(a=>a.mean!==null).sort((a,b)=>(b.mean||0)-(a.mean||0));
 const strongest=stats[0];
 const proposal=useMemo(()=>search(cs,student,{...p.pref,priority:'promedio',target:9,exactCredits:false,courseCount:undefined},hours).options[0],[p.pref]);
 return <div className="academic-flow improve-flow recommendation-story">
  <header className="flow-heading"><h2>Mi recomendación para ti</h2><p>Para dedicar más tiempo a tus próximas notas.</p></header>
  {proposal?<><section className="recommendation-voice"><span className="voice-signature">Nexi · Tu próximo PAO</span><p>Te recomiendo <b>{proposal.ids.length} materias</b>. Tus mejores resultados están en <b>{strongest?.name.toLowerCase()}</b>{strongest?.mean!=null?` (${strongest.mean.toFixed(2)})`:''}; esta selección se apoya en esa área y evita acumular más créditos de los necesarios.</p><div className="recommendation-measures"><span><b>{proposal.credits}</b> créditos</span><span><b>{proposal.load.total}</b> h/semana de referencia</span></div><small>Historial de ejemplo. Buscamos margen para estudiar; no es una predicción de notas.</small></section>
  <section className="recommended-list" aria-label="Materias recomendadas">{proposal.ids.map((id,i)=><div className="recommended-subject" key={id}><span className="subject-number">{i+1}</span><button onClick={()=>p.onInspect(id)}><strong>{course(id).name}</strong><small>{course(id).credits} créditos · Ver materia y profesores</small></button><ArrowRight size={17}/></div>)}</section>
  <div className="recommendation-actions"><button className="flow-primary" onClick={()=>p.onApply(proposal.ids)}>Elegir estas materias<Check size={16}/></button><button className="ask-recommendation" onClick={()=>p.onDiscuss?.(proposal.ids,'Explícame esta recomendación para mejorar mis notas: '+names(proposal.ids)+'. Usa mis resultados por áreas y carga. No inventes probabilidades.')}>Preguntarle a Nexi <Info size={16}/></button></div><details className="recommendation-method"><summary>Por qué estas materias</summary><p>Se revisaron requisitos, créditos y tu rendimiento por áreas. La selección suma entre 9 y 15 créditos; las horas son una referencia de sílabos. Los profesores disponibles y sus evaluaciones se consultan dentro de cada materia.</p></details></>:<p>No encontramos un plan válido con los requisitos conocidos.</p>}
 </div>;
}

export function ImpactFlow(p:Props){
 const [view,setView]=useState<'full'|'postpone'>('full'),[focus,setFocus]=useState(p.plan[0]);
 const selected=p.plan.includes(focus)?focus:p.plan[0];
 return <div className="academic-flow impact-flow visual-impact"><header className="flow-heading"><h2>Tu avance en la malla</h2><p>Ve qué cambia al posponer una materia.</p></header>
 <div className="impact-view-tabs" aria-label="Vistas de tu planificación"><button aria-pressed={view==='full'} onClick={()=>setView('full')}>Plan completo</button><button aria-pressed={view==='postpone'} onClick={()=>setView('postpone')}>Si pospongo una materia</button></div>
 <div hidden={view!=='full'}><div className="plan-line"><strong>{p.plan.length} materias · {creditSum(p.plan,cs)} créditos</strong><button onClick={p.onEdit}>Editar plan <ArrowRight size={14}/></button></div><section className="full-plan-list">{p.plan.map(id=><button key={id} onClick={()=>p.onInspect(id)}><span>{course(id).name}</span><small>{course(id).credits} cr.</small></button>)}</section><ScheduleCheck ids={p.plan}/><details className="full-plan-map"><summary>Ver este plan en la malla</summary><PlanGrid ids={p.plan} onInspect={p.onInspect}/></details></div>
 {view==='postpone'&&<><section className="postpone-picker"><h3>Toca la materia que dejarías</h3><div>{p.plan.map(id=><button key={id} aria-pressed={selected===id} onClick={()=>{setFocus(id);p.onActivity('discovery')}}>{course(id).name}</button>)}</div></section><PlanGrid ids={p.plan} postponed={selected} onInspect={p.onInspect}/><button className="progress-ask" onClick={()=>p.onAsk('Mi plan es '+names(p.plan)+'. ¿Qué cambia en mi malla si pospongo '+course(selected).name+'? Explica una alternativa válida y las dependencias confirmadas en pocas palabras.')}>Preguntarle a Nexi <ArrowRight size={15}/></button></>}
 </div>;
}
