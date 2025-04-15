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