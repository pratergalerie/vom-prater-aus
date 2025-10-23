export default {
  routes: [
    {
      method: "GET",
      path: "/draft-stories/:uuid",
      handler: "api::story.story.findOneDraft",
      config: {},
    },
    {
      method: "PUT",
      path: "/draft-stories/:uuid",
      handler: "api::story.story.updateDraft",
      config: {},
    },
  ],
};
