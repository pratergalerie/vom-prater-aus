import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::story.story",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { id: slug } = ctx.params;

      const entity = await strapi.db.query("api::story.story").findOne({
        where: { slug },
        populate: {
          pages: { populate: ["image"] },
        },
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

      return this.transformResponse(sanitizedEntity);
    },
  })
);
