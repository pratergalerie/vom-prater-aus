import { factories } from "@strapi/strapi";
import * as z from "zod";

const UuidSchema = z.uuidv4();
const SlugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

export default factories.createCoreController(
  "api::story.story",
  ({ strapi }) => ({
    async findOne(ctx) {
      await this.validateQuery(ctx);

      const { id: slug } = ctx.params;

      try {
        SlugSchema.parse(slug);
      } catch (_) {
        return ctx.badRequest("Slug is in the wrong format");
      }

      const entity = await strapi.documents("api::story.story").findFirst({
        status: "published",
        filters: {
          slug,
        },
        populate: {
          sections: { populate: ["image"] },
        },
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

      return this.transformResponse(sanitizedEntity);
    },

    async findOneDraft(ctx) {
      await this.validateQuery(ctx);

      const { uuid } = ctx.params;

      try {
        UuidSchema.parse(uuid);
      } catch (_) {
        return ctx.badRequest("Slug is in the wrong format");
      }

      const entity = await strapi.documents("api::story.story").findFirst({
        status: "draft",
        filters: {
          uuid,
          lifecycleState: {
            $contains: "pending",
          },
        },
        populate: {
          sections: { populate: ["image"] },
        },
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

      return this.transformResponse(sanitizedEntity);
    },

    async updateDraft(ctx) {
      await this.validateQuery(ctx);

      const { uuid } = ctx.params;

      try {
        UuidSchema.parse(uuid);
      } catch (_) {
        return ctx.badRequest("What? is in the wrong format");
      }

      const { documentId } = await strapi
        .documents("api::story.story")
        .findFirst({
          status: "draft",
          filters: {
            uuid,
            lifecycleState: {
              $contains: "pending",
            },
          },
        });

      const entity = await strapi.documents("api::story.story").update({
        documentId: documentId,
        data: ctx.request.body,
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

      return this.transformResponse(sanitizedEntity);
    },
  })
);
