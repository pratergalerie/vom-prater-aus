# Initial Data for VomPraterAus

This directory contains JSON files that define the initial data for the VomPraterAus website. These files are used to generate the SQL statements that populate the database during initialization.

## File Structure

- `locales.json`: Defines the supported locales (languages)
- `pages.json`: Defines the available pages
- `sections.json`: Defines the sections for each page
- `section_content.json`: Defines the localized content for each section

## How to Use

1. Edit the JSON files to update the content
2. Run the generator script to create the SQL file:

```bash
cd supabase/scripts
npm run generate-data
```

This will generate the `initial_data.sql` file in the `supabase/scripts` directory, which will be used by Docker to initialize the database.

## JSON Structure

### locales.json

```json
[
  {
    "code": "en",
    "name": "English"
  },
  {
    "code": "de",
    "name": "Deutsch"
  }
]
```

### pages.json

```json
[
  {
    "slug": "home"
  }
]
```

### sections.json

```json
[
  {
    "page_slug": "home",
    "type": "hero",
    "name": "stories",
    "order": 1
  }
]
```

### section_content.json

```json
[
  {
    "section_name": "stories",
    "locale_code": "en",
    "title": "Featured Stories",
    "text": ["Discover the unique stories shared by our community members."],
    "button_label": "View Stories",
    "button_link": "/stories",
    "image_src": null,
    "image_alt": "Featured Stories Section"
  }
]
```

## Adding New Content

To add new content:

1. Add new entries to the appropriate JSON files
2. Run the generator script
3. Restart the Docker containers to apply the changes

## Notes

- The generator script will only generate SQL for tables that are empty, so it won't overwrite existing data
- Make sure to follow the same structure when adding new content
- For images, use the full URL to the image in the storage bucket
