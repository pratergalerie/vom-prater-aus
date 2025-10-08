export const storyLifecycleMiddleware = () => {
  return async (context, next) => {
    const isDraft = context.params.status === "draft";

    if (isDraft) {
      // Story 'lifecycleState: created' -> 'lifecycleState: pending'
      if (context.uid === "api::story.story" && context.action === "create") {
        context.params.data.lifecycleState = "pending";
      }

      if (context.uid === "api::story.story" && context.action === "update") {
        const documentId = context.params.documentId;
        const previousData = await strapi
          .documents("api::story.story")
          .findOne({
            documentId,
          });

        const { reviewState: reviewStatePrev } = previousData;
        const { reviewState: reviewStateNext } = context.params.data;
        const { lifecycleState: lifecyclePrev } = previousData;
        const { lifecycleState: lifecycleNext } = context.params.data;

        // Story 'lifecycleState: pending' -> 'lifecycleState: submitted'
        // - Reset 'reviewState' to 'pending'
        // - Clear 'rejectionReason'
        if (lifecyclePrev === "pending" && lifecycleNext === "submitted") {
          context.params.data.reviewState = "pending";
          context.params.data.rejectionReason = null;
        }

        // Story 'reviewState: reject' -> 'lifecycleState: pending'
        if (reviewStatePrev === "pending" && reviewStateNext === "rejected") {
          context.params.data.lifecycleState = "pending";
        }
      }
    }

    // Story is published
    // - Set 'lifecycleState' to 'submitted'
    // - Set 'reviewState' to 'approved'
    if (context.uid === "api::story.story" && context.action === "publish") {
      const documentId = context.params.documentId;

      // We need to update the story using the document service API because published stories don't have data in the middleware context.
      // We can't use 'context.action === "update" because there is no way to find out if the story is being published or updated.
      await strapi.documents("api::story.story").update({
        documentId,
        data: {
          lifecycleState: "submitted",
          reviewState: "accepted",
        },
      });
    }

    return next();
  };
};
