(function(){"use strict";let a=[],d=!0,l=null;const f=new WeakSet;let s=null,u=null;function y(){chrome.runtime.sendMessage({type:"GET_RULES"},e=>{e?.type==="RULES_RESPONSE"&&(a=e.rules),chrome.runtime.sendMessage({type:"GET_EXTENSION_STATE"},t=>{t?.type==="EXTENSION_STATE_RESPONSE"&&(d=t.enabled),d&&(c(),g())})})}function b(e){return e.textContent?.toLowerCase().trim()??""}function x(e){if(f.has(e))return;const t=b(e);if(!t||t.length<10)return;f.add(e);const r=a.filter(o=>o.type==="hide"&&o.enabled),n=a.filter(o=>o.type==="highlight"&&o.enabled);let i=!1,h=!1;for(const o of r)if(t.includes(o.keyword.toLowerCase())){i=!0;break}if(i){E(e);return}for(const o of n)t.includes(o.keyword.toLowerCase())&&(h=!0,S(e,o.color??"#2dd4bf"));h||p(e)}function E(e){const t=e;if(t.querySelector(".nfr-hidden-toggle"))return;t.style.transition="opacity 0.25s ease, transform 0.25s ease",t.style.opacity="0.15",t.style.transform="scale(0.99)",t.setAttribute("data-nfr-hidden","true");const n=document.createElement("button");n.className="nfr-hidden-toggle",n.textContent="Hidden — show anyway?",n.style.cssText=`
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
    margin: 4px 0;
    transition: all 0.15s ease;
    text-transform: uppercase;
  `,n.addEventListener("mouseenter",()=>{n.style.color="rgba(255,255,255,0.6)",n.style.background="rgba(255,255,255,0.08)"}),n.addEventListener("mouseleave",()=>{n.style.color="rgba(255,255,255,0.35)",n.style.background="rgba(255,255,255,0.04)"}),n.addEventListener("click",i=>{i.stopPropagation(),t.style.opacity="1",t.style.transform="scale(1)",t.removeAttribute("data-nfr-hidden"),n.remove()}),t.insertAdjacentElement("afterend",n)}function S(e,t){const r=e;r.style.borderLeft=`2.5px solid ${t}`,r.style.paddingLeft="10px",r.style.borderRadius="2px",r.style.transition="border-left-color 0.3s ease",r.setAttribute("data-nfr-highlighted","true")}function p(e){const t=e;t.getAttribute("data-nfr-highlighted")&&(t.style.borderLeft="",t.style.paddingLeft="",t.style.borderRadius="",t.removeAttribute("data-nfr-highlighted"))}function v(){const e=['[data-testid="tweet"]','[data-testid="tweetText"]',".feed-shared-update-v2",".update-components-text",".thing",".entry-list-item","article",".post",".card",".item",'[role="article"]',".stream-item",".tweet"],t=[],r=new Set;for(const n of e)try{document.querySelectorAll(n).forEach(i=>{r.has(i)||(r.add(i),t.push(i))})}catch{}return t.length===0&&document.querySelectorAll("p, li, h2, h3").forEach(n=>{!r.has(n)&&(n.textContent?.length??0)>30&&(r.add(n),t.push(n))}),t}function c(){if(!d||a.length===0)return;v().forEach(x)}function w(){u&&clearTimeout(u),u=setTimeout(c,150)}function g(){l&&l.disconnect(),l=new MutationObserver(e=>{let t=!1;for(const r of e)if(r.addedNodes.length>0){t=!0;break}t&&w()}),l.observe(document.body,{childList:!0,subtree:!0})}function k(e,t){if(s)return;s=document.createElement("div"),s.id="nfr-limit-overlay",s.style.cssText=`
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: rgba(5, 5, 8, 0.92);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
    animation: nfr-fade-in 0.3s ease;
  `;const r=document.createElement("style");r.textContent=`
    @keyframes nfr-fade-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  `,document.head.appendChild(r),s.innerHTML=`
    <div style="text-align:center;max-width:360px;padding:40px;">
      <div style="width:48px;height:48px;border-radius:12px;background:rgba(45,212,191,0.12);border:1px solid rgba(45,212,191,0.25);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:22px;">
        &#9201;
      </div>
      <p style="font-size:22px;font-weight:600;color:rgba(255,255,255,0.92);margin:0 0 8px;letter-spacing:-0.02em;">
        Time check
      </p>
      <p style="font-size:14px;color:rgba(255,255,255,0.45);margin:0 0 32px;line-height:1.6;">
        You've spent <strong style="color:rgba(45,212,191,0.9)">${e} min</strong> here today — past your ${t}-minute limit.
      </p>
      <button id="nfr-dismiss" style="
        background:rgba(45,212,191,0.12);
        border:1px solid rgba(45,212,191,0.3);
        color:rgba(45,212,191,0.9);
        font-size:13px;
        font-weight:500;
        padding:10px 24px;
        border-radius:8px;
        cursor:pointer;
        letter-spacing:0.02em;
        transition:all 0.15s ease;
        margin-right:8px;
      ">Stay anyway</button>
      <button id="nfr-close-tab" style="
        background:transparent;
        border:1px solid rgba(255,255,255,0.1);
        color:rgba(255,255,255,0.4);
        font-size:13px;
        font-weight:500;
        padding:10px 24px;
        border-radius:8px;
        cursor:pointer;
        letter-spacing:0.02em;
        transition:all 0.15s ease;
      ">Close tab</button>
    </div>
  `,document.body.appendChild(s);const n=document.getElementById("nfr-dismiss"),i=document.getElementById("nfr-close-tab");n?.addEventListener("click",()=>{s?.remove(),s=null}),i?.addEventListener("click",()=>{window.close()})}function m(){document.querySelectorAll("[data-nfr-hidden]").forEach(e=>{const t=e;t.style.opacity="",t.style.transform="",e.removeAttribute("data-nfr-hidden")}),document.querySelectorAll("[data-nfr-highlighted]").forEach(e=>{p(e)}),document.querySelectorAll(".nfr-hidden-toggle").forEach(e=>e.remove())}chrome.runtime.onMessage.addListener(e=>{switch(e.type){case"RULES_UPDATED":a=e.rules,m(),c();break;case"TOGGLE_EXTENSION":d=e.enabled,d?(c(),g()):(l?.disconnect(),m());break;case"SHOW_LIMIT_OVERLAY":k(e.minutes,e.limit);break}}),chrome.runtime.onMessage.addListener((e,t,r)=>{if(e.type==="ADD_TO_QUEUE")return chrome.runtime.sendMessage(e,r),!0}),y()})();
