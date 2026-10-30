import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createApi} from './http.mjs';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const api=createApi();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.json':'application/json'};
createServer((req,res)=>api(req,res,async()=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname.split('/').some(part=>part.startsWith('.'))){res.writeHead(404);return res.end();}
  let file=path.resolve(root,'.'+pathname);
  const relative=path.relative(root,file);
  if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403);return res.end();}
  try{if(!(await stat(file)).isFile())throw Error();}catch{
   if(path.extname(pathname)){res.writeHead(404);return res.end();}
   file=path.join(root,'index.html');
  }
  const body=await readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':file.endsWith('index.html')?'no-cache':'public, max-age=3600'});
  res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(400);res.end('Solicitud no disponible');}
})).listen(Number(process.env.PORT)||10000,'0.0.0.0',()=>console.log('PoliNexo: frontend y API listos.'));
