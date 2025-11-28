# Script Usage Guide

## Quick Start: Adding a New Episode

### Step 1: Edit `add-episode.js`

Open `add-episode.js` and update the `EPISODE` object at the top:

```javascript
const EPISODE = {
  number: 1,                    // Episode number
  title: 'Your Episode Title',  // Full title (can include Bengali/English)
  youtubeUrl: 'https://youtu.be/xxxxx',
  transcript: `Your transcript here...`
};
```

### Step 2: Run the Script

```bash
node add-episode.js
```

That's it! The script will:
- ✅ Create the episode file with proper naming
- ✅ Format it using the template
- ✅ Tell you what to do next

### Step 3: Commit and Push

```bash
git add transcripts/
git commit -m "docs: add transcript for episode X"
git push
```

## Example

```javascript
const EPISODE = {
  number: 2,
  title: 'Transformers | ট্রান্সফর্মার আর্কিটেকচার',
  youtubeUrl: 'https://youtu.be/abc123',
  transcript: `Your full transcript...

Can be multiple paragraphs...

In any language...`
};
```

## Tips

1. **Title format**: Use `|` to separate Bengali and English parts
   - Script uses the English part for the filename
   - Full title appears in the document

2. **Transcript**: Just paste it directly - no formatting needed
   - Newlines are preserved
   - Unicode (Bengali) works perfectly

3. **YouTube URL**: Both formats work:
   - `https://youtu.be/xxxxx`
   - `https://www.youtube.com/watch?v=xxxxx`

## Troubleshooting

**Q: What if I need to edit an episode later?**
A: Just edit the markdown file directly in `transcripts/episode-XX-name.md`

**Q: Can I add multiple episodes at once?**
A: Edit the EPISODE object, run the script, then edit it again for the next episode.

**Q: How do I delete the old template episode?**
A: `rm transcripts/episode-01-machine-learning.md` (if you created it with the old template)

---

**That's all!** Much simpler than remembering the manual workflow. 🎉
