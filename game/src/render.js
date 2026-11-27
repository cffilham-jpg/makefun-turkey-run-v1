import {CFG, STAGES, scoreRun} from './config.js';

const C={ink:'#292738',cream:'#fff0c9',gold:'#ffc861',orange:'#ed8341',red:'#d95243',green:'#84b898',brown:'#74412f',blue:'#5b8291'};
function box(g,x,y,w,h,r,fill,stroke) {g.beginPath();g.roundRect(x,y,w,h,r);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke();}}
function ellipse(g,x,y,rx,ry,fill,rotation=0) {g.beginPath();g.ellipse(x,y,rx,ry,rotation,0,Math.PI*2);g.fillStyle=fill;g.fill();}
function line(g,points,color,width=3) {g.beginPath();g.moveTo(points[0],points[1]);for(let i=2;i<points.length;i+=2)g.lineTo(points[i],points[i+1]);g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';g.stroke();}
function shape(g,points,fill,stroke,width=3) {g.beginPath();g.moveTo(points[0],points[1]);for(let i=2;i<points.length;i+=2)g.lineTo(points[i],points[i+1]);g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.lineJoin='round';g.stroke();}}
function text(g,value,x,y,size=20,color=C.cream,weight='bold',align='left',font='Trebuchet MS') {g.font=weight+' '+size+'px '+font+', Arial, sans-serif';g.fillStyle=color;g.textAlign=align;g.fillText(value,x,y);}
function tracked(g,value,x,y,size=13,color=C.gold,spacing=2) {g.font='bold '+size+'px Trebuchet MS, sans-serif';g.fillStyle=color;g.textAlign='left';for(const char of value){g.fillText(char,x,y);x+=g.measureText(char).width+spacing;}}
function star(g,x,y,size=10,color=C.cream) {shape(g,[x,y-size,x+size*.25,y-size*.25,x+size,y,x+size*.25,y+size*.25,x,y+size,x-size*.25,y+size*.25,x-size,y,x-size*.25,y-size*.25],color);}

