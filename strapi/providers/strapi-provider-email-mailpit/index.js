module.exports = {
  init(providerOptions = {}, settings = {}) {
    return {
      send: async (options) => {
        const {
          from,
          to,
          subject,
          html,
          text,
          cc,
          bcc,
          tags,
          replyTo,
          ...rest
        } = options;

        function emailStringToArray(array) {
          if (array.includes(",")) {
            return array.split(",").map((email) => ({
              email: email.trim(),
              name: "",
            }));
          }
          return [{ email: array, name: "" }];
        }

        const fromPayload = from
          ? { email: from, name: "" }
          : { email: settings.defaultFrom, name: settings.defaultFromName };

        const replyToPayload = replyTo
          ? [{ email: replyTo, name: "" }]
          : [
              {
                email: settings.defaultReplyTo,
                name: settings.defaultReplyToName,
              },
            ];

        const payload = {
          replyTo: replyToPayload,
          from: fromPayload,
          to: to && emailStringToArray(to),
          cc: cc && emailStringToArray(cc),
          bcc: bcc && emailStringToArray(bcc),
          subject: subject,
          text: text,
          html: html,
          tags: tags,
          ...rest,
        };

        const mailpitEndpoint = `${providerOptions.baseUrl}/api/v1/send`;

        const response = await fetch(mailpitEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Mailpit send failed: ${error.Error}`);
        } else {
          const responseBody = await response.json();
          return responseBody;
        }
      },
    };
  },
};
