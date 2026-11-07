import test from 'node:test';
import assert from 'node:assert/strict';
import {countdown,eventConfig} from '../src/config.js';
test('Tashkent midnight matches previous UTC evening',()=>assert.equal(new Date(eventConfig.target).toISOString(),'2026-11-20T19:00:00.000Z'));
test('countdown calculates days and remainder',()=>assert.deepEqual(countdown(eventConfig.target,new Date('2026-11-19T17:57:56Z').getTime()),{ended:false,values:[1,1,2,4]}));
test('countdown never becomes negative',()=>assert.deepEqual(countdown(eventConfig.target,new Date('2026-11-22T00:00:00Z').getTime()),{ended:true,values:[0,0,0,0]}));
test('celebration starts at exact target',()=>assert.equal(countdown(eventConfig.target,new Date(eventConfig.target).getTime()).ended,true));
