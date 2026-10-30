export type TeacherRating={courseCode:string;teacherName:string;score:number;metric:string;sampleSize:number|null;period:string|null;checked:string;sourceUrl:string;status:string};
export function summarizeTeacherRatings(rows:TeacherRating[],courseCode:string){
 const data=rows.filter(r=>r.courseCode===courseCode&&Number.isFinite(r.score));
 const values=data.map(r=>r.score).sort((a,b)=>a-b),n=values.length;
 const compatible=n>0&&data.every(r=>r.sampleSize!==null&&r.sampleSize>0&&r.period!==null&&r.period===data[0].period&&r.metric===data[0].metric);
 return {teacherCount:n,meanOfPublishedTeacherScores:n?values.reduce((a,b)=>a+b,0)/n:null,median:n?(values[Math.floor((n-1)/2)]+values[Math.floor(n/2)])/2:null,min:n?values[0]:null,max:n?values[n-1]:null,weightedMean:compatible?data.reduce((s,r)=>s+r.score*r.sampleSize!,0)/data.reduce((s,r)=>s+r.sampleSize!,0):null,studentVoteMean:null,historicalPassRate:null};
}
