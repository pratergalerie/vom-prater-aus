// Script to upload initial images to Supabase Storage
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role key for admin access

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define the bucket name
const BUCKET_NAME = "content-storage";

// Define the images to upload
const images = [
  {
    name: "berliner-prater.jpeg",
    sourcePath: "/app/initial-data/pages/home/images/berliner-prater.jpeg",
    contentType: "image/jpeg",
  },
  {
    name: "create-story.jpeg",
    sourcePath: "/app/initial-data/pages/home/images/create-story.jpeg",
    contentType: "image/jpeg",
  },
];

async function uploadImage(image) {
  try {
    // Check if file exists
    if (!fs.existsSync(image.sourcePath)) {
      console.error(`Error: File not found: ${image.sourcePath}`);
      return null;
    }

    // Read the file
    const fileBuffer = fs.readFileSync(image.sourcePath);

    // Upload using the Supabase client directly
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(image.name, fileBuffer, {
        contentType: image.contentType,
        upsert: true,
      });

    if (error) {
      console.error(`Error uploading ${image.name}:`, error);
      return null;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(image.name);

    console.log(`Successfully uploaded ${image.name} to ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`Error processing ${image.name}:`, error);
    return null;
  }
}

async function main() {
  // Upload images and collect URLs
  const imageUrls = {};

  for (const image of images) {
    const publicUrl = await uploadImage(image);
    if (publicUrl) {
      imageUrls[image.name] = publicUrl;
    }
  }

  // Write the URLs to a file that can be used by the SQL script
  const outputPath = path.join(__dirname, "image_urls.json");
  fs.writeFileSync(outputPath, JSON.stringify(imageUrls, null, 2));

  console.log(`Image URLs written to ${outputPath}`);
  console.log("Image URLs:");
  console.log(JSON.stringify(imageUrls, null, 2));
}

main().catch(console.error);
