import {useCallback,useEffect,useRef,useState} from 'react';
import {MessageCircle,Send,RefreshCw} from 'lucide-react';
export default function GuestComments(){
 const [comments,setComments]=useState([]),[name,setName]=useState(''),[message,setMessage]=useState('');
 const [loading,setLoading]=useState(true),[sending,setSending]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[next,setNext]=useState(null);
 const request=useRef(null),busy=useRef(false);
 const load=useCallback(async(before=null)=>{
  setLoading(true);setError('');
  try{const response=await fetch('/api/comments'+(before?'?before='+before:''),{cache:'no-store'});const data=await response.json();if(!response.ok)throw new Error(data.error);setComments(current=>{const rows=before?[...current,...data.comments]:data.comments;return [...new Map(rows.map(row=>[row.id,row])).values()]});setNext(data.next)}
  catch{setError('Tilaklar yuklanmadi. Qayta urinib ko‘ring.')}
  finally{setLoading(false)}
 },[]);
 useEffect(()=>{load()},[load]);
 async function submit(event){
  event.preventDefault();if(busy.current)return;busy.current=true;setSending(true);setError('');setNotice('');
  const signature=JSON.stringify([name.trim(),message.trim()]);
  if(request.current?.signature!==signature)request.current={signature,id:crypto.randomUUID()};
  try{
   const response=await fetch('/api/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name.trim(),message:message.trim(),requestId:request.current.id})});
   const data=await response.json();if(!response.ok)throw new Error(data.error||'Tilak yuborilmadi.');
   setComments(current=>[data.comment,...current.filter(row=>row.id!==data.comment.id)]);setMessage('');request.current=null;setNotice('Rahmat! Tilagingiz saqlandi.');
  }catch(error){setError(error.message==='Failed to fetch'?'Aloqa uzildi. Matningiz saqlanib turibdi — qayta yuboring.':error.message)}
  finally{busy.current=false;setSending(false)}
 }
 return <section className="guest-comments" id="izohlar">
  <div className="guest-heading"><span className="eyebrow">SIZNING SO‘ZLARINGIZ — GO‘ZAL XOTIRA</span><h2>Bir tilak, <em>ming quvonch.</em></h2><p>Azizbek uchun qalbingizdagi eng ezgu tilaklarni qoldiring.</p></div>
  <div className="guest-layout"><form className="guest-form" onSubmit={submit}>
   <label htmlFor="guest-name">Ismingiz</label><input id="guest-name" value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={60} required autoComplete="name" placeholder="Ismingizni yozing"/>
   <label htmlFor="guest-message">Tilagingiz</label><textarea id="guest-message" value={message} onChange={e=>setMessage(e.target.value)} minLength={3} maxLength={1000} required rows={5} placeholder="Eng samimiy tilaklaringiz…"/>
   <div className="guest-form-note"><span>Tilagingiz barcha mehmonlarga ko‘rinadi.</span><span>{message.length}/1000</span></div>
   <button className="gold-button" disabled={sending} type="submit">{sending?'SAQLANMOQDA…':'TILAKNI YUBORISH'} <Send size={15}/></button>
   {notice&&<p className="guest-status" role="status">{notice}</p>}
   {error&&<p className="guest-error" role="alert">{error}</p>}
  </form><div className="guest-list"><div className="guest-list-header"><span className="eyebrow">SAMIMIY TILAKLAR</span><button type="button" onClick={()=>load()} disabled={loading} aria-label="Tilaklarni yangilash"><RefreshCw size={16}/></button></div>
   {loading&&comments.length===0?<p className="guest-empty" role="status">Tilaklar yuklanmoqda…</p>:comments.length===0?<div className="guest-empty"><MessageCircle size={28}/><p>Ilk samimiy tilak sizdan bo‘lsin!</p></div>:comments.map(comment=><article className="guest-comment" key={comment.id}><div className="guest-author"><span className="guest-avatar">{Array.from(comment.name)[0]}</span><div><h3>{comment.name}</h3><time dateTime={comment.created_at}>{new Intl.DateTimeFormat('uz-UZ',{day:'numeric',month:'long',timeZone:'Asia/Tashkent'}).format(new Date(comment.created_at))}</time></div></div><p>{comment.message}</p></article>)}
   {next&&<button className="outline-button guest-more" disabled={loading} onClick={()=>load(next)}>{loading?'YUKLANMOQDA…':'YANA TILAKLAR'}</button>}
  </div></div>
 </section>
}
