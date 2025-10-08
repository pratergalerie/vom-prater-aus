import type { Core } from "@strapi/strapi";
import { storyCreateEmailMiddleware } from "./middlewares/document-service/story-create-email";
import { storyLifecycleMiddleware } from "./middlewares/document-service/story-lifecyle";
import { storyReviewEmailMiddleware } from "./middlewares/document-service/story-review-email";
import { storySubmitEmailMiddleware } from "./middlewares/document-service/story-submit-email";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    const middlewares = [
      storyLifecycleMiddleware,
      storyCreateEmailMiddleware,
      storySubmitEmailMiddleware,
      storyReviewEmailMiddleware,
      // Must be done last
      storyLifecycleMiddleware,
    ];

    for (const middleware of middlewares) {
      strapi.documents.use(middleware());
    }
  },
  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
