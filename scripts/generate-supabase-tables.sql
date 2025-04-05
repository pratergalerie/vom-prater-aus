-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Authors table (maps to Author type)
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Keywords table (maps to Keyword type)
CREATE TABLE keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Stories table (maps to Story type)
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  modified_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT year_check CHECK (year >= 1000 AND year <= 9999)
);

-- Story pages table (maps to StoryPage type)
CREATE TABLE story_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  layout TEXT NOT NULL,
  text TEXT,
  image TEXT,
  page_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT layout_check CHECK (layout IN ('text', 'image', 'text-over-image', 'image-over-text'))
);

-- Stories to Keywords junction table (many-to-many relationship)
CREATE TABLE stories_keywords (
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (story_id, keyword_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_stories_author_id ON stories(author_id);
CREATE INDEX idx_story_pages_story_id ON story_pages(story_id);
CREATE INDEX idx_stories_keywords_story_id ON stories_keywords(story_id);
CREATE INDEX idx_stories_keywords_keyword_id ON stories_keywords(keyword_id);

-- Add trigger for updating modified_at timestamp
CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stories_modified_at
    BEFORE UPDATE ON stories
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_at_column();