import React,{useState} from 'react';
import catalog from '../data/catalog.json';import {student} from '../data/student';
import {eligibility,downstream,postponementProjection} from './engine';
const cs=catalog.courses,levels=['100-I','100-II','200-I','200-II','300-I','300-II','400-I','400-II'];
export function PlanGrid({ids,postponed,onInspect}:{ids:string[];postponed?:string;onInspect:(id:string)=>void}){
 const [showAll,setShowAll]=useState(false);
 const before={...student,approved:[...student.approved,...ids]},projection=postponementProjection(ids,postponed,cs,student),after=projection.profile;
 const descendants=postponed?[...new Set([postponed,...projection.invalidated].flatMap(id=>downstream(id,cs)))]:[];
 const rows=cs.filter(c=>c.code&&(ids.includes(c.id)||descendants.includes(c.id)||c.prerequisites.some(id=>ids.includes(id))||c.corequisites.some(id=>ids.includes(id)))).filter(c=>!postponed||showAll||c.id===postponed||descendants.includes(c.id)||projection.invalidated.includes(c.id));
 const losses=rows.filter(c=>projection.invalidated.includes(c.id)||(!ids.includes(c.id)&&eligibility(c,before,[]).ok&&!eligibility(c,after,[]).ok));
 function tile(c:typeof rows[number],changed:boolean){const projected=changed?after:before,can=eligibility(c,projected,[]).ok;const lost=changed&&losses.some(r=>r.id===c.id);const later=changed&&descendants.includes(c.id)&&!lost&&!can;
 const state=student.approved.includes(c.id)?'done':ids.includes(c.id)?changed&&c.id===postponed?'postponed':changed&&projection.invalidated.includes(c.id)?'lost':'planned':lost?'lost':can?'ready':later?'dependent':'pending';
 const label={done:'Aprobada',planned:'En tu plan',postponed:'Pospuesta',lost:'Se bloquea',ready:'Cumpliría requisitos',dependent:'Depende de ella',pending:'Faltan requisitos'}[state];
 return <button key={c.id} className={'grid-course '+state} onClick={()=>onInspect(c.id)}><strong>{c.name}</strong><small>{c.credits} cr.</small><span>{label}</span></button>;
 }
 return <section className="plan-grid" aria-label={postponed?'Malla antes y después de posponer':'Malla de tu plan'}>{postponed&&<><p className="grid-verdict">{losses.length?<><b>{losses.length} materia(s)</b> perderían acceso con esta selección.</>:'No se pierde acceso inmediato a otras materias con esta selección.'}</p><div className="grid-comparison-head"><span>Antes<small>Apruebas tu plan</small></span><span>Después<small>Pospones una materia</small></span></div></>}
 {levels.map((label,i)=>{const list=rows.filter(c=>c.level===i+1);return list.length?<div className="grid-level" key={label}><h4>{label}</h4><div className={postponed?'grid-columns':'grid-single'}><div>{list.map(c=>tile(c,false))}</div>{postponed&&<div>{list.map(c=>tile(c,true))}</div>}</div></div>:null})}
 {postponed&&<button className="grid-expand" onClick={()=>setShowAll(!showAll)}>{showAll?'Mostrar solo la ruta afectada':'Ver también materias sin cambios'}</button>}<div className="grid-key"><span className="ready">Cumpliría requisitos</span><span className="lost">Se bloquea</span><span className="dependent">Dependencia posterior</span></div><small className="grid-caption">Materias relacionadas con tu plan, por nivel. Se supone aprobación; oferta y horarios por confirmar.</small></section>;
}
