import test from "node:test";
import assert from "node:assert/strict";
import { saveDraft, readDraft } from "../dist/storage.js";
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};};
test("restores saved draft",()=>{const s=memory();saveDraft(s,"form",{name:"Ada"},100);assert.deepEqual(readDraft(s,"form",1000,200),{name:"Ada"});});
test("expires old drafts",()=>{const s=memory();saveDraft(s,"form",{name:"Ada"},100);assert.equal(readDraft(s,"form",50,200),null);});
test("handles malformed data safely",()=>{const s=memory();s.setItem("form","not json");assert.equal(readDraft(s,"form"),null);});
test("does not return unknown draft version",()=>{const s=memory();s.setItem("form",JSON.stringify({version:2,savedAt:100,values:{}}));assert.equal(readDraft(s,"form"),null);});
