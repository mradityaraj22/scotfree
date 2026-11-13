/* Constellation artwork: each shape is a list of strokes on a 100x100 grid. Stars sit on every point. */
const ART = {
  stag:{name:"Red deer",hue:265,s:[
    [[18,42],[22,34],[30,30],[34,36],[38,46],[62,44],[76,46],[80,52],[84,49]],
    [[18,42],[26,45],[34,41]],[[38,46],[40,62],[66,62],[76,58],[80,52]],
    [[42,62],[42,84]],[[48,62],[47,84]],[[68,62],[70,84]],[[74,60],[76,84]],
    [[30,30],[28,18],[22,8]],[[28,18],[34,10]],[[28,18],[21,20]],[[31,30],[37,22],[41,11]],[[37,22],[45,18]]]},
  seal:{name:"Grey seal",hue:200,s:[
    [[14,58],[17,49],[24,44],[30,47],[34,57],[50,63],[70,65],[86,61],[93,55],[89,66],[74,72],[40,72],[22,68],[14,58]],
    [[40,72],[44,80],[51,74]],[[14,58],[8,57]],[[14,58],[9,62]]]},
  cow:{name:"Highland cow",hue:30,s:[
    [[30,40],[70,40],[78,46],[78,64],[30,64],[27,52],[30,40]],
    [[30,40],[19,43],[13,53],[19,61],[28,58]],[[18,44],[9,38],[6,27]],[[25,42],[31,33],[39,28]],
    [[34,64],[34,82]],[[42,64],[42,82]],[[66,64],[66,82]],[[74,64],[74,82]],[[78,46],[85,58],[83,67]]]},
  dolphin:{name:"Bottlenose dolphin",hue:190,s:[
    [[10,62],[22,46],[40,36],[60,36],[76,44],[88,58]],[[10,62],[16,64],[30,56],[48,50],[66,52],[80,60],[88,58]],
    [[44,37],[50,25],[57,36]],[[88,58],[97,51]],[[88,58],[94,69]],[[34,54],[29,65]]]},
  goose:{name:"Pink-footed goose",hue:320,s:[
    [[5,46],[12,48],[30,52],[52,50],[70,54],[81,58],[87,56]],[[30,52],[44,60],[66,60],[81,58]],
    [[40,52],[34,32],[24,13],[44,30],[52,50]],[[56,51],[60,32],[70,15],[66,36],[64,52]]]},
  squirrel:{name:"Red squirrel",hue:20,s:[
    [[40,30],[44,22],[46,14],[50,22],[56,26],[54,32],[46,36]],[[46,36],[40,48],[38,64],[44,80],[58,80]],
    [[44,44],[52,46]],[[58,80],[70,72],[78,56],[76,38],[68,28],[62,34],[66,48],[62,64],[58,80]],[[44,80],[50,83]]]},
  puffin:{name:"Puffin",hue:280,s:[
    [[40,40],[40,20],[50,14],[60,20],[62,30]],[[62,30],[75,32],[62,38]],
    [[62,38],[66,52],[64,70],[54,80],[42,76],[38,58],[40,40]],[[44,44],[52,60],[50,74]],[[50,80],[48,89]],[[58,79],[60,89]]]},
  eagle:{name:"Sea eagle",hue:45,s:[
    [[46,30],[50,23],[54,30],[54,52],[50,62],[46,52],[46,30]],
    [[46,36],[30,31],[14,35],[4,44],[16,44],[26,48],[46,46]],[[54,36],[70,31],[86,35],[96,44],[84,44],[74,48],[54,46]],
    [[46,56],[43,73],[57,73],[54,56]]]},
  otter:{name:"Otter",hue:170,s:[
    [[8,52],[15,44],[24,46],[29,53],[50,50],[70,54],[92,57]],[[8,52],[16,57],[50,60],[70,61],[92,57]],
    [[36,60],[38,67]],[[62,60],[64,67]],[[4,72],[24,68],[44,73],[64,68],[84,73],[97,70]]]},
  cat:{name:"Wild cat",hue:350,s:[
    [[30,85],[30,60],[36,40],[34,26],[38,17],[42,26],[50,26],[54,17],[58,26],[56,40],[64,60],[66,85]],
    [[66,80],[80,78],[87,66]],[[38,34],[44,36]],[[48,36],[53,34]]]},
  mountain:{name:"Mountains",hue:220,s:[[[4,82],[28,42],[42,60],[62,22],[96,82]],[[55,34],[62,30],[70,36]]]},
  castle:{name:"Castle",hue:250,s:[
    [[10,85],[10,40],[18,40],[18,32],[26,32],[26,40],[34,40],[34,50],[66,50],[66,40],[74,40],[74,32],[82,32],[82,40],[90,40],[90,85],[10,85]],
    [[42,85],[42,68],[50,60],[58,68],[58,85]]]},
  wave:{name:"Coast",hue:195,s:[[[5,62],[20,46],[35,40],[49,48],[44,59],[35,56]],[[5,76],[25,70],[45,76],[65,70],[85,76],[96,72]]]},
  tree:{name:"Forest",hue:150,s:[[[50,10],[30,40],[40,40],[22,62],[78,62],[60,40],[70,40],[50,10]],[[50,62],[50,86]]]},
  falls:{name:"Waterfall",hue:185,s:[[[10,20],[45,20],[45,86]],[[50,22],[50,80]],[[56,22],[58,80]],[[62,22],[65,80]],[[40,88],[82,88]]]},
  city:{name:"City",hue:230,s:[[[5,85],[5,55],[18,55],[18,40],[30,40],[30,60],[42,60],[42,25],[56,25],[56,50],[68,50],[68,35],[80,35],[80,85]]]}
};
const ART_BY_ID = {stabbs:"seal",eyemouth:"seal",tentsmuir:"seal",newburgh:"seal",cumbrae:"seal",oban:"seal",queensferry:"seal",leith:"seal",
  lochleven:"goose",aberlady:"goose",montrose:"goose",islay:"goose",caerlaverock:"goose",musselburgh:"goose",duddingston:"goose",linlithgow:"goose",
  pollok:"cow",pentlands:"cow",gorgie:"cow",aberdeen:"dolphin",inverness:"dolphin",bowfiddle:"dolphin",deepsea:"dolphin",dundee:"dolphin",
  glencoe:"stag",beecraigs:"stag",arran:"stag",deeside:"stag",deercentre:"stag",aviemore:"stag",dunkeld:"squirrel",botanic:"squirrel",dalkeith:"squirrel",
  mull:"eagle",skye:"otter",dean:"otter",orkney:"puffin",shetland:"puffin",northberwick:"puffin",eastneuk:"puffin",edzoo:"puffin",dunfermline:"puffin",
  fivesisters:"cat",blairdrummond:"cat",hwp:"cat",oldtown:"castle"};
