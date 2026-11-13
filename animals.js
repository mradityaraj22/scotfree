/* Every animal you can see, with its photo (images/<key>.jpg), season and the places to see it. */
const ANIMALS = [
 {k:"cow",n:"Highland cow",when:"All year",line:"Shaggy ginger 'hairy coos' with huge horns.",places:["pollok","pentlands","aviemore","skye","deeside","beecraigs"]},
 {k:"seal",n:"Grey seal",when:"Pups Oct–Dec",line:"Fluffy white pups on the beaches in autumn, seals at harbours all year.",places:["stabbs","eyemouth","tentsmuir","newburgh","cumbrae","northberwick","oban","queensferry","eastneuk"]},
 {k:"stag",n:"Red deer",when:"Best Oct–Mar",line:"Scotland's biggest wild animal. Stags come down to the roads in winter.",places:["glencoe","arran","beecraigs","deercentre","deeside","callander","inveraray","aberfoyle"]},
 {k:"dolphin",n:"Bottlenose dolphin",when:"All year",line:"The world's biggest bottlenose dolphins, hunting close to shore.",places:["aberdeen","inverness","bowfiddle","dundee"]},
 {k:"squirrel",n:"Red squirrel",when:"All year",line:"Tufted ears, bright red coat. Most active in autumn mornings.",places:["dunkeld","aviemore","tentsmuir","peebles","dalkeith","pitlochry","callander"]},
 {k:"goose",n:"Pink-footed goose",when:"Oct–Mar",line:"Tens of thousands fly in from Iceland. Spectacular at dusk.",places:["aberlady","lochleven","montrose","islay","caerlaverock"]},
 {k:"reindeer",n:"Reindeer",when:"All year",line:"Britain's only free-ranging reindeer herd, in the Cairngorms.",places:["aviemore"]},
 {k:"puffin",n:"Puffin",when:"Apr–Jul",line:"Clown-faced seabirds that nest on clifftop islands.",places:["eastneuk","mull","orkney","shetland","thurso","yellowcraig"]},
 {k:"eagle",n:"White-tailed sea eagle",when:"All year",line:"The 'flying barn door', with a wingspan up to 2.5 m.",places:["mull","skye","oban","glenfinnan","harris"]},
 {k:"otter",n:"Otter",when:"All year, dawn & dusk",line:"Playful hunters along quiet sea lochs.",places:["skye","mull","dean","glenfinnan","harris","shetland","castlestalker"]},
 {k:"swan",n:"Swans",when:"All year · whoopers in winter",line:"Mute swans on rivers, wild whooper swans from Iceland in winter.",places:["musselburgh","linlithgow","lochleven","caerlaverock","duddingston"]},
 {k:"gannet",n:"Gannet",when:"Feb–Oct",line:"150,000 gannets turn Bass Rock white. They dive at 60 mph.",places:["northberwick"]},
 {k:"pony",n:"Shetland pony",when:"All year",line:"Tiny, tough and fluffy, roaming the Shetland hills.",places:["shetland"]},
 {k:"clydesdale",n:"Clydesdale horse",when:"All year",line:"Gentle giant Scottish horses with feathered feet.",places:["pollok"]},
 {k:"sheep",n:"Blackface sheep",when:"Lambs Apr–May",line:"Curly-horned hill sheep on every Highland slope.",places:["pentlands","innerleithen","harris"]},
 {k:"goat",n:"Wild goats",when:"All year",line:"Shaggy feral goats on rocky hillsides.",places:["dumyat","arrochar","moffat","gorgie"]},
 {k:"hare",n:"Mountain hare",when:"White Dec–Mar",line:"Turns snow white in winter.",places:["deeside"]},
 {k:"marten",n:"Pine marten",when:"All year, at night",line:"Rare, shy forest hunter with a cream bib.",places:["fortwilliam"]},
 {k:"osprey",n:"Osprey",when:"Apr–Aug",line:"Fish-catching eagles back from Africa each spring.",places:["dunkeld","aberfoyle","bowfiddle"]},
 {k:"beaver",n:"Beaver",when:"Dusk, all year",line:"Back in Scotland after 400 years.",places:["dunkeld"]},
 {k:"heron",n:"Grey heron",when:"All year",line:"Statue-still fishers on city rivers.",places:["duddingston","dean","kelpies"]},
 {k:"cat",n:"Scottish wildcat",when:"All year",line:"Britain's rarest mammal, the 'Highland tiger'.",places:["hwp","deercentre"]},
 {k:"leopard",n:"Snow leopard",when:"All year",line:"At the Highland Wildlife Park, with snow to match.",places:["hwp"]},
 {k:"polar",n:"Polar bear",when:"All year",line:"The UK's only polar bears live near Aviemore.",places:["hwp"]},
 {k:"penguin",n:"Penguins",when:"All year",line:"Gentoo and rockhopper penguins at Edinburgh Zoo.",places:["edzoo"]},
 {k:"lion",n:"Lions",when:"Spring–autumn",line:"At Blair Drummond Safari Park and Five Sisters Zoo.",places:["blairdrummond","fivesisters"]},
 {k:"peacock",n:"Peacocks",when:"All year",line:"Free-roaming in Pittencrieff Park, Dunfermline.",places:["dunfermline"]},
 {k:"wallaby",n:"Wallabies",when:"All year",line:"A wild colony on a Loch Lomond island. Yes, really.",places:["lomond"]}
];
const PHOTO_BY_ID={stabbs:"seal",eyemouth:"seal",tentsmuir:"seal",newburgh:"seal",cumbrae:"seal",oban:"seal",queensferry:"seal",leith:"seal",
  lochleven:"goose",aberlady:"goose",montrose:"goose",islay:"goose",caerlaverock:"swan",musselburgh:"swan",duddingston:"heron",linlithgow:"swan",
  pollok:"cow",pentlands:"sheep",gorgie:"goat",aberdeen:"dolphin",inverness:"dolphin",bowfiddle:"dolphin",deepsea:"dolphin",dundee:"dolphin",
  glencoe:"stag",beecraigs:"stag",arran:"stag",deeside:"hare",deercentre:"stag",aviemore:"reindeer",dunkeld:"squirrel",botanic:"squirrel",dalkeith:"squirrel",
  mull:"eagle",skye:"cow",dean:"heron",orkney:"puffin",shetland:"pony",northberwick:"gannet",eastneuk:"puffin",edzoo:"penguin",dunfermline:"peacock",
  fivesisters:"lion",blairdrummond:"lion",hwp:"leopard",lomond:"wallaby",dumyat:"goat",arrochar:"goat",fortwilliam:"marten",
  eileandonan:"castle",castlestalker:"castle",kilchurn:"castle",stirling:"castle",oldtown:"castle",glenfinnan:"mountain",storr:"storr",
  harris:"wave",thurso:"wave",durness:"wave",fortwilliam2:"falls",pitlochry:"falls",callander:"falls",aberfeldy:"falls",comrie:"falls",newlanark:"falls"};
function photoFor(p){
  if(PHOTO_BY_ID[p.id])return PHOTO_BY_ID[p.id];
  const a=(p.a||"").toLowerCase();
  if(p.ai>0)for(const [k,re] of [["seal",/seal/],["dolphin",/dolphin/],["goose",/geese|goose/],["swan",/swan/],["stag",/deer/],["cow",/cow/],["sheep",/sheep/],["goat",/goat/],["squirrel",/squirrel/],["otter",/otter/],["eagle",/eagle/],["puffin",/puffin/],["heron",/heron/]])if(re.test(a))return k;
  for(const [t,k] of [["waterfall","falls"],["castle","castle"],["island","storr"],["beach","wave"],["forest","tree"],["hills","mountain"],["city","castle"],["village","mountain"]])if(p.tags.includes(t))return k;
  return "mountain";
}
const img=k=>`images/${k}.jpg`;
