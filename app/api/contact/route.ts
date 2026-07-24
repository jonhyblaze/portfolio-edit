import nodemailer from "nodemailer"
import { zodFormShema } from "@/components/form/schema"

const EMAIL_ADDRESS = process.env.GOOGLE_EMAIL_ADDRESS!
const PASSWORD = process.env.GOOGLE_APP_PASSWORDS!

if (!EMAIL_ADDRESS || !PASSWORD) {
  throw new Error("Email env variables missing in .env.local")
}

export async function POST(req: Request) {
  try {
    const parsed = zodFormShema.safeParse(await req.json())

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          errors: parsed.error.issues
        },
        { status: 400 }
      )
    }

    const { name, email, message, website } = parsed.data

    // Honeypot check
    if (website?.trim()) return Response.json({ success: true })


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
                <div style="width:36px;height:36px;text-align:cener;border-radius:50%;background:#111;color:#fff;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;">
                    ${name?.[0] || "PF"}
                </div>

                <div style="padding: 0 10px;">
                  <div style="font-size:15px;font-weight:600;color:#111;">
                    ${name}
                  </div>
                  <div style="font-size:13px;color:#6b280;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">
                   ${email}
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
                ${message}
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div style="border-top:1px solid #f0f0f0;padding:20px 32px;background:#fafafa;">
            <div style="font-size:12px;color:#9ca3af;">
              Sent from contact form on your portfolio <a style="color:#9ca3af;" href="https://portfolio-prototype-gamma.vercel.app/">website</a>
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