function artFor(p){
  if(ART_BY_ID[p.id])return ART_BY_ID[p.id];
  const a=(p.a||"").toLowerCase();
  if(p.ai>0){for(const [k,re] of [["seal",/seal/],["dolphin",/dolphin/],["goose",/geese|goose|swan/],["stag",/deer|reindeer/],["cow",/cow|sheep|goat/],["squirrel",/squirrel/],["otter",/otter/],["eagle",/eagle|kite|buzzard|osprey/],["puffin",/puffin|seabird|bird/]])if(re.test(a))return k}
  for(const [t,k] of [["waterfall","falls"],["castle","castle"],["beach","wave"],["island","wave"],["forest","tree"],["hills","mountain"],["city","city"]])if(p.tags.includes(t))return k;
  return "mountain";
}
let _seed=7; const rnd=()=>((_seed=(_seed*9301+49297)%233280)/233280);
function constellation(key,opts={}){
  const A=ART[key]||ART.mountain, big=opts.big, seen=new Set(); let stars="", lines="";
  A.s.forEach((st,i)=>{
    lines+=`<polyline pathLength="1" style="--d:${(i*0.12).toFixed(2)}s" points="${st.map(p=>p.join(",")).join(" ")}"/>`;
    st.forEach(([x,y])=>{const k=x+","+y; if(seen.has(k))return; seen.add(k);
      const r=(big?1.5:2.2)+rnd()*(big?1.6:1.4);
      stars+=`<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" style="--t:${(rnd()*3).toFixed(2)}s"/>`;});
  });
  return `<svg class="cst${big?" big":""}" viewBox="-4 -4 108 108" aria-hidden="true"><g class="ln">${lines}</g><g class="st">${stars}</g></svg>`;
}
