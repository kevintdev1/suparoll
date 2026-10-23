import { PRELOADER_SESSION_KEY } from "@/shared/lib/motion/preloader";

export const PRELOADER_SEEN_SCRIPT = `try{if(sessionStorage.getItem(\`${PRELOADER_SESSION_KEY}\`)===\`1\`)document.currentScript.previousElementSibling.hidden=true}catch(e){}`;

export const PRELOADER_NOSCRIPT_STYLE = "[data-preloader=root]{display:none}";
