import worker from './src/index.js';

const env = { ALLOWED_ORIGIN: 'https://yourbirthgirl.com', RESEND_API_KEY: 'test_key',
              MAIL_TO: 'megan.yourbirthgirl@gmail.com', MAIL_FROM: 'x <forms@yourbirthgirl.com>' };

const valid = {
  name: 'Jane Doe', email: 'jane@example.com', phone: '423-555-0100',
  dueDate: '2027-03-14', birthPlace: 'birth center',
  birthLocation: 'The Nest Chattanooga\n123 Main St',
  supportType: ['in-person doula care'],
  consultPref: 'Video call (Google Meet)', notes: 'excited!',
  heardFrom: 'from my midwife', consent: true, website: ''
};

let sent = null;
globalThis.fetch = async (url, opts) => {
  sent = { url, body: JSON.parse(opts.body) };
  return new Response(JSON.stringify({ id: 'x' }), { status: 200 });
};

const post = (body, origin='https://yourbirthgirl.com') =>
  worker.fetch(new Request('https://w.dev', {
    method:'POST', headers:{'Content-Type':'application/json', Origin:origin},
    body: JSON.stringify(body)
  }), env);

const cases = [
  ['valid submission', valid, 200],
  ['missing name', {...valid, name:''}, 400],
  ['bad email', {...valid, email:'not-an-email'}, 400],
  ['bad date format', {...valid, dueDate:'14/03/2027'}, 400],
  ['birthPlace not in list', {...valid, birthPlace:'spaceship'}, 400],
  ['supportType not in list', {...valid, supportType:['free care']}, 400],
  ['supportType empty', {...valid, supportType:[]}, 400],
  ['consultPref forged', {...valid, consultPref:'whatever'}, 400],
  ['heardFrom forged', {...valid, heardFrom:'billboard'}, 400],
  ['consent false', {...valid, consent:false}, 400],
  ['consent truthy string', {...valid, consent:'yes'}, 400],
  ['oversized notes', {...valid, notes:'x'.repeat(4000)}, 400],
  ['honeypot filled', {...valid, website:'bot'}, 200],
];

let pass = 0, fail = 0;
for (const [label, body, want] of cases) {
  sent = null;
  const res = await post(body);
  const ok = res.status === want;
  if (ok) pass++; else fail++;
  let note = '';
  if (label === 'honeypot filled') note = sent ? '  !! EMAIL WAS SENT (bad)' : '  (no email sent, correct)';
  console.log(`${ok?'PASS':'FAIL'}  ${label.padEnd(26)} got ${res.status} want ${want}${note}`);
}

// origin enforcement
const bad = await post(valid, 'https://evil.example');
console.log(`${bad.status===403?'PASS':'FAIL'}  ${'foreign origin blocked'.padEnd(26)} got ${bad.status} want 403`);
bad.status===403?pass++:fail++;

// method
const g = await worker.fetch(new Request('https://w.dev',{method:'GET'}), env);
console.log(`${g.status===405?'PASS':'FAIL'}  ${'GET rejected'.padEnd(26)} got ${g.status} want 405`);
g.status===405?pass++:fail++;

// header injection + escaping
sent = null;
await post({...valid, name:'Eve\r\nBcc: attacker@evil.com', notes:'<img src=x onerror=alert(1)>'});
const subjClean = !/[\r\n]/.test(sent.body.subject);
const escaped = sent.body.html.includes('&lt;img') && !sent.body.html.includes('<img src=x');
console.log(`${subjClean?'PASS':'FAIL'}  ${'CRLF stripped from subject'.padEnd(26)}`);
console.log(`${escaped?'PASS':'FAIL'}  ${'HTML escaped in body'.padEnd(26)}`);
subjClean?pass++:fail++; escaped?pass++:fail++;

// reply_to
sent = null; await post(valid);
const rt = sent.body.reply_to === 'jane@example.com';
console.log(`${rt?'PASS':'FAIL'}  ${'reply_to = enquirer'.padEnd(26)}`);
rt?pass++:fail++;

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
