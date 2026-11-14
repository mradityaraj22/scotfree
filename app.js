/* App logic. Kept in its own file so the Content Security Policy can block all inline scripts. */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmtH=h=>{if(h<.2)return "walk";const hh=Math.floor(h),m=Math.round((h-hh)*60);return "~"+(hh?hh+"h":"")+(m?(hh?" ":"")+m+"m":"")};
const load=k=>{try{return new Set(JSON.parse(localStorage.getItem(k)||"[]"))}catch(e){return new Set()}};
const store=(k,s)=>{try{localStorage.setItem(k,JSON.stringify([...s]))}catch(e){}};
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
let done=load("sf-done"), saved=load("sf-saved");
const byId=Object.fromEntries(P.map(p=>[p.id,p]));
const ph=(k,cls="",extra="",lazy=true)=>`<div class="ph ${cls}">${`<img src="${img(k)}" alt="" ${lazy?'loading="lazy"':""} decoding="async">`}${extra}</div>`;

/* sync link */
let synced=null;
(function(){const m=location.hash.match(/^#sync=d:([^;]*);s:(.*)$/);if(!m)return;let n=0;
  m[1].split(".").forEach(i=>{if(byId[i]&&!done.has(i)){done.add(i);n++}});
  m[2].split(".").forEach(i=>{if(byId[i]&&!saved.has(i)){saved.add(i);n++}});
  store("sf-done",done);store("sf-saved",saved);history.replaceState(null,"",location.pathname);
  synced=n?`Synced ${n} new tick${n>1?"s":""}`:"Already in sync";})();

/* floating light motes */
if(!reduce)$("#motes").innerHTML=Array.from({length:14},()=>`<i style="left:${Math.random()*100}%;--x:${(Math.random()*120-60).toFixed(0)}px;animation-duration:${(14+Math.random()*16).toFixed(1)}s;animation-delay:-${(Math.random()*25).toFixed(1)}s;transform:scale(${(.5+Math.random()).toFixed(2)})"></i>`).join("");

/* ---------- hero slideshow ---------- */
const HERO=[["seal","Grey seal","St Abbs, pups on the shore right now"],["stag","Red deer","Glencoe, stags by the road in winter"],["cow","Highland cow","Pollok Park, free to visit"],["puffin","Puffin","Isle of May & Lunga, every spring"],["dolphin","Bottlenose dolphin","Aberdeen harbour, all year"],["squirrel","Red squirrel","Dunkeld, in the Hermitage woods"],["eagle","Sea eagle","Isle of Mull"],["reindeer","Reindeer","Cairngorms, the only herd in Britain"],["otter","Otter","Isle of Skye sea lochs"]];
$("#hero").insertAdjacentHTML("afterbegin",HERO.map(([k],i)=>`<img src="${img(k)}" alt="" ${i?'loading="lazy"':""} decoding="async">`).join(""));
$("#dots").innerHTML=HERO.map(()=>"<i></i>").join("");
let hi=-1,heroT;
function hero(next){const imgs=$$("#hero img"),dots=$$("#dots i");hi=(next??hi+1)%HERO.length;
  imgs.forEach((im,i)=>{im.classList.toggle("show",i===hi);if(i===hi){im.style.animation="none";im.offsetWidth;im.style.animation=""}});
  dots.forEach((d,i)=>{d.className=i<hi?"done":i===hi?"on":"";});
  const [k,n,l]=HERO[hi];$("#now").innerHTML=`<b>${n}</b><span>· ${esc(l)}</span>`;
  clearTimeout(heroT);if(!reduce)heroT=setTimeout(()=>{if($("#v-home").classList.contains("on"))hero();else heroT=setTimeout(()=>hero(hi),1000)},6000);}
hero(0);
$("#hero").addEventListener("click",e=>{const r=$("#hero").getBoundingClientRect();hero(e.clientX<r.left+r.width/3?(hi-1+HERO.length):hi+1)});

$("#rail").innerHTML=NOV.map(id=>{const p=byId[id];const line=p.a.replace(/^⭐\s*(November star:\s*)?/,"").split(/[.:]/)[0];
  return `<button class="tile ph" data-open="${id}"><img src="${img(photoFor(p))}" alt="" loading="lazy"><span class="on-top"><b>${esc(p.n)}</b><small>${esc(line)}</small><small>${fmtH(p.h)} · ${LEN[p.len].label}</small></span></button>`}).join("");

/* ---------- animals ---------- */
const seenAnimal=a=>a.places.some(i=>done.has(i));
function renderAnimals(){
  $("#agrid").innerHTML=ANIMALS.map((a,i)=>`<button class="acard ph" style="--i:${i}" data-animal="${a.k}"><img src="${img(a.k)}" alt="" loading="lazy">${seenAnimal(a)?'<span class="seen on-top">✓</span>':""}<span class="on-top"><b>${esc(a.n)}</b><small>${esc(a.when)}</small></span></button>`).join("");
  $("#aSeen").textContent=ANIMALS.filter(seenAnimal).length;$("#aAll").textContent=ANIMALS.length;}

function progress(){const n=done.size,t=P.length;
  $$(".nDone").forEach(e=>e.textContent=n);$$(".nAll").forEach(e=>e.textContent=t);
  $("#ring").style.strokeDashoffset=163.4*(1-n/t);
  const seen=ANIMALS.filter(seenAnimal).length;
  $("#progT").textContent=n===0?"Let's start ticking.":`${n} places, ${seen} animals.`;
  $("#progS").textContent=n===0?"Tick places as you go.":`${t-n} places still to see.`;}

/* ---------- places ---------- */
let len="day", filter=null, q="";
const HEAD={half:"Half days",day:"Day trips",long:"Long days",n1:"One night",n2:"Two or three nights",big:"Big trips"};
$("#segs").innerHTML=Object.entries(LEN).map(([k,v])=>`<button data-len="${k}" aria-pressed="${k===len}">${v.label.replace(" trip","").replace("Big 4+","Big")}<i>${P.filter(p=>p.len===k).length}</i></button>`).join("");
const badges=p=>(p.ai===2?" 🐾":"")+(p.tags.includes("insta")?" 📸":"")+(p.gem?" 💎":"")+(saved.has(p.id)?" ♥":"");
function renderList(){
  const s=q.trim().toLowerCase();
  let items=P.filter(p=>s?true:p.len===len);
  if(filter)items=items.filter(p=>filter==="animals"?p.ai>0:filter==="insta"?p.tags.includes("insta"):filter==="gem"?p.gem:filter==="saved"?saved.has(p.id):!done.has(p.id));
  if(s)items=items.filter(p=>(p.n+" "+p.r+" "+p.a+" "+p.see+" "+(p.see2||"")+" "+(p.paid||[]).map(x=>x.join(" ")).join(" ")+" "+p.tags.join(" ")).toLowerCase().includes(s));
  items.sort((a,b)=>(b.ai-a.ai)||(a.h-b.h));
  const pool=s?P:P.filter(p=>p.len===len);
  $("#lhT").textContent=s?`Results for “${q.trim()}”`:HEAD[len];
  $("#lhN").textContent=s?`${items.length} found`:`${pool.filter(p=>done.has(p.id)).length}/${pool.length} done`;
  $("#list").innerHTML=items.map((p,i)=>`<li class="row${done.has(p.id)?" done":""}" style="--i:${Math.min(i,14)}" data-id="${p.id}">
    ${ph(photoFor(p),"thumb")}
    <button class="open" data-open="${p.id}"><span class="name">${esc(p.n)}</span><span class="meta">${fmtH(p.h)} · ${esc(p.r)}${badges(p)}</span></button>
    <button class="check" data-check="${p.id}" aria-pressed="${done.has(p.id)}" aria-label="Done: ${esc(p.n)}"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 5"/></svg></button></li>`).join("");
  $("#empty").hidden=items.length>0;
}

/* ---------- sheets ---------- */
let sheetId=null;
function openSheetHTML(html){$("#sheet").innerHTML=html;$("#sheet").scrollTop=0;$("#scrim").classList.add("on");$("#sheet").classList.add("on");document.body.style.overflow="hidden"}
function openPlace(id){const p=byId[id];sheetId=id;const st=p.stay&&STAYS[p.stay];
  const animals=ANIMALS.filter(a=>a.places.includes(id));
  openSheetHTML(`${ph(photoFor(p),"sheet-ph",`<span class="grab"></span><div class="on-top"><h2 id="shT">${esc(p.n)}</h2><p class="sub">${esc(p.r)} · ${LEN[p.len].label} · ${fmtH(p.h)} each way${p.gem?" · 💎 hidden gem":""}</p></div>`,false)}
  <div class="sheet-in">
    ${p.a?`<div class="box animal"><span class="l">Animals${animals.length?" · "+animals.map(a=>esc(a.n)).join(", "):""}</span>${esc(p.a.replace(/^⭐\s*/,""))}</div>`:""}
    <div class="box"><span class="l" style="color:var(--muted)">What to do</span>${esc(p.see)}${p.see2?`<div class="dim">${esc(p.see2)}</div>`:""}</div>
    <div class="box bus"><span class="l">Free bus</span>${esc(p.bus.flat().join(" · "))}</div>
    ${p.paid?`<div class="box pay"><span class="l">Student prices</span>${p.paid.map(d=>`<div>${esc(d[0])} <span class="tier">${esc(d[1])}</span>${d[2]?` <span class="dim">· ${esc(d[2])}</span>`:""}</div>`).join("")}</div>`:""}
    ${p.ferry?`<div class="box ferry"><span class="l">Ferry (not free)</span>${esc(p.ferry)}</div>`:""}
    ${st?`<div class="box stay"><span class="l">Stay · ${esc(st.w)}</span>Dorm ${esc(st.d)} each · room ${esc(st.r)}${st.n?`<div class="dim">${esc(st.n)}</div>`:""}</div>`:""}
    ${p.tip?`<div class="box"><span class="l" style="color:var(--muted)">Tip</span>${esc(p.tip)}</div>`:""}
    <div class="actions"><button class="primary${done.has(id)?" is":""}" data-sdone>${done.has(id)?"✓ Been there":"Mark as done"}</button><button class="heart${saved.has(id)?" is":""}" data-sheart>${saved.has(id)?"♥ On our list":"♡ Want to go"}</button></div>
  </div>`);}
function openAnimal(k){const a=ANIMALS.find(x=>x.k===k);sheetId=null;
  openSheetHTML(`${ph(k,"sheet-ph",`<span class="grab"></span><div class="on-top"><h2 id="shT">${esc(a.n)}</h2><p class="sub">${esc(a.when)}</p></div>`,false)}
  <div class="sheet-in"><div class="box animal"><span class="l">About</span>${esc(a.line)}</div>
  <div class="box" style="background:none;border:0;padding:0"><span class="l" style="color:var(--muted)">Where to see it · ${a.places.length} place${a.places.length>1?"s":""}</span></div>
  <div class="where">${a.places.map(id=>{const p=byId[id];return `<button data-open="${id}">${ph(photoFor(p),"thumb")}<span><span class="name" style="font-size:15px">${esc(p.n)}</span><span class="meta">${fmtH(p.h)} · ${LEN[p.len].label}</span></span>${done.has(id)?'<span class="tick">✓</span>':""}</button>`}).join("")}</div></div>`);}
function closeSheet(){$("#scrim").classList.remove("on");$("#sheet").classList.remove("on");document.body.style.overflow="";sheetId=null}
$("#scrim").addEventListener("click",closeSheet);
addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});
(function(){let y0=null;const s=$("#sheet");s.addEventListener("touchstart",e=>{if(s.scrollTop<=0)y0=e.touches[0].clientY},{passive:true});
  s.addEventListener("touchmove",e=>{if(y0===null)return;const d=e.touches[0].clientY-y0;if(d>0){s.style.transition="none";s.style.transform=`translateY(${d}px)`}},{passive:true});
  s.addEventListener("touchend",e=>{if(y0===null)return;const d=e.changedTouches[0].clientY-y0;s.style.transition="";s.style.transform="";if(d>110)closeSheet();y0=null});})();

