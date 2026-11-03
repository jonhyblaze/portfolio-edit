import nodemailer from "nodemailer"
import { zodFormShema } from "@/components/form/schema"
import profile from "@/data/profile"

const EMAIL_ADDRESS = process.env.GOOGLE_EMAIL_ADDRESS
const PASSWORD = process.env.GOOGLE_APP_PASSWORDS

/**
 * Everything a visitor types lands in the HTML body of the mail, so it goes in
 * as text: without this a message could carry its own markup — links, images,
 * a fake "reply here" block — into the inbox.
 */
/**
 * Faster than this from form shown to form sent, and it wasn't typed. Three
 * fields can't be filled in by hand in three seconds; a script posts at once.
 */
const MIN_FILL_TIME_MS = 3000

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

export async function POST(req: Request) {
  // Checked per request rather than at import, so a missing variable answers
  // with a clean 500 instead of taking the route down when it loads.
  if (!EMAIL_ADDRESS || !PASSWORD) {
    console.error("Contact form: GOOGLE_EMAIL_ADDRESS or GOOGLE_APP_PASSWORDS is not set")
    return Response.json({ success: false }, { status: 500 })
  }

  try {
    const body = await req.json()

    // Bot checks first, before validation can say anything about the request:
    // a tripped check gets the same answer a real message does, and no mail.
    // A missing `elapsed` counts as too fast — only something posting straight
    // at the route, never the form, leaves it out.
    if (typeof body?.website === "string" && body.website.trim()) {
      console.info("Contact form: honeypot filled, message dropped")
      return Response.json({ success: true })
    }

    if (typeof body?.elapsed !== "number" || body.elapsed < MIN_FILL_TIME_MS) {
      console.info("Contact form: sent too fast, message dropped")
      return Response.json({ success: true })
    }

    const parsed = zodFormShema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          errors: parsed.error.issues
        },
        { status: 400 }
      )
    }

    const { name, email, message } = parsed.data

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    // Line breaks are kept: the message is the one field written in paragraphs.
    const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br />")

    const htmlTemplate = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f5f5f7;padding:48px 16px;color:#111;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #eaeaea;border-radius:2px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.04);">

          <!-- Accent line -->
          <div style="height:4px;background:linear-gradient(90deg,#000,#555,#000);"></div>

          <!-- Header -->
          <div style="padding:32px 32px 20px 32px;">
            <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;font-weight:600;margin-bottom:6px;">
              Portfolio
            </div>
            <h1 style="margin:0;font-size:22px;font-weight:600;color:#111;">
              New Contact Message
            </h1>
          </div>

          <!-- Divider -->
          <div style="height:1px;background:#f0f0f0;"></div>

          <!-- Content -->
          <div style="padding:32px;">

            <!-- Sender -->
            <div style="margin-bottom:28px;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;margin-bottom:8px;">
                From
              </div>

              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:36px;height:36px;text-align:center;border-radius:50%;background:#111;color:#fff;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;">
                    ${escapeHtml(name.charAt(0).toUpperCase()) || "PF"}
                </div>

                <div style="padding: 0 10px;">
                  <div style="font-size:15px;font-weight:600;color:#111;">
                    ${safeName}
                  </div>
                  <div style="font-size:13px;color:#6b7280;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">
                   ${safeEmail}
                  </div>
                </div>
              </div>
            </div>

            <!-- Message -->
            <div>
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;margin-bottom:10px;">
                Message
              </div>

              <div style="font-size:14px;line-height:1.7;color:#111;background:#fafafa;border:1px solid #ececec;border-radius:2px;padding:20px;">
                ${safeMessage}
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div style="border-top:1px solid #f0f0f0;padding:20px 32px;background:#fafafa;">
            <div style="font-size:12px;color:#9ca3af;">
              Sent from contact form on your portfolio <a style="color:#9ca3af;" href="${profile.url}">website</a>
            </div>
          </div>

        </div>
      </div>`

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ADDRESS,
        pass: PASSWORD
      }
    })

    await transporter.sendMail({
      from: `"Portfolio Contact" <${EMAIL_ADDRESS}>`,
      to: EMAIL_ADDRESS,
      subject: `New message from ${name}`,
      replyTo: email,
      html: htmlTemplate,
      text: `
      New contact form message

      Name: ${name}
      Email: ${email}

      Message:
      ${message}
      `
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ success: false }, { status: 500 })
  }
}
