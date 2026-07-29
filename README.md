# ☕ LetsFocus

> *Your personal focus café — where productivity meets ambiance.*

LetsFocus is a beautifully crafted, coffee-shop themed productivity app that helps you set goals, run focus sessions, track your progress, and level up as a barista the more you work. No accounts needed, no distractions — just you, your goals, and a warm cup of something.

---

## ✨ Features

### 🎯 Goal Management
- Add goals and sub-goals with a simple input
- Assign **categories** with custom colors and drink pairings
- Set **deadlines** — overdue goals show urgency color coding
- Mark goals **recurring** (daily or weekly) — they auto-reset and show a "✨ Refreshed today" badge
- **Drag to reorder** goals in the list
- Filter by category, completion status, or deadline
- **Sort** by name, deadline, category, or completion

### 📋 Order Board
- Every goal appears as a **colored sticky note** pinned to a wooden corkboard
- Note color matches the goal's category
- **Drag notes freely** around the board — positions are saved
- Double-click a note to mark it done
- Rank badge visible at the bottom of the board

### 🎯 Goal Templates
- 6 pre-built goal packs: Study Session, Work Day, Fitness Week, Creative Sprint, Personal Development, Morning Routine
- Load any template in one click — skips duplicates automatically

### ⏱ Focus Timer
- **Custom time** or **🍅 Pomodoro mode** (25 min work / 5 min break × 4 cycles)
- Click any digit on the timer to edit it inline — auto-pauses if running
- Keyboard shortcuts: `Space` pause/resume · `R` reset · `Esc` back to goals
- Progress bar with motivational quotes at milestones
- **Ambient sound presets**: ☕ Café · 🌧 Rainy Day · 🌲 Forest · 🎧 Deep Work
- Mix individual sounds with volume sliders
- Pop-out timer window for multi-tasking

### 🥤 Drink Progress Cup
- A drink fills up as your session progresses
- Drink type matches your goal's category (Study → 🍵 Matcha, Work → ☕ Coffee, etc.)
- 7 drink variants: Coffee, Matcha, Milk Tea, Orange Juice, Chamomile Tea, Smoothie, Lemonade
- Swap drink anytime with the ⟳ button
- At 100% — sparkle celebration animation

### 🏅 XP & Barista Ranking
- Earn XP for every minute focused, goal completed, and session finished
- **10 barista ranks**: Café Newcomer → Kitchen Helper → Milk Frother → Junior Barista → Latte Artist → Senior Barista → Head Barista → Café Manager → Master Roaster → Legend of the Brew
- Level-up animation: screen dims, spotlight fades in, badge flips 3D to your new rank, coffee beans rain down
- Daily XP cap of 150 base XP (bonus XP from streaks and deadlines bypass the cap)
- **Overdue streak** — consecutive overdue goals reduce XP gains (-5 to -35 XP per goal)
- **Redemption bonus** — completing a late goal still earns 50% XP

### 🏆 Achievements (30 total)
Achievements across 6 categories, each with a progress bar and XP reward:

| Category | Examples |
|----------|---------|
| 🔥 Streak | Warm Up (3 days), On Fire (7 days), Legendary (30 days) |
| 🎯 Goals | Goal Getter (10), Overachiever (25), Century (50), Legend (100) |
| ⏱ Focus Time | Deep Focus (1h), Marathon (5h), Iron Will (10h), Barista Life (25h) |
| 🍅 Pomodoro | Tomato Timer, Pomodoro Pro (10 cycles), Tomato Farm (50 cycles) |
| 🌞 Time of Day | Early Bird, Night Owl, All Day |
| ⏰ Deadlines | Sharpshooter, Deadline Crusher, Comeback Kid, Redemption Arc |

Unlocking an achievement shows a **Minecraft-style toast** — cream foam panel on the left bleeding into dark coffee parchment on the right.

### 📅 Deadlines Tab
- All goals with deadlines in one view
- Color-coded urgency: 🟢 Safe · 🟡 Soon · 🟠 Urgent · 🔴 Overdue
- Overdue streak pill on each overdue card showing current XP deduction rate
- Click to edit deadline inline

