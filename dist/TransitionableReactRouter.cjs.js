"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var React=require("react"),React__default=_interopDefault(React);const RouterContext=React.createContext();function Router({base:e="/",children:t}){const[n,o]=React.useState({currentRoute:trimBase(window.location.pathname,e),previousRoute:""});return React.useEffect(()=>{function t(){o(t=>({currentRoute:`/${trimBase(window.location.pathname,e)}`.replace("//","/"),previousRoute:t.currentRoute}))}return window.addEventListener("popstate",t),function(){window.removeEventListener("popstate",t)}},[]),React__default.createElement(RouterContext.Provider,{value:{setRoute:t=>{window.history.pushState({},null,t),o(t=>({currentRoute:trimBase(window.location.pathname,e),previousRoute:t.currentRoute}))},...n}},t)}const baseRegexp=[];function trimBase(e,t="/"){return baseRegexp[t]||(baseRegexp[t]=new RegExp(`^/?${t}/?(.*)`,"ig")),baseRegexp[t].lastIndex=-1,`/${baseRegexp[t].exec(e)[1]}`}function normalisePath(e=""){return e.replace("//","/")}function last(e=[]){return e[e.length-1]}function noop(){}const IS_SSR="undefined"==typeof window,TRANSITION_STATES=["entering","entered","exiting","exited"],NEXT_STEP_MAP=[1,1,3,3];function mapToRegExp([e,t,n],o=!1){const r=normalisePath(n?`${n}/${t}`:t),[u,a]=deconstructURL(r);let c=u;return o?c=`${u}\\/.*`:"/"===t&&(c=`${u}\\/`),[new RegExp(`${c}$`,"ig"),a,e]}function TransitionableReactRoute({animateOnMount:e,children:t,onRouteChange:n=noop,path:o,timeout:r=1e3,...u}){const a=Date.now(),c=React.useRef([]),s=React.useRef(r),i=React.useContext(RouterContext),l=i.currentRoute,R=`${l}_${a}`,[p,f]=React.useState(IS_SSR?[{state:e?0:1,key:R,timestamp:a,currentRoute:l}]:[]);return c.current.length||React__default.Children.forEach(t,t=>{const{path:n,defaultpath:u}=t.props,a=t.type===TransitionableReactRoute,s={...t.props,fullPath:u?"defaultpath":normalisePath(`${o||""}/${n}`),timeout:r};a&&(s.animateOnMount=e);const i=React__default.cloneElement(t,s);u?c.current.push([/.*/gi,[!1],i]):c.current.push(mapToRegExp([i,n,o],a))}),React.useEffect(()=>{n(l),u.transitionstate!==TRANSITION_STATES[2]&&f(t=>{const n=[...t],o=Date.now(),r=checkIfSameParent((last(n)||{}).currentRoute,i.currentRoute,c),u=n.length-1;return n.length>0&&n[u].state<2&&!r&&(n[u]={...n[u],timestamp:o,state:2}),r||n.push({state:e?0:1,key:R,timestamp:o,currentRoute:l}),n})},[l]),React.useEffect(()=>{let e,t=!1;const n=()=>{e=requestAnimationFrame(()=>{!t&&onAnimationEnd(f,s.current),n()})};return e=n(),()=>{t=!0,cancelAnimationFrame(e)}},[]),React.useEffect(()=>{r!==s.current&&(c.current=c.current.map(([e,t,n])=>{return[e,t,r!==n.props.timeout?React__default.cloneElement(n,{timeout:r}):n]}),s.current=r)},[r]),React.useMemo(()=>p.map(({currentRoute:e,key:t,state:n})=>{const o=greedyMatchComponent(c.current,e);return o.component?React__default.createElement(o.component.type,{key:t,...o.component.props,query:o.query,transitionstate:TRANSITION_STATES[n]}):null}),[p])}function checkIfSameParent(e,t,n){const o=matchRoute(n,e),r=matchRoute(n,t);return r&&o?o[o.length-1]===r[r.length-1]:null}function matchRoute(e,t){if(!t)return null;for(let[n]of e.current){n.lastIndex=0;const e=n.exec(t);if(e)return e}}function onAnimationEnd(e,t){e(e=>{let n=!1;const o=Date.now(),r=[...e];for(let e=0;e<r.length;e++){const u=NEXT_STEP_MAP[r[e].state];o-r[e].timestamp>=t&&u!==r[e].state&&(n=!0,r[e]={...r[e],state:u})}return n?r.filter(({state:e})=>e<3):e})}function greedyMatchComponent(e,t){e:for(let[n,o,r]of e){n.lastIndex=0;const e=n.exec(t);if(!e)continue;let u={};for(let t=0;t<o.length;t++)if("string"==typeof o[t]&&(u[o[t]]=e[t+1],!e[t+1]))continue e;return{component:r,query:u}}return{component:null,attributes:null}}function deconstructURL(e){const t=e.split("/");return"/"===e?["^",[!1]]:t.filter(e=>!!e).reduce((e,t,n)=>{const o=e[1];return 0===t.indexOf(":")?(o.push(t.substring(1)),[`${e[0]}\\/?([^\\/]+)?`,o]):(o.push(!1),n>0?[`${e[0]}\\/(${t})`,o]:[`${e[0]}(${t})`,o])},["^\\/",[]])}exports.Router=Router,exports.RouterContext=RouterContext,exports.TransitionableReactRoute=TransitionableReactRoute;