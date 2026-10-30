import {defineConfig,loadEnv} from 'vite';
import {pathToFileURL} from 'node:url';import {resolve} from 'node:path';
export default defineConfig(async({mode})=>{const {createApi}=await import(pathToFileURL(resolve('server/http.mjs')).href);const env=loadEnv(mode,process.cwd(),'');const api=createApi({apiKey:env.GEMINI_API_KEY||env.GOOGLE_API_KEY,model:env.GEMMA_MODEL||'gemma-4-26b-a4b-it'});return {plugins:[{name:'polinexo-server',configureServer(s){s.middlewares.use(api)},configurePreviewServer(s){s.middlewares.use(api)}}],server:{host:'127.0.0.1',port:5174},preview:{host:'127.0.0.1'}};});
// Reload server configuration after provider adjustment.
// Refresh contextual course tools.
// Refresh bounded Gemma tool loop.
// Refresh Gemma-compatible tools configuration.
// Refresh schema extraction and explicit constraints.
// Explicitly select verified Gemma 31B alternative for testing.
// Use validated JSON tool protocol with Gemma.
