import {search} from './engine';
self.onmessage=e=>{const {id,cs,profile,pref,hours,exclude}=e.data;try{self.postMessage({id,result:search(cs,profile,pref,hours,exclude)});}catch{self.postMessage({id,error:'No se pudo completar la búsqueda local.'});}};
