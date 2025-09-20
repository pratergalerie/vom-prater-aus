import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import * as brevo from "npm:@getbrevo/brevo";

serve(async (req) => {
  // Set default headers for all responses
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers, status: 204 });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers,
      status: 405,
    });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body" }),
      { headers, status: 400 }
    );
  }

  const { email, storyId, status, storyTitle } = body;

  if (!email || !storyId || !status || !storyTitle) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      headers,
      status: 400,
    });
  }

  const storyLink = `http://vomprateraus.pratergalerie.de/stories/${storyId}`;

  const senderEmail = Deno.env.get("SMTP_EMAIL");
  const senderName = Deno.env.get("SMTP_SENDER_NAME");
  const brevoApiKey = Deno.env.get("BREVO_API_KEY");

  if (!senderEmail || !senderName || !brevoApiKey) {
    return new Response(JSON.stringify({ error: "Missing SMTP config" }), {
      status: 500,
    });
  }

  // Prepare email content based on status
  const subject =
    status === "approved"
      ? "Your Story Has Been Published / Deine Geschichte wurde veröffentlicht"
      : "Update About Your Story / Update zu deiner Geschichte";

  const htmlContent =
    status === "approved"
      ? `<html><body><h3>Hallo,</h3>

<p>Wir freuen uns, dir mitteilen zu können, dass deine Geschichte "${storyTitle}" veröffentlicht wurde!</p>

<p>Du kannst deine Geschichte hier lesen: <a href="${storyLink}">${storyLink}</a></p>

<p>Vielen Dank für deinen Beitrag zu Vom Prater aus.</p>

<p>Viele Grüße,<br>
Vom Prater aus Team</p>

<p>______________________</p>

<h3>Hello,</h3>

<p>We are happy to inform you that your story "${storyTitle}" has been published!</p>

<p>You can read your story here: <a href="${storyLink}">${storyLink}</a></p>

<p>Thank you for contributing to Vom Prater aus.</p>

<p>Best regards,<br>
Vom Prater aus Team</p>
</body></html>`
      : `<html><body><h3>Hallo,</h3>

<p>Vielen Dank für die Einreichung deiner Geschichte "${storyTitle}".</p>

<p>Nach sorgfältiger Prüfung können wir deine Geschichte leider nicht veröffentlichen.</p>

<p>Wir ermutigen dich, eine neue Geschichte einzureichen, die besser zu unserem Projekt passt.</p>

<p>Viele Grüße,<br>
Vom Prater aus Team</p>

<p>______________________</p>

<h3>Hello,</h3>

<p>Thank you for submitting your story "${storyTitle}".</p>

<p>After careful review, we regret to inform you that we cannot publish your story at this time.</p>

<p>We encourage you to submit a new story that better aligns with our project.</p>

<p>Best regards,<br>
Vom Prater aus Team</p>
</body></html>`;

  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      brevoApiKey
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: senderName, email: senderEmail };
    sendSmtpEmail.to = [{ email }];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    if (!response) throw Error("Failed to send email");

    return new Response(JSON.stringify({ success: true }), {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error("SMTP error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers,
      status: 500,
    });
  }
});
