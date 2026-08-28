/**
 * Consultation form relay.
 *
 * Receives the form POST from yourbirthgirl.com and forwards it to Megan via
 * Resend. The Resend API key lives here as a Worker secret and is never sent
 * to the browser.
 *
 * Secrets / vars (see wrangler.toml and README.md):
 *   RESEND_API_KEY  secret  Resend API key
 *   MAIL_TO         var     where enquiries land
 *   MAIL_FROM       var     verified Resend sender on yourbirthgirl.com
 *   ALLOWED_ORIGIN  var     the only origin allowed to POST here
 */

const SUPPORT_OPTIONS = [
  'in-person doula care',
  'virtual doula care',
  'doula Q&A coaching sessions',
];
const BIRTH_PLACES = ['home', 'birth center', 'hospital'];
const CONSULT_PREFS = [
  'In-person (Drip Coffee in Hixson)',
  'Video call (Google Meet)',
];
const HEARD_FROM = [
  'from a web search',
  'from social media',
  'from my midwife',
  'referral from another doula',
  'from a previous client',
];

const MAX = { name: 120, email: 200, phone: 40, birthLocation: 600, notes: 3000 };

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

/** Escape for safe interpolation into the HTML email body. */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Strip CR/LF so user input cannot inject extra mail headers. */
function oneLine(s) {
  return String(s).replace(/[\r\n]+/g, ' ').trim();
}

function str(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function validate(d) {
  const errors = [];
  const out = {};

  out.name = oneLine(str(d.name));
  if (!out.name) errors.push('name is required');
  else if (out.name.length > MAX.name) errors.push('name is too long');

  out.email = oneLine(str(d.email));
  if (!out.email) errors.push('email is required');
  else if (out.email.length > MAX.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(out.email))
    errors.push('email is not valid');

  out.phone = oneLine(str(d.phone));
  if (!out.phone) errors.push('phone is required');
  else if (out.phone.length > MAX.phone) errors.push('phone is too long');

  out.dueDate = oneLine(str(d.dueDate));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(out.dueDate)) errors.push('due date is not valid');

  out.birthPlace = oneLine(str(d.birthPlace));
  if (!BIRTH_PLACES.includes(out.birthPlace)) errors.push('birth place is not valid');

  out.birthLocation = str(d.birthLocation);
  if (!out.birthLocation) errors.push('birth location is required');
  else if (out.birthLocation.length > MAX.birthLocation)
    errors.push('birth location is too long');

  const support = Array.isArray(d.supportType) ? d.supportType.map(str) : [];
  out.supportType = support.filter((s) => SUPPORT_OPTIONS.includes(s));
  if (out.supportType.length === 0) errors.push('at least one support type is required');

  out.consultPref = oneLine(str(d.consultPref));
  if (!CONSULT_PREFS.includes(out.consultPref)) errors.push('consultation preference is not valid');

  out.notes = str(d.notes);
  if (out.notes.length > MAX.notes) errors.push('notes are too long');

  out.heardFrom = oneLine(str(d.heardFrom));
  if (!HEARD_FROM.includes(out.heardFrom)) errors.push('referral source is not valid');

  if (d.consent !== true) errors.push('consent is required');

  return { errors, out };
}

function buildEmail(d) {
  const row = (label, value) =>
    `<tr>
       <td style="padding:8px 14px 8px 0;vertical-align:top;color:#5C2D3E;font-weight:600;white-space:nowrap">${esc(label)}</td>
       <td style="padding:8px 0;vertical-align:top;color:#3A2226">${esc(value).replace(/\n/g, '<br>')}</td>
     </tr>`;

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#FDF6EC;padding:24px">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1.5px solid #E8B44A;border-radius:16px;padding:26px">
    <h1 style="margin:0 0 4px;font-size:19px;color:#5C2D3E">New consultation request</h1>
    <p style="margin:0 0 18px;font-size:14px;color:#3A2226">From the form at yourbirthgirl.com</p>
    <table style="border-collapse:collapse;font-size:15px;width:100%">
      ${row('Name', d.name)}
      ${row('Email', d.email)}
      ${row('Phone', d.phone)}
      ${row('Due date', d.dueDate)}
      ${row('Birth place', d.birthPlace)}
      ${row('Birth location', d.birthLocation)}
      ${row('Support type', d.supportType.join(', '))}
      ${row('Consultation', d.consultPref)}
      ${row('Notes', d.notes || '—')}
      ${row('Heard via', d.heardFrom)}
      ${row('Medical-advice acknowledgement', 'Agreed')}
    </table>
    <p style="margin:20px 0 0;font-size:13px;color:#3A2226">Reply directly to this email to reach ${esc(d.name)}.</p>
  </div>
</div>`;

  const text = [
    'New consultation request — yourbirthgirl.com',
    '',
    `Name:          ${d.name}`,
    `Email:         ${d.email}`,
    `Phone:         ${d.phone}`,
    `Due date:      ${d.dueDate}`,
    `Birth place:   ${d.birthPlace}`,
    `Birth location:${d.birthLocation}`,
    `Support type:  ${d.supportType.join(', ')}`,
    `Consultation:  ${d.consultPref}`,
    `Notes:         ${d.notes || '—'}`,
    `Heard via:     ${d.heardFrom}`,
    'Medical-advice acknowledgement: Agreed',
  ].join('\n');

  return { html, text };
}

export default {
  async fetch(request, env) {
    const allowed = env.ALLOWED_ORIGIN || 'https://yourbirthgirl.com';
    const origin = request.headers.get('Origin');
    // Always echo the configured origin, never the request's — reflecting an
    // arbitrary Origin would defeat the point of the check below.
    const cors = allowed;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(cors) });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, cors);
    }
    if (origin && origin !== allowed) {
      return json({ error: 'Forbidden' }, 403, cors);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400, cors);
    }

    // Honeypot: a real person never fills this. Accept silently so bots do
    // not learn they were caught.
    if (str(data.website)) return json({ ok: true }, 200, cors);

    const { errors, out } = validate(data);
    if (errors.length) {
      return json({ error: 'Please check your answers: ' + errors.join(', ') }, 400, cors);
    }

    if (!env.RESEND_API_KEY) {
      return json({ error: 'Server is not configured to send mail yet.' }, 500, cors);
    }

    const { html, text } = buildEmail(out);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.MAIL_FROM || 'Your Birth Girl <forms@yourbirthgirl.com>',
        to: [env.MAIL_TO || 'megan.yourbirthgirl@gmail.com'],
        reply_to: out.email,
        subject: `Consultation request — ${out.name} (due ${out.dueDate})`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Resend failed', res.status, detail);
      return json({ error: 'Could not send the message. Please email Megan directly.' }, 502, cors);
    }

    return json({ ok: true }, 200, cors);
  },
};
