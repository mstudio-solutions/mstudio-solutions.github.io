// mStudio Solutions – contact form Worker
// Sends the form on https://mstudiosolutions.com/contact/ to Gmail, with the attachment.
// Cloudflare Workers Free plan. One file, no npm packages: paste it into the dashboard editor.
// Nothing is stored. The attachment goes straight into the email.
//
// Worker settings it needs:
//   Binding "Send email"  name: SEND_EMAIL        (destination: mstudiosolutions@gmail.com)
//   Secret                name: TURNSTILE_SECRET  (secret key of the Turnstile widget)
//
// Backup copy: contact-worker/worker.js in repo mstudio-solutions/mstudio-solutions.github.io

import { EmailMessage } from "cloudflare:email";

const ALLOWED_ORIGIN = "https://mstudiosolutions.com";
const TURNSTILE_HOSTNAME = "mstudiosolutions.com";
const MAIL_DOMAIN = "mstudiosolutions.com";
const FROM_ADDRESS = "website@mstudiosolutions.com";
const FROM_NAME = "mStudio Solutions Website";
const TO_ADDRESS = "mstudiosolutions@gmail.com";

const MAX_FILE = 2 * 1024 * 1024;     // 2 MB attachment
const MAX_REQUEST = 3 * 1024 * 1024;  // whole form, with the file
const MAX_LENGTH = { name: 100, email: 200, subject: 150, message: 5000 };

// Topic value in the form -> name in the email subject.
// A new topic that is not listed here still works; the subject then shows its value.
const TOPICS = {
  "general": "General question",
  "mcurrency": "mCurrency",
  "mpractice": "mPractice Citizenship Test",
  "mtranslate": "mTranslate (Mac)",
  "mtranslate-chrome": "mTranslate for Chrome",
  "mmarkdown": "mMarkdown",
  "mpath": "mPath",
  "clean-microsoft-teams-accounts": "Clean Microsoft Teams Accounts",
  "iac-bicep-generator": "IaC Generator for Bicep",
  "cloud-migration": "Cloud migration",
  "other": "Other",
};

