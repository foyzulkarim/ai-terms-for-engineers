#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

async function getEpisodeConfig() {
  // Check if running in CI with VIDEO_URL
  const videoUrl = process.env.VIDEO_URL;

  if (videoUrl) {
    // CI mode: fetch title from YouTube
    console.log('🔍 Fetching video details from YouTube...\n');
    const videoId = extractVideoId(videoUrl);
    const videoDetails = await fetchVideoDetails(videoId);
    const episodeNumber = determineNextEpisodeNumber();

    return {
      number: episodeNumber,
      title: videoDetails.title,
      youtubeUrl: videoUrl,
      transcript: `Paste your transcript here...`
    };
  } else {
    // Manual mode: use hardcoded values (for local testing)
    return {
      number: 0,  // Change this to your episode number
      title: 'Episode Title Here',
      youtubeUrl: 'https://youtu.be/xxxxx',
      transcript: `Paste your transcript here...`
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function checkForDuplicate(videoId) {
  const transcriptsDir = path.join(__dirname, 'transcripts');
  
  // If transcripts directory doesn't exist, no duplicates possible
  if (!fs.existsSync(transcriptsDir)) {
    return null;
  }

  const files = fs.readdirSync(transcriptsDir)
    .filter(file => file.startsWith('episode-') && file.endsWith('.md'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(transcriptsDir, file), 'utf8');
    if (content.includes(videoId)) {
      return file;
    }
  }

  return null;
}

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  throw new Error('Invalid YouTube URL');
}

async function fetchVideoDetails(videoId) {
  const response = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch video details from YouTube');
  }

  const data = await response.json();

  return {
    title: data.title,
    author: data.author_name,
  };
}

function determineNextEpisodeNumber() {
  const transcriptsDir = path.join(__dirname, 'transcripts');

  // If transcripts directory doesn't exist, start at 1
  if (!fs.existsSync(transcriptsDir)) {
    return 1;
  }

  // Read all episode files
  const files = fs.readdirSync(transcriptsDir)
    .filter(file => file.startsWith('episode-') && file.endsWith('.md'));

  if (files.length === 0) {
    return 1;
  }

  // Extract episode numbers and find the max
  const episodeNumbers = files.map(file => {
    const match = file.match(/episode-(\d+)-/);
    return match ? parseInt(match[1], 10) : 0;
  });

  const maxEpisodeNumber = Math.max(...episodeNumbers);
  return maxEpisodeNumber + 1;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .replace(/^-+|-+$/g, '')   // Trim dashes from start/end
    .trim();
}

function createEpisodeFile(episode) {
  const episodeNum = String(episode.number).padStart(2, '0');

  // Extract English part of title for filename
  const titleParts = episode.title.split('|');
  const englishTitle = titleParts.length > 1 ? titleParts[1].trim() : titleParts[0];
  const slug = slugify(englishTitle);

  const filename = `episode-${episodeNum}-${slug}.md`;
  const filepath = path.join(__dirname, 'transcripts', filename);

  // Check if file exists
  if (fs.existsSync(filepath)) {
    console.warn(`⚠️  Warning: ${filename} already exists`);
    console.log('    Overwriting file...\n');
  }

  const content = `# Episode ${episodeNum}: ${episode.title}

**Watch:** [YouTube](${episode.youtubeUrl})

---

## Transcript

${episode.transcript}
`;

  try {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ Created: ${filename}`);
    return filename;
  } catch (error) {
    console.error(`❌ Error creating file: ${error.message}`);
    process.exit(1);
  }
}

function updateReadme(episode, filename) {
  const readmePath = path.join(__dirname, 'transcripts', 'README.md');

  try {
    let readme = fs.readFileSync(readmePath, 'utf8');

    const episodeNum = String(episode.number).padStart(2, '0');

    // Check if episode already exists in README
    if (readme.includes(`Episode ${episodeNum}:`)) {
      console.warn(`⚠️  Warning: Episode ${episodeNum} already exists in README`);
      console.log('    Skipping README update to avoid duplicates.\n');
      return;
    }

    const episodeLine = `- [Episode ${episodeNum}: ${episode.title}](${filename}) | [🎥 Watch](${episode.youtubeUrl})`;

    // Find the Episodes section and add the new episode
    const episodesMarker = '## 📚 Episodes';
    const episodesIndex = readme.indexOf(episodesMarker);

    if (episodesIndex === -1) {
      console.error('❌ Error: Could not find Episodes section in README');
      console.log('    Please update transcripts/README.md manually.\n');
      return;
    }

    // Find the next section after Episodes
    const nextSectionIndex = readme.indexOf('\n## ', episodesIndex + episodesMarker.length);

    // Insert the new episode before the next section
    const insertPosition = nextSectionIndex;
    const updatedReadme =
      readme.slice(0, insertPosition) +
      episodeLine + '\n' +
      readme.slice(insertPosition);

    fs.writeFileSync(readmePath, updatedReadme, 'utf8');
    console.log('✅ Updated: transcripts/README.md');
  } catch (error) {
    console.error(`❌ Error updating README: ${error.message}`);
    console.log('    Please update transcripts/README.md manually.\n');
  }
}

async function main() {
  console.log('\n🚀 Adding Episode to Transcripts...\n');

  // Get episode configuration (from CI or manual)
  const EPISODE = await getEpisodeConfig();

  // Validate episode data
  if (!EPISODE.number || EPISODE.number === 0) {
    console.error('❌ Error: Could not determine episode number');
    process.exit(1);
  }

  // Check for duplicate video URL
  try {
    const videoId = extractVideoId(EPISODE.youtubeUrl);
    const existingFile = checkForDuplicate(videoId);
    if (existingFile) {
      console.error(`❌ Error: This video has already been added in ${existingFile}`);
      process.exit(1);
    }
  } catch (error) {
    // If it's an invalid URL, the validation below will catch it
    // We don't need to handle it here
  }

  if (EPISODE.number < 1 || EPISODE.number > 100) {
    console.warn(`⚠️  Warning: Episode number ${EPISODE.number} is outside typical range (1-100)`);
    console.log('    Continuing anyway...\n');
  }

  if (!EPISODE.title || !EPISODE.youtubeUrl || !EPISODE.transcript) {
    console.error('❌ Error: Missing episode fields (title, youtubeUrl, or transcript)');
    process.exit(1);
  }

  if (EPISODE.title === 'Episode Title Here' || EPISODE.youtubeUrl === 'https://youtu.be/xxxxx') {
    console.error('❌ Error: Please update the placeholder values in EPISODE object');
    process.exit(1);
  }

  // Create transcripts directory if it doesn't exist
  const transcriptsDir = path.join(__dirname, 'transcripts');
  if (!fs.existsSync(transcriptsDir)) {
    fs.mkdirSync(transcriptsDir);
  }

  // Create the episode file
  const filename = createEpisodeFile(EPISODE);

  // Update the README
  updateReadme(EPISODE, filename);

  console.log(`\n✨ Episode ${EPISODE.number} added successfully!\n`);

  if (process.env.VIDEO_URL) {
    console.log('📝 Next steps:');
    console.log('   1. Review the PR that was created');
    console.log('   2. Update the transcript in the episode file');
    console.log('   3. Merge the PR\n');
  } else {
    console.log('📝 Next steps:');
    console.log('   1. Review the files:');
    console.log('      - transcripts/' + filename);
    console.log('      - transcripts/README.md');
    console.log('   2. git add transcripts/');
    console.log(`   3. git commit -m "docs: add transcript for episode ${EPISODE.number}"`);
    console.log('   4. git push\n');
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
