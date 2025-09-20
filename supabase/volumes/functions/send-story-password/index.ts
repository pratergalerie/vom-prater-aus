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

  const { email, storyId, password } = body;

  if (!email || !storyId || !password) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      headers,
      status: 400,
    });
  }

  const editLink = `http://vomprateraus.pratergalerie.de/stories/edit/${storyId}`;

  const senderEmail = Deno.env.get("SMTP_EMAIL");
  const senderName = Deno.env.get("SMTP_SENDER_NAME");
  const brevoApiKey = Deno.env.get("BREVO_API_KEY");

  if (!senderEmail || !senderName || !brevoApiKey) {
    return new Response(JSON.stringify({ error: "Missing SMTP config" }), {
      status: 500,
    });
  }

  const mailBody = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email }],
    subject:
      "Link zu deinem Berliner Prater Story / Link to your Berliner Prater Story",
    htmlContent: `<html><body><h3>Hallo,</h3>

<p>Du kannst deine Story jederzeit mit dem folgenden Link und Passwort bearbeiten:</p>
<p>Link: <a href="${editLink}">${editLink}</a></p>
<p>Passwort: ${password}</p>

<p>Bitte diese E-Mail sicher aufbewahren. Falls du dein Passwort verlierst, kannst du deine Story nicht mehr bearbeiten.</p>

<p>Du kannst deine Story jederzeit bearbeiten, solange sie noch nicht eingereicht oder veröffentlicht wurde.</p>

<p>Falls du Fragen hast, kontaktiere uns unter <a href="mailto:vomprateraus@pratergalerie.de">vomprateraus@pratergalerie.de</a>.</p>

<p>Viele Grüße,<br>
Vom Prater aus Team</p>

<p>______________________</p>

<h3>Hello,</h3>

<p>Thank you for submitting your story to Vom Prater aus!</p>

<p>You can edit your story at any time using the following link and password:</p>

<p>Edit link: <a href="${editLink}">${editLink}</a></p>
<p>Password: ${password}</p>

<p>Keep this email safe. If you lose your password, you will not be able to edit your story.</p>

<p>You can edit your story as long as it is not submitted or published.</p>

<p>If you have any questions, please contact us at <a href="mailto:vomprateraus@pratergalerie.de">vomprateraus@pratergalerie.de</a>.</p>

<p>Best regards,<br>
Vom Prater aus Team</p>
</body></html>
`,
  };

  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      brevoApiKey
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = mailBody.subject;
    sendSmtpEmail.htmlContent = mailBody.htmlContent;

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
