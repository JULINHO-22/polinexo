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
 const [scenarioPlan,setScenarioPlan]=useState([...p.plan]),[planDraft,setPlanDraft]=useState([...p.plan]),[editing,setEditing]=useState(false);const [scenarioMode,setScenarioMode]=useState<'postpone'|'fail'|'pass'>('postpone');const [scheduleEvidence,setScheduleEvidence]=useState('No se ingresaron horas de clase.'),[submittedSchedule,setSubmittedSchedule]=useState('');
 const [focus,setFocus]=useState(scenarioPlan.includes('CCPG1034')?'CCPG1034':scenarioPlan[0]);
 const [show,setShow]=useState(false),[route,setRoute]=useState<'original'|'alternative'>('alternative');
 const alternatives=useMemo(()=>search(cs,student,{...p.pref,priority:'avance',target:creditSum(scenarioPlan,cs),exactCredits:false},hours,[focus]).options.sort((a,b)=>b.ids.filter(id=>scenarioPlan.includes(id)).length-a.ids.filter(id=>scenarioPlan.includes(id)).length),[focus,scenarioPlan,p.pref]);
 const alternative=alternatives[0];
 const changes=alternative?compare(scenarioPlan,alternative.ids,cs,student):null;
 const selected=route==='original'?scenarioPlan:alternative?.ids||[];
 const horizon=useMemo(()=>show?simulateHorizon(selected,cs,student,p.pref,hours):null,[show,selected.join(),p.pref]);
 const affected=downstream(focus,cs);
 const originalHorizon=useMemo(()=>show?simulateHorizon(scenarioPlan,cs,student,p.pref,hours):null,[show,scenarioPlan,p.pref]);
 const replacementHorizon=useMemo(()=>show&&alternative?simulateHorizon(alternative.ids,cs,student,p.pref,hours):null,[show,alternative?.ids.join(),p.pref]);
 const moved=affected.map(id=>({id,before:originalHorizon?.steps.findIndex(s=>s.ids.includes(id))??-1,after:replacementHorizon?.steps.findIndex(s=>s.ids.includes(id))??-1})).filter(x=>x.before>=0&&x.after>x.before);
 return <div className="academic-flow impact-flow">
  <header className="flow-heading"><h2>¿Qué cambia en los próximos PAO?</h2><p>Compara tu selección: aprobar, posponer o repetir una materia.</p></header>
  <DelayWatch ids={scenarioPlan}/><section className="impact-current"><div><h3>Partimos de tu plan</h3><button onClick={()=>setEditing(!editing)}>Editar este escenario</button></div><p>{names(scenarioPlan)}</p><small>{scenarioPlan.length} materias · {creditSum(scenarioPlan,cs)} créditos</small></section>
  {editing&&<section className="scenario-editor"><h3>Materias de tu plan previsto</h3><p>Este borrador solo cambia el escenario que analizas.</p>{available.map(c=><label className="scenario-course-check" key={c.id}><input type="checkbox" checked={planDraft.includes(c.id)} onChange={()=>setPlanDraft(a=>a.includes(c.id)?a.filter(id=>id!==c.id):[...a,c.id])}/><span>{c.name}<small>{c.credits} créditos · Nivel {level(c.level)}</small></span></label>)}<p>{creditSum(planDraft,cs)} créditos seleccionados</p>{validate(planDraft,cs,student).errors.map(e=><p className="selection-guidance" key={e}>{friendly(e)}</p>)}<button disabled={!validate(planDraft,cs,student).ok} onClick={()=>{setScenarioPlan([...planDraft]);setFocus(planDraft[0]);setShow(false);setEditing(false)}}>Usar estas materias en el escenario</button></section>}
  <label className="impact-question">Escenario<select value={scenarioMode} onChange={e=>{setScenarioMode(e.target.value as typeof scenarioMode);setShow(false)}}><option value="postpone">Si dejo una materia para después</option><option value="fail">Si no apruebo una materia del plan</option><option value="pass">Si apruebo todo lo que planeo tomar</option></select></label>
  <ScheduleCheck ids={scenarioPlan} onReport={report=>{setScheduleEvidence(report);setShow(false)}}/>
  {scenarioMode!=='pass'&&<label className="impact-question">{scenarioMode==='fail'?'Materia a repetir':'Materia a posponer'}<select value={focus} onChange={e=>{setFocus(e.target.value);setShow(false);p.onActivity('discovery')}}>{scenarioPlan.map(id=><option key={id} value={id}>{course(id).name}</option>)}</select></label>}
  <button className="flow-primary" onClick={()=>{setSubmittedSchedule(scheduleEvidence);setShow(true);p.onActivity('discovery')}}>Analizar mi plan<GitBranch size={17}/></button>
  {show&&scenarioMode!=='postpone'&&<OutcomeScenario plan={scenarioPlan} failed={scenarioMode==='fail'?[focus]:[]} pref={p.pref} scheduleEvidence={submittedSchedule} onStatus={p.onActivity} onInspect={p.onInspect} onApply={p.onApply}/>}
  {show&&scenarioMode==='postpone'&&<>
   <PlanAdvice ids={scenarioPlan} pref={p.pref} purpose="future" onStatus={p.onActivity} context={'Estoy pensando posponer '+course(focus).name+'. '+submittedSchedule} onApply={p.onApply}/>
   <section className="consequence-reading"><h3>Lo que sí cambia</h3>{affected.length?<><p>Si dejas <b>{course(focus).name}</b>, estas materias seguirán necesitando que la apruebes:</p>{affected.map(id=><button key={id} onClick={()=>p.onInspect(id)}><span>{course(id).name}<small>Nivel {level(course(id).level)} · Dependencia confirmada</small></span><ArrowRight size={16}/></button>)}</>:<p>No encontramos materias posteriores que la exijan directamente o en cadena. Podría haber otros requisitos que todavía no están verificados.</p>}<p className="conditional-reading">Esto muestra una condición pendiente; no demuestra que te graduarás uno o dos PAO más tarde.</p></section>
   {alternative&&changes?<><section className="replacement-reading"><h3>Para mantener un plan válido</h3>{changes.beforeFuture.filter(id=>!changes.afterFuture.includes(id)).map(id=><p className="verified-next-term" key={id}>Con tu plan actual, aprobar sus materias podría permitirte cursar <b>{course(id).name}</b> en el PAO siguiente. Esta alternativa todavía no cumple todos sus requisitos.</p>)}<p><b>Mantendrías:</b> {names(scenarioPlan.filter(id=>alternative.ids.includes(id)))||'Ninguna de las materias actuales'}.</p><p><b>Dejarías para otro PAO:</b> {names(changes.removed)}.</p><p><b>En su lugar podrías tomar:</b> {names(changes.added)||'No es necesario añadir otra materia'}.</p><strong>{alternative.credits} créditos · {alternative.ids.length} materias</strong></section>
    <LineMap ids={alternative.ids} onInspect={p.onInspect}/><section className="term-roadmap"><h3>Compáralo por PAO</h3>{moved.map(m=><p className="scenario-difference" key={m.id}>En este ejercicio, <b>{course(m.id).name}</b> aparece en el PAO {m.before+1} con tu plan y en el PAO {m.after+1} con el cambio. Es un escenario sujeto a aprobación y oferta.</p>)}<div className="flow-switch"><button aria-pressed={route==='original'} onClick={()=>setRoute('original')}>Tu plan actual</button><button aria-pressed={route==='alternative'} onClick={()=>setRoute('alternative')}>Con el cambio</button></div>{horizon?.steps.map((s,i)=><div className={'roadmap-stop '+(!s.valid?'incomplete':'')} key={s.term}><span className="roadmap-dot">{i+1}</span><div><h4>{i===0?'Próximo PAO':i===1?'PAO siguiente':'Un PAO después'}</h4>{s.valid?<><p>{names(s.ids)}</p><small>{s.credits} créditos · {s.ids.length} materias</small></>:<p>No podemos completar este PAO con las condiciones conocidas. Hay requisitos que deben revisarse.</p>}</div></div>)}<p className="roadmap-assumptions">Ejercicio con hasta cuatro materias en PAO posteriores. Supone que apruebas y que se ofertan los cursos. No es un horario de clases ni una fecha de graduación.</p></section>
    <button className="flow-primary" onClick={()=>p.onApply(alternative.ids)}>Guardar el plan con este cambio<Check size={16}/></button>
   </>:<p className="selection-guidance">No encontramos una sustitución válida entre 9 y 15 créditos. Tu plan no se cambia.</p>}
   <button className="impact-ask" onClick={()=>p.onAsk('Estoy pensando posponer '+course(focus).name+'. Mi plan es '+names(scenarioPlan)+'. Explica brevemente las consecuencias a mediano y largo plazo y una sustitución válida, sin inventar retrasos exactos.')}>Que Nexi me lo explique en pocas palabras</button><SourceNote/>
  </>}
 </div>;
}

