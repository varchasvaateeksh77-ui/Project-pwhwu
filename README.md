# For Rishika — Interactive Proposal Site

A single-file (`index.html`), mobile-first 7-chapter interactive love letter and proposal experience designed for Rishika.

## How to Edit `CONFIG`

Open `index.html` in any text editor and scroll to the `/* ===== CONFIG ===== */` section inside the `<script>` tag:

- **`CONFIG.herName`**: `"Rishika"`
- **`CONFIG.metDateISO`**: `"2026-10-07"` (used by Chapter 2's live day counter in her local timezone)
- **`CONFIG.videoId`**: `"frmal9gVzJw"` (YouTube video ID for the Song page in Chapter 4c)
- **`CONFIG.chatUrl`**: `"https://ig.me/m/trytofindvxrchsva__"` (opened by the "Open our chat" button on Chapter 7d; leave `""` to hide the button)
- **`CONFIG.notes`**: The 4 paper notes on Chapter 3
- **`CONFIG.bouquet`**: The 8 alternating sunflower and lily lines revealed stem-by-stem on Chapter 6
- **`CONFIG.letter`**: The full lowercase letter typed block-by-block on `#/4/letter`

## How to Deploy on Netlify

Because the entire experience (HTML, CSS, hand-inked SVGs, and JS) lives inside a single self-contained `index.html` file:

1. Put `index.html` into an empty folder on your computer.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop that folder onto the page.
4. Netlify will immediately give you a live HTTPS link you can send to her on Instagram.
