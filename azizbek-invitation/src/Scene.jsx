import {useMemo,useRef,useEffect,Component} from 'react';
import {Canvas,useFrame} from '@react-three/fiber';
import {Environment,Lightformer,Line,Sparkles,Float} from '@react-three/drei';
const colors=['#d4af37','#f7e7ce','#171717','#c9a227','#fff9ed'];
function Balloon({position,index,reduced,cursor}){
 const ref=useRef();
 const points=useMemo(()=>Array.from({length:20},(_,i)=>[Math.sin(i*.32)*.06,-.85-i*.1,0]),[]);
 useFrame(({clock})=>{if(!ref.current||reduced)return;const t=clock.elapsedTime;ref.current.position.y=position[1]+Math.sin(t*.3+index)*.28+cursor.current.y*.06;ref.current.rotation.z=Math.sin(t*.35+index)*.09;ref.current.position.x=position[0]+cursor.current.x*.13;});
 return <group ref={ref} position={position}><mesh scale={[.64,.82,.64]} castShadow><sphereGeometry args={[1,40,32]}/><meshPhysicalMaterial color={colors[index%5]} metalness={index%5===4?.2:.92} roughness={.19} clearcoat={1} clearcoatRoughness={.12}/></mesh><mesh position={[0,-.84,0]} rotation={[0,0,Math.PI]}><coneGeometry args={[.055,.13,12]}/><meshStandardMaterial color={colors[index%5]} metalness={.8} roughness={.3}/></mesh><Line points={points} color="#a99465" lineWidth={.55} transparent opacity={.65}/></group>;
}
function Cake(){return <Float speed={.8} rotationIntensity={.15} floatIntensity={.2}><group position={[0,-2.4,-3]}><mesh><cylinderGeometry args={[.8,.8,.38,48]}/><meshStandardMaterial color="#c9a227" metalness={.8} roughness={.22}/></mesh><mesh position={[0,.3,0]}><cylinderGeometry args={[.55,.55,.3,48]}/><meshStandardMaterial color="#fff0ce" metalness={.4} roughness={.25}/></mesh>{[-.22,0,.22].map((x,i)=><group key={i} position={[x,.6,0]}><mesh><cylinderGeometry args={[.018,.018,.3,8]}/><meshStandardMaterial color="#d4af37"/></mesh><mesh position={[0,.19,0]} scale={[.6,1,.6]}><sphereGeometry args={[.045,12,12]}/><meshBasicMaterial color="#ffe4a0"/></mesh></group>)}</group></Float>}
class SceneBoundary extends Component{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?null:this.props.children}}
export default function FloatingBalloons({reduced}){
 const cursor=useRef({x:0,y:0});
 useEffect(()=>{const move=e=>{cursor.current={x:e.clientX/window.innerWidth*2-1,y:1-e.clientY/window.innerHeight*2}};window.addEventListener('pointermove',move,{passive:true});return()=>window.removeEventListener('pointermove',move)},[]);
 const mobile=window.innerWidth<700;
 const positions=mobile?[[-2.3,1,-1],[2.3,0,-1],[-2.7,-2,-2],[2.7,3,-2]]:[[-4.9,1.4,0],[-3.6,-.7,-1],[-5.8,-2,-3],[-3.7,3,-2],[4.7,1,0],[3.7,-1.3,-1],[5.8,3,-2],[3.6,3.5,-2]];
 return <div className="scene" aria-hidden="true"><SceneBoundary><Canvas dpr={[1,mobile?1.25:1.6]} camera={{position:[0,0,9],fov:45}} gl={{alpha:true,antialias:!mobile}} frameloop={reduced?'demand':'always'}><ambientLight intensity={.45}/><spotLight position={[0,6,5]} intensity={55} color="#ffe4a4" angle={.7} penumbra={1}/><Environment resolution={128}><Lightformer form="rect" intensity={4} position={[-4,2,4]} scale={[3,8,1]}/><Lightformer form="rect" intensity={3} color="#f7e7ce" position={[5,1,3]} scale={[2,7,1]}/><Lightformer form="ring" intensity={2} position={[0,4,-4]} scale={5}/></Environment>{positions.map((p,i)=><Balloon key={i} position={p} index={i} reduced={reduced} cursor={cursor}/>)}<Sparkles count={mobile?45:110} scale={[16,12,6]} size={2} speed={reduced?0:.18} color="#d4af37"/>{!mobile&&!reduced&&<Cake/>}</Canvas></SceneBoundary></div>
}