function drawSkyAndHills(g,distance,time) {
  const sky=g.createLinearGradient(0,0,0,560);sky.addColorStop(0,'#695070');sky.addColorStop(.43,'#df937c');sky.addColorStop(1,'#ffd68a');g.fillStyle=sky;g.fillRect(0,0,1280,560);
  const sun=g.createRadialGradient(868,292,5,868,292,210);sun.addColorStop(0,'#ffedaa');sun.addColorStop(.34,'#ffe8a0');sun.addColorStop(.35,'#ffe8a024');sun.addColorStop(1,'#ffe8a000');g.fillStyle=sun;g.fillRect(640,60,440,440);
  ellipse(g,868,292,78,78,'#ffe4a0');
  for(let i=0;i<6;i++){const x=((i*259-distance*.8)%1600+1600)%1600-120;box(g,x,190+i%3*43,160,9,8,'#f9c6a339');box(g,x+55,178+i%3*43,82,8,6,'#f9c6a324');}
  for(let layer=0;layer<3;layer++) {
    g.beginPath();g.moveTo(0,500);
    for(let x=0;x<=1320;x+=30) {const h=Math.sin((x+distance*(layer+1)*.8)/240+layer)*35+Math.cos(x/380+layer)*25;g.lineTo(x,370+layer*49+h);}
    g.lineTo(1280,560);g.lineTo(0,560);g.fillStyle=['#a77078','#a57c6e','#b79770'][layer];g.fill();
  }
  for(let i=0;i<5;i++){const x=930+i*35;const y=190+Math.sin(i*1.6)*12;line(g,[x-6,y+4,x,y,x+6,y+4],'#674a61',2);}
  // Soft rays are painted behind all solid scenery.
  g.save();g.globalAlpha=.07;shape(g,[868,285,1180,560,990,560],'#fff3bf');shape(g,[868,285,600,560,740,560],'#fff3bf');g.restore();
}
function drawBarn(g,x,y,s) {
  g.save();g.translate(x,y);g.scale(s,s);
  box(g,119,-153,54,159,6,'#c5a494');ellipse(g,146,-151,27,20,'#ac8e88');line(g,[131,-157,163,-157],'#dfc3a7',3);
  box(g,0,-113,136,117,0,'#a64f4a');shape(g,[-12,-111,67,-174,148,-111],'#654a57');shape(g,[0,-111,67,-160,136,-111],'#be6d57');
  for(let i=8;i<135;i+=15)line(g,[i,-99,i,0],'#c2745c',2);
  box(g,37,-68,61,72,0,'#704353');line(g,[38,0,98,-67,38,-67,98,0],'#f0bd8e',4);line(g,[67,-68,67,1],'#f0bd8e',4);
  box(g,54,-116,26,25,1,'#e6b584');line(g,[67,-115,67,-91],'#77505c',3);
  g.restore();
}
function drawTree(g,x,y,s,variant=0) {
  g.save();g.translate(x,y);g.scale(s,s);
  line(g,[0,0,-3,-119],'#674c4d',13);line(g,[-3,-50,-38,-92],'#674c4d',7);line(g,[-2,-71,29,-108],'#674c4d',6);
  const colors=variant?['#a35d51','#c87952','#df9a56']:['#bd624b','#dd8251','#eda25e'];
  ellipse(g,-30,-128,40,39,colors[0]);ellipse(g,23,-136,42,46,colors[1]);ellipse(g,-5,-163,39,40,colors[1]);ellipse(g,-7,-135,35,36,colors[2]);
  for(let i=0;i<12;i++){const xx=Math.sin(i*2.7)*50, yy=-150+Math.cos(i*3)*33;ellipse(g,xx,yy,4,2,'#f5b76e',i);}
  g.restore();
}
function drawPumpkin(g,x,y,s=1) {
  g.save();g.translate(x,y);g.scale(s,s);ellipse(g,0,4,26,7,'#513a3b3f');
  ellipse(g,-12,-9,14,19,'#bc5938');ellipse(g,12,-9,14,19,'#d16c36');ellipse(g,0,-10,14,21,'#ec8d40');
  line(g,[0,-29,2,-37,8,-39],'#5f7051',5);line(g,[-5,-23,-8,-10,-5,3],'#ffb04d',2);g.restore();
}
function drawFence(g,offset,y=505) {
  for(let x=-80-offset%135;x<1380;x+=135) {
    box(g,x,y-44,11,49,2,'#836757');box(g,x-11,y-30,151,8,1,'#a58b68');box(g,x-11,y-11,151,8,1,'#a58b68');
  }
}
function drawFarm(g,world,time) {
  drawSkyAndHills(g,world.distance,time);
  const barnX=600-(world.distance*1.3%1550);drawBarn(g,barnX,452,.82);drawBarn(g,barnX+1550,452,.82);
  for(let i=0;i<9;i++){const x=((i*220-world.distance*2.1)%1980+1980)%1980-160;drawTree(g,x,483,.65+(i%3)*.16,i%2);}
  g.fillStyle='#9c955e';g.fillRect(0,480,1280,74);drawFence(g,world.distance*3.4);
  // Rows of crops and pumpkins give the foreground a different parallax speed.
  for(let i=0;i<22;i++){const x=((i*94-world.distance*5.1)%2068+2068)%2068-70;line(g,[x,538,x-4,505],'#6c8054',3);shape(g,[x,523,x-19,511,x-11,530],'#7e8b51');shape(g,[x,519,x+16,505,x+10,525],'#b5a05b');}
  for(let i=0;i<9;i++){const x=((i*185-world.distance*4)%1665+1665)%1665-80;drawPumpkin(g,x,541,.65+(i%2)*.2);}
  const dirt=g.createLinearGradient(0,552,0,720);dirt.addColorStop(0,'#b67c52');dirt.addColorStop(.08,'#ce9a62');dirt.addColorStop(.09,'#926449');dirt.addColorStop(1,'#624435');g.fillStyle=dirt;g.fillRect(0,552,1280,168);
  line(g,[0,553,1280,553],'#f3bd75',5);line(g,[0,565,1280,565],'#5d473d',3);
  for(let i=0;i<85;i++){const x=((i*113-world.distance*14)%1380+1380)%1380-50;const y=581+(i*47)%130;ellipse(g,x,y,3+i%5,1.3,'#e4b27a33');}
  for(let i=0;i<14;i++){const x=((i*128-world.distance*15)%1792+1792)%1792-80;shape(g,[x,572,x-6,562,x+2,568,x+8,559,x+6,575],'#6e7946');}
  if(world.distance>480 && world.distance<1030) drawCookhouse(g,world.distance);
}
function drawCookhouse(g,distance) {
  // A distant open-air cookhouse marks the more dangerous middle stretch.
  const x=1110-(distance-480)*2.8;
  g.save();g.globalAlpha=.7;box(g,x,329,272,167,2,'#b27e63');shape(g,[x-22,329,x+137,267,x+294,329],'#765360');
  for(let i=0;i<7;i++)box(g,x+18+i*35,346,21,149,0,'#a16e59');box(g,x+32,359,105,99,3,'#745864');
  text(g,'COOKHOUSE',x+141,354,15,'#ffe0a3','bold','center');g.restore();
}

