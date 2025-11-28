# Workflow Guide: Publishing Video Episodes

Simple workflow for adding transcripts to your video series.

## 📋 Publishing a New Episode

### Step 1: Record and Upload Video
1. Record your video
2. Upload to YouTube
3. Add to your playlist
4. Note the video URL

### Step 2: Create Transcript File

Copy `TEMPLATE.md` and rename it:
```
episode-XX-topic-name.md
```

Example: `episode-01-machine-learning.md`

### Step 3: Paste Your Transcript

1. Open your new episode file
2. Update the title and video URL
3. Paste your transcript under the "Transcript" heading
4. Done!

### Step 4: Update the Index (Optional)

If you want the transcript index to link to your video:
1. Edit `transcripts/README.md`
2. Update the video URL for that episode

### Step 5: Commit and Push

```bash
git add transcripts/
git commit -m "docs: add transcript for episode XX"
git push
```

## 🎯 That's It!

The simpler the better. Your YouTube playlist handles:
- Episode order
- Navigation between videos
- Descriptions and metadata

This repo just needs:
- The transcript text
- A link back to the video

## 💡 Tips

- Use YouTube's auto-transcript feature as a starting point
- Clean it up for readability
- Don't worry about formatting - plain text is fine
- The transcript helps with SEO and accessibility

---

**Questions?** Just paste transcripts and commit. Keep it simple!
