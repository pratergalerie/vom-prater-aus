export default ({ env }) => ({
  email: {
    config: {
      provider: "strapi-provider-email-brevo",
      providerOptions: {
        apiKey: env('BREVO_API_KEY'),
      },
      settings: {
        defaultSenderEmail: "vomprateraus@pratergalerie.de",
        defaultSenderName: "Vom Prater Aus",
        defaultReplyTo: "vomprateraus@pratergalerie.de",
      },
    },
  },
});