export function drawTurkey(g,x,y,scale=1,time=0,duck=false,flying=false) {
  g.save();g.translate(x,y);g.scale(scale,scale);if(duck) {g.translate(0,-2);g.scale(1.3,.43);}
  const stride=flying?Math.sin(time*13)*5:Math.sin(time*17)*12;
  // Fan feathers, each with a light tip and central quill.
  for(let i=0;i<7;i++) {
    g.save();g.translate(-25,-48);g.rotate(-1.15+i*.29);
    ellipse(g,0,-32,12,42,i%2?'#a94737':'#c8663e');ellipse(g,0,-59,11,14,i%2?'#f4b76a':'#ffd795');ellipse(g,0,-37,5,25,'#713d36');line(g,[0,-8,0,-62],'#e39b60',1.7);g.restore();
  }
  line(g,[-7,-12,-10+stride,4,-19+stride,7],'#efae55',6);line(g,[18,-12,21-stride,4,31-stride,7],'#efae55',6);
  ellipse(g,0,-44,43,36,'#4e3540',-.08);ellipse(g,5,-49,36,27,'#825044',-.15);ellipse(g,10,-34,31,19,'#a9704b');
  g.save();g.translate(-6,-52);g.rotate(flying?-.7+Math.sin(time*16)*.35:.25+Math.sin(time*14)*.1);ellipse(g,-1,1,26,15,'#ce975b',.2);line(g,[-21,0,2,6,14,4],'#edbc78',3);g.restore();
  // Blue neck and red snood make the silhouette unmistakably a turkey.
  line(g,[27,-54,35,-94,48,-108],'#5b97a3',22);ellipse(g,47,-109,23,25,'#73afbb',-.15);ellipse(g,53,-109,15,20,'#8ac3c7');
  shape(g,[64,-110,87,-101,65,-95],'#ffc860','#8f5338',2);
  ellipse(g,55,-117,10,12,'#fff7dc');ellipse(g,59,-116,4.5,7,C.ink);ellipse(g,60,-119,1.5,2,'#ffffff');line(g,[45,-132,62,-128],C.ink,4);
  ellipse(g,65,-99,6,14,'#e4554f',-.28);ellipse(g,44,-88,7,12,'#cb454d');ellipse(g,40,-133,6,7,'#e55e51');
  line(g,[-15,-27,-2,-24,13,-25],'#e9b676',2);
  g.restore();
}
function drawFarmer(g,x,y,time,scale=1,caught=false) {
  g.save();g.translate(x,y);g.scale(scale,scale);
  const stride=Math.sin(time*13)*15;
  line(g,[-12,-43,-17+stride,-17,-24+stride,0],'#353747',15);line(g,[13,-43,17-stride,-17,27-stride,0],'#353747',15);
  ellipse(g,-23+stride,1,16,6,'#312c36');ellipse(g,28-stride,1,16,6,'#312c36');
  line(g,[-18,-100,-31,-71,-9,-66],'#dca477',13);line(g,[20,-99,40,-88,58,-115],'#e4ae7b',13);
  box(g,-27,-110,55,71,17,'#d59864');box(g,-24,-88,49,49,8,'#527787');line(g,[-16,-108,-14,-71,16,-71,19,-108],'#658a98',8);box(g,-9,-77,23,17,2,'#3f6375');ellipse(g,-13,-77,2,2,C.gold);ellipse(g,18,-77,2,2,C.gold);
  ellipse(g,0,-133,26,30,'#eab280');ellipse(g,-18,-132,6,10,'#f1bc88');ellipse(g,22,-135,11,6,'#f5bd88');
  ellipse(g,11,-139,3,4,C.ink);line(g,[5,-149,18,-151],C.ink,3);shape(g,[6,-127,25,-128,18,-120],'#624338');
  ellipse(g,0,-157,43,9,'#6d4b3e',-.05);box(g,-23,-190,46,35,6,'#997043');box(g,-24,-165,48,10,0,'#503f3b');
  // The net is a real mesh, not an opaque disc.
  line(g,[50,-113,115,-302],'#6b5043',6);g.save();g.translate(127,-324);g.rotate(.5);g.strokeStyle='#fff0bf';g.lineWidth=4;g.beginPath();g.ellipse(0,0,37,48,0,0,Math.PI*2);g.stroke();
  g.save();g.beginPath();g.ellipse(0,0,36,47,0,0,Math.PI*2);g.clip();for(let i=-70;i<80;i+=14){line(g,[i,-60,i+55,60],'#f6e7bc70',1.3);line(g,[i,-60,i-55,60],'#f6e7bc70',1.3);}g.restore();g.restore();
  if(caught)drawTurkey(g,72,-75,.55,time,false,true);
  g.restore();
}
function drawOven(g,x,time) {
  const y=CFG.ground;
  const glow=g.createRadialGradient(x,y-30,5,x,y-30,115);glow.addColorStop(0,'#ffbb4955');glow.addColorStop(1,'#ff903300');g.fillStyle=glow;g.fillRect(x-130,y-160,260,220);
  ellipse(g,x,y+5,68,11,'#4c344c50');box(g,x-51,y-99,102,96,9,'#3e4150','#252737');box(g,x-53,y-104,106,24,6,'#62616a','#292738');
  for(let i=0;i<4;i++){ellipse(g,x-32+i*21,y-92,5,5,i%2?'#ffc86a':'#d9d0bb');ellipse(g,x-32+i*21,y-93,1,2,'#4a3c41');}
  box(g,x-42,y-71,84,57,4,'#ff8f32','#df6540');box(g,x-33,y-62,66,40,3,'#8e302c');
  for(let i=0;i<6;i++){const f=Math.sin(time*9+i)*6;shape(g,[x-30+i*12,y-25,x-31+i*12,y-43-f,x-24+i*12,y-36,x-20+i*12,y-58+f,x-16+i*12,y-25],'#ffd15a');}
  line(g,[x-34,y-25,x+34,y-25],'#f1a364',3);
  shape(g,[x-45,y-13,x+44,y-13,x+61,y+13,x-54,y+13],'#5e5660','#292738');line(g,[x-27,y+6,x+33,y+6],'#d4b698',5);
  for(let i=0;i<4;i++){const xx=x-30+i*20;g.beginPath();g.moveTo(xx,y-112);g.bezierCurveTo(xx+12,y-130,xx-10,y-138,xx+Math.sin(time*3+i)*10,y-153);g.strokeStyle='#ffdda573';g.lineWidth=3;g.stroke();}
}
function drawKnife(g,x,time) {
  g.save();g.translate(x,0);
  line(g,[0,150,0,330],'#67534d',5);box(g,-57,144,114,12,4,'#655444');
  g.translate(0,339);g.rotate(Math.sin(time*2.6)*.085);
  box(g,-14,-28,28,66,8,'#77483f','#382f39');for(let i=0;i<3;i++)ellipse(g,0,-14+i*17,3,3,'#e9c58f');
  box(g,-28,31,57,9,3,'#d6bd9d');shape(g,[-22,41,58,41,55,109,16,143,-17,143],'#d6e3dd','#404452',3);shape(g,[45,45,58,41,55,109,16,143,-17,143,-9,133,42,101],'#fff6d1');line(g,[-10,55,40,55],'#ffffffa0',4);
  g.restore();
}
function drawHay(g,x) {box(g,x-39,CFG.ground-66,78,64,8,'#d7a74f','#8b633c');for(let i=0;i<9;i++)line(g,[x-32+i*8,CFG.ground-57,x-29+i*8,CFG.ground-9],'#f4ce75',2);line(g,[x-22,CFG.ground-64,x-22,CFG.ground-3],'#8d653d',5);line(g,[x+23,CFG.ground-64,x+23,CFG.ground-3],'#8d653d',5);}
function drawObstacle(g,o,x,time) {
  if(o.type==='oven')drawOven(g,x,time);
  if(o.type==='knife')drawKnife(g,x,time);
  if(o.type==='hay')drawHay(g,x);
  if(o.type==='fence'){line(g,[x-22,552,x-22,484],'#78513f',11);line(g,[x+22,552,x+22,484],'#78513f',11);line(g,[x-32,500,x+33,500],'#e1b679',11);line(g,[x-32,529,x+33,529],'#c59362',10);}
}
function drawCorn(g,x,y,time=0,scale=1) {
  g.save();g.translate(x,y);g.rotate(.3);g.scale(scale,scale);
  ellipse(g,0,0,10,22,'#f9c951');for(let i=0;i<4;i++)for(let j=0;j<3;j++)ellipse(g,-5+j*5,-13+i*8,2,2.7,'#ffe78a');
  shape(g,[-3,22,-18,4,-16,-8,-2,5],'#5e9a60');shape(g,[0,22,17,4,18,-8,5,6],'#92b65c');g.restore();
  star(g,x+17,y-19,4+Math.sin(time*4)*2,C.gold);
}
function drawFreedomGate(g,x,y,scale=1) {
  g.save();g.translate(x,y);g.scale(scale,scale);
  for(const xx of [-104,104]){box(g,xx-11,-190,22,195,5,'#565a55');box(g,xx-15,-198,30,17,3,'#ffd48b');}
  box(g,-130,-208,260,47,6,'#334d4d','#9bb68e');text(g,'FREEDOM',0,-177,28,'#ffe8a8','bold','center');
  g.save();g.translate(-95,-148);g.rotate(-.2);box(g,0,0,93,146,3,'#9ba57c');for(let i=0;i<5;i++)box(g,7+i*18,0,8,145,2,'#d8c58e');g.restore();
  g.save();g.translate(95,-148);g.rotate(.2);box(g,-93,0,93,146,3,'#9ba57c');for(let i=0;i<5;i++)box(g,-87+i*18,0,8,145,2,'#d8c58e');g.restore();g.restore();
}
function feather(g,x,y,fill=C.cream,scale=1) {g.save();g.translate(x,y);g.rotate(.5);g.scale(scale,scale);ellipse(g,0,-3,6,15,fill);line(g,[0,13,0,-11],'#795747',1.5);for(let i=-6;i<=6;i+=5)line(g,[0,i,4,i-4],'#b18b66',1);g.restore();}
function meter(g,x,y,w,h,value,color) {box(g,x,y,w,h,h/2,'#141b28');if(value>0)box(g,x+2,y+2,(w-4)*Math.min(1,value),h-4,(h-4)/2,color);}

