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

-- Check if homepage table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM homepage LIMIT 1) THEN
    -- Insert initial homepage sections
    INSERT INTO homepage (section_name)
    VALUES 
      ('stories'),
      ('berliner_prater'),
      ('create_story');
  END IF;
END $$;

-- Check if homepage_section table is empty before inserting data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM homepage_section LIMIT 1) THEN
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
  END IF;
END $$; 