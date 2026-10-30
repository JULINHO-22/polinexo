import React,{useState} from 'react';
import {X,ChatCircle,Briefcase,ArrowRight} from '@phosphor-icons/react';
import catalog from '../data/catalog.json';
import careers from '../data/career-context.json';
import hours from '../data/workload.json';
import {TeacherEvidence} from './DecisionStudio';
import {downstream} from './engine';
const cs=catalog.courses;
export function CourseDetail({id,onClose,onAsk}:{id:string;onClose:()=>void;onAsk:(q:string)=>void}){
 const [tab,setTab]=useState<'subject'|'teachers'>('subject');const c=cs.find(x=>x.id===id)!;
 const career=(careers as Record<string,{purpose:string;example:string}>)[id];const load=(hours as Record<string,{independent:number}>)[id];
 const names=(ids:string[])=>ids.map(x=>cs.find(c=>c.id===x)?.name||x);
 return <section className="context-detail course-sheet" role="dialog" aria-modal="true" aria-label="Detalle de la materia"><button aria-label="Cerrar ficha" onClick={onClose} className="detail-close"><X size={20}/></button><div className="sheet-heading"><small>{c.code} · {c.credits} créditos</small><h2>{c.name}</h2></div>
 <div className="sheet-tabs" role="tablist" aria-label="Información de materia"><button role="tab" id="subject-tab" aria-selected={tab==='subject'} aria-controls="subject-panel" onClick={()=>setTab('subject')}>Materia</button><button role="tab" id="teachers-tab" aria-selected={tab==='teachers'} aria-controls="teachers-panel" onClick={()=>setTab('teachers')}>Profesores</button></div>
 {tab==='subject'?<div role="tabpanel" id="subject-panel" aria-labelledby="subject-tab"><section className="sheet-purpose"><Briefcase size={21}/><div><h3>¿Para qué te sirve?</h3><p>{career?.purpose||'Forma parte de las bases de tu carrera.'}</p>{career&&<small>{career.example}</small>}</div></section><section className="sheet-requirements"><h3>Para cursarla</h3>{c.prerequisites.length?<p><span>Aprobar antes</span>{names(c.prerequisites).join(' · ')}</p>:<p>Sin materias previas registradas.</p>}{c.corequisites.length>0&&<p><span>Tomar junto a, si no aprobaste</span>{names(c.corequisites).join(' · ')}</p>}{c.conditions.length>0&&<small>Hay condiciones adicionales pendientes de confirmar.</small>}</section><section className="sheet-next"><h3>Te abre camino hacia</h3><p>{names(downstream(id,cs)).join(' · ')||'No hay dependencias posteriores verificadas.'}</p></section><div className="sheet-workload"><span>{load?`${load.independent} h de estudio / semana`:'Carga por verificar'}</span><small>Referencia del sílabo · Dificultad sin medir</small></div></div>:<div role="tabpanel" id="teachers-panel" aria-labelledby="teachers-tab"><TeacherEvidence id={id}/></div>}
 <div className="sheet-footer"><button onClick={()=>{onClose();onAsk('¿Cómo encaja '+c.name+' en mi plan?')}}><ChatCircle size={17}/>Preguntarle a Nexi<ArrowRight size={15}/></button><details><summary>Fuente académica</summary><a href={c.source} target="_blank" rel="noreferrer">Documento ESPOL ↗</a></details></div></section>
}
