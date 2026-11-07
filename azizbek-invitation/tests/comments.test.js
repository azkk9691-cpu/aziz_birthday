import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {commentsApi} from '../worker/comments.js';
function binding(db){return {prepare(sql){return {bind(...args){return {async all(){return {results:db.prepare(sql).all(...args)}},async first(){return db.prepare(sql).get(...args)},async run(){return db.prepare(sql).run(...args)}}}}}}}
const origin='https://invitation.example';
const post=(data,from=origin)=>new Request(origin+'/api/comments',{method:'POST',headers:{Origin:from,'Content-Type':'application/json'},body:JSON.stringify(data)});
test('wishes persist after reconnect and retries do not duplicate',async()=>{
 const file=join(mkdtempSync(join(tmpdir(),'birthday-comments-')),'comments.sqlite');
 let db=new DatabaseSync(file);db.exec(readFileSync('drizzle/0000_guest_comments.sql','utf8'));
 const data={name:'Mehmon',message:'Tug‘ilgan kun muborak! <script>literal text</script>',requestId:'550e8400-e29b-41d4-a716-446655440000'};
 assert.equal((await commentsApi(post(data),{DB:binding(db)})).status,201);
 assert.equal((await commentsApi(post(data),{DB:binding(db)})).status,201);
 db.close();db=new DatabaseSync(file);
 const response=await commentsApi(new Request(origin+'/api/comments'),{DB:binding(db)});
 const result=await response.json();assert.equal(result.comments.length,1);assert.equal(result.comments[0].message,data.message);assert.ok(result.comments[0].created_at.endsWith('Z'));db.close();
});
test('API rejects bad data, cross-origin writes and unavailable database',async()=>{
 const db=new DatabaseSync(':memory:');db.exec(readFileSync('drizzle/0000_guest_comments.sql','utf8'));const env={DB:binding(db)};
 assert.equal((await commentsApi(post({name:'A',message:'x',requestId:'bad'}),env)).status,400);
 assert.equal((await commentsApi(post({},'https://other.example'),env)).status,403);
 assert.equal((await commentsApi(new Request(origin+'/api/comments'),{})).status,503);db.close();
});
test('pagination allows access to older stored comments',async()=>{
 const db=new DatabaseSync(':memory:');db.exec(readFileSync('drizzle/0000_guest_comments.sql','utf8'));for(let i=0;i<23;i++)db.prepare('INSERT INTO comments (name,message,request_id) VALUES (?,?,?)').run('Mehmon','Baxt va omad!',String(i));const env={DB:binding(db)};
 const first=await (await commentsApi(new Request(origin+'/api/comments'),env)).json();assert.equal(first.comments.length,20);assert.ok(first.next);
 const second=await (await commentsApi(new Request(origin+'/api/comments?before='+first.next),env)).json();assert.equal(second.comments.length,3);assert.equal(second.next,null);db.close();
});
