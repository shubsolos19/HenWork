require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setup() {
  // Create bucket if not exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.find(b => b.name === 'avatars');
  
  if (!exists) {
    console.log('Creating avatars bucket...');
    const { error } = await supabase.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png']
    });
    if (error) console.error('Error creating bucket:', error);
    else console.log('Bucket created successfully.');
  } else {
    console.log('Avatars bucket already exists.');
  }

  // Create column if not exists
  console.log('Adding profile_picture_url column...');
  const { error: dbError } = await supabase.rpc('exec_sql', {
    query: 'ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_picture_url text;'
  });
  
  if (dbError) {
    console.log('RPC exec_sql not found, trying raw query or ignoring. If it fails, we will map profile_picture_url to avatar_url.');
  } else {
    console.log('Column added successfully.');
  }
}

setup();
