import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const payload = await req.json()
    const { toEmail, subject, message } = payload

    console.log("📧 Email dikirim ke:", toEmail)
    console.log("Subject:", subject)
    console.log("Message:", message)

    return new Response(
      JSON.stringify({
        status: "ok",
        message: `Simulasi email terkirim ke ${toEmail}`
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    )
  }
})
