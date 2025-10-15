import type { Schema, Struct } from '@strapi/strapi';

export interface StoryComponentsPage extends Struct.ComponentSchema {
  collectionName: 'components_story_components_pages';
  info: {
    displayName: 'Page';
    icon: 'file';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files'>;
    layout: Schema.Attribute.Enumeration<['text', 'image-text', 'text-image']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'image-text'>;
    text: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'story-components.page': StoryComponentsPage;
    }
  }
}
