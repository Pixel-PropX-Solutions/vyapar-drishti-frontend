import{r as o}from"./react-DrzH4biM.js";import{h as m,u as P,j as f,m as A}from"./goober-np-fLvOt.js";var C=e=>typeof e=="function",$=(e,t)=>C(e)?e(t):e,I=(()=>{let e=0;return()=>(++e).toString()})(),z=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),N=20,O=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,N)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:a}=t;return O(e,{type:e.toasts.find(r=>r.id===a.id)?1:0,toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(r=>r.id===s||s===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+i}))}}},w=[],E={toasts:[],pausedAt:void 0},y=e=>{E=O(E,e),w.forEach(t=>{t(E)})},M={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},T=(e={})=>{let[t,a]=o.useState(E);o.useEffect(()=>(w.push(a),()=>{let i=w.indexOf(a);i>-1&&w.splice(i,1)}),[t]);let s=t.toasts.map(i=>{var r,d,n;return{...e,...e[i.type],...i,removeDelay:i.removeDelay||((r=e[i.type])==null?void 0:r.removeDelay)||(e==null?void 0:e.removeDelay),duration:i.duration||((d=e[i.type])==null?void 0:d.duration)||(e==null?void 0:e.duration)||M[i.type],style:{...e.style,...(n=e[i.type])==null?void 0:n.style,...i.style}}});return{...t,toasts:s}},j=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(a==null?void 0:a.id)||I()}),b=e=>(t,a)=>{let s=j(t,e,a);return y({type:2,toast:s}),s.id},l=(e,t)=>b("blank")(e,t);l.error=b("error");l.success=b("success");l.loading=b("loading");l.custom=b("custom");l.dismiss=e=>{y({type:3,toastId:e})};l.remove=e=>y({type:4,toastId:e});l.promise=(e,t,a)=>{let s=l.loading(t.loading,{...a,...a==null?void 0:a.loading});return typeof e=="function"&&(e=e()),e.then(i=>{let r=t.success?$(t.success,i):void 0;return r?l.success(r,{id:s,...a,...a==null?void 0:a.success}):l.dismiss(s),i}).catch(i=>{let r=t.error?$(t.error,i):void 0;r?l.error(r,{id:s,...a,...a==null?void 0:a.error}):l.dismiss(s)}),e};var S=(e,t)=>{y({type:1,toast:{id:e,height:t}})},H=()=>{y({type:5,time:Date.now()})},g=new Map,U=1e3,_=(e,t=U)=>{if(g.has(e))return;let a=setTimeout(()=>{g.delete(e),y({type:4,toastId:e})},t);g.set(e,a)},F=e=>{let{toasts:t,pausedAt:a}=T(e);o.useEffect(()=>{if(a)return;let r=Date.now(),d=t.map(n=>{if(n.duration===1/0)return;let u=(n.duration||0)+n.pauseDuration-(r-n.createdAt);if(u<0){n.visible&&l.dismiss(n.id);return}return setTimeout(()=>l.dismiss(n.id),u)});return()=>{d.forEach(n=>n&&clearTimeout(n))}},[t,a]);let s=o.useCallback(()=>{a&&y({type:6,time:Date.now()})},[a]),i=o.useCallback((r,d)=>{let{reverseOrder:n=!1,gutter:u=8,defaultPosition:c}=d||{},h=t.filter(p=>(p.position||c)===(r.position||c)&&p.height),D=h.findIndex(p=>p.id===r.id),x=h.filter((p,k)=>k<D&&p.visible).length;return h.filter(p=>p.visible).slice(...n?[x+1]:[0,x]).reduce((p,k)=>p+(k.height||0)+u,0)},[t]);return o.useEffect(()=>{t.forEach(r=>{if(r.dismissed)_(r.id,r.removeDelay);else{let d=g.get(r.id);d&&(clearTimeout(d),g.delete(r.id))}})},[t]),{toasts:t,handlers:{updateHeight:S,startPause:H,endPause:s,calculateOffset:i}}},L=m`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,R=m`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Y=m`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,q=f("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${R} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Y} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,B=m`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,G=f("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${B} 1s linear infinite;
`,J=m`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,K=m`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Q=f("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${J} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${K} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,V=f("div")`
  position: absolute;
`,W=f("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Z=m`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,X=f("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Z} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ee=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return t!==void 0?typeof t=="string"?o.createElement(X,null,t):t:a==="blank"?null:o.createElement(W,null,o.createElement(G,{...s}),a!=="loading"&&o.createElement(V,null,a==="error"?o.createElement(q,{...s}):o.createElement(Q,{...s})))},te=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ae=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,re="0%{opacity:0;} 100%{opacity:1;}",ie="0%{opacity:1;} 100%{opacity:0;}",se=f("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,oe=f("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ne=(e,t)=>{let a=e.includes("top")?1:-1,[s,i]=z()?[re,ie]:[te(a),ae(a)];return{animation:t?`${m(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${m(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},de=o.memo(({toast:e,position:t,style:a,children:s})=>{let i=e.height?ne(e.position||t||"top-center",e.visible):{opacity:0},r=o.createElement(ee,{toast:e}),d=o.createElement(oe,{...e.ariaProps},$(e.message,e));return o.createElement(se,{className:e.className,style:{...i,...a,...e.style}},typeof s=="function"?s({icon:r,message:d}):o.createElement(o.Fragment,null,r,d))});A(o.createElement);var le=({id:e,className:t,style:a,onHeightUpdate:s,children:i})=>{let r=o.useCallback(d=>{if(d){let n=()=>{let u=d.getBoundingClientRect().height;s(e,u)};n(),new MutationObserver(n).observe(d,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return o.createElement("div",{ref:r,className:t,style:a},i)},ce=(e,t)=>{let a=e.includes("top"),s=a?{top:0}:{bottom:0},i=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:z()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...s,...i}},ue=P`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,v=16,fe=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:s,children:i,containerStyle:r,containerClassName:d})=>{let{toasts:n,handlers:u}=F(a);return o.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:v,left:v,right:v,bottom:v,pointerEvents:"none",...r},className:d,onMouseEnter:u.startPause,onMouseLeave:u.endPause},n.map(c=>{let h=c.position||t,D=u.calculateOffset(c,{reverseOrder:e,gutter:s,defaultPosition:t}),x=ce(h,D);return o.createElement(le,{id:c.id,key:c.id,onHeightUpdate:u.updateHeight,className:c.visible?ue:"",style:x},c.type==="custom"?$(c.message,c):i?i(c):o.createElement(de,{toast:c,position:h}))}))},ye=l;export{fe as D,l as c,ye as k};
