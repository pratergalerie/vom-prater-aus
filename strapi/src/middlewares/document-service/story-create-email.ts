import { errors } from "@strapi/utils";
import { createdTemplateDe, createdTemplateEn } from "./email-templates";

export const storyCreateEmailMiddleware = () => {
  return async (context, next) => {
    if (context.uid === "api::story.story" && context.action === "create") {
      const isCreatedByUser = context.params.populate?.createdBy === undefined;

      if (isCreatedByUser) {
        const { authorEmail, title, uuid, language } = context.params.data;

        try {
          await strapi.plugins.email.services.email.sendTemplatedEmail(
            { to: authorEmail },
            language === "de" ? createdTemplateDe : createdTemplateEn,
            { story: { title, link: uuid } },
          );
        } catch (error) {
          throw new errors.ApplicationError(`Email sending failed: ${error}`);
        }
      }
    }

    return next();
  };
};
