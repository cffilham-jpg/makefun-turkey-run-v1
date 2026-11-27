const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || '/home/hatch/workspace/makefun/browser/node_modules/playwright-core/index.mjs');
import {mkdirSync,statSync} from 'node:fs';
import assert from 'node:assert/strict';

const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
const errors=[],remote=[],runtimeRequests=[];
let loaded=false;
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8080/'))remote.push(r.url());if(loaded)runtimeRequests.push(r.url());});
await page.goto('http://127.0.0.1:8080/?seed=7');
await page.waitForFunction(()=>window.gobble);
loaded=true;
await page.clock.install();
await page.keyboard.press('Enter');
await page.clock.runFor(50);
assert.equal(await page.evaluate(()=>gobble.screen),'playing');
await page.keyboard.down('Space');await page.clock.runFor(250);
assert.ok(await page.evaluate(()=>gobble.world.y< -50),'jump responds');
await page.keyboard.up('Space');await page.clock.runFor(1300);
await page.keyboard.down('ArrowDown');await page.clock.runFor(50);
assert.equal(await page.evaluate(()=>gobble.world.duck),true,'duck responds');
await page.keyboard.up('ArrowDown');
await page.keyboard.down('ArrowRight');await page.clock.runFor(300);
assert.ok(await page.evaluate(()=>gobble.world.stamina<100),'sprint drains stamina');
await page.keyboard.up('ArrowRight');
await page.keyboard.press('KeyP');await page.clock.runFor(50);
assert.equal(await page.evaluate(()=>gobble.screen),'paused');
const paused=await page.evaluate(()=>gobble.world.distance);
await page.clock.runFor(1000);assert.equal(await page.evaluate(()=>gobble.world.distance),paused);
await page.keyboard.press('KeyP');await page.clock.runFor(50);
// A real unattended run demonstrates feather loss and the caught screen.
for(let i=0;i<400 && await page.evaluate(()=>gobble.screen==='playing');i++) await page.clock.runFor(100);
const caught=await page.evaluate(()=>({screen:gobble.screen,caught:gobble.world.caught,hits:gobble.world.stats.hits}));
assert.equal(caught.screen,'end');assert.equal(caught.caught,true);assert.ok(caught.hits>=1);
await page.keyboard.press('KeyR');await page.clock.runFor(50);
let jumping=false,ducking=false,jumpUntil=0;
// Read the live scene and use ordinary keys, never mutate the world or skip collisions.
for(let tick=0;tick<1600;tick++) {
  const state=await page.evaluate(()=>({screen:gobble.screen,d:gobble.world.distance,y:gobble.world.y,obstacles:gobble.world.obstacles.map(o=>({type:o.type,dx:(o.at-gobble.world.distance)*14}))}));
  if(state.screen==='end') break;
  const hazard=state.obstacles.find(o=>o.dx> -82);
  const needsDuck=Boolean(hazard&&hazard.type==='knife'&&hazard.dx<190);
  if(needsDuck!==ducking){await page.keyboard[needsDuck?'down':'up']('ArrowDown');ducking=needsDuck;}
  if(hazard&&hazard.type!=='knife'&&hazard.dx<155&&hazard.dx>15&&state.y===0&&!jumping){await page.keyboard.down('Space');jumping=true;jumpUntil=tick+6;}
  if(jumping&&tick>=jumpUntil){await page.keyboard.up('Space');jumping=false;}
  await page.clock.runFor(75);
  if(tick%200===0) console.log('Run check: '+Math.floor(state.d)+' m');
}
const result=await page.evaluate(()=>({screen:gobble.screen,distance:gobble.world.distance,escaped:gobble.world.escaped,stats:gobble.world.stats,lives:gobble.world.lives}));
assert.equal(result.escaped,true,'normal route must be escapable');assert.ok(result.stats.cleared>15);assert.ok(result.stats.corn>0);
await page.keyboard.up('Space');await page.keyboard.up('ArrowDown');
await page.locator('#action').click();await page.clock.runFor(50);assert.equal(await page.evaluate(()=>gobble.screen),'playing');
await page.locator('[data-control="duck"]').dispatchEvent('pointerdown',{pointerId:1});await page.clock.runFor(50);
assert.equal(await page.evaluate(()=>gobble.world.duck),true);
await page.locator('[data-control="duck"]').dispatchEvent('pointerup',{pointerId:1});
assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);assert.deepEqual(runtimeRequests,[]);
loaded=false;
mkdirSync('screenshots',{recursive:true});
const shots=[['1-play.jpg','play'],['2-start.jpg','start'],['3-end.jpg','end']];
for(const [name,shot] of shots){await page.goto('http://127.0.0.1:8080/?shot='+shot+'&seed=7');await page.waitForFunction(()=>window.gobble);await page.mouse.move(1279,719);await page.screenshot({path:'screenshots/'+name,type:'jpeg',quality:89});assert.ok(statSync('screenshots/'+name).size<=262144);}
console.log(JSON.stringify({caught,result,errors,externalRequests:remote,runtimeRequests,screenshots:shots.map(([file])=>({file,bytes:statSync('screenshots/'+file).size}))},null,2));
await browser.close();
