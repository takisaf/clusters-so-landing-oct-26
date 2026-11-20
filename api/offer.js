// POST /api/offer — receives an offer from the dialog, emails it to the owner,
// and sends the buyer an automatic confirmation. Uses Resend's HTTP API (no dependencies).
//
// Vercel environment variables:
//   RESEND_API_KEY   required — from resend.com, with clusters.so verified as a sending domain
//   OFFER_TO         optional — where offers go (default asaf@clusters.so)
//   OFFER_FROM       optional — sender (default "Clusters.so <offers@clusters.so>")

const TO = process.env.OFFER_TO || "asaf@clusters.so";
const FROM = process.env.OFFER_FROM || "Clusters.so <offers@clusters.so>";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function send(payload) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // Honeypot: bots fill the hidden field. Pretend success, send nothing.
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });

  const name = clean(body.name, 120);
  const company = clean(body.company, 160);
  const email = clean(body.email, 200);
  const amount = Math.floor(Number(body.amount));

  if (!name) return res.status(400).json({ error: "Please enter your name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1e12) return res.status(400).json({ error: "Please enter your offer in USD." });
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Offers can't be sent right now. Please email hello@clusters.so." });
  }

  const price = "$" + amount.toLocaleString("en-US") + " USD";
  const rows = [["Name", name], ["Company", company || "—"], ["Email", email], ["Offer", price]];

  try {
    // 1. The offer, to the owner. Reply-To is the buyer, so replying goes straight to them.
    await send({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `New offer for Clusters.so: ${price} from ${name}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: `<h2 style="font-family:Arial,sans-serif">New offer for Clusters.so</h2>
<table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">${rows
        .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#676C68">${k}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>`)
        .join("")}</table>`,
    });

    // 2. Automatic confirmation, to the buyer. Failure here shouldn't fail the offer.
    try {
      await send({
        from: FROM,
        to: [email],
        reply_to: TO,
        subject: "We've received your offer for Clusters.so",
        text: `Hi ${name},

Thank you for your offer of ${price} for Clusters.so. This is an automatic confirmation that it reached us.

We review every offer personally and will get back to you soon.

Your offer
Name: ${name}
Company: ${company || "—"}
Amount: ${price}

Clusters.so`,
        html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#232624">
<p>Hi ${esc(name)},</p>
<p>Thank you for your offer of <strong>${esc(price)}</strong> for Clusters.so. This is an automatic confirmation that it reached us.</p>
<p>We review every offer personally and will get back to you soon.</p>
<p style="color:#676C68;font-size:13px;margin-top:24px">Your offer<br>Name: ${esc(name)}<br>Company: ${esc(company || "—")}<br>Amount: ${esc(price)}</p>
<p style="margin-top:24px"><strong>Clusters.so</strong></p></div>`,
      });
    } catch (e) {
      console.error("Confirmation email failed:", e);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Offer email failed:", e);
    return res.status(502).json({ error: "Your offer couldn't be sent. Please try again or email hello@clusters.so." });
  }
}
