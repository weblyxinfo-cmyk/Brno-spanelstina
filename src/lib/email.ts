import { Resend } from "resend";
import { SITE_CONFIG, getEmailFrom } from "./constants";

// Only initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string | null;
  courseType?: string | null;
  message: string;
}

export async function sendContactNotification(data: ContactEmailData) {
  // If no API key or resend not initialized, skip sending (development mode)
  if (!resend) {
    console.log("RESEND_API_KEY not set, skipping email notification");
    return { success: true, skipped: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: getEmailFrom(),
      to: process.env.ADMIN_EMAIL || SITE_CONFIG.contact.email,
      replyTo: data.email,
      subject: `Nová zpráva od ${data.name}${data.courseType ? ` - ${data.courseType}` : ""}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #E07B53, #C4613D); padding: 24px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Nová zpráva z webu</h1>
          </div>

          <div style="background: #FBF9F6; padding: 24px; border: 1px solid #EBE6DF; border-top: none; border-radius: 0 0 16px 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6B5D54; width: 120px;">Jméno:</td>
                <td style="padding: 8px 0; color: #1F1A17; font-weight: bold;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B5D54;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #E07B53;">${data.email}</a></td>
              </tr>
              ${data.phone ? `
              <tr>
                <td style="padding: 8px 0; color: #6B5D54;">Telefon:</td>
                <td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #E07B53;">${data.phone}</a></td>
              </tr>
              ` : ""}
              ${data.courseType ? `
              <tr>
                <td style="padding: 8px 0; color: #6B5D54;">Typ kurzu:</td>
                <td style="padding: 8px 0; color: #1F1A17;">${data.courseType}</td>
              </tr>
              ` : ""}
            </table>

            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #EBE6DF;">
              <p style="color: #6B5D54; margin: 0 0 8px 0; font-size: 14px;">Zpráva:</p>
              <p style="color: #1F1A17; margin: 0; white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
            </div>

            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #EBE6DF;">
              <a href="mailto:${data.email}?subject=Re: Dotaz na kurzy španělštiny"
                 style="display: inline-block; background: #E07B53; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: bold;">
                Odpovědět
              </a>
            </div>
          </div>

          <p style="color: #6B5D54; font-size: 12px; text-align: center; margin-top: 16px;">
            Tato zpráva byla odeslána z kontaktního formuláře na ${SITE_CONFIG.email.domain}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending email notification:", error);
    return { success: false, error };
  }
}

export async function sendConfirmationEmail(data: ContactEmailData) {
  // If no API key or resend not initialized, skip sending
  if (!resend) {
    return { success: true, skipped: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: getEmailFrom(),
      to: data.email,
      subject: "Děkujeme za váš zájem o kurzy španělštiny",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #E07B53, #C4613D); padding: 24px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">¡Hola ${data.name}!</h1>
          </div>

          <div style="background: #FBF9F6; padding: 24px; border: 1px solid #EBE6DF; border-top: none; border-radius: 0 0 16px 16px;">
            <p style="color: #1F1A17; font-size: 16px; line-height: 1.6;">
              Děkujeme za váš zájem o kurzy španělštiny v Brně. Vaši zprávu jsme obdrželi a ozveme se vám co nejdříve.
            </p>

            <p style="color: #6B5D54; font-size: 14px; line-height: 1.6; margin-top: 16px;">
              Mezitím se můžete podívat na naše <a href="https://${SITE_CONFIG.email.domain}/kurzy" style="color: #E07B53;">kurzy</a>
              nebo si přečíst <a href="https://${SITE_CONFIG.email.domain}/reference" style="color: #E07B53;">reference</a> od našich studentů.
            </p>

            <div style="margin-top: 24px; padding: 16px; background: white; border-radius: 12px; border: 1px solid #EBE6DF;">
              <p style="color: #6B5D54; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase;">Vaše zpráva:</p>
              <p style="color: #1F1A17; margin: 0; font-size: 14px; white-space: pre-wrap;">${data.message}</p>
            </div>

            <p style="color: #1F1A17; font-size: 16px; line-height: 1.6; margin-top: 24px;">
              ¡Hasta pronto!<br>
              <strong>Tým Španělština Brno</strong>
            </p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #6B5D54; font-size: 12px; margin: 0;">
              ${SITE_CONFIG.email.fromName} | ${SITE_CONFIG.contact.address}<br>
              <a href="mailto:${SITE_CONFIG.contact.email}" style="color: #E07B53;">${SITE_CONFIG.contact.email}</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending confirmation email:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return { success: false, error };
  }
}
