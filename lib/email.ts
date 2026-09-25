import { Resend } from "resend";

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
    await new Resend(key).emails.send({
      from,
      to,
      subject: pack ? `Ai activat „${pack.name}”` : "Plata a fost confirmată",
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:30px auto;padding:30px;border:1px solid #eee;border-radius:12px">
        <h2 style="margin:0 0 12px">Mulțumim. Plata a fost confirmată.</h2>
        <p style="color:#444">${what}</p>${invoice}
        <p><a href="${appUrl}/cont" style="display:inline-block;background:#6d28d9;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">Deschide contul</a></p>
      </div>`,
    });
  } catch (error: unknown) {
    console.error("[email] confirmare plata:", error);
  }
}
