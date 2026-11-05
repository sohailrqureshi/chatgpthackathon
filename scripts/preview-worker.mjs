import {createServer} from 'node:http';
import {Readable} from 'node:stream';
import {existsSync} from 'node:fs';
if(existsSync('.env.local'))process.loadEnvFile('.env.local');
const {default:worker}=await import('../dist/server/index.js');
createServer(async(req,res)=>{try{const url=`http://${req.headers.host}${req.url}`;const request=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Readable.toWeb(req),duplex:'half'}:{})});const result=await worker.fetch(request,process.env);res.writeHead(result.status,Object.fromEntries(result.headers));if(result.body)Readable.fromWeb(result.body).pipe(res);else res.end();}catch{res.writeHead(500);res.end('Preview request failed');}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
