-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Enable UUID extension in the extensions schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Authors table (maps to Author type)
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Keywords table (maps to Keyword type)
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  word TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Stories table (maps to Story type)
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  modified_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT year_check CHECK (year >= 1000 AND year <= 9999)
);

-- Story pages table (maps to StoryPage type)
CREATE TABLE IF NOT EXISTS story_pages (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  layout TEXT NOT NULL,
  text TEXT,
  image TEXT,
  page_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT layout_check CHECK (layout IN ('text', 'image', 'text-over-image', 'image-over-text'))
);

-- Stories to Keywords junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS stories_keywords (
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (story_id, keyword_id)
);

-- Locales table to store supported locales
CREATE TABLE IF NOT EXISTS locales (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Homepage table (maps to HomepageSection type)
CREATE TABLE IF NOT EXISTS homepage (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  section_name TEXT NOT NULL UNIQUE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT section_name_check CHECK (section_name IN ('stories', 'berliner_prater', 'create_story'))
);

-- Homepage section table (maps to HomepageSectionContent type)
CREATE TABLE IF NOT EXISTS homepage_section (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES homepage(id) ON DELETE CASCADE,
  locale_id UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  title TEXT,
  paragraph TEXT,
  button_label TEXT,
  button_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT title_length_check CHECK (LENGTH(title) <= 50),
  CONSTRAINT paragraph_length_check CHECK (LENGTH(paragraph) <= 300),
  UNIQUE(section_id, locale_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_story_pages_story_id ON story_pages(story_id);
CREATE INDEX IF NOT EXISTS idx_stories_keywords_story_id ON stories_keywords(story_id);
CREATE INDEX IF NOT EXISTS idx_stories_keywords_keyword_id ON stories_keywords(keyword_id);
CREATE INDEX IF NOT EXISTS idx_homepage_section_name ON homepage(section_name);
CREATE INDEX IF NOT EXISTS idx_homepage_section_section_id ON homepage_section(section_id);
CREATE INDEX IF NOT EXISTS idx_homepage_section_locale_id ON homepage_section(locale_id);

-- Add trigger for updating modified_at timestamp
CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updating stories modified_at timestamp
DROP TRIGGER IF EXISTS update_stories_modified_at ON stories;
CREATE TRIGGER update_stories_modified_at
    BEFORE UPDATE ON stories
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at_column();

-- Add trigger for updating homepage updated_at timestamp
DROP TRIGGER IF EXISTS update_homepage_updated_at ON homepage;
CREATE TRIGGER update_homepage_updated_at
    BEFORE UPDATE ON homepage
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at_column();

-- Add trigger for updating homepage_section updated_at timestamp
DROP TRIGGER IF EXISTS update_homepage_section_updated_at ON homepage_section;
CREATE TRIGGER update_homepage_section_updated_at
    BEFORE UPDATE ON homepage_section
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at_column();

-- Insert initial locales
INSERT INTO locales (code, name)
VALUES 
  ('en', 'English'),
  ('de', 'Deutsch')
ON CONFLICT (code) DO NOTHING;

-- Insert initial homepage sections
INSERT INTO homepage (section_name)
VALUES 
  ('stories'),
  ('berliner_prater'),
  ('create_story')
ON CONFLICT (section_name) DO NOTHING;

-- Insert initial homepage content for each section and locale
INSERT INTO homepage_section (section_id, locale_id, title, paragraph, button_label, button_link)
SELECT 
  hs.id, 
  l.id,
  CASE 
    WHEN hs.section_name = 'stories' AND l.code = 'en' THEN 'Featured Stories'
    WHEN hs.section_name = 'stories' AND l.code = 'de' THEN 'Ausgewählte Geschichten'
    WHEN hs.section_name = 'berliner_prater' AND l.code = 'en' THEN 'Berliner Prater'
    WHEN hs.section_name = 'berliner_prater' AND l.code = 'de' THEN 'Berliner Prater'
    WHEN hs.section_name = 'create_story' AND l.code = 'en' THEN 'Create Your Story'
    WHEN hs.section_name = 'create_story' AND l.code = 'de' THEN 'Erstellen Sie Ihre Geschichte'
  END,
  CASE 
    WHEN hs.section_name = 'stories' AND l.code = 'en' THEN 'Discover the unique stories shared by our community members.'
    WHEN hs.section_name = 'stories' AND l.code = 'de' THEN 'Entdecken Sie die einzigartigen Geschichten, die von unseren Community-Mitgliedern geteilt wurden.'
    WHEN hs.section_name = 'berliner_prater' AND l.code = 'en' THEN 'The Berliner Prater is a historic amusement park in Berlin, Germany. It was established in 1833 and is one of the oldest amusement parks in Germany.'
    WHEN hs.section_name = 'berliner_prater' AND l.code = 'de' THEN 'Der Berliner Prater ist ein historischer Vergnügungspark in Berlin, Deutschland. Er wurde 1833 gegründet und ist einer der ältesten Vergnügungsparks in Deutschland.'
    WHEN hs.section_name = 'create_story' AND l.code = 'en' THEN 'Share your memories and experiences about the Berliner Prater with our community.'
    WHEN hs.section_name = 'create_story' AND l.code = 'de' THEN 'Teilen Sie Ihre Erinnerungen und Erfahrungen über den Berliner Prater mit unserer Community.'
  END,
  CASE 
    WHEN hs.section_name = 'stories' AND l.code = 'en' THEN 'View Stories'
    WHEN hs.section_name = 'stories' AND l.code = 'de' THEN 'Geschichten ansehen'
    WHEN hs.section_name = 'berliner_prater' AND l.code = 'en' THEN 'Learn More'
    WHEN hs.section_name = 'berliner_prater' AND l.code = 'de' THEN 'Mehr erfahren'
    WHEN hs.section_name = 'create_story' AND l.code = 'en' THEN 'Create Story'
    WHEN hs.section_name = 'create_story' AND l.code = 'de' THEN 'Geschichte erstellen'
  END,
  CASE 
    WHEN hs.section_name = 'stories' THEN '/stories'
    WHEN hs.section_name = 'berliner_prater' THEN '/about'
    WHEN hs.section_name = 'create_story' THEN '/stories/create'
  END
FROM 
  homepage hs
CROSS JOIN 
  locales l
ON CONFLICT (section_id, locale_id) DO NOTHING;
