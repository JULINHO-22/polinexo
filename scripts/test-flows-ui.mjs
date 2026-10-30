import {chromium} from '@playwright/test';
import fs from 'node:fs';import assert from 'node:assert/strict';
const url=process.env.POLINEXO_URL||'http://127.0.0.1:5174';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
fs.mkdirSync('research/flows',{recursive:true});const checks=[];
try{for(const width of [360,390,412,1280]){
 const p=await browser.newPage({viewport:{width,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/api/chat',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({message:'Gemma no se invoca en esta prueba de UI; se valida el estado de error explícito.'})}));await p.goto(url+'/planificador');await p.getByRole('heading',{name:'Escoge tus próximas materias',exact:true}).waitFor();
 assert.equal(await p.getByRole('checkbox').count(),9);
 await p.getByRole('checkbox',{name:'Seleccionar Matemáticas discretas',exact:true}).uncheck();
 assert.equal(await p.getByRole('button',{name:'Revisar selección',exact:true}).isEnabled(),false);
 assert((await p.locator('.selection-guidance').textContent()).includes('Matemáticas discretas'));
 await p.getByRole('checkbox',{name:'Seleccionar Matemáticas discretas',exact:true}).check();
 await p.getByRole('button',{name:'Revisar selección',exact:true}).click();
 assert(await p.getByRole('button',{name:'Guardar este plan de prueba',exact:true}).isEnabled());
 await p.getByRole('button',{name:'Cambiar mi selección',exact:true}).click();
 await p.getByRole('button',{name:'Ver sugerencias',exact:true}).click();
 for(const [label,count,credits] of [['3 materias',3,9],['4 materias',4,11],['5 materias',5,14],['Mi nivel',5,13]]){
  await p.getByRole('button',{name:label,exact:true}).click();assert.equal(await p.locator('.flow-course').count(),count);assert((await p.locator('.flow-plan-total').innerText()).includes(credits+' créditos'));
 }
 await p.screenshot({path:`research/flows/${width}-suggestions.png`,fullPage:true,animations:'disabled'});
 await p.getByRole('button',{name:'Sistema de bases de datos TICG1018',exact:true}).click();
 const detail=p.getByRole('dialog');assert((await detail.innerText()).includes('7 docentes consultados'));assert((await detail.innerText()).includes('86.64'));assert((await detail.innerText()).includes('¿Para qué me sirve en el trabajo?'));
 await p.keyboard.press('Escape');assert.equal(await p.getByRole('dialog').count(),0);
 await p.goto(url+'/analitica');assert(await p.getByRole('heading',{name:'Más tiempo para hacerlo bien',exact:true}).isVisible());assert.equal(await p.locator('.mean-projection').count(),0);assert.equal(await p.locator('.flow-course').count(),3);
 await p.screenshot({path:`research/flows/${width}-improve.png`,fullPage:true,animations:'disabled'});
 await p.goto(url+'/simulador');await p.getByRole('button',{name:'Ver consecuencias y alternativa',exact:true}).click();assert((await p.locator('.consequence-reading').innerText()).includes('Análisis de algoritmos'));assert((await p.locator('.replacement-reading').innerText()).includes('Programación de sistemas'));assert.equal(await p.locator('.roadmap-stop').count(),3);
 await p.screenshot({path:`research/flows/${width}-impact.png`,fullPage:true,animations:'disabled'});
 for(const path of ['inicio','planificador','analitica','simulador','malla','polinexo']){await p.goto(url+'/'+path);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await p.locator('.wandering-nexi').count(),0);if(path!=='inicio')assert.equal(await p.getByLabel('Tres opciones de PoliNexo').getByRole('button').count(),3);checks.push({width,path,overflow:false});}
 await p.getByRole('button',{name:'Animar a Nexi',exact:true}).click();await p.getByRole('button',{name:'Bailar',exact:true}).click();assert(await p.getByRole('img',{name:'Nexi · bailando',exact:true}).isVisible());assert.deepEqual(errors,[]);await p.close();
}
 const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await p.goto(url+'/polinexo');assert.equal(await p.locator('.nexi-whole').evaluate(el=>getComputedStyle(el).animationName),'none');
 fs.writeFileSync('research/flows/automated-qa.json',JSON.stringify({checks,gemma:'No API call in UI tests; live evidence is separate'},null,2));console.log('Passed:',checks.length,'responsive route checks plus selection, suggestions, teacher calculations, modal, consequences and mascot checks.');
}finally{await browser.close()}
