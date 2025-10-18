import { errors } from "@strapi/utils";
import { submittedTemplateDe, submittedTemplateEn } from "./email-templates";

export const storySubmitEmailMiddleware = () => {
  return async (context, next) => {
    const isDraft = context.params.status === "draft";

    if (
      context.uid === "api::story.story" &&
      context.action === "update" &&
      isDraft
    ) {
      const documentId = context.params.documentId;
      const previousData = await strapi.documents("api::story.story").findOne({
        documentId,
      });

      const { lifecycleState: lifecyclePrev } = previousData;
      const {
        lifecycleState: lifecycleNext,
        authorEmail,
        language,
      } = context.params.data;

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
