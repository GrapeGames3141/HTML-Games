// Run with Node 22+ and a Chromium-family browser. No npm dependencies.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = dirname(fileURLToPath(import.meta.url)),
  quick = process.argv.includes('--quick');
const evidence = join(root, 'evidence'),
  scratch = process.env.LITTORAL_SCRATCH || 'E:/CodexCache';
const profile = await mkdtemp(join(scratch, 'littoral-headless-'));
const executable = process.env.CHROME_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const html = await readFile(join(root, 'Astra-demo.html'));
const server = createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path === '/Astra-demo.html') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(html);
  } else if (/^\/evidence\/(atlas\.html|polish-review\.jpg|[a-z0-9-]+\.png)$/.test(path)) {
    try {
      let bytes = await readFile(join(evidence, basename(path)));
      res.writeHead(200, {
        'content-type': path.endsWith('.png') ? 'image/png' : path.endsWith('.jpg') ? 'image/jpeg' : 'text/html; charset=utf-8'
      });
      res.end(bytes);
    } catch {
      res.writeHead(404);
      res.end();
    }
  } else if (path === '/favicon.ico') {
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const url = 'http://127.0.0.1:' + server.address().port + '/Astra-demo.html';
const browser = spawn(
  executable,
  [
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-sync',
    '--disable-crash-reporter',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--remote-debugging-port=0',
    '--user-data-dir=' + profile,
    'about:blank'
  ],
  {
    windowsHide: true,
    stdio: ['ignore', 'ignore', 'pipe'],
    env: { ...process.env, TEMP: profile, TMP: profile }
  }
);
const exited = once(browser, 'exit');
let socket,
  id = 0,
  pending = new Map(),
  errors = [],
  warnings = [],
  result = {};
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
async function connect() {
  let buf = '';
  let ws = await new Promise((ok, fail) => {
    let timer = setTimeout(() => fail(Error('Browser startup timeout: ' + buf.slice(-800))), 20000);
    browser.stderr.on('data', (b) => {
      buf = (buf + b).slice(-5000);
      let m = buf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (m) {
        clearTimeout(timer);
        ok(m[1]);
      }
    });
    browser.once('error', fail);
  });
  let pages = await (await fetch('http://' + new URL(ws).host + '/json/list')).json();
  socket = new WebSocket(pages.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((ok, fail) => {
    socket.onopen = ok;
    socket.onerror = fail;
  });
  socket.onmessage = (e) => {
    let m = JSON.parse(e.data);
    if (m.id) {
      let p = pending.get(m.id);
      if (p) {
        pending.delete(m.id);
        if (m.error) p[1](Error(m.error.message));
        else p[0](m.result);
      }
    } else {
      if (m.method === 'Runtime.exceptionThrown')
        errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error')
        errors.push(m.params.args.map((a) => a.value || a.description).join(' '));
      if (m.method === 'Log.entryAdded') {
        let l = m.params.entry;
        if (l.level === 'error' || /GL_INVALID|feedback loop|GLSL/i.test(l.text)) errors.push(l.text);
        else if (l.level === 'warning') warnings.push(l.text);
      }
    }
  };
}
function call(method, params = {}) {
  let key = ++id;
  return new Promise((ok, fail) => {
    pending.set(key, [ok, fail]);
    socket.send(JSON.stringify({ id: key, method, params }));
  });
}
async function js(expression) {
  let r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
async function size(w, h, mobile = false) {
  await call('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
}
async function open(query) {
  await call('Page.navigate', { url: url + query });
  for (let i = 0; i < 180; i++) {
    await pause(150);
    if (errors.length) throw Error(errors.join('\n'));
    if (await js('!!window.DEMO')) return;
  }
  throw Error('Page initialization timed out');
}
async function screenshot(name) {
  let { data } = await call('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile(join(evidence, name + '.png'), Buffer.from(data, 'base64'));
}
async function key(code, keyValue, down = true) {
  await call('Input.dispatchKeyEvent', { type: down ? 'keyDown' : 'keyUp', code, key: keyValue });
}
async function press(c, k) {
  await key(c, k);
  await key(c, k, false);
}
async function testStartCard() {
  const seededSplats = await js('DEMO.state().staticSplats');
  assert(seededSplats > 0);
  await size(1060, 660);
  await open('?desktop&q=low');
  assert.equal(await js('DEMO.state().started'), false);
  assert.equal(await js('DEMO.state().staticSplats'), seededSplats);
  await screenshot('start-card');
  const pt = await js(
    '(()=>{let r=document.getElementById("begin").getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()'
  );
  for (let type of ['mousePressed', 'mouseReleased'])
    await call('Input.dispatchMouseEvent', {
      type,
      ...pt,
      button: 'left',
      buttons: type === 'mousePressed' ? 1 : 0,
      clickCount: 1
    });
  let before = await js('DEMO.state().time');
  for (let i = 0; i < 80 && (await js('DEMO.state().time')) <= before; i++) await pause(150);
  if (errors.length) throw Error(errors.join('\n'));
  assert((await js('DEMO.state().time')) > before, 'Live animation must advance after entering');
}
async function station(i) {
  return js('DEMO.goto(' + i + ');DEMO.step(.15);DEMO.state()');
}
try {
  await mkdir(evidence, { recursive: true });
  await connect();
  for (let m of ['Page.enable', 'Runtime.enable', 'Log.enable']) await call(m);
  await size(960, 600);
  if (process.argv.includes('--surf')) {
    await open('?test&seed=412&q=high');
    await js('DEMO.all(true)');
    for (const [id, name] of [[1, 'beach'], [2, 'pools']]) {
      const state = await station(id);
      assert.equal(state.quality, 'high');
      assert(state.effective[5]);
      await screenshot('surf-' + name);
    }
    await js('DEMO.cam([-27,3.6,84],0,0);DEMO.lookAt(-29,3.3,112)');
    await screenshot('surf-arch');
    await js('DEMO.step(1.9)');
    await screenshot('surf-arch-next-wave');
    for (const q of ['low', 'medium', 'high']) {
      await js('DEMO.quality("' + q + '")');
      const stops = q === 'low' ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 8];
      for (const id of stops) {
        const state = await station(id);
        assert.equal(state.quality, q);
        assert.equal(await js('DEMO.inspect().glError'), 0);
      }
    }
    await station(1);
    await js('DEMO.toggle(6,false);DEMO.step(.2)');
    assert.equal(await js('DEMO.state().effective[5]'), false);
    await js('DEMO.toggle(6,true);DEMO.step(.2)');
    assert.equal(await js('DEMO.state().effective[5]'), true);
    await open('?test&seed=412&q=high&nofloat');
    for (const id of [1, 2, 8]) {
      await station(id);
      assert.equal(await js('DEMO.inspect().glError'), 0);
    }
    assert.deepEqual(errors, []);
    console.log('Coast captures, preset changes, ocean toggle and no-float path passed');
  } else if (process.argv.includes('--high-realism')) {
    await open('?test&seed=412&q=high');
    await js('DEMO.all(true)');
    const names = {2: 'tide-pools', 4: 'forest', 6: 'waterfall'};
    for (const i of [2, 4, 6]) {
      const state = await station(i);
      assert.equal(state.quality, 'high');
      assert(state.floatOK);
      if (i === 6) await js('DEMO.step(.65)');
      await screenshot('high-' + names[i]);
      assert.equal(await js('DEMO.inspect().glError'), 0);
      console.log('Captured High', names[i]);
    }
    const high = await js('DEMO.state()');
    for (const q of ['low', 'medium', 'high', 'high']) {
      await js('DEMO.quality("' + q + '")');
      const state = await station(4);
      assert.equal(state.quality, q);
      if (q === 'high') assert.equal(state.staticTriangles, high.staticTriangles);
      else assert(state.staticTriangles < high.staticTriangles);
      assert.equal(await js('DEMO.inspect().glError'), 0);
    }
    await js('DEMO.goto(6);DEMO.toggle(12,false);DEMO.step(.25);DEMO.toggle(12,true);DEMO.step(.25)');
    assert.equal(await js('DEMO.inspect().glError'), 0);
    console.log('Quality switching and waterfall effect toggle passed');
  } else if (process.argv.includes('--atlas')) {
    await call('Page.navigate', { url: new URL('evidence/atlas.html', url).href });
    for (let i = 0; i < 40 && !(await js('!!document.getElementById("effect")?.options.length')); i++)
      await pause(100);
    let count =
      await js(`(async()=>{let s=document.getElementById('station'),e=document.getElementById('effect'),urls=new Set();
      for(let i=0;i<s.length;i++){s.selectedIndex=i;s.dispatchEvent(new Event('change'));for(let opt of e.options){e.value=opt.value;e.dispatchEvent(new Event('change'));for(let id of ['on','off']){let image=document.getElementById(id);await image.decode();if(!image.naturalWidth)throw Error(image.src);urls.add(image.src)}}}
      for(let a of document.querySelectorAll('footer a[href$=".png"],footer a[href$=".jpg"]')){let img=new Image();img.src=a.href;await img.decode();urls.add(img.src)}
      return urls.size})()`);
    assert.equal(count, 55);
    console.log('Atlas decoded all', count, 'unique images');
  } else {
    await open('?test&seed=412&q=low');
    console.log('Loaded', await js('DEMO.inspect()'));
    if (quick) {
      for (let i of [1, 2, 3, 4, 5, 6, 7, 8]) {
        await station(i);
        assert.equal(await js('DEMO.inspect().glError'), 0);
        console.log('Preview', i);
      }
      await testStartCard();
    } else {
      const names = [
        'beach',
        'tide-pools',
        'stream',
        'forest',
        'glasshouse',
        'waterfall',
        'cave',
        'overlook'
      ];
      result.stations = [];
      for (let i = 1; i <= 8; i++) {
        await js('DEMO.all(true)');
        let s = await station(i);
        assert.equal(s.station, i);
        if (i === 2) await js('DEMO.lookAt(-24,.3,67);DEMO.throwPebble();DEMO.step(1.05)');
        if (i === 5) await js('DEMO.blow();DEMO.step(1.2)');
        if (i === 6) await js('DEMO.step(.65)');
        if (i === 7) await js('DEMO.step(.45)');
        await screenshot(i + '-' + names[i - 1] + '-on');
        const localEffects = [
          [6, 9, 3],
          [5, 7, 9],
          [5, 7, 6],
          [3, 2, 4, 10],
          [8, 9, 10, 3, 11],
          [12, 5, 7, 2, 8],
          [1, 4, 9, 5, 7, 2],
          [11, 6, 3, 2]
        ][i - 1];
        for (let effect of localEffects) {
          await js('DEMO.toggle(' + effect + ',false)');
          await screenshot(i + '-' + names[i - 1] + '-t' + effect + '-off');
          await js('DEMO.toggle(' + effect + ',true)');
        }
        await js('DEMO.all(false)');
        await screenshot(i + '-' + names[i - 1] + '-off');
        assert.equal(await js('DEMO.inspect().glError'), 0);
        result.stations.push(s.stationName);
        console.log('Station', i, s.stationName);
      }
      await js('DEMO.all(true);DEMO.goto(2);DEMO.lookAt(-24,.3,67);DEMO.throwPebble();DEMO.step(1.0)');
      result.water = await js('DEMO.inspect()');
      assert(result.water.ripplePeak > 0.001 && result.water.oceanPeak > 0.001);
      let t = await js('DEMO.state().time');
      await pause(300);
      assert.equal(await js('DEMO.state().time'), t);
      let previous = await js('DEMO.state()');
      await key('KeyW', 'w');
      await js('DEMO.step(.4)');
      await key('KeyW', 'w', false);
      assert(
        Math.hypot((await js('DEMO.state().x')) - previous.x, (await js('DEMO.state().z')) - previous.z) > 0.3
      );
      await call('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x: 600,
        y: 270,
        button: 'left',
        buttons: 1,
        clickCount: 1
      });
      await call('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: 635,
        y: 260,
        button: 'left',
        buttons: 1
      });
      await call('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x: 635,
        y: 260,
        button: 'left',
        buttons: 0,
        clickCount: 1
      });
      assert(Math.abs((await js('DEMO.state().yaw')) - previous.yaw) > 0.08);
      await press('Tab', 'Tab');
      assert(await js('DEMO.state().panel'));
      await js('document.querySelectorAll(".effect")[4].click()');
      assert.equal(await js('DEMO.state().flags[4]'), false);
      await press('Tab', 'Tab');
      await key('KeyV', 'v');
      assert(await js('DEMO.state().split'));
      await screenshot('tide-pool-split');
      await key('KeyV', 'v', false);
      await press('Digit5', '5');
      assert(await js('DEMO.state().flags[4]'));
      await js('DEMO.goto(5)');
      assert.equal(await js('DEMO.interact()'), 'Bubbles');
      assert((await js('DEMO.state().bubbles')) > 0);
      await js('let lamp=DEMO.state().lantern;DEMO.tp(lamp[0],lamp[2],true)');
      assert.equal(await js('DEMO.interact()'), 'Lantern');
      await js('DEMO.walk(-.4,.6,.8);DEMO.interact()');
      assert.equal(await js('DEMO.state().carrying'), false);
      await js('DEMO.tp(-93,-1);DEMO.interact()');
      assert.equal(await js('document.getElementById("dial").hidden'), false);
      await js('DEMO.setSun(.94);DEMO.goto(8)');
      await screenshot('sunset-overlook');
      await js('DEMO.setSun(.23)');
      await press('KeyF', 'f');
      assert(await js('DEMO.state().free'));
      await press('KeyP', 'p');
      assert(await js('DEMO.state().photo'));
      await call('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: profile });
      await press('Enter', 'Enter');
      let png;
      for (let i = 0; i < 60 && !png; i++) {
        await pause(100);
        try {
          png = await readFile(join(profile, 'littoral-overlook.png'));
        } catch {}
      }
      assert(png && png.subarray(1, 4).toString() === 'PNG');
      result.photoBytes = png.length;
      await press('KeyP', 'p');
      await press('KeyN', 'n');
      assert.equal(await js('DEMO.state().sound'), false);
      await js('DEMO.goto(1)');
      result.routeMeters = await js(
        'DEMO.route().reduce((sum,p,i,a)=>sum+(i?Math.hypot(p[0]-a[i-1][0],p[1]-a[i-1][1]):0),0)'
      );
      result.walk = await js(
        '(()=>{let nodes=DEMO.route(),out=[];for(let [x,z] of nodes.slice(1)){let s=DEMO.walkTo(x,z);out.push({x,z,error:Math.hypot(x-s.x,z-s.z),station:s.station,cave:s.inCave})}return out})()'
      );
      console.log('Route max error', Math.max(...result.walk.map((v) => v.error)));
      assert(result.walk.every((p) => p.error < 0.2));
      assert.deepEqual([...new Set(result.walk.map((s) => s.station))].sort(), [1, 2, 3, 4, 5, 6, 7, 8]);
      assert(result.walk.some((p) => p.cave) && !result.walk.at(-1).cave);
      await size(640, 420);
      for (let q of ['medium', 'high']) {
        await js('DEMO.quality("' + q + '")');
        for (let i = 1; i <= 8; i++) {
          await station(i);
          assert.equal(await js('DEMO.inspect().glError'), 0);
        }
      }
      await js('DEMO.quality("low");DEMO.goto(5)');
      console.log('Quality sweep passed; timing frame pairs');
      result.cost = await js('DEMO.cost()');
      assert.equal(result.cost.length, 12);
      await size(390, 780, true);
      await open('?test&touch&nofloat&seed=412');
      let fall = await js('DEMO.state()');
      assert(fall.touch && !fall.floatOK && fall.quality === 'low');
      assert(!fall.effective[0] && !fall.effective[11]);
      for (let i = 1; i <= 8; i++) {
        await station(i);
        assert.equal(await js('DEMO.inspect().glError'), 0);
      }
      await station(1);
      await screenshot('touch-portrait');
      await size(780, 390, true);
      await js('DEMO.goto(6)');
      await screenshot('touch-landscape');
      await call('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 });
      let touchBefore = await js('DEMO.state()');
      async function gesture(type, points) {
        await call('Input.dispatchTouchEvent', {
          type,
          touchPoints: points.map(([x, y, id]) => ({ x, y, id, radiusX: 5, radiusY: 5, force: 0.8 }))
        });
      }
      await gesture('touchStart', [[110, 160, 0]]);
      await gesture('touchMove', [[115, 95, 0]]);
      await js('DEMO.step(.22)');
      await gesture('touchEnd', []);
      let touchAfter = await js('DEMO.state()');
      assert(Math.hypot(touchBefore.x - touchAfter.x, touchBefore.z - touchAfter.z) > 0.35);
      await gesture('touchStart', [[470, 130, 1]]);
      await gesture('touchMove', [[520, 145, 1]]);
      await gesture('touchEnd', []);
      assert(Math.abs((await js('DEMO.state().yaw')) - touchAfter.yaw) > 0.05);
      await call('Emulation.setTouchEmulationEnabled', { enabled: false });
      result.touchMovement = true;
      assert.equal(await js('DEMO.inspect().glError'), 0);
      await js(
        'window.mockPad={axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false}))};Object.defineProperty(navigator,"getGamepads",{configurable:true,value:()=>[mockPad]})'
      );
      await js('mockPad.buttons[1].pressed=true');
      await pause(120);
      assert(await js('DEMO.state().free'));
      await js('mockPad.buttons[1].pressed=false;mockPad.buttons[4].pressed=true');
      await pause(120);
      assert(await js('DEMO.state().split'));
      await testStartCard();
      result.liveAnimation = true;
      result.inputChecks = [
        'keyboard walking',
        'mouse drag look',
        'touch walking and looking',
        'simulated standard gamepad',
        'PNG download'
      ];
      result.errors = errors;
      result.warnings = [...new Set(warnings)].slice(0, 8);
      assert.deepEqual(errors, []);
      await writeFile(join(evidence, 'validation.json'), JSON.stringify(result, null, 2) + '\n');
      console.log('All checks passed');
    }
  }
  if (errors.length) throw Error(errors.join('\n'));
} finally {
  try {
    if (socket?.readyState === 1) {
      socket.send(JSON.stringify({ id: ++id, method: 'Browser.close' }));
      socket.close();
    }
  } catch {}
  let timer;
  await Promise.race([exited, new Promise((r) => (timer = setTimeout(r, 5000)))]);
  clearTimeout(timer);
  if (browser.exitCode === null && browser.signalCode === null) {
    browser.kill();
    await exited;
  }
  await new Promise((r) => server.close(r));
  if (dirname(resolve(profile)) === resolve(scratch) && basename(profile).startsWith('littoral-headless-'))
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
}
