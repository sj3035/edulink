
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { position, applicantName, applicantEmail } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "EduLink <no-reply@edulink.com>",
      to: "support.edulink@gmail.com",
      subject: `New Job Application: ${position}`,
      html: `
        <h1>New Job Application Received</h1>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Applicant Name:</strong> ${applicantName}</p>
        <p><strong>Applicant Email:</strong> ${applicantEmail}</p>
        <p>Please log in to the admin dashboard to review this application.</p>
      `,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
