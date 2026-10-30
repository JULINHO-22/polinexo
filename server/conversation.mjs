// Only completed user/model pairs become provider history. Failed or interrupted
// user turns remain visible in the UI, but are not replayed as adjacent user roles.
export function completedHistory(messages){
 const pairs=[];let pending=null;
 for(const m of messages){if(m.role==='user')pending=m.text;else if(m.role==='model'&&pending!==null){pairs.push([{role:'user',text:pending.slice(0,650)},{role:'model',text:m.text.slice(0,650)}]);pending=null;}}
 return pairs.slice(-2).flat();
}
