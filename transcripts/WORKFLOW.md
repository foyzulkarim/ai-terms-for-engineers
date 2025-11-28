# Workflow Guide: Publishing Video Episodes

This guide explains how to publish a new episode in the AI Terms for Software Engineers series.

## 📋 Publishing a New Episode

### Step 1: Record and Upload Video
1. Record your video covering the topic
2. Upload to YouTube
3. Add to the "AI Terms for Software Engineers" playlist
4. Note the video URL and publish date

### Step 2: Create Episode Transcript File

1. Copy the `TEMPLATE.md` file
2. Rename it following the pattern: `episode-XX-topic-name.md`
3. Fill in the metadata:
   - Video URL
   - Duration
   - Publish date
   - Overview

### Step 3: Add Your Transcript

You can structure your transcript in two ways:

#### Option A: Structured Format (Recommended)
Break down your transcript into sections:
- Key Concepts
- Real-World Applications
- Practical Examples
- Key Takeaways
- Full Transcript with timestamps

#### Option B: Simple Format
Just paste the full transcript under a "Transcript" heading

### Step 4: Update the Index

Edit `transcripts/README.md` and update:
1. The episode link in the table of contents
2. The video URL for that episode
3. Any cross-references to related episodes

### Step 5: Update Navigation Links

In your episode file, update:
- **Previous:** Link to previous episode
- **Next:** Link to next episode

### Step 6: Commit and Push

```bash
git add transcripts/
git commit -m "docs: add transcript for episode XX - [topic name]"
git push
```

## 🎨 Adding YouTube Thumbnail to README

### One-time setup:

1. Create or download your YouTube playlist thumbnail
2. Save it as `images/youtube-thumbnail.png`
3. Update both instances of `YOUR_YOUTUBE_PLAYLIST_URL` in `README.md` with your actual playlist URL

```bash
# Add the thumbnail
git add images/youtube-thumbnail.png

# Update README.md with your playlist URL
# Then commit
git commit -m "docs: add YouTube series thumbnail and playlist link"
git push
```

## 📝 Transcript Tips

### Best Practices:

1. **Use timestamps** - Helps viewers jump to specific sections
2. **Add code blocks** - Format code examples properly with syntax highlighting
3. **Include visuals** - Reference slides or diagrams from your presentation
4. **Link related episodes** - Cross-reference other episodes when mentioning related concepts
5. **Highlight key points** - Use bold, bullet points, and emojis for scanability

### Example Timestamp Format:

```markdown
### Introduction (00:00)

Hello everyone, in this episode we're going to talk about...

### Main Concept (02:30)

Now let's dive into the core concept...

### Code Example (05:45)

Here's how this looks in practice:
```

## 🔄 Batch Publishing Multiple Episodes

If you have multiple episodes ready:

1. Create all episode files at once
2. Update the index file with all URLs
3. Commit everything together:

```bash
git add transcripts/
git commit -m "docs: add transcripts for episodes 1-3"
git push
```

## 📊 Progress Tracking

You can track your progress by checking off episodes in the index:

- ✅ Episode published with transcript
- 📝 Video published, transcript pending
- 🎬 Recording in progress
- ⏳ Not started

## 🎯 End Goal: The Complete Handbook

After all 26 episodes are published, you'll have:

1. **26 individual transcripts** - Each searchable and readable on GitHub
2. **A complete handbook** - Read sequentially from episode 1-26
3. **Cross-referenced knowledge base** - Episodes link to related concepts
4. **Video + Text learning** - Users can watch, read, or both

### Optional: Create a Compiled Handbook

You could later create a `handbook/README.md` that combines all transcripts into a single document for easier reading/downloading.

---

**Questions?** Open an issue or refer to the [TEMPLATE.md](TEMPLATE.md) for the episode structure.
