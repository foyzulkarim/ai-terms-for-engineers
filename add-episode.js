#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ============================================================================
// EDIT THIS SECTION TO ADD A NEW EPISODE
// ============================================================================

const EPISODE = {
  number: 0,  // Change this to your episode number
  title: 'Episode Title Here',
  youtubeUrl: 'https://youtu.be/xxxxx',
  transcript: `Paste your transcript here...`
};

// ============================================================================
// NO NEED TO EDIT BELOW THIS LINE
// ============================================================================

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

function main() {
  console.log('\n🚀 Adding Episode to Transcripts...\n');

  // Validate episode data
  if (!EPISODE.number || EPISODE.number === 0) {
    console.error('❌ Error: Please set a valid episode number (1-26)');
    process.exit(1);
  }

  if (EPISODE.number < 1 || EPISODE.number > 26) {
    console.warn(`⚠️  Warning: Episode number ${EPISODE.number} is outside typical range (1-26)`);
    console.log('    Continuing anyway...\n');
  }

  if (!EPISODE.title || !EPISODE.youtubeUrl || !EPISODE.transcript) {
    console.error('❌ Error: Please fill in all episode fields (title, youtubeUrl, transcript)');
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
  console.log('📝 Next steps:');
  console.log('   1. Review the files:');
  console.log('      - transcripts/' + filename);
  console.log('      - transcripts/README.md');
  console.log('   2. git add transcripts/');
  console.log(`   3. git commit -m "docs: add transcript for episode ${EPISODE.number}"`);
  console.log('   4. git push\n');
}

main();
