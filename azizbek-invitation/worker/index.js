import {commentsApi} from './comments.js';
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/api/comments')return commentsApi(request,env);
 if(url.pathname.startsWith('/api/'))return new Response('Not found',{status:404});
 return serveAsset(request,url.pathname);
}};

function serveAsset(request,path){
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 const asset=SITE_ASSETS[path==='/'?'/index.html':path];
 if(!asset)return new Response('Not found',{status:404});
 const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
 const headers={'Content-Type':asset.type,'X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes','Cache-Control':path.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache'};
 const range=request.headers.get('Range');
 if(range){
  const match=/^bytes=(\d*)-(\d*)$/.exec(range);
  if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${bytes.length}`}});
  const start=match[1]?Number(match[1]):Math.max(0,bytes.length-Number(match[2]));
  const end=match[1]?(match[2]?Math.min(Number(match[2]),bytes.length-1):bytes.length-1):bytes.length-1;
  if(start>end||start>=bytes.length)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${bytes.length}`}});
  return new Response(request.method==='HEAD'?null:bytes.slice(start,end+1),{status:206,headers:{...headers,'Content-Range':`bytes ${start}-${end}/${bytes.length}`,'Content-Length':String(end-start+1)}});
 }
 return new Response(request.method==='HEAD'?null:bytes,{headers:{...headers,'Content-Length':String(bytes.length)}});
}
