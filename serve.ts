import {createServer} from 'node:http';
import {readFileSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('./game/',import.meta.url));
const port=Number(process.env.PORT||8080);
const mime:Record<string,string>={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg'};
createServer((req,res)=>{
  try {
    const url=new URL(req.url||'/', 'http://localhost');
    const path=decodeURIComponent(url.pathname);
    const file=resolve(root,'.'+(path==='/'?'/index.html':path));
    if(!file.startsWith(resolve(root)+sep)||!statSync(file).isFile()){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(readFileSync(file));
  }catch{res.writeHead(404).end();}
}).listen(port,'127.0.0.1',()=>console.log('Gobble Dash ready at http://127.0.0.1:'+port));
