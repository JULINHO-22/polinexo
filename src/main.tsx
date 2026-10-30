import React from 'react';
import {createRoot} from 'react-dom/client';
import {
  House,Path,Books,ChartLineUp,ArrowLeft,ArrowRight,ArrowUpRight,Check,
  LockSimple,Clock,GraduationCap,CalendarDots,Heart,Certificate,ForkKnife,
  MapTrifold,Bell,UserCircle,Info,Compass,GitBranch,ShieldCheck,
  WarningCircle,Camera,HandHeart,SealCheck,ChartPieSlice,IdentificationCard,
  QrCode,Fingerprint,Siren,BookOpen,Flag,Lightning,Question,Notebook,
  CaretRight,Student,CalendarCheck,Aperture,Plus,Medal,Signpost,TrendUp,
} from '@phosphor-icons/react';
import catalog from './data/catalog.json';
import {student} from './data/student';
import './style.css';
import {PoliNexo} from './polinexo/PoliNexo';

const page=location.pathname.split('/').filter(Boolean)[0]||'inicio';
function Logo(){return <a className="brand" href="/inicio" aria-label="Inicio de Mi ESPOL"><img src="/assets/miespol/logo.png?v=20261030" alt="Mi ESPOL"/></a>}
function Avatar(){return <img className="profile-illustration" src="/assets/miespol/avatar.png?v=20261030" alt="Avatar gris del estudiante"/>}
function Timeline(){return <img className="timeline" src="/assets/miespol/historia.png?v=20261030" alt="Ilustración histórica de ESPOL con sus años y personajes"/>}
function Header(){return <header className="global-header"><Logo/><img className="header-actions-image" src="/assets/miespol/header-tools.png?v=20261030" alt="Servicios y notificaciones, referencia visual"/></header>}
const navAreas=[{label:'Inicio',asset:'inicio',href:'/inicio'},{label:'Sirena',asset:'sirena',href:null},{label:'Código QR',asset:'qr',href:null},{label:'Nexo',asset:null,href:'/polinexo'},{label:'Huella',asset:'huella',href:null},{label:'Perfil',asset:'perfil',href:null}];
function BottomNav(){return <nav className="dock" aria-label="Navegación principal de Mi ESPOL">{navAreas.map(it=>{const active=it.href==='/inicio'?page==='inicio':it.href==='/polinexo'&&page!=='inicio';const body=<>{it.asset?<img src={'/assets/miespol/nav-'+it.asset+'.png?v=20261030'} alt=""/>:<Path size={28} weight={active?'bold':'regular'}/>}<small>{it.label==='Nexo'?'Nexo':''}</small></>;return it.href?<a key={it.label} className={active?'active':''} href={it.href} aria-label={it.label} aria-current={active?'page':undefined}>{body}</a>:<span key={it.label} aria-label={it.label+' · solo visual'} className="dock-inert">{body}</span>})}</nav>}
const homeServices=[
  {label:'Académico', icon:GraduationCap, className:'service-blue',href:'/academico'},
  {label:'Calendario', icon:CalendarDots, className:'service-olive'},
  {label:'Bienestar', icon:HandHeart, className:'service-purple'},
  {label:'Certificados', icon:SealCheck, className:'service-cyan'},
  {label:'Restaurantes', icon:ForkKnife, className:'service-orange'},
  {label:'Mapa', icon:MapTrifold, className:'service-pink'},
];
function Home(){const assets=['academico','calendario','bienestar','certificados','restaurantes','mapa'];return <div className="home-page"><div className="home-profile"><Avatar/><h1>¡Buenas tardes!</h1><strong>Hola, {student.name}</strong><span>{student.registration}</span><Timeline/></div><div className="home-tray"><div className="services">{homeServices.map(({label},i)=><div key={label} className="service" aria-label={label+' · solo visual'}><img src={'/assets/miespol/'+assets[i]+'.png?v=20261030'} alt=""/><span>{label}</span></div>)}</div><div className="pager-dots"><span/><i/></div><div className="favorites-heading"><span>≡</span><h2>Favoritos</h2></div><div className="favorites"><div className="favorite favorite-original"><img src="/assets/miespol/favorito.png?v=20261030" alt="Favorito académico, solo visual"/></div><div className="favorite favorite-add" aria-label="Agregar favorito · solo visual"><Plus weight="light" size={31}/></div></div><p className="home-disclaimer">Prototipo no oficial · Datos ficticios</p></div></div>}
export function App(){return <div className="phone-shell"><Header/><main className={page==='inicio'?'main-home':'page-content'}>{page==='inicio'?<Home/>:<><nav className="route-tabs" aria-label="Vistas de PoliNexo"><a href="/polinexo">PoliNexo</a><a href="/malla">Mi malla</a><a href="/analitica">Rendimiento</a><a href="/planificador">Planificar</a><a href="/simulador">Simular</a></nav><PoliNexo page={page}/></>}</main><BottomNav/></div>}
if (typeof document !== 'undefined') createRoot(document.getElementById('root')!).render(<App/>);
