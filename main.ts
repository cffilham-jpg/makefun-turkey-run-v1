import { cpSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const source = fileURLToPath(new URL('.', import.meta.url));
// The sandbox supplies /output; local runs use a writable working-directory out/.
const destination = resolve(process.env.MAKEFUN_OUTPUT_DIR || (existsSync('/output') ? '/output' : 'out'));
mkdirSync(destination, {recursive:true});
for (const folder of ['game', 'screenshots']) {
  cpSync(join(source, folder), join(destination, folder), {recursive:true});
}
const dossier = buildDossier(destination, {
  text_max_bytes:163840,
  screenshots:{max:4,max_bytes:262144},
  game_max_files:993,
  game_max_bytes:50331648,
  game_path_max_bytes:1000,
});
writeFileSync(join(destination,'dossier.json'),dossier);
console.log('Built deterministic Gobble Dash package.');
