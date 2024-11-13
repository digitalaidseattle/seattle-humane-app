// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("resend function is online boss!")

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

    curl --request POST 'EDGE_FUNCTION_URL' \
  --header 'Authorization: Bearer API_KEY_RESEND_OR_SUPABASE' \
  --header 'Content-Type: application/json' \
  --data '{"db_table_col_1":"This is a test email"}'

*/

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL')
const RESEND_TO_EMAIL = Deno.env.get('RESEND_TO_EMAIL')

const handler = async (req: Request): Promise<Response> => {
  const { request_source, created_at, description, }: { request_source: string, created_at: string, description: string; } = await req.json();
  if (request_source !== 'public_service_request_intake_form')
    return new Response(JSON.stringify({ body: "no notifications will be sent for this source" }), { status: 200 });

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: RESEND_TO_EMAIL,
        subject: "New Service Request Notification",
        html: `
          <div>
            <h3>Heya! There's a new client service request waiting for you in the dashboard!</h3>
            <h4>Description</h4>
            <p>${description}</p>
            <p>${created_at}</p>
          </div>
          `,
      }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "CLANG!! Something just broke hehe" }))
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message }), { status: 500 });
  }
}

Deno.serve(handler)