/* ---------- toggles ---------- */
function toggleDone(id){const on=!done.has(id);on?done.add(id):done.delete(id);store("sf-done",done);if(on&&navigator.vibrate&&navigator.userActivation?.hasBeenActive)navigator.vibrate(10);progress();renderAnimals();schedulePush();return on}
function toggleSaved(id){const on=!saved.has(id);on?saved.add(id):saved.delete(id);store("sf-saved",saved);progress();schedulePush();return on}

/* ---------- cloud sync with a shared code ---------- */
let code=(()=>{try{return localStorage.getItem("sf-code")||""}catch(e){return ""}})();
let pushT=null, inflight=false, dirty=(()=>{try{return localStorage.getItem("sf-dirty")==="1"}catch(e){return false}})();
const setDirty=v=>{dirty=v;try{localStorage.setItem("sf-dirty",v?"1":"0")}catch(e){}};
const same=(a,b)=>a.size===b.size&&[...a].every(x=>b.has(x));
async function api(body){const r=await fetch("/api/ticks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||"Cloud sync isn't available");return j}
function rerender(){renderList();renderAnimals();progress()}
function applyCloud(d){const nd=new Set((d.done||[]).filter(i=>byId[i])),ns=new Set((d.saved||[]).filter(i=>byId[i]));if(same(nd,done)&&same(ns,saved))return false;
  done=nd;saved=ns;store("sf-done",done);store("sf-saved",saved);rerender();return true}
function syncUI(state){const b=$("#syncBtn");b.classList.toggle("on",!!code&&state!=="err");b.classList.toggle("err",state==="err");
  b.textContent=!code?"☁︎ Sync":state==="saving"?"☁︎ Saving…":state==="err"?"☁︎ Offline":"☁︎ "+code}
async function pull(manual){if(!code||pushT||inflight)return;
  if(dirty){await push();if(manual&&!dirty)toast("Saved your offline ticks");return}
  try{const d=await api({action:"get",code});if(pushT||inflight)return;const changed=applyCloud(d);syncUI("ok");if(manual)toast(changed?"Got the latest ticks":"Already up to date");else if(changed)toast("Ticks updated from the other phone")}
  catch(e){syncUI("err");if(manual)toast(e.message)}}
function schedulePush(){if(!code)return;setDirty(true);clearTimeout(pushT);syncUI("saving");pushT=setTimeout(push,500)}
async function push(){pushT=null;inflight=true;
  try{await api({action:"set",code,done:[...done],saved:[...saved]});setDirty(false);syncUI("ok")}
  catch(e){syncUI("err");toast("Saved on this phone. It will upload when you're back online.")}
  inflight=false}
async function connect(){const v=$("#codeIn").value.trim().toUpperCase(),btn=$("#syncGo");
  if(!/^[A-Z0-9]{6,40}$/.test(v)){toast("Use 6–40 letters or numbers, no spaces");return}
  btn.disabled=true;btn.textContent="Connecting…";
  try{const d=await api({action:"get",code:v});
    (d.done||[]).forEach(i=>byId[i]&&done.add(i));(d.saved||[]).forEach(i=>byId[i]&&saved.add(i));
    store("sf-done",done);store("sf-saved",saved);
    await api({action:"set",code:v,done:[...done],saved:[...saved]});
    code=v;setDirty(false);try{localStorage.setItem("sf-code",code)}catch(e){}
    rerender();syncUI("ok");closeSheet();toast(`Connected to ${code}. Ticks now save to the cloud.`)}
  catch(e){toast(e.message);btn.disabled=false;btn.textContent=code?"Switch code":"Connect"}}
async function undoCloud(){try{const d=await api({action:"undo",code});applyCloud(d);setDirty(false);syncUI("ok");closeSheet();toast("Restored the previous version")}catch(e){toast(e.message)}}
function disconnect(){code="";try{localStorage.removeItem("sf-code")}catch(e){}syncUI();closeSheet();toast("Disconnected. Your ticks stay on this phone.")}
function openSync(){sheetId=null;
  openSheetHTML(`${ph("storr","sheet-ph",`<span class="grab"></span><div class="on-top"><h2 id="shT">Sync your ticks</h2><p class="sub">Same code on both phones = same checklist, anywhere.</p></div>`,false)}
  <div class="sheet-in">
    <input class="codein" id="codeIn" value="${esc(code)}" placeholder="YOUR CODE" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" maxlength="40" aria-label="Sync code">
    ${code?`<div class="box animal"><span class="l">Connected</span>This phone saves every tick to the cloud under <b>${esc(code)}</b>. Open the site on any phone, enter the same code, and your ticks are there.</div>`
          :`<p class="dim" style="font-size:15px">Pick a code you both remember and type it here on each phone. Ticks you've already made on this phone are added to the code.</p>`}
    <div class="actions"><button class="primary" id="syncGo">${code?"Switch code":"Connect"}</button>${code?`<button id="syncNow">Sync now</button>`:`<button data-close>Cancel</button>`}</div>
    ${code?`<button class="linkbtn" id="syncUndo">Undo the last cloud change</button><button class="linkbtn" id="syncOff">Disconnect this phone</button>`:""}
    <p class="dim" style="font-size:12.5px">Anyone who knows the code can see and change your ticks, so don't share it.</p>
  </div>`);
  const i=$("#codeIn");i.addEventListener("keydown",e=>{if(e.key==="Enter")connect()});if(!code)setTimeout(()=>i.focus(),450);}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")pull()});
setInterval(()=>{if(document.visibilityState==="visible")pull()},20000);
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2400)}

function show(v){closeSheet();$$(".view").forEach(s=>s.classList.toggle("on",s.id==="v-"+v));$$(".tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.v===v));
  scrollTo(0,0);try{localStorage.setItem("sf-view",v)}catch(e){}}

document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  if(b.dataset.v)show(b.dataset.v);
  else if(b.dataset.open)openPlace(b.dataset.open);
  else if(b.dataset.animal)openAnimal(b.dataset.animal);
  else if(b.dataset.check){const on=toggleDone(b.dataset.check);b.setAttribute("aria-pressed",on);b.closest(".row").classList.toggle("done",on);if(filter==="todo")setTimeout(renderList,450);else if(!q){const pool=P.filter(p=>p.len===len);$("#lhN").textContent=`${pool.filter(p=>done.has(p.id)).length}/${pool.length} done`}}
  else if(b.dataset.sdone!==undefined){const on=toggleDone(sheetId);b.classList.toggle("is",on);b.textContent=on?"✓ Been there":"Mark as done";renderList()}
  else if(b.dataset.sheart!==undefined){const on=toggleSaved(sheetId);b.classList.toggle("is",on);b.textContent=on?"♥ On our list":"♡ Want to go";renderList()}
  else if(b.dataset.len){len=b.dataset.len;q="";$("#q").value="";$$("#segs button").forEach(x=>x.setAttribute("aria-pressed",x===b));renderList();b.scrollIntoView({inline:"center",block:"nearest",behavior:reduce?"auto":"smooth"})}
  else if(b.dataset.f){filter=filter===b.dataset.f?null:b.dataset.f;$$("#chips button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.f===filter));renderList()}
  else if(b.id==="syncBtn")openSync();
  else if(b.id==="syncGo")connect();
  else if(b.id==="syncNow")pull(true);
  else if(b.id==="syncOff")disconnect();
  else if(b.id==="syncUndo")undoCloud();
  else if(b.dataset.close!==undefined)closeSheet();
});
$("#q").addEventListener("input",e=>{q=e.target.value;renderList()});

/* trips, stays, credits */
const RIMG=["stag","otter","eagle","dolphin","seal","goose"];
$("#routes").innerHTML=ROUTES.map((r,i)=>`<details class="card"><summary>${ph(RIMG[i%RIMG.length],"ca")}<div><h3>${esc(r.t)}</h3><p class="when">${esc(r.d)}</p><p class="s2">${esc(r.sub)}</p></div><span class="plus"></span></summary>
  <div class="body"><ul class="legs">${r.legs.map(l=>`<li><b>${esc(l[0])}</b>${esc(l[1])}</li>`).join("")}</ul><div class="cost">${esc(r.cost)}</div></div></details>`).join("");
$("#stays").innerHTML=HOSTEL_TABLE.map(r=>`<div class="stayrow"><div>${esc(r[0])}${r[3]?`<small>${esc(r[3])}</small>`:""}</div><div class="p">${esc(r[1])}<small>room ${esc(r[2])}</small></div></div>`).join("");
$("#credits").innerHTML=Object.values(CREDITS).map(c=>`<div><a href="${esc(c.page)}" target="_blank" rel="noopener">${esc(c.title.replace(/\.(jpe?g|png)$/i,""))}</a>, ${esc(c.artist)}, ${esc(c.license)}</div>`).join("");

renderList();renderAnimals();progress();
try{const v=localStorage.getItem("sf-view");if(v&&document.getElementById("v-"+v))show(v)}catch(e){}
if(synced)setTimeout(()=>toast(synced),600);
syncUI();if(code)pull();
