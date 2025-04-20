// Script to upload initial images to Supabase Storage
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
// Use the internal Docker network URL for Kong service
const supabaseUrl = process.env.SUPABASE_URL || "http://kong:8000";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role key for admin access

if (!supabaseKey) {
  console.error(
    "Error: SUPABASE_SERVICE_ROLE_KEY must be set in environment variables"
  );
  process.exit(1);
}

console.log(`Connecting to Supabase at: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

// Define the bucket names
const CONTENT_BUCKET_NAME = "content-storage";
const STORIES_BUCKET_NAME = "stories-storage";

// Define the images to upload
const contentImages = [
  {
    name: "berliner-prater.jpeg",
    sourcePath: "/app/initial-data/images/berliner-prater.jpeg",
    contentType: "image/jpeg",
    bucket: CONTENT_BUCKET_NAME,
  },
  {
    name: "create-story.jpeg",
    sourcePath: "/app/initial-data/images/create-story.jpeg",
    contentType: "image/jpeg",
    bucket: CONTENT_BUCKET_NAME,
  },
];

const storyImages = [
  {
    name: "story-1.jpeg",
    sourcePath: "/app/initial-data/images/story-1.jpeg",
    contentType: "image/jpeg",
    bucket: STORIES_BUCKET_NAME,
  },
  {
    name: "story-2a.jpeg",
    sourcePath: "/app/initial-data/images/story-2a.jpeg",
    contentType: "image/jpeg",
    bucket: STORIES_BUCKET_NAME,
  },
  {
    name: "story-2b.jpeg",
    sourcePath: "/app/initial-data/images/story-2b.jpeg",
    contentType: "image/jpeg",
    bucket: STORIES_BUCKET_NAME,
  },
  {
    name: "story-3.jpeg",
    sourcePath: "/app/initial-data/images/story-3.jpeg",
    contentType: "image/jpeg",
    bucket: STORIES_BUCKET_NAME,
  },
];

// Combine all images
const allImages = [...contentImages, ...storyImages];

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
      .from(image.bucket)
      .upload(image.name, fileBuffer, {
        contentType: image.contentType,
        upsert: true,
      });

    if (error) {
      console.error(`Error uploading ${image.name} to ${image.bucket}:`, error);
      return null;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(image.bucket).getPublicUrl(image.name);

    console.log(`Successfully uploaded ${image.name} to ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`Error processing ${image.name}:`, error);
    return null;
  }
}

async function main() {
  for (const image of allImages) {
    await uploadImage(image);
  }
}

main().catch(console.error);