// File ending -> file type. The file's first bytes must match too.
const FILE_TYPES = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", pdf: "application/pdf" };

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const cors = { "Vary": "Origin" };
    if (origin === ALLOWED_ORIGIN) cors["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN;

    if (request.method === "OPTIONS") {
      if (origin !== ALLOWED_ORIGIN) return reply(403, "Not allowed", cors);
      return new Response(null, {
        status: 204,
        headers: {
          ...cors,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }
    if (request.method !== "POST") return reply(405, "Method not allowed", { ...cors, "Allow": "POST, OPTIONS" });
    if (origin !== ALLOWED_ORIGIN) return reply(403, "Not allowed", cors);

    try {
      return await handleForm(request, env, cors);
    } catch (err) {
      // Details only go to the Worker logs, never to the visitor.
      console.error("contact form error:", err && err.stack ? err.stack : err);
      return reply(500, "Could not send the message", cors);
    }
  },
};

async function handleForm(request, env, cors) {
  const bad = (status = 400) => reply(status, status === 413 ? "Too large" : "Please check the form", cors);

  const type = request.headers.get("Content-Type") || "";
  if (!/^multipart\/form-data\s*;/i.test(type)) return reply(415, "Unsupported content type", cors);
  if (Number(request.headers.get("Content-Length") || 0) > MAX_REQUEST) return bad(413);

  const body = await request.arrayBuffer();
  if (body.byteLength > MAX_REQUEST) return bad(413);
  let form;
  try {
    form = await new Response(body, { headers: { "Content-Type": type } }).formData();
  } catch {
    return bad();
  }

  // Hidden trap field: people never see it, bots fill it in.
  if (field(form, "website") !== "") return bad();

  const name = oneLine(field(form, "name"));
  const email = field(form, "email").trim();
  const subject = oneLine(field(form, "subject"));
  const message = field(form, "message").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim();
  const topicValue = field(form, "topic").trim() || "general";
  const token = field(form, "cf-turnstile-response");

  if (!email || !subject || !message) return bad();
  if (name.length > MAX_LENGTH.name || email.length > MAX_LENGTH.email ||
      subject.length > MAX_LENGTH.subject || message.length > MAX_LENGTH.message) return bad();
  if (!isEmail(email)) return bad();
  if (!/^[a-z0-9-]{1,40}$/.test(topicValue)) return bad();
  const topic = TOPICS[topicValue] || topicValue;

  // Attachment: none or exactly 1 file, JPG / PNG / PDF, up to 2 MB.
  const files = [];
  for (const v of form.getAll("attachment")) {
    if (typeof v === "string") {
      if (v !== "") return bad();
      continue;
    }
    if (v.size === 0 && !v.name) continue; // the visitor chose no file
    files.push(v);
  }
  if (files.length > 1) return bad();
  let attachment = null;
  if (files.length === 1) {
    const f = files[0];
    if (f.size > MAX_FILE) return bad(413);
    if (f.size === 0) return bad();
    const ext = ((f.name || "").match(/\.([A-Za-z0-9]+)$/) || [])[1];
    const wanted = ext && FILE_TYPES[ext.toLowerCase()];
    if (!wanted) return bad();
    const bytes = new Uint8Array(await f.arrayBuffer());
    if (fileType(bytes) !== wanted) return bad();
    attachment = { name: safeFileName(f.name, ext.toLowerCase()), type: wanted, bytes };
  }

  // Turnstile (spam check) last, so a wrong form does not use up the visitor's token.
  if (!token || token.length > 2048) return reply(403, "Verification failed", cors);
  if (!(await turnstileOk(token, request.headers.get("CF-Connecting-IP"), env.TURNSTILE_SECRET))) {
    return reply(403, "Verification failed", cors);
  }

  const raw = buildEmail({ name, email, topic, subject, message, attachment });
  await env.SEND_EMAIL.send(new EmailMessage(FROM_ADDRESS, TO_ADDRESS, raw));
  return reply(200, "Sent", cors);
}

// ---------- helpers ----------

function reply(status, message, headers) {
  return new Response(JSON.stringify({ ok: status >= 200 && status < 300, message }), {
    status,
    headers: { ...headers, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function field(form, key) {
  const v = form.get(key);
  return typeof v === "string" ? v : "";
}

// No line breaks or control characters: these values go into email headers.
function oneLine(s) {
  return s.replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ").replace(/\s+/g, " ").trim();
}

function isEmail(s) {
  return /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(s);
}

function fileType(b) {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (b.length > 8 && png.every((x, i) => b[i] === x)) return "image/png";
  // "%PDF-" near the start of the file
  const head = String.fromCharCode.apply(null, b.subarray(0, 1024));
  if (head.includes("%PDF-")) return "application/pdf";
  return null;
}

function safeFileName(name, ext) {
  let base = name.replace(/\.[^.]*$/, "").normalize("NFKD")
    .replace(/[^A-Za-z0-9 _.()-]+/g, "").replace(/\s+/g, " ").replace(/^[.\s]+/, "").trim().slice(0, 60).trim();
  if (!base) base = "attachment";
  return base + "." + ext;
}

async function turnstileOk(token, ip, secret) {
  if (!secret) throw new Error("TURNSTILE_SECRET is not set");
  const data = new FormData();
  data.append("secret", secret);
  data.append("response", token);
  if (ip) data.append("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: data });
  if (!r.ok) throw new Error("Turnstile siteverify HTTP " + r.status);
  const result = await r.json();
  const codes = result["error-codes"] || [];
  if (codes.includes("missing-input-secret") || codes.includes("invalid-input-secret")) {
    throw new Error("TURNSTILE_SECRET is wrong: " + codes.join(","));
  }
  if (!result.success) {
    console.log("Turnstile said no:", codes.join(","));
    return false;
  }
  if (result.hostname !== TURNSTILE_HOSTNAME) {
    console.log("Turnstile token from another site:", result.hostname);
    return false;
  }
  return true;
}

// ---------- the email (MIME) ----------

function buildEmail(d) {
  const subject = `[Website] ${d.topic}: ${d.subject}`;
  const replyTo = d.name ? `${displayName(d.name)} <${d.email}>` : `<${d.email}>`;

  const text = [
    "New message from the contact form on mstudiosolutions.com",
    "",
    "Name:       " + (d.name || "(not given)"),
    "Email:      " + d.email,
    "Topic:      " + d.topic,
    "Subject:    " + d.subject,
    "Attachment: " + (d.attachment ? `${d.attachment.name} (${Math.max(1, Math.round(d.attachment.bytes.length / 1024))} KB)` : "none"),
    "",
    "Message:",
    "",
    d.message,
    "",
    "--",
    "Press Reply to answer " + (d.name || d.email) + ".",
  ].join("\n").replace(/\n/g, "\r\n");

  const headers = [
    `From: ${displayName(FROM_NAME)} <${FROM_ADDRESS}>`,
    `To: <${TO_ADDRESS}>`,
    `Reply-To: ${replyTo}`,
    `Subject: ${headerText(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${MAIL_DOMAIN}>`,
    "MIME-Version: 1.0",
  ];
  const textPart = [
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64Lines(new TextEncoder().encode(text)),
  ];

  if (!d.attachment) return [...headers, ...textPart, ""].join("\r\n");

  const boundary = "=_mstudio_" + crypto.randomUUID().replace(/-/g, "");
  return [
    ...headers,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    "This is a message in MIME format.",
    "",
    "--" + boundary,
    ...textPart,
    "--" + boundary,
    `Content-Type: ${d.attachment.type}; name="${d.attachment.name}"`,
    `Content-Disposition: attachment; filename="${d.attachment.name}"`,
    "Content-Transfer-Encoding: base64",
    "",
    base64Lines(d.attachment.bytes),
    "--" + boundary + "--",
    "",
  ].join("\r\n");
}

// Header text: plain if it is simple ASCII, else UTF-8 "encoded words" (RFC 2047).
function headerText(s) {
  return /^[\x20-\x7e]*$/.test(s) ? s : encodedWords(s);
}

// Name before an address: quoted if ASCII, else encoded words.
function displayName(s) {
  return /^[\x20-\x7e]*$/.test(s) ? '"' + s.replace(/["\\]/g, "\\$&") + '"' : encodedWords(s);
}

function encodedWords(s) {
  const enc = new TextEncoder();
  const words = [];
  let chunk = "", size = 0;
  for (const ch of s) {               // whole characters, never half of one
    const n = enc.encode(ch).length;
    if (size + n > 45 && chunk) { words.push(chunk); chunk = ""; size = 0; }
    chunk += ch; size += n;
  }
  if (chunk) words.push(chunk);
  return words.map((w) => "=?UTF-8?B?" + base64(enc.encode(w)) + "?=").join("\r\n ");
}

function base64(bytes) {
  if (typeof bytes.toBase64 === "function") return bytes.toBase64();
  let out = "";
  const step = 3 * 4096;               // a multiple of 3, so the pieces join cleanly
  for (let i = 0; i < bytes.length; i += step) {
    out += btoa(String.fromCharCode.apply(null, bytes.subarray(i, i + step)));
  }
  return out;
}

// Base64 in lines of 76 characters, as email needs.
function base64Lines(bytes) {
  const s = base64(bytes);
  const lines = [];
  for (let i = 0; i < s.length; i += 76) lines.push(s.slice(i, i + 76));
  return lines.join("\r\n");
}
