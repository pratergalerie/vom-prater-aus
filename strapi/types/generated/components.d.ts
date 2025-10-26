import type { Schema, Struct } from '@strapi/strapi';

export interface StoryComponentsPage extends Struct.ComponentSchema {
  collectionName: 'components_story_components_pages';
  info: {
    displayName: 'Section';
    icon: 'file';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files'>;
    text: Schema.Attribute.Text;
    type: Schema.Attribute.Enumeration<['image', 'image-text', 'text']> &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'story-components.page': StoryComponentsPage;
    }
  }
}
