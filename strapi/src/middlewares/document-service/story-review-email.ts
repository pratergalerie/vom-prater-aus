import { env, errors } from "@strapi/utils";
import {
  acceptedTemplateDe,
  acceptedTemplateEn,
  rejectedTemplateDe,
  rejectedTemplateEn,
} from "./email-templates";

export const storyReviewEmailMiddleware = () => {
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

      const { reviewState: reviewStatePrev } = previousData;
      const {
        reviewState: reviewStateNext,
        authorEmail,
        rejectionReason,
        title,
        slug,
        uuid,
        language,
      } = context.params.data;
      const url = env("PUBLIC_URL", "");

      if (reviewStatePrev === "pending" && authorEmail) {
        switch (reviewStateNext) {
          case "rejected":
            const link = `${url}/draft-stories/${uuid}`;

            try {
              await strapi.plugins.email.services.email.sendTemplatedEmail(
                { to: authorEmail },
                language === "de" ? rejectedTemplateDe : rejectedTemplateEn,
                { story: { title, link }, reason: rejectionReason }
              );
            } catch (error) {
              throw new errors.ApplicationError(
                `Email sending failed: ${error}`
              );
            }
            break;
          case "accepted": {
            const link = `${url}/stories/${slug}`;

            try {
              await strapi.plugins.email.services.email.sendTemplatedEmail(
                { to: authorEmail },
                language === "de" ? acceptedTemplateDe : acceptedTemplateEn,
                { story: { title, link } }
              );
            } catch (error) {
              throw new errors.ApplicationError(
                `Email sending failed: ${error}`
              );
            }
            break;
          }
        }
      }
    }

    return next();
  };
};
