import {readFileSync,readdirSync,mkdirSync,writeFileSync,cpSync} from 'node:fs';
import {extname,relative,resolve} from 'node:path';
const root=resolve('dist');
const assets={};
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mp3':'audio/mpeg'};
function collect(dir){for(const item of readdirSync(dir,{withFileTypes:true})){const file=resolve(dir,item.name);if(item.isDirectory())collect(file);else assets['/'+relative(root,file).replaceAll('\\','/')]={type:types[extname(file)]||'application/octet-stream',data:readFileSync(file).toString('base64')};}}
collect(root);
const api=readFileSync('worker/comments.js','utf8').replace('export async function','async function');
const worker=readFileSync('worker/index.js','utf8').replace("import {commentsApi} from './comments.js';",'');
mkdirSync('dist/server',{recursive:true});
writeFileSync('dist/server/index.js','const SITE_ASSETS='+JSON.stringify(assets)+';\n'+api+'\n'+worker);
mkdirSync('dist/.openai',{recursive:true});
cpSync('.openai/hosting.json','dist/.openai/hosting.json');
cpSync('drizzle','dist/.openai/drizzle',{recursive:true});
console.log('Worker with persistent comments and '+Object.keys(assets).length+' assets built.');