function OutcomeScenario({plan,failed,pref,onInspect,onApply,scheduleEvidence,onStatus}:{plan:string[];failed:string[];pref:Preferences;scheduleEvidence:string;onStatus:(v:'thinking'|'discovery'|'warning')=>void;onInspect:(id:string)=>void;onApply:(ids:string[])=>void}){
 const [retryNext,setRetryNext]=useState(true),[maxCourses,setMaxCourses]=useState(4);
 const report=useMemo(()=>simulateHorizon(plan,cs,student,pref,hours,failed,5,{retryNext,maxCourses}),[plan.join(),failed.join(),pref,retryNext,maxCourses]);
 const normal=future(plan,cs,student),opened=future(plan,cs,student,failed),lost=normal.filter(id=>!opened.includes(id));
 return <section className="outcome-scenario"><header><h3>{failed.length?'Si no apruebas '+names(failed):'Si apruebas todo tu plan'}</h3><p>{failed.length?'Comparamos qué quedaría pendiente y cómo reorganizar el siguiente PAO.':'Estas son las oportunidades que abriría tu selección si se cumplen los supuestos.'}</p></header>
 <div className="outcome-conclusion">{lost.length?<p>En este escenario todavía no cumplirías los requisitos de <b>{names(lost)}</b> para el PAO siguiente.</p>:<p>{opened.length?'Al aprobar lo previsto, podrías cumplir los requisitos de '+names(opened)+'.':'La selección no habilita nuevas materias verificadas por sí sola. Revisa las materias clave de tu malla antes de decidir.'}</p>}</div>
 {failed.length>0&&<label className="retry-preference"><input type="checkbox" checked={retryNext} onChange={e=>setRetryNext(e.target.checked)}/><span>Priorizar repetirla en el próximo PAO<small>Preferencia para este escenario. No afirmamos una obligación institucional.</small></span></label>}
 <label>Materias que podrías llevar por PAO posterior<select value={maxCourses} onChange={e=>setMaxCourses(+e.target.value)}>{[3,4,5].map(n=><option value={n} key={n}>{n} materias</option>)}</select></label>
 <LineMap ids={plan} failed={failed} onInspect={onInspect}/>
 <h3>Una posible organización hasta cinco PAO</h3>{report.steps.map((s,i)=><div className={'roadmap-stop '+(!s.valid?'incomplete':'')} key={s.term}><span className="roadmap-dot">{s.term}</span><div><h4>{i===0?'Tu PAO previsto':'PAO '+s.term+' · escenario'}</h4><DelayWatch ids={s.ids} current={3+i} approved={[...student.approved,...report.steps.slice(0,i).flatMap(x=>x.ids).filter(id=>i>1||!failed.includes(id))]}/>{s.valid?<><p>{names(s.ids)}</p><small>{s.credits} créditos · {s.ids.length} materias{i===1&&failed.some(id=>s.ids.includes(id))?' · Incluye repetir la materia':''}</small></>:<p>No se puede completar este PAO entre 9 y 15 créditos con la cantidad y las condiciones elegidas. Ajusta la cantidad o revisa los requisitos pendientes.</p>}</div></div>)}
 <p className="roadmap-assumptions">La secuencia supone oferta y aprobación en los PAO posteriores. Las condiciones desconocidas se excluyen; los horarios oficiales no están cargados. No es una fecha de graduación.</p>
 <PlanAdvice ids={plan} failed={failed} pref={{...pref,courseCount:maxCourses}} purpose="future" onStatus={onStatus} context={scheduleEvidence+' ' +(failed.length?'Escenario: no apruebo '+names(failed)+'. Quiero valorar repetirla el siguiente PAO.':'Escenario: apruebo todas las materias de mi selección.')} onApply={onApply}/>
 </section>;
}
