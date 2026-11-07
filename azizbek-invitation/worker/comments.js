const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
export async function commentsApi(request,env){
 if(!env.DB)return json({error:'Izohlar xizmati hozir mavjud emas.'},503);
 const url=new URL(request.url);
 try{
  if(request.method==='GET'){
   const raw=url.searchParams.get('before');
   if(raw&&!/^\d+$/.test(raw))return json({error:'So‘rov noto‘g‘ri.'},400);
   const before=raw?Number(raw):Number.MAX_SAFE_INTEGER;
   const {results}=await env.DB.prepare('SELECT id, name, message, created_at FROM comments WHERE id < ? ORDER BY id DESC LIMIT 21').bind(before).all();
   return json({comments:results.slice(0,20),next:results.length>20?results[19].id:null});
  }
  if(request.method!=='POST')return json({error:'Usul qo‘llab-quvvatlanmaydi.'},405);
  if(request.headers.get('Origin')!==url.origin)return json({error:'So‘rov manbasi noto‘g‘ri.'},403);
  if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'JSON kutilmoqda.'},415);
  const body=await request.text();
  if(body.length>10000)return json({error:'Izoh juda uzun.'},413);
  let data;try{data=JSON.parse(body)}catch{return json({error:'So‘rov noto‘g‘ri.'},400)}
  const name=typeof data.name==='string'?data.name.trim():'';
  const message=typeof data.message==='string'?data.message.trim():'';
  if(name.length<2||name.length>60||message.length<3||message.length>1000)return json({error:'Ism 2–60, tilak esa 3–1000 belgidan iborat bo‘lsin.'},400);
  if(typeof data.requestId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(data.requestId))return json({error:'So‘rov identifikatori noto‘g‘ri.'},400);
  // A repeated request after a network interruption never creates a duplicate.
  await env.DB.prepare('INSERT INTO comments (name, message, request_id) VALUES (?, ?, ?) ON CONFLICT(request_id) DO NOTHING').bind(name,message,data.requestId).run();
  const comment=await env.DB.prepare('SELECT id, name, message, created_at FROM comments WHERE request_id = ?').bind(data.requestId).first();
  return json({comment},201);
 }catch{return json({error:'Izohlar yuklanmadi. Birozdan keyin qayta urinib ko‘ring.'},503)}
}