function drawHUD(g,w) {
  box(g,20,17,1240,116,17,'#252634f5','#edc99a35');
  tracked(g,'GOBBLE DASH',42,42,12,C.gold,1.6);text(g,'THE GREAT ESCAPE',42,62,11,'#b9b5ac');
  const stage=Math.min(2,Math.floor(w.distance/500));text(g,STAGES[stage],245,41,12,'#d5c5b1');
  text(g,Math.floor(w.distance).toLocaleString()+' m',245,80,34);text(g,'/ 1,500 m',388,78,15,'#b6b8ab');
  meter(g,245,94,250,11,w.distance/1500,C.gold);text(g,'FREEDOM GATE →',502,104,10,C.gold);
  line(g,[629,37,629,112],'#e5c3932b',1);
  drawCorn(g,663,68,1,.75);text(g,String(w.corn).padStart(2,'0'),684,79,30,C.gold);text(g,'CORN',653,106,10,'#c7bbaa');
  text(g,'FEATHERS',754,43,10,'#c7bbaa');for(let i=0;i<3;i++)feather(g,766+i*25,73,i<w.lives?'#f9dfad':'#5e5660',.95);
  const danger=w.gap<3;const color=danger?'#ff7866':w.gap<6?'#ffcb67':'#93c7a0';
  text(g,'FARMER GAP',869,43,11,'#c7bbaa');text(g,w.gap.toFixed(1)+' m',1040,43,17,color,'bold','right');
  meter(g,869,55,171,15,w.gap/CFG.maxGap,color);text(g,danger?'TOO CLOSE!':'KEEP YOUR LEAD',869,87,10,color);
  text(g,'SPRINT',869,108,10,'#c7bbaa');meter(g,926,99,114,10,w.stamina/100,'#80bbbf');
  text(g,Math.round(w.speed*3.6),1084,78,32);text(g,'KM/H',1085,104,10,'#c7bbaa');
  text(g,'HOLD → TO SPRINT',1148,109,9,'#beb9b1');
}
function drawWorldActors(g,w,time) {
  if(w.sprint||w.cornBoost>0){for(let i=0;i<15;i++){const x=(time*650+i*119)%1280;line(g,[x,230+i*20,x-55,230+i*20],'#ffe6b64d',2);}}
  const fx=CFG.heroX-100-w.gap*20;
  ellipse(g,fx,558,58,10,'#4a344135');drawFarmer(g,fx,550,time,.94);
  for(const o of w.obstacles){const x=CFG.heroX+(o.at-w.distance)*14;if(x>-130&&x<1400)drawObstacle(g,o,x,time);}
  for(const c of w.pickups){const x=CFG.heroX+(c.at-w.distance)*14;if(x>-50&&x<1350&&!c.taken)drawCorn(g,x,CFG.ground-c.height,time);}
  if(w.distance>1410)drawFreedomGate(g,CFG.heroX+(1500-w.distance)*14,552);
  ellipse(g,CFG.heroX,558,43+Math.max(-20,w.y*.08),8,'#513d4344');
  if(w.invincible===0||Math.sin(time*35)>-.35)drawTurkey(g,CFG.heroX,CFG.ground+w.y,1.1,time,w.duck,w.y<0);
  for(const p of w.particles){g.globalAlpha=Math.max(0,p.life/p.max);ellipse(g,p.x,p.y,p.size,p.size*.45,p.color,p.life*4);}g.globalAlpha=1;
}
function drawRun(g,w,time) {
  drawFarm(g,w,time);drawWorldActors(g,w,time);drawHUD(g,w);
  // Action hints occupy the path margin and leave the silhouettes unobscured.
  const next=w.obstacles.find(o=>o.at>w.distance-2);
  if(next){const dx=(next.at-w.distance)*14;const x=Math.min(1120,Math.max(410,410+dx));const isKnife=next.type==='knife';
    box(g,x-73,isKnife?258:594,146,30,9,'#302a38e8','#ffd18565');text(g,isKnife?'↓  DUCK':'↑  JUMP',x,isKnife?279:615,15,C.gold,'bold','center');}
  if(w.toastTime>0){box(g,38,169,319,37,8,'#302a38df','#ffe0ad50');text(g,w.toast,55,193,14,C.cream);}
  box(g,30,647,370,46,12,'#282734c9','#e7c39435');text(g,'HOLD ↑  FLUTTER',49,676,13,C.cream);text(g,'CORN = MORE SPRINT',219,676,12,C.gold);
  if(w.gap<3){box(g,41,222,163,29,8,'#9e463fe8');text(g,'HE’S RIGHT THERE!',123,242,12,'#fff0ce','bold','center');}
  tracked(g,'OUTRUN DINNER.',38,713,10,'#e1b389',1.7);
}
function drawTitle(g,w,best,time) {
  drawFarm(g,{...w,distance:0},time);
  // An asymmetrical poster composition leaves the live hero art in the sunset.
  const veil=g.createLinearGradient(0,0,1010,0);veil.addColorStop(0,'#252434fa');veil.addColorStop(.53,'#30283deb');veil.addColorStop(1,'#30283d00');g.fillStyle=veil;g.fillRect(0,0,1280,720);
  tracked(g,'A THANKSGIVING GETAWAY',90,84,13,C.gold,3);
  text(g,'GOBBLE',84,190,94,C.cream,'900');text(g,'DASH',84,283,112,C.gold,'900');
  box(g,92,309,305,35,5,'#e9804d');tracked(g,'THE GREAT ESCAPE',107,332,16,'#292738',2.7);
  text(g,'Dinner is at six. You have other plans.',91,384,22,'#f7d9ae','normal');
  text(g,'Run for the Freedom Gate. Keep your feathers.',92,415,16,'#c4b1a5','normal');
  box(g,88,441,471,47,9,'#f3c88f12','#efcca535');text(g,'1,500 m',107,471,22,C.cream);text(g,'ONE FARMER.  THREE FEATHERS.',225,468,12,C.gold);
  text(g,'ENTER / CLICK TO START',274,595,12,'#c7b5a6','bold','center');
  box(g,86,622,490,60,10,'#242431a8','#d7b18a28');text(g,'HOW TO PLAY',105,644,10,C.gold);text(g,'Hold ↑ jump & flutter    ↓ duck    → sprint    P pause',105,666,14,C.cream);
  box(g,1000,614,207,76,10,'#292738da','#e5c39350');text(g,'BEST DISTANCE',1103,640,11,'#d8bea6','bold','center');text(g,best.toLocaleString()+' m',1103,673,27,C.cream,'bold','center');
  ellipse(g,888,568,135,22,'#513d433f');drawTurkey(g,863,535,2.25,time,false,true);
  drawFarmer(g,665,554,time,.68);
  box(g,1001,172,202,52,12,'#ffefc9');shape(g,[1033,222,1011,252,1068,222],'#ffefc9');text(g,'NOT ON THE MENU.',1102,204,17,C.ink,'bold','center');
  drawCorn(g,1111,430,time,1.1);drawPumpkin(g,725,578,1.1);drawPumpkin(g,1209,580,1.4);
  tracked(g,'AN ORIGINAL FARMYARD ESCAPE',698,708,11,'#f0c18c',2);
}
function drawEnd(g,w,time) {
  drawFarm(g,{...w,distance:1470},time);
  const shade=g.createLinearGradient(0,0,1280,0);shade.addColorStop(0,'#25263700');shade.addColorStop(.45,'#252637ad');shade.addColorStop(.68,'#252637f7');shade.addColorStop(1,'#252637');g.fillStyle=shade;g.fillRect(0,0,1280,720);
  const won=w.escaped;
  tracked(g,'GOBBLE DASH / THE GREAT ESCAPE',57,59,12,C.cream,2);
  if(won) {
    drawFreedomGate(g,344,602,1.35);drawTurkey(g,347,290,1.65,time,false,true);drawFarmer(g,91,553,time,.67);
    for(let i=0;i<40;i++){const x=80+(i*79)%550;const y=135+(i*59)%370;g.save();g.translate(x,y);g.rotate(i+time);box(g,-4,-2,8,4,1,[C.gold,C.red,C.green,C.cream][i%4]);g.restore();}
    box(g,204,616,281,44,9,'#334d4de8','#9bb68e');text(g,'OFF THE MENU. FOREVER.',344,645,16,C.cream,'bold','center');
  } else {drawFarmer(g,344,561,time,1.8,true);box(g,168,177,304,47,12,'#fff0ca');text(g,'“WELL, THAT WAS A CLOSE ONE.”',320,207,14,C.ink,'bold','center');}
  tracked(g,won?'A VERY HAPPY THANKSGIVING':'THE DINNER PLANS CONTINUE',716,159,12,C.gold,2);
  text(g,won?'ESCAPED!':'CAUGHT!',708,251,77,won?C.gold:'#ff9675','900');
  text(g,won?'A little flutter. A lot of freedom.':'One more run. One less dinner guest.',716,293,21,C.cream,'normal');
  text(g,'FINAL SCORE',718,354,12,'#bdb2a4');text(g,scoreRun(w).toLocaleString(),711,423,72,C.cream,'900');
  line(g,[716,448,1174,448],'#e4c3953d',1);
  text(g,'DISTANCE',717,478,11,'#c9b5a5');text(g,'CORN COLLECTED',925,478,11,'#c9b5a5');
  text(g,Math.floor(w.distance).toLocaleString()+' m',716,515,30);drawCorn(g,939,507,time,.7);text(g,String(w.corn),963,517,30,C.gold);
  text(g,won?'+ 2,500 FREEDOM BONUS':'THE GATE IS STILL OUT THERE.',717,558,13,C.green);
  text(g,'R / ENTER TO RESTART',902,679,12,'#c9b5a5','bold','center');
  tracked(g,won?'NO TURKEYS WERE ROASTED.':'THREE FEATHERS. ONE MORE CHANCE.',716,711,10,'#bca394',1.5);
}
export function drawGame(g,w,screen,best,time) {
  g.save();g.clearRect(0,0,1280,720);
  if(w.shake>0&&screen==='playing')g.translate(Math.sin(time*121)*7*w.shake,Math.cos(time*131)*6*w.shake);
  if(screen==='title')drawTitle(g,w,best,time);
  else if(screen==='end')drawEnd(g,w,time);
  else {drawRun(g,w,time);if(screen==='paused'){g.fillStyle='#202131c9';g.fillRect(0,0,1280,720);tracked(g,'TAKE A BREATHER',91,244,14,C.gold,3);text(g,'DINNER CAN WAIT.',84,337,70,C.cream,'900');text(g,'Your escape is paused. Press P or resume below.',91,385,21,'#d5bcaa','normal');}}
  g.restore();
}
