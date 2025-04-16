-- Check if locales table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM locales LIMIT 1) THEN
    -- Insert initial locales
    INSERT INTO locales (code, name)
    VALUES 
      ('en', 'English'),
      ('de', 'Deutsch');
  END IF;
END $$;

-- Check if pages table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pages LIMIT 1) THEN
    -- Insert initial pages
    INSERT INTO pages (slug)
    VALUES ('home');
  END IF;
END $$;

-- Check if sections table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM sections LIMIT 1) THEN
    -- Insert sections for home page
    INSERT INTO sections (page_id, type, name, "order")
    SELECT 
      p.id,
      type,
      name,
      "order"
    FROM pages p
    CROSS JOIN (
      VALUES 
        ('hero', 'stories', 1),
        ('text_block', 'berliner-prater', 2),
        ('cta', 'create-story', 3)
    ) AS sections(type, name, "order")
    WHERE p.slug = 'home';
  END IF;
END $$;

-- Check if section_content table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM section_content LIMIT 1) THEN
    -- Insert content for home page sections
    INSERT INTO section_content (
      section_id, 
      locale_id, 
      title, 
      text, 
      button_label, 
      button_link, 
      image_src, 
      image_alt
    )
    SELECT 
      s.id,
      l.id,
      CASE 
        WHEN s.name = 'stories' AND l.code = 'en' THEN 'Featured Stories'
        WHEN s.name = 'stories' AND l.code = 'de' THEN 'Ausgewählte Geschichten'
        WHEN s.name = 'berliner-prater' AND l.code = 'en' THEN 'Berliner Prater'
        WHEN s.name = 'berliner-prater' AND l.code = 'de' THEN 'Berliner Prater'
        WHEN s.name = 'create-story' AND l.code = 'en' THEN 'Create Your Story'
        WHEN s.name = 'create-story' AND l.code = 'de' THEN 'Erstellen Sie Ihre Geschichte'
      END,
      CASE 
        WHEN s.name = 'stories' AND l.code = 'en' THEN ARRAY['Discover the unique stories shared by our community members.']
        WHEN s.name = 'stories' AND l.code = 'de' THEN ARRAY['Entdecken Sie die einzigartigen Geschichten, die von unseren Community-Mitgliedern geteilt wurden.']
        WHEN s.name = 'berliner-prater' AND l.code = 'en' THEN ARRAY['The Berliner Prater is a historic amusement park in Berlin, Germany.', 'It was established in 1833 and is one of the oldest amusement parks in Germany.']
        WHEN s.name = 'berliner-prater' AND l.code = 'de' THEN ARRAY['Der Berliner Prater ist ein historischer Vergnügungspark in Berlin, Deutschland.', 'Er wurde 1833 gegründet und ist einer der ältesten Vergnügungsparks in Deutschland.']
        WHEN s.name = 'create-story' AND l.code = 'en' THEN ARRAY['Share your memories and experiences about the Berliner Prater with our community.']
        WHEN s.name = 'create-story' AND l.code = 'de' THEN ARRAY['Teilen Sie Ihre Erinnerungen und Erfahrungen über den Berliner Prater mit unserer Community.']
      END,
      CASE 
        WHEN s.name = 'stories' AND l.code = 'en' THEN 'View Stories'
        WHEN s.name = 'stories' AND l.code = 'de' THEN 'Geschichten ansehen'
        WHEN s.name = 'berliner-prater' AND l.code = 'en' THEN 'Learn More'
        WHEN s.name = 'berliner-prater' AND l.code = 'de' THEN 'Mehr erfahren'
        WHEN s.name = 'create-story' AND l.code = 'en' THEN 'Create Story'
        WHEN s.name = 'create-story' AND l.code = 'de' THEN 'Geschichte erstellen'
      END,
      CASE 
        WHEN s.name = 'stories' THEN '/stories'
        WHEN s.name = 'berliner-prater' THEN '/about'
        WHEN s.name = 'create-story' THEN '/stories/create'
      END,
      CASE 
        WHEN s.name = 'stories' THEN '/images/stories-section.jpg'
        WHEN s.name = 'berliner-prater' THEN '/images/berliner-prater-section.jpg'
        WHEN s.name = 'create-story' THEN '/images/create-story-section.jpg'
      END,
      CASE 
        WHEN s.name = 'stories' AND l.code = 'en' THEN 'Featured Stories Section'
        WHEN s.name = 'stories' AND l.code = 'de' THEN 'Ausgewählte Geschichten Sektion'
        WHEN s.name = 'berliner-prater' AND l.code = 'en' THEN 'Berliner Prater Section'
        WHEN s.name = 'berliner-prater' AND l.code = 'de' THEN 'Berliner Prater Sektion'
        WHEN s.name = 'create-story' AND l.code = 'en' THEN 'Create Your Story Section'
        WHEN s.name = 'create-story' AND l.code = 'de' THEN 'Erstellen Sie Ihre Geschichte Sektion'
      END
    FROM 
      sections s
    CROSS JOIN 
      locales l
    WHERE 
      s.name IN ('stories', 'berliner-prater', 'create-story')
    ON CONFLICT (section_id, locale_id) DO NOTHING;
  END IF;
END $$;