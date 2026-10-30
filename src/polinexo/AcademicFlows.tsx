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
 const [focus,setFocus]=useState<string|null>(null);
 const opened=future(p.plan,cs,student),valid=validate(p.plan,cs,student);
 const affected=focus?cs.filter(c=>downstream(focus,cs).includes(c.id)||c.corequisites.some(r=>r===focus)):[];
 const alternative=useMemo(()=>focus?search(cs,student,{...p.pref,priority:'avance',target:creditSum(p.plan,cs),exactCredits:false},hours,[focus]).options.sort((a,b)=>b.ids.filter(id=>p.plan.includes(id)).length-a.ids.filter(id=>p.plan.includes(id)).length)[0]:null,[focus,p.plan.join(),p.pref]);
 const lost=focus?opened.filter(id=>!future(p.plan,cs,student,[focus]).includes(id)):[];
 const horizon=useMemo(()=>simulateHorizon(p.plan,cs,student,p.pref,hours,[],3),[p.plan.join(),p.pref]);
 return <div className="academic-flow impact-flow progress-story">
 <header className="flow-heading"><h2>Así seguirías avanzando</h2><p>Esto es lo que tu selección deja abierto para después.</p></header>
 <section className="progress-intro"><span>Tu próximo PAO</span><h3>{p.plan.length} materias · {creditSum(p.plan,cs)} créditos</h3><p>{opened.length?`Si las apruebas, podrías cumplir los requisitos de ${opened.length} materias más.`:'Esta selección no habilita nuevas materias verificadas por sí sola.'}</p><button className="subject-link" onClick={p.onEdit}>Cambiar mis materias <ArrowRight size={14}/></button></section>
 {!valid.ok&&<p className="selection-guidance">{valid.errors.map(friendly).join('. ')}</p>}
 <DelayWatch ids={p.plan}/>
 <section className="progress-subjects" aria-label="Tu selección y sus consecuencias">{p.plan.map(id=><article className={'progress-subject '+(focus===id?'exploring':'')} key={id}><div><button className="progress-name" onClick={()=>p.onInspect(id)}>{course(id).name}<small>{course(id).credits} créditos · {level(course(id).level)}</small></button><button className="postpone-link" aria-expanded={focus===id} onClick={()=>{setFocus(focus===id?null:id);p.onActivity('discovery')}}>{focus===id?'Cerrar':'¿Y si la dejo?'}</button></div>{focus===id&&<section className="postpone-result"><h4>Si pospones {course(id).name}</h4><p>{lost.length?`Todavía no podrías habilitar ${names(lost)} con este plan.`:affected.length?'No cierra nuevas opciones inmediatas de esta selección, pero estas materias seguirían dependiendo de ella:':'No encontramos materias posteriores que la exijan en las relaciones verificadas.'}</p>{affected.length>0&&<div className="dependency-pills">{affected.map(c=><button key={c.id} onClick={()=>p.onInspect(c.id)}>{c.name}<small>{level(c.level)}</small></button>)}</div>}
 {alternative&&validate(alternative.ids,cs,student).ok?<div className="single-replacement"><strong>Una forma de reorganizarlo</strong><p>{names(alternative.ids)}</p><small>{alternative.credits} créditos · Requisitos conocidos revisados</small><button onClick={()=>p.onApply(alternative.ids)}>Usar este cambio <Check size={14}/></button></div>:<p>No encontramos un reemplazo válido de 9–15 créditos.</p>}
 <button className="subject-link" onClick={()=>p.onAsk('Mi plan es '+names(p.plan)+'. Estoy pensando posponer '+course(id).name+'. Explica en pocas palabras qué materias afectaría y si conviene cambiar la selección.')}>Que Nexi me lo explique <ArrowRight size={14}/></button></section>}</article>)}</section>
 <section className="next-door"><h3>Después de aprobar este plan</h3>{opened.length?<div className="dependency-pills">{opened.map(id=><button key={id} onClick={()=>p.onInspect(id)}>{course(id).name}<small>{level(course(id).level)}</small></button>)}</div>:<p>Revisa las pendientes de niveles anteriores antes de decidir.</p>}<small>Son requisitos académicos; la oferta y los cupos se confirman en matrícula.</small></section>
 <details className="progress-timeline"><summary>Ver un posible recorrido por PAO</summary>{horizon.steps.map((step,i)=><div className="roadmap-stop" key={step.term}><span className="roadmap-dot">{step.term}</span><div><h4>{i===0?'Tu selección':`PAO ${step.term}`}</h4><p>{step.valid?names(step.ids):'Falta información para completar este PAO.'}</p>{step.valid&&<small>{step.credits} créditos</small>}</div></div>)}<small>Ejemplo sujeto a aprobación y oferta, con hasta cuatro materias posteriores. No calcula una fecha de graduación.</small></details>
 <button className="progress-ask" onClick={()=>p.onAsk('Analiza mi plan de '+names(p.plan)+'. Dime brevemente qué materias conviene mantener para no cerrar opciones en próximos PAO, con requisitos verificados.')}>Preguntarle a Nexi sobre mi avance <ArrowRight size={16}/></button>
 <ScheduleCheck ids={p.plan}/>
 </div>;
}
