import assert from 'node:assert/strict';
import {readFileSync,statSync,readdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {buildDossier,readGameTree,htmlFacts,sourceImports,resolveGamePath} from '../vendor/makefun-game.ts';

const caps={text_max_bytes:163840,screenshots:{max:4,max_bytes:262144},game_max_files:993,game_max_bytes:50331648,game_path_max_bytes:1000};
const tree=readGameTree('game',caps);
assert.ok(statSync('game/index.html').size<=1048576);
const facts=htmlFacts(readFileSync('game/index.html','utf8'));
const reference=(ref,from)=>{
  if(ref.startsWith('data:')) return;
  assert.ok(!/^[a-z]+:|^\/\//i.test(ref),'no external reference: '+ref);
  const target=ref.startsWith('/')?ref.slice(1):resolveGamePath(ref,from);
  assert.ok(target && statSync(join('game',target)).isFile(),'reference is inside game: '+ref);
};
for(const script of facts.scripts)if(script.src)reference(script.src,'index.html');
for(const link of facts.links)reference(link.href,'index.html');
for(const resource of facts.resources)reference(resource.src,'index.html');
for(const file of tree.files.filter(f=>f.path.endsWith('.js'))){
  const content=readFileSync(join('game',file.path),'utf8');
  for(const specifier of sourceImports(content))reference(specifier,file.path);
  assert.equal(spawnSync(process.execPath,['--check',join('game',file.path)]).status,0,file.path+' parses');
  assert.ok(!/\b(fetch|XMLHttpRequest|WebSocket|Worker|EventSource)\s*\(/.test(content),'no runtime network API');
}
const shots=readdirSync('screenshots').filter(f=>!f.startsWith('.')).sort();
assert.equal(shots.length,3);
const dimensions=[];
for(const shot of shots){
  const bytes=readFileSync(join('screenshots',shot));assert.ok(bytes.length<=262144);assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(bytes.readUInt16BE(bytes.length-2),0xffd9);
  let at=2,width=0,height=0;
  while(at<bytes.length){if(bytes[at]!==255){at++;continue;}const marker=bytes[at+1];at+=2;if(marker===0xd9||marker===0xda)break;const length=bytes.readUInt16BE(at);if([0xc0,0xc1,0xc2].includes(marker)){height=bytes.readUInt16BE(at+3);width=bytes.readUInt16BE(at+5);break;}at+=length;}
  assert.equal(width,1280);assert.equal(height,720);dimensions.push({file:shot,bytes:bytes.length,width,height});
}
const dossier=buildDossier(resolve('.'),caps);
assert.ok(dossier.length<=1572864);
assert.deepEqual(readFileSync('out/dossier.json'),Buffer.from(dossier),'output dossier matches official library');
assert.deepEqual(readFileSync('vendor/makefun-game.ts'),readFileSync('/home/hatch/workspace/makefun/turkey-run-kit-tmp/starter/vendor/makefun-game.ts'),'vendor byte identity');
assert.equal(readFileSync('.makefun/owner.json','utf8').trim(),'{"wallet":"CeAd3SWA1rNMUUmHWkFATMXXGNwHdNApNS1jcrRGqbdg"}');
console.log(JSON.stringify({gameEntries:tree.count,gameBytes:tree.totalBytes,indexBytes:statSync('game/index.html').size,dossierBytes:dossier.length,screenshots:dimensions,checks:'PASS'},null,2));
