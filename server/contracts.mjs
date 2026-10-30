import {z} from 'zod';
export const MODELS=['gemma-4-26b-a4b-it','gemma-4-31b-it'];
export const id=z.string().min(1).max(70);
export const prefSchema=z.object({target:z.number().int().min(9).max(15),hours:z.number().min(1).max(100),priority:z.enum(['equilibrar','avance','promedio']),pace:z.enum(['tranquila','equilibrada','intensiva']),courseCount:z.number().int().min(1).max(8).optional()}).strict();
export const requestSchema=z.object({message:z.string().min(1).max(1800),plan:z.array(id).max(16),focus:id,pref:prefSchema,failed:z.array(id).max(16),grades:z.record(z.string(),z.number().min(0).max(10)),history:z.array(z.object({role:z.enum(['user','model']),text:z.string().max(3000)})).max(12)}).strict();
export const toolSchemas={
 evaluate_plan:z.object({ids:z.array(id).max(16).optional(),priority:z.enum(['equilibrar','avance','promedio']).optional(),courseCount:z.number().int().min(1).max(8).optional()}).strict(),
 recommend_courses:z.object({credits:z.number().int().min(9).max(15).optional(),priority:z.enum(['equilibrar','avance','promedio']).optional(),hours:z.number().min(1).max(100).optional(),courseCount:z.number().int().min(1).max(8).optional(),exclude:z.array(id).max(10).optional(),include:z.array(id).max(8).optional()}).strict(),
 inspect_course:z.object({courseId:id}).strict(),inspect_history:z.object({}).strict(),
 compare_plans:z.object({after:z.array(id).max(16)}).strict(),
 simulate_grades:z.object({grades:z.record(z.string(),z.number().min(0).max(10))}).strict()
};
export const finalSchema=z.object({message:z.string().min(1).max(1800),proposalIndex:z.number().int().min(0).max(5).nullable().default(null),clarification:z.boolean().default(false)}).strict();
const str={type:'STRING'},num={type:'NUMBER'};
export const declarations=[
 {name:'evaluate_plan',description:'Evaluar el plan actual o materias elegidas, comparar sustituciones y hasta tres PAO condicionales. No aplica ni produce propuesta confirmable; usa recommend_courses o compare_plans si desea cambiar.',parameters:{type:'OBJECT',properties:{ids:{type:'ARRAY',items:str},priority:{type:'STRING',enum:['equilibrar','avance','promedio']},courseCount:num}}},
 {name:'recommend_courses',description:'Buscar propuestas válidas 9–15 créditos. Usar courseCount si solicita cuatro materias; include/exclude son códigos exactos. Excluir solo materias que el estudiante haya pedido evitar; nunca todo su plan actual. No aplica cambios.',parameters:{type:'OBJECT',properties:{credits:num,priority:{type:'STRING',enum:['equilibrar','avance','promedio']},hours:num,courseCount:num,exclude:{type:'ARRAY',items:str},include:{type:'ARRAY',items:str}}}},
 {name:'inspect_course',description:'Consultar requisitos reales, historial y efectos de posponer o reprobar una asignatura.',parameters:{type:'OBJECT',properties:{courseId:str},required:['courseId']}},
 {name:'inspect_history',description:'Consultar expediente ficticio, medias por áreas y estado del plan.',parameters:{type:'OBJECT',properties:{}}},
 {name:'compare_plans',description:'Validar y comparar la sustitución propuesta; usar lista completa de códigos del plan posterior.',parameters:{type:'OBJECT',properties:{after:{type:'ARRAY',items:str}},required:['after']}},
 {name:'simulate_grades',description:'Proyectar media simple ilustrativa con notas hipotéticas del plan actual (no promedio institucional).',parameters:{type:'OBJECT',properties:{grades:{type:'OBJECT',additionalProperties:{type:'NUMBER'}}},required:['grades']}}
];
