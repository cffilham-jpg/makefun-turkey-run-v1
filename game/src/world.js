import {CFG, OBSTACLES, scoreRun} from './config.js';

export function createWorld(seed = 1) {
  return {seed: (Number(seed)||1)>>>0, time:0, distance:0, speed:CFG.baseSpeed, corn:0, lives:CFG.lives, gap:CFG.initialGap,
    stamina:100, y:0, vy:0, duck:false, sprint:false, invincible:0, slow:0, shake:0,
    obstacles:[], pickups:[], particles:[], nextSpawn:45, obstacleCount:0, combo:0,
    escaped:false, caught:false, events:[], toast:'THANKSGIVING DINNER? NOT TODAY.', toastTime:3, stats:{jumps:0,ducks:0,hits:0,corn:0,cleared:0}};
}
function random(world) { world.seed = (world.seed * 1664525 + 1013904223) >>> 0; return world.seed / 4294967296; }
export function burst(world, x, y, color, count = 12) {
  for(let i=0;i<count;i++) world.particles.push({x,y,vx:(random(world)-.6)*220,vy:-random(world)*220,life:.5+random(world)*.6,max:1.1,color,size:3+random(world)*6});
}
function announce(world, text) { world.toast = text; world.toastTime = 1.6; }
export function spawnObstacle(world) {
  const sequence = ['fence','oven','knife','hay','knife','oven'];
  const type = sequence[world.obstacleCount++ % sequence.length];
  const at = world.distance + 70;
  world.obstacles.push({type,at,passed:false,hit:false,...OBSTACLES[type]});
  const high = type !== 'knife';
  for(let i=0;i<3;i++) world.pickups.push({at:at+9+i*4,height:high?110+Math.sin(i)*30:30,taken:false});
  world.nextSpawn = world.distance + Math.max(34,51-world.distance/100) + random(world)*8;
}
export function updateWorld(world, input, dt) {
  if (world.caught || world.escaped) return;
  world.time += dt; world.events.length = 0;
  world.toastTime = Math.max(0,world.toastTime-dt); world.invincible = Math.max(0,world.invincible-dt); world.slow = Math.max(0,world.slow-dt); world.shake = Math.max(0,world.shake-dt);
  world.cornBoost=Math.max(0,(world.cornBoost||0)-dt);
  if (input.jumpPressed) world.jumpBuffer = .13;
  world.jumpBuffer = Math.max(0,(world.jumpBuffer||0)-dt);
  if (world.jumpBuffer > 0 && world.y === 0) { world.vy = CFG.jumpVelocity; world.jumpBuffer=0; world.stats.jumps++; world.events.push('jump'); }
  if (input.duck && !world.duck) world.stats.ducks++;
  world.duck = input.duck && world.y === 0;
  const gravity = input.jump && world.vy < 0 ? CFG.flutterGravity : CFG.gravity;
  world.vy += gravity*dt; world.y = Math.min(0,world.y+world.vy*dt);
  if (world.y === 0) world.vy = 0;
  world.sprint = input.sprint && world.stamina > 1 && !world.slow;
  world.stamina = Math.max(0,Math.min(100,world.stamina+(world.sprint?-CFG.staminaDrain:CFG.staminaRegen)*dt));
  const target = Math.min(CFG.maxSpeed,CFG.baseSpeed+world.distance/150) + (world.sprint?CFG.sprintBonus:0) + (world.cornBoost>0?4:0) - (world.slow?10:0);
  world.speed += (target-world.speed)*Math.min(1,dt*7);
  world.distance += world.speed*dt;
  world.gap = Math.min(CFG.maxGap,world.gap+((world.slow?-2:world.sprint?1.1:.09)-world.distance/15000)*dt);
  if (world.distance >= world.nextSpawn && world.distance < 1415) spawnObstacle(world);
  for (const obstacle of world.obstacles) {
    const dx = (obstacle.at-world.distance)*CFG.pixelsPerMetre;
    const touching = Math.abs(dx)<obstacle.width/2+22;
    const collides = obstacle.type === 'knife' ? (!world.duck && world.y > -230) : world.y > -obstacle.height+13;
    if (touching && collides && !obstacle.hit && world.invincible === 0) {
      obstacle.hit = true; world.lives--; world.stats.hits++; world.combo=0; world.slow=1.05;
      world.gap -= CFG.hitGapLoss; world.invincible=CFG.hitInvulnerability; world.shake=.3; world.events.push('hit','gobble');
      burst(world,CFG.heroX,CFG.ground+world.y-45,'#f5d49b',20); announce(world,'FEATHER DOWN! KEEP MOVING.');
    }
    if (dx < -obstacle.width/2-24 && !obstacle.passed) {
      obstacle.passed = true;
      if (!obstacle.hit) {world.combo++; world.stats.cleared++; world.gap=Math.min(CFG.maxGap,world.gap+.25); if(world.combo%3===0) announce(world,world.combo+' CLEAN DODGES!');}
    }
  }
  for (const corn of world.pickups) {
    if (!corn.taken && Math.abs((corn.at-world.distance)*CFG.pixelsPerMetre)<40 && Math.abs(world.y-35+corn.height)<65) {
      corn.taken=true; world.corn++; world.stats.corn++; world.stamina=Math.min(100,world.stamina+CFG.cornStamina); world.gap=Math.min(CFG.maxGap,world.gap+.4); world.events.push('corn');
      world.cornBoost=.7;
      burst(world,CFG.heroX,CFG.ground-corn.height,'#ffdb68',10);
    }
  }
  world.obstacles = world.obstacles.filter(o=>o.at>world.distance-25);
  world.pickups = world.pickups.filter(o=>!o.taken && o.at>world.distance-15);
  for(const p of world.particles) {p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=430*dt;p.life-=dt;}
  world.particles=world.particles.filter(p=>p.life>0);
  if (world.y===0 && Math.floor(world.time*15)!==Math.floor((world.time-dt)*15)) burst(world,CFG.heroX-20,CFG.ground+2,'#cba072',1);
  if(world.lives<=0 || world.gap<=.3) {world.caught=true;world.events.push('lose');}
  else if(world.distance>=CFG.escapeDistance) {world.distance=CFG.escapeDistance;world.escaped=true;world.events.push('win');}
  if(Math.floor(world.time/9)!==Math.floor((world.time-dt)/9)) world.events.push('shout');
}
export function stageScreenshot(kind, seed) {
  const world = createWorld(seed);
  if(kind==='play') {
    Object.assign(world,{distance:640,time:18.2,y:-147,vy:-80,lives:2,gap:1.5,corn:12,speed:28,stamina:63,toast:'ONE HOT SHORTCUT.',toastTime:2});
    world.obstacles=[{type:'oven',at:640,...OBSTACLES.oven},{type:'knife',at:682,...OBSTACLES.knife},{type:'hay',at:699,...OBSTACLES.hay}];
    world.pickups=[0,1,2,3,4].map(i=>({at:652+i*4.1,height:145-Math.sin(i*.6)*35}));
    burst(world,335,552,'#d2a16b',8);
  }
  if(kind==='end') Object.assign(world,{distance:1500,corn:37,lives:2,gap:4.2,escaped:true,time:50});
  return world;
}
export {scoreRun};
