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


## Drink animation checks

Run `node tests/drinks.cjs` (Node.js 18 or later) to validate drink rendering, SVG references, seeded marbling, animation resets, and Golden Hour equipment tiers. The test also generates `tests/review.html` for interactive playback and `tests/gallery.html` for collection review. These generated pages stay local and are excluded from Git.

Serve this folder locally and open `tests/review.html` to inspect the animations. See [DRINK-IMPROVEMENTS.md](DRINK-IMPROVEMENTS.md) for the drink-by-drink change record.

Run `node tests/timer-drinks.cjs` for timer/drink integration checks, including pause/resume precision, Pomodoro breaks, zero-time edits, and shared pop-out progress. The animation studio now includes Pause/Resume controls.

Run `node tests/drink-tiers.cjs` to generate a controlled three-tier comparison at `tests/tiers.html`. The latest visual decisions are documented in [DRINK-EXPERIENCE-REVIEW.md](DRINK-EXPERIENCE-REVIEW.md).

### Guided tour checks

Run `node tests/tour.cjs` to check card placement at viewport edges and side flipping.
The tour includes 19 steps, tracks scroll and resize, and restores the original tab,
scroll position and keyboard focus when closed. Timer steps preview the existing
interface without starting or resetting a session. Browser checks covered all steps
at 1280×720, 390×844 and 320×568, plus keyboard navigation and exit cleanup.

### Responsive layout

`styles-responsive.css` loads after the component styles and defines the shared
phone, tablet and desktop layout. Timer panels use content height so the drink and
sound controls remain reachable; narrow screens stack them and put the drink first.
Dialogs use the dynamic viewport height, and phone navigation wraps to expose all
tabs. Returning from the timer restores the goal page's scroll position.

Browser review covered the seven main tabs at 320, 390, 768, 1024 and 1440 CSS pixels,
the timer at those widths, and narrow-screen shop, templates, category editor and
timer setup. These are browser viewport checks, not physical iOS device tests.

### Custom timer layout
On the timer page, choose **Edit layout** to reorder the timer, drink, current goal,
ambient sounds, and quote. Drag a labelled handle or use its arrow buttons; desktop
and tablet corner handles resize height and snap between half/full width. Arrow keys
also work on move and resize handles. Phones offer Expand/Compact instead of corner
resizing. Panels remain in normal grid flow and cannot cover one another.

Layouts save in this browser separately for phone, tablet, and desktop. **Reset
layout** restores the current screen-size layout. Browser storage restrictions may
limit saving to the current visit. Run `node tests/timer-layout.cjs` for saved-layout
validation checks.


### Focus experience
- Interrupted sessions offer **Return to session** or **Discard session** on reload.
  Returning restores the goal, drink and timer paused; closed-page time is not credited.
  Returning to Goals pauses the session and keeps it available to resume. Saves are local to this browser.
- **Layout** offers Balanced, Drink spotlight and Minimal focus presets per screen size.
  Manual edits show Custom. All five panels remain available in the regular view.
- **Focus mode** temporarily shows just the timer and drink. Exit focus mode restores
  panels and controls without changing the saved arrangement or stopping ambient sounds.
- Completion shows focused time and beans awarded, with an optional five-minute break,
  Continue and Finish. A break earns no focus rewards; Finish does not mark an unfinished goal complete.
- Redeem codes ignore case and whitespace. Errors remain inline for correction, including
  unknown, already redeemed, expired (when configured) and storage errors. Existing codes
  have no newly added expiration. Rewards and redemption markers save together.

Experience checks: `node tests/session-recovery.cjs`, `node tests/session-completion.cjs`,
`node tests/focus-mode.cjs`, `node tests/timer-layout.cjs`, and `node tests/shop-codes.cjs`.

### Panel visibility and sizing
Expand view sits next to Pop Out. The Panels menu saves visibility for each screen size;
the timer remains available. Reset layout or a preset restores every panel. Cards pack
into short grid tracks with small gutters, and the drink/recipe/timer text scale within
their panel. Wide cards still require a full-width row.


### Main controls and shelf details
- **Your next focus** remembers a selected goal; Start focus uses the saved timer duration.
- Returning to Goals pauses an unfinished session. Resume session continues it; End saved
  session explicitly discards it after confirmation. Starting a different goal asks first.
- Goal deletion, goal checkbox changes, subgoal changes/deletion and clearing goals offer
  a ten-second Undo. Goal-checkbox rewards commit after the Undo window, and rechecking
  the same goal cannot repeatedly earn rewards. Recurring goals can earn rewards each cycle.
- Click or keyboard-activate a shelf cup in Stats or the timer to see studied duration,
  goal, category and completion date. Older cups without goal metadata say so.
- Deadlines offers counts and filters for overdue, today, the next seven days and later,
  plus goal/category search and a direct Focus action. Main-page reminders can be snoozed
  for an hour or dismissed for the local calendar day without changing the deadline.
- Shared confirmation/prompt dialogs support Enter, Escape and contained keyboard focus.

Validation: `node tests/main-controls.cjs` checks Undo accounting, duplicate reward
protection, local-calendar deadline calculations and saved shelf metadata.

### Account preparation (local-only for now)

The small **Sign in** button beside Help opens account information. Live Google sign-in,
cloud saving, and Calendar authorization are intentionally deferred until a new backend
is provisioned. The retired Supabase project is no longer contacted and its browser SDK
is no longer loaded. Existing guest storage remains unchanged; use Goal Area → Settings
→ Export for a portable backup. The account dialog does not claim that local data is synced.

Before activating accounts: configure the new provider and approved redirect URLs;
implement account-isolated storage, explicit guest import, conflict-safe atomic saves,
offline/error states, and database ownership rules; then test two different accounts
and cross-device save/reload. Calendar authorization must remain a separate optional step.
