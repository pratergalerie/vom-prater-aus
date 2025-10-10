export default ({ env }) => ({
  email: {
    config: {
      provider: "strapi-provider-email-mailpit",
      providerOptions: {
        baseUrl: "http://mailpit:8025",
      },
      settings: {
        defaultFrom: "vomprateraus@pratergalerie.de",
        defaultFromName: "Vom Prater Aus",
        defaultReplyTo: "vomprateraus@pratergalerie.de",
        defaultReplyToName: "Vom Prater Aus",
      },
    },
  },
});
