import {useEffect,useRef,useState} from 'react';
import {Pause,Play,Volume2,VolumeX,Music2} from 'lucide-react';
import {eventConfig} from './config';

export default function MusicPlayer(){
 const audio=useRef(null);
 const [playing,setPlaying]=useState(false);
 const [muted,setMuted]=useState(false);
 const [blocked,setBlocked]=useState(false);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  let active=true;
  const element=audio.current;
  element.volume=.35;
  element.play().catch(error=>{
   if(!active)return;
   if(error.name==='NotAllowedError')setBlocked(true);
   else if(error.name!=='AbortError')setFailed(true);
  });
  return()=>{active=false;element.pause()};
 },[]);
 async function toggle(){
  const element=audio.current;
  if(!element.paused){element.pause();return;}
  try{setFailed(false);await element.play();setBlocked(false)}
  catch(error){if(error.name==='NotAllowedError')setBlocked(true);else if(error.name!=='AbortError')setFailed(true)}
 }
 function mute(){const next=!muted;audio.current.muted=next;setMuted(next)}
 return <section className="music-section">
  <div className="music-heading"><span className="eyebrow">OQSHOM KAYFIYATI</span><h3>Har lahzaning o‘z ohangi bor.</h3></div>
  <div className="music-box audio-only">
   <audio ref={audio} src={eventConfig.localAudio} loop preload="auto" onPlay={()=>{setPlaying(true);setBlocked(false);setFailed(false)}} onPause={()=>setPlaying(false)} onError={()=>{setFailed(true);setPlaying(false)}}/>
   <div className="audio-caption"><Music2 size={18}/><span>HAPPY BIRTHDAY</span><span className={playing&&!muted?'audio-indicator active':'audio-indicator'} aria-hidden="true"><i/><i/><i/><i/></span></div>
   <div className="music-actions"><button onClick={toggle} aria-pressed={playing}>{playing?<Pause size={15}/>:<Play size={15}/>}<span>{playing?'Musiqani to‘xtatish':'Musiqani yoqish'}</span></button><button onClick={mute} aria-pressed={muted} aria-label={muted?'Ovozni yoqish':'Ovozni o‘chirish'}>{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button></div>
   {blocked&&!failed&&<small role="status">Musiqani boshlash uchun “Musiqani yoqish” tugmasini bosing.</small>}
   {failed&&<small role="status">Musiqa yuklanmadi. Qayta yoqib ko‘ring.</small>}
  </div>
 </section>
}
