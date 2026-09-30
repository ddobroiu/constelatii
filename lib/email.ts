import { Resend } from "resend";

import { alerta } from "@/lib/alerts";

// E-mailurile aplicatiei (Resend). Fara cheie sau expeditor configurate nu trimitem nimic:
// plata si creditele merg oricum, e-mailul e doar informare.
export async function sendPurchaseEmail(
  to: string,
  pack: { name: string; credits: number } | null,
  appUrl: string,
  invoiceUrl: string | null,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from || !to) return;
  const what = pack
    ? `Pachetul „${pack.name}” e activ: ${pack.credits} ${pack.credits === 1 ? "raport complet" : "rapoarte complete"} în contul tău, pentru orice constelație. Creditele nu expiră.`
    : "Creditele au fost adăugate în contul tău.";
  const invoice = invoiceUrl
    ? `<p style="color:#444">Factura o găsești aici: <a href="${invoiceUrl}">${invoiceUrl}</a></p>`
    : `<p style="color:#444">Factura îți vine în scurt timp pe această adresă.</p>`;
  try {
    const { error } = await new Resend(key).emails.send({
      from,
      to,
      subject: pack ? `Ai activat „${pack.name}”` : "Plata a fost confirmată",
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:30px auto;padding:30px;border:1px solid #eee;border-radius:12px">
        <h2 style="margin:0 0 12px">Mulțumim. Plata a fost confirmată.</h2>
        <p style="color:#444">${what}</p>${invoice}
        <p><a href="${appUrl}/cont" style="display:inline-block;background:#6d28d9;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">Deschide contul</a></p>
      </div>`,
    });
    // Resend nu arunca la un e-mail refuzat: intoarce { error }
    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (error: unknown) {
    console.error("[email] confirmare plata:", error);
    void alerta("error", "resend", `Constelatii Familiale: e-mailul de confirmare a plății nu a plecat: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// ---------------------------------------------------------------- e-mailuri cu șablon

export interface EmailContent {
  to: string;
  subject: string;
  heading: string;
  /** Paragrafe de text simplu; se scapă la randare. */
  paragraphs: string[];
  cta?: { label: string; url: string };
  footnote?: string;
  /** Linkul de dezabonare: în subsol și în antetele List-Unsubscribe (un click, RFC 8058). */
  unsubscribe?: { pageUrl: string; oneClickUrl: string };
}

export interface SendResult {
  ok: boolean;
  id: string | null;
  error: string | null;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const DISCLAIMER =
  "Nu este terapie psihologică sau medicală și nu înlocuiește un specialist — este un instrument de auto-reflecție.";

function render(content: EmailContent): { html: string; text: string } {
  const p = content.paragraphs
    .map((t) => `<p style="color:#444;line-height:1.6;margin:0 0 14px">${escapeHtml(t)}</p>`)
    .join("");
  const cta = content.cta
    ? `<p style="margin:24px 0"><a href="${escapeHtml(content.cta.url)}" style="display:inline-block;background:#6d28d9;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">${escapeHtml(content.cta.label)}</a></p>`
    : "";
  const footnote = content.footnote
    ? `<p style="color:#888;font-size:13px;line-height:1.5;margin:18px 0 0">${escapeHtml(content.footnote)}</p>`
    : "";
  const unsubscribe = content.unsubscribe
    ? `<br>Nu mai vrei aceste e-mailuri? <a href="${escapeHtml(content.unsubscribe.pageUrl)}" style="color:#999">Dezabonează-te</a>.`
    : "";
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:30px auto;padding:30px;border:1px solid #eee;border-radius:12px">
        <h2 style="margin:0 0 14px">${escapeHtml(content.heading)}</h2>
        ${p}${cta}${footnote}
        <p style="color:#999;font-size:12px;line-height:1.5;margin:24px 0 0;border-top:1px solid #eee;padding-top:14px">Constelații Familiale · constelatii.com · contact@constelatii.com<br>${DISCLAIMER}${unsubscribe}</p>
      </div>`;
  const text = [
    content.heading,
    "",
    ...content.paragraphs,
    content.cta ? `\n${content.cta.label}: ${content.cta.url}` : "",
    content.footnote ? `\n${content.footnote}` : "",
    "",
    "Constelații Familiale · https://constelatii.com · contact@constelatii.com",
    DISCLAIMER,
    content.unsubscribe ? `Dezabonare: ${content.unsubscribe.pageUrl}` : "",
  ].join("\n");
  return { html, text };
}

/** Trimite un e-mail cu șablonul comun. Nu aruncă niciodată; spune ce s-a întâmplat. */
export async function sendEmailResult(content: EmailContent): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return { ok: false, id: null, error: "RESEND_API_KEY sau EMAIL_FROM lipsește" };
  const { html, text } = render(content);
  try {
    const { data, error } = await new Resend(key).emails.send({
      from,
      to: content.to,
      replyTo: "contact@constelatii.com",
      subject: content.subject,
      html,
      text,
      ...(content.unsubscribe && {
        headers: {
          "List-Unsubscribe": `<${content.unsubscribe.oneClickUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });
    if (error) throw new Error(`${error.name}: ${error.message}`);
    return { ok: true, id: data?.id ?? null, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[email] „${content.subject}”:`, message);
    void alerta("error", "resend", `Constelatii Familiale: e-mailul „${content.subject}” nu a plecat: ${message}`);
    return { ok: false, id: null, error: message };
  }
}
