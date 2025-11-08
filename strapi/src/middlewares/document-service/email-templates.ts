export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

export const createdTemplateDe: EmailTemplate = {
  subject: "Vielen Dank für deinen Beitrag zu Vom Prater aus",
  text: "",
  html: `<html><body><b>Hallo,</b>

  <p>danke, dass du deine Erinnerung bei Vom Prater aus erstellt hast!</p>

  <p>Solange du deine Erinnerung noch nicht final eingereicht hast, kannst du sie jederzeit mit dem folgenden Link bearbeiten:</p>

  <p>Link zum Bearbeiten:: <a href="<%= story.link %>"><%= story.title %></a></p>

  <p>Bitte bewahre diese E-Mail sicher auf. Wenn du deinen Link verlierst, kannst du deine Erinnerung nicht mehr bearbeiten.</p>

  <p>Falls du Fragen hast, kontaktiere uns unter <a href="mailto:vomprateraus@pratergalerie.de">vomprateraus@pratergalerie.de</a>.</p>

  <p>Viele Grüße,<br>
  Dein Vom Prater aus-Team</p>
  </body></html>`,
};

export const createdTemplateEn: EmailTemplate = {
  subject: "Thank you for contributing to Vom Prater aus",
  text: "",
  html: `<html><body><b>Hello,</b>

  <p>Thank you for creating your memory with Vom Prater aus!</p>

  <p>As long as you haven’t submitted your memory yet, you can edit it at any time using the following link :</p>

  <p>Edit link: <a href="<%= story.link %>"><%= story.title %></a></p>

  <p>Please keep this email safe. If you lose your link, you won’t be able to edit your memory anymore.</p>

  <p>If you have any questions, feel free to contact us at <a href="mailto:vomprateraus@pratergalerie.de">vomprateraus@pratergalerie.de</a>.</p>

  <p>Best regards,<br>
  Your Vom Prater aus team</p>
  </body></html>`,
};

export const submittedTemplateDe: EmailTemplate = {
  subject: "Dein Beitrag wird überprüft",
  text: "",
  html: `<html><body><b>Hallo,</b>

  <p>Danke, dass du deine Erinnerung bei Vom Prater aus eingereicht hast! Sie wird nun von uns überprüft und kann nicht mehr von dir bearbeitet werden. Nach unserer Freigabe wird dein Beitrag veröffentlicht. Du erhältst eine E-Mail, sobald der Moderationsprozess abgeschlossen ist.</p>

  <p>Falls du Fragen hast, kontaktiere uns unter <a href="mailto:vomprateraus@pratergalerie.de">vomprateraus@pratergalerie.de</a>.</p>

  <p>Viele Grüße,<br>
  Dein Vom Prater aus-Team</p>
  </body></html>`,
};

export const submittedTemplateEn: EmailTemplate = {
  subject: "Your submission is being reviewed",
  text: "",
  html: `<html><body><b>Hello,</b>

  <p>Thank you for submitting your memory to Vom Prater aus! It is now being reviewed by our team and can no longer be edited by you. Once it has been approved, it will be published. You will receive an email as soon as the moderation process is complete.</p>

  <p>If you have any questions, feel free to contact us at <a href="mailto:vomprateraus@pratergalerie.de">vomprateraus@pratergalerie.de</a>.</p>

  <p>Best regards,<br>
  Your Vom Prater aus team</p>
  </body></html>`,
};

export const rejectedTemplateDe: EmailTemplate = {
  subject: "Dein Beitrag konnte nicht veröffentlicht werden",
  text: "",
  html: `<html><body><b>Hallo,</b>

  <p>danke, dass du deine Erinnerung „<%= story.title %>“ eingeschickt hast. Nach genauer Prüfung müssen wir dir leider mitteilen, dass wir deinen Beitrag im Moment nicht veröffentlichen können.</p>

  <p>Die Moderator:innen haben folgenden Grund angegeben: </p>

  <p><%= reason %></p>

  <p>Aber gib nicht auf! Deine Geschichte kann jetzt wieder über diesen Link bearbeitet werden: <a href="<%= story.link %>"><%= story.title %></a>.</p>

  <p>Viele Grüße,<br>
  Dein Vom Prater aus-Team</p>
  </body></html>`,
};

export const rejectedTemplateEn: EmailTemplate = {
  subject: "Your submission could not be published",
  text: "",
  html: `<html><body><b>Hello,</b>

  <p>Thank you for submitting your memory titled “<%= story.title %>”.
  After careful review, we regret to inform you that we are currently unable to publish your contribution.</p>

  <p>The moderators have provided the following reason:</p>

  <p><%= reason %></p>

  <p>But don’t give up! You can now edit your story again here: <a href="<%= story.link %>"><%= story.title %></a>.</p>

  <p>We’re looking forward to your next story!</p>

  <p>Best regards,<br>
  Your Vom Prater aus team</p>
  </body></html>`,
};

export const acceptedTemplateDe: EmailTemplate = {
  subject: "Dein Beitrag wurde veröffentlicht",
  text: "",
  html: `<html><body><b>Hallo,</b>

  <p>Wir freuen uns, dir mitteilen zu können, dass deine Geschichte veröffentlicht wurde!</p>

  <p>Du kannst deine Geschichte hier lesen: <a href="<%= story.link %>"><%= story.title %></a></p>

  <p>Vielen Dank für deinen Beitrag zu Vom Prater aus – damit hilfst du uns, ein lebendiges und vielseitiges Archiv des Berliner Praters zu erstellen.</p>

  <p>Viele Grüße,<br>
  Dein Vom Prater aus-Team</p>
  </body></html>`,
};

export const acceptedTemplateEn: EmailTemplate = {
  subject: "Your submission has been published",
  text: "",
  html: `<html><body><b>Hello,</b>

  <p>We are happy to inform you that your story has been published!</p>

  <p>You can read your story here: <a href="<%= story.link %>"><%= story.title %></a></p>

  <p>Thank you for contributing to Vom Prater aus – you help us to create a lively and diverse archive of the Berlin Prater.</p>

  <p>Best regards,<br>
  Your Vom Prater aus team</p>
  </body></html>`,
};
