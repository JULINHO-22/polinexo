import React,{useEffect,useRef,useState} from 'react';import {Nexi,type Mood} from './Nexi';
export function NexiCompanion({mood,version,onGreet,onReturn}:{mood:Mood;version:number;onGreet:()=>void;onReturn:()=>void}){
 const clamp=(x:number,y:number)=>({x:Math.max(6,Math.min(document.documentElement.clientWidth-106,x)),y:Math.max(6,Math.min(innerHeight-220,y))});
 const [position,setPosition]=useState(()=>{try{const saved=JSON.parse(localStorage.getItem('nexi-companion-position')||'null');if(saved)return clamp(saved.x,saved.y)}catch{}return clamp(innerWidth-112,innerHeight-240)});
 const drag=useRef<{x:number;y:number;left:number;top:number;moved:boolean}|null>(null);
 useEffect(()=>{localStorage.setItem('nexi-companion-position',JSON.stringify(position))},[position]);
 useEffect(()=>{const resize=()=>setPosition(p=>clamp(p.x,p.y));addEventListener('resize',resize);return()=>removeEventListener('resize',resize)},[]);
 return <div className="nexi-companion-float" role="group" aria-label="Nexi acompañante, puedes arrastrarlo" style={{left:position.x,top:position.y}}>
 <button className="floating-pet-touch" aria-label="Saludar a Nexi acompañante" onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY,left:position.x,top:position.y,moved:false};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{const d=drag.current;if(!d||!e.currentTarget.hasPointerCapture(e.pointerId))return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.abs(dx)+Math.abs(dy)>6)d.moved=true;if(d.moved)setPosition(clamp(d.left+dx,d.top+dy))}} onPointerUp={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>{drag.current=null}} onClick={()=>{if(!drag.current?.moved)onGreet();drag.current=null}} onKeyDown={e=>{const directions:Record<string,[number,number]>={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]};if(directions[e.key]){e.preventDefault();const [dx,dy]=directions[e.key];setPosition(p=>clamp(p.x+dx,p.y+dy))}}}><Nexi key={version} mood={mood}/></button>
 <button className="return-companion" onClick={onReturn}>Volver a mi sitio</button>
 </div>;
}
