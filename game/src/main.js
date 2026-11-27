import {createInput} from './input.js';
import {FarmSynth} from './audio.js';
import {createWorld, updateWorld, stageScreenshot, scoreRun} from './world.js';
import {drawGame} from './render.js';

const canvas=document.querySelector('#game');
const context=canvas.getContext('2d');
const input=createInput(canvas);
const audio=new FarmSynth();
const params=new URLSearchParams(location.search);
const shot=params.get('shot');
let world=shot?stageScreenshot(shot,params.get('seed')):createWorld(params.get('seed'));
let screen=shot==='play'?'playing':shot==='end'?'end':'title';
let frozen=Boolean(shot);
let best=0;
try {best=Number(localStorage.getItem('gobble-dash-best'))||0;} catch {}
if(shot) best=0;
const action=document.querySelector('#action');
const controls=document.querySelector('#controls');
const pause=document.querySelector('#pause');
const sound=document.querySelector('#sound');
function refreshUI() {
  action.hidden=screen==='playing'; controls.hidden=screen!=='playing'; pause.hidden=screen!=='playing';
  action.textContent=screen==='title'?'LET’S GET OUT OF HERE →':screen==='paused'?'KEEP RUNNING →':'RUN IT BACK →';
  action.style.left=screen==='end'?'56%':'7%'; action.style.top=screen==='paused'?'60%':screen==='end'?'82%':'70%';
  document.querySelector('#status').textContent=screen==='end'?(world.escaped?'Escaped!':'Caught!')+' Score '+scoreRun(world):screen;
}
function startRun() {audio.unlock();audio.play('gobble');world=createWorld(params.get('seed'));screen='playing';frozen=false;refreshUI();}
sound.addEventListener('click',()=>{audio.unlock();audio.enabled=!audio.enabled;sound.textContent=audio.enabled?'♫ Sound':'♫ Muted';});
function frame(now) {
  const dt=Math.min(.033,(now-frame.last)/1000||0);frame.last=now;
  const keys=input.state;
  if(keys.restart) startRun();
  else if(keys.start && screen!=='playing') {if(screen==='paused'){screen='playing';refreshUI();}else startRun();}
  if(keys.pause && (screen==='playing'||screen==='paused')) {screen=screen==='playing'?'paused':'playing';refreshUI();}
  if(screen==='playing'&&!frozen) {
    updateWorld(world,keys,dt);
    world.events.forEach(event=>audio.play(event));
    if(world.caught||world.escaped) {screen='end';best=Math.max(best,Math.floor(world.distance));try{localStorage.setItem('gobble-dash-best',String(best));}catch{}refreshUI();}
  }
  audio.update(dt,screen==='playing'&&!frozen);
  drawGame(context,world,screen,best,shot?1.7:now/1000);
  input.consume(); requestAnimationFrame(frame);
}
refreshUI(); requestAnimationFrame(frame);
// Read-only state access makes browser checks reproducible without altering normal play.
window.gobble={get world(){return world;},get screen(){return screen;}};
