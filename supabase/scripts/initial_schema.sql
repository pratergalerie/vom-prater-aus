-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Enable UUID extension in the extensions schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Locales table to store supported locales
CREATE TABLE IF NOT EXISTS locales (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

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
  word TEXT NOT NULL,
  locale_id UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(word, locale_id)
);

-- Stories table (maps to Story type)
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  locale_id UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  featured_image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  quote TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  modified_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT year_check CHECK (year >= 1000 AND year <= 9999),
  CONSTRAINT status_check CHECK (status IN ('draft', 'submitted', 'approved', 'rejected'))
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

-- Pages table to define all available pages
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Sections table to define different types of content sections
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(page_id, name)
);

-- Section content table for localized content
CREATE TABLE IF NOT EXISTS section_content (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  locale_id UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  title TEXT,
  subtitle TEXT,
  text TEXT[], -- Array of paragraphs
  button_label TEXT,
  button_link TEXT,
  image_src TEXT,
  image_alt TEXT,
  additional_content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(section_id, locale_id)
);

