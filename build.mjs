// Builds index.html from the files in src/.
// Usage: node build.mjs   (Node 16 or newer, no packages needed)
import { readFileSync, writeFileSync } from 'node:fs';
import { Script } from 'node:vm';

const src = f => readFileSync(new URL('./src/' + f, import.meta.url), 'utf8');

// The map editor is split over four files; they are joined first.
const EDITOR = ['ed_a.js', 'ed_check.js', 'ed_actions.js', 'ed_c.js'];

// Load order matters: later files wrap or extend functions from earlier ones.
const ORDER = [
  'game.js', 'qol.js', 'worldgen2.js', 'world_c.js', 'layers.js', 'terrain2.js', 'EDITOR',
  'content.js', 'content2.js', 'content3.js', 'feat1.js', 'feat2.js', 'feat3.js', 'feat4.js',
  'ui2.js', 'feat5.js', 'ed_ext.js', 'default_map.js', 'bigworld.js',
  'studio.js', 'studio2.js', 'studio3.js', 'studio4.js', 'studio5.js', 'studio6.js',
  'zones2.js', 'lvl30.js', 'sailing.js', 'monsters2.js', 'dgmove.js', 'admin.js', 'respawn.js',
  'towns2.js', 'isle_nodes.js', 'resources2.js', 'farm_fields.js', 'farming.js', 'bounties2.js',
  'quests2.js', 'auras.js', 'events2.js', 'fixes3.js', 'qol2.js', 'qol3.js'
];

const js = ORDER.map(f => f === 'EDITOR' ? EDITOR.map(src).join('') : src(f)).join('');
new Script(js, { filename: 'game.js' }); // throws on a syntax error

const shell = src('shell.html');
if (!shell.includes('/*__GAME_JS__*/')) throw new Error('shell.html is missing the /*__GAME_JS__*/ marker');
const html = shell.replace('/*__GAME_JS__*/', () => js.replace(/<\/script>/g, '<\\/script>'));
writeFileSync(new URL('./index.html', import.meta.url), html);
console.log(`built index.html (${(html.length / 1024 / 1024).toFixed(2)} MB)`);