### 📊 Stats Tab
- Total focus time, sessions completed, goals done, day streak
- 7-day bar chart of daily focus time
- XP progress bar from current rank to next
- XP log with Today / Last 7 Days toggle
- Best session record

### 🏷️ Categories Tab
- Create categories with a **custom color picker** and **drink pairing**
- Category color shows on goal cards, filter tags, and bill board notes
- Grid layout with light color-tinted cards for easy identification
- Default categories: Study, Work, Fitness, Creative, Personal, Other

### 🎵 Music Setup
- 10 ambient sounds: Soft Rain, Thunder, Ocean, Forest, Fireplace, Barista, Field Wind, Writing, Keyboard, AC Hum
- Mix multiple sounds with individual volume sliders
- Quick presets save your favourite combinations
- Sounds sync to the pop-out timer window

### 🎉 Session End — Closing Time Animation
When you complete a goal or session, a wooden **OPEN → CLOSED** sign flips with a satisfying 3D swing. A rotating congratulatory quote fades in, followed by a **session notes** field to capture what you accomplished — saved to your local log.

### 🗺️ Guided Tour
- 10-step spotlight tour covers every tab and feature
- Auto-launches on first visit
- Replay anytime via the **?** button
- Each step shows bullet-point tips for that section

### ⬇ Export / Import
- Export all your goals, categories, stats, and XP as a `.json` backup file
- Import a backup to restore everything
- Accessible via ⚙ in the goals toolbar

---

## 🚀 Getting Started

LetsFocus runs entirely in the browser — no install, no server, no account required.

```
1. Open index.html in any modern browser
2. The guided tour will launch automatically on first visit
3. Add your first goal and click the ☕ coffee cup to start focusing
```

### File Structure

```
letsfocus/
├── index.html              # Main app shell + all tab HTML
├── styles-main.css         # All styles
├── script-main.js          # App bootstrap, tab switching, export/import
├── script-goals.js         # Goal CRUD, categories, recurring, drag/drop
├── script-timer.js         # Focus timer, Pomodoro, inline editing, pop-out
├── script-music.js         # Ambient sound engine
├── script-drink.js         # Drink progress cup + bill board
├── script-stats.js         # Stats tracking and rendering
├── script-xp.js            # XP engine, ranks, achievements, level-up
├── script-categories.js    # Category manager with colors and drink mapping
├── script-templates.js     # Goal template packs
└── script-tour.js          # Guided onboarding tour
```

---

## 💾 Data Storage

All data is stored in **localStorage** — nothing leaves your browser.

| Key | Contents |
|-----|----------|
| `goals` | All goals, sub-goals, deadlines, recurring settings |
| `letsfocus_categories_v2` | Custom categories with colors and drinks |
| `letsfocus_stats` | Session history, streaks, focus time |
| `letsfocus_xp` | XP total, rank, achievement progress, XP log |
| `letsfocus_volumes` | Ambient sound volume preferences |
| `letsfocus_bill_positions` | Sticky note positions on the order board |
| `letsfocus_daily_quote` | Cached daily quote (refreshed once per day) |
| `letsfocus_tour_done` | Whether the onboarding tour has been seen |

---

## ⌨️ Keyboard Shortcuts

These work while the timer page is open:

| Key | Action |
|-----|--------|
| `Space` | Pause / Resume timer |
| `R` | Reset timer |
| `Esc` | Back to goals |
| Click `HH` / `MM` / `SS` | Edit that segment inline |
| `↑` / `↓` (while editing) | Nudge value up or down |
| `Tab` | Move to next time segment |
| `Enter` | Confirm edit |

---

## 🎨 Theme

LetsFocus uses a warm **coffee-shop palette**:

| Role | Color |
|------|-------|
| Primary brown | `#8b6f47` |
| Dark espresso | `#4a3429` |
| Cream | `#f5f1eb` |
| Gold accent | `#d4a574` |
| Background | `#e8dcc8` |

Font stack: **Playfair Display** (headings/display) · **Source Sans Pro** (body)
---

## 📄 License

Post it if you want but don't copy everything. A ☕ credit is always appreciated.

---

*Built with focus, caffeine, and a lot of ☕.*
