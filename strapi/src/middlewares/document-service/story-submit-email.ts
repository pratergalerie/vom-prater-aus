import { errors } from "@strapi/utils";
import { submittedTemplateDe, submittedTemplateEn } from "./email-templates";

export const storySubmitEmailMiddleware = () => {
  return async (context, next) => {
    if (
      context.uid === "api::story.story" &&
      context.action === "update"
    ) {
      const documentId = context.params.documentId;
      const previousData = await strapi.documents("api::story.story").findOne({
        documentId,
        status: 'draft',
      });

      // Skip if document not found or not a draft
      if (!previousData) {
        return next();
      }

      const { lifecycleState: lifecyclePrev, authorEmail, language } = previousData;
      const { lifecycleState: lifecycleNext } = context.params.data;

      if (
        lifecyclePrev === "pending" &&
        lifecycleNext === "submitted" &&
        authorEmail
      ) {
        try {
          await strapi.plugins.email.services.email.sendTemplatedEmail(
            { to: authorEmail },
            language === "de" ? submittedTemplateDe : submittedTemplateEn,
            {}
          );
        } catch (error) {
          throw new errors.ApplicationError(`Email sending failed: ${error}`);
        }
      }
    }

    return next();
  };
};
