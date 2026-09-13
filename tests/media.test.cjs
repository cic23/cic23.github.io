const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');

function loader({fallback=false}={}) {
  const frames=[], timers=new Map();let callback, timer=0;
  class Observer { constructor(fn){callback=fn;} observe(){} unobserve(){} disconnect(){} }
  const window={IntersectionObserver:fallback?undefined:Observer};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/media.js'),'utf8'),{
    window,IntersectionObserver:Observer,Set,requestAnimationFrame:fn=>frames.push(fn),
    setTimeout:fn=>{timers.set(++timer,fn);return timer;},clearTimeout:id=>timers.delete(id)
  });
  const element=(tag='IMG')=>{
    const events=new Map();
    return {tagName:tag,isConnected:true,dataset:{mediaSrc:'https://example.invalid/image'},classList:{remove(){}},
      addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:name=>events.delete(name),
      removeAttribute(name){delete this[name];},fire:name=>events.get(name)?.()};
  };
  const paint=()=>{while(frames.length)frames.shift()();};
  return {api:window.CIC_MEDIA,element,paint,frames,timers,visible:elements=>callback(elements.map(target=>({target,isIntersecting:true}))),root:elements=>({isConnected:true,querySelectorAll:()=>elements})};
}

test('media waits for paint and visibility, limits concurrent images, advances after load or failure',()=>{
  const l=loader(), images=Array.from({length:5},()=>l.element());
  l.api.observe(l.root(images));assert.equal(images.some(el=>el.src),false);
  l.paint();assert.equal(images.some(el=>el.src),false);
  l.visible(images);assert.equal(images.filter(el=>el.src).length,3);
  images[0].fire('load');assert.ok(images[3].src);
  images[1].fire('error');assert.ok(images[4].src);
  l.api.reset();assert.equal(l.timers.size,0);
});

test('navigation discards pending frames, queued images and active requests',()=>{
  const l=loader(), images=Array.from({length:5},()=>l.element());
  l.api.observe(l.root(images));l.api.reset();l.paint();
  assert.equal(images.some(el=>el.src),false);
  l.api.observe(l.root(images));l.paint();l.visible(images);l.api.reset();
  assert.equal(images.some(el=>el.src),false);assert.equal(l.timers.size,0);
});

test('media fallback works without IntersectionObserver and a stalled image releases its slot',()=>{
  const l=loader({fallback:true}), video=l.element('VIDEO'), images=Array.from({length:4},()=>l.element());
  l.api.observe(l.root([video,...images]));l.paint();
  assert.ok(video.src);assert.equal(images.filter(el=>el.src).length,3);
  l.timers.values().next().value();assert.equal(images[0].src,undefined);assert.ok(images[3].src);
  l.api.reset();
});
