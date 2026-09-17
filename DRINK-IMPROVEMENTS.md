# Drink review and improvement plan

Implemented September 16, 2026. Scope: 28 shop entries (including Birthday Cake) and 7 base drinks. Random is a selection mode.

## Shared corrections implemented

- Constrain syrup clouds and ribbons to the actual filled area, including filter blur. Reveal clouds gradually rather than adding whole blobs at thresholds.
- Keep internal recipe artwork and external halos in their original layers throughout later steps.
- Scale legacy recipe artwork to the current cup; center finishing garnishes. Use one finishing treatment rather than overlapping recipe art and new art.
- Drive ice entry by progress so timer redraws do not replay the drop.
- Reuse the live liquid renderer in shop previews, including layered drinks and cosmic effects; isolate gradient IDs per card and leave headroom for foam.
- Resolve shop drinks selected through categories, sanitize invalid progress, and re-arm completion and milestones on rewind.
- Correct The Void's missing upgraded-tier gradient. Remove Galaxy's unavailable ButterflyPeaJar equipment requirement (an ingredient, not a purchasable machine).
- Honor reduced-motion preferences for live CSS animations.

## Drink-by-drink decisions

“Retain” means its existing distinguishing feature was kept, checked, and carried through the shared preview renderer; it does not imply new artwork was added.

| Drink | Implemented decision / visual direction |
|---|---|
| Espresso | Retain tight crema ring and dark extraction; center tier garnish. |
| Americano | Retain open dark surface without a large milk cap. |
| Flat White | Add centered white microfoam dot and fine pull-through. |
| Hot Chocolate | Add a progressive cocoa drizzle distinct from submerged syrup. |
| Matcha Latte | Retain green body and centered recipe rosette. |
| Lavender Latte | Add a lavender sprig; keep honey ribbons tier-gated. |
| Iced Matcha | Preserve green/milk layering in preview and stabilize ice entry. |
| Brown Sugar Boba | Reveal syrup clouds and narrow ribbons gradually; preserve pearls in previews. |
| Egg Coffee | Add fine cocoa flecks over the existing custard layer. |
| Caramel Macchiato | Replace crossed surface sticks with curved caramel drizzle; constrain submerged ribbons. |
| Cà Phê Sữa Đá | Preserve condensed milk, ice, and coffee stages in previews; scale recipe ice into the cup. |
| Dalgona | Preserve whipped coffee over milk; soften syrup reveal and stabilize ice. |
| Irish Coffee | Replace green cream with warm ivory; preserve the floating cream layer in previews. |
| Latte | Add a centered heart with a light coffee outline. |
| Cappuccino | Add fine cocoa dusting while retaining its tall foam dome. |
| Mocha | Add a progressively drawn chocolate finish over the foam; contain marbling below it. |
| Macchiato | Retain a small foam spot instead of a full cap; center recipe garnish. |
| Vienna Coffee | Add fine chocolate flecks to the whipped cream crown. |
| Affogato | Add a vanilla scoop with espresso trails, visible in both renderers. |
| Rose Gold | Retain rose/peach coloration and gold flecks; preview now includes liquid detail. |
| Cherry Blossom | Retain petals and blossom-colored body; center recipe garnish. |
| Galaxy Cold Brew | Preserve nebula/star detail in previews; make the top equipment tier reachable. |
| Midnight Espresso | Preserve dark body and restrained star detail in previews. |
| Barista’s Secret | Keep teal siphon glow; prevent halos from being clipped at the final step. |
| Golden Hour | Preserve warm sun glow and rays in previews with independent gradient definitions. |
| Aurora Brew | Preserve multicolor bands in previews; keep external recipe effects outside the cup. |
| The Void | Fix upgraded fill; retain starfield and orbit arcs in previews. |
| Birthday Cake | Retain dedicated tier assembly, ganache drops, and candle artwork; regression-check both renderers. |
| Base Coffee | Retain warm coffee/crema identity and use the shared preview liquid. |
| Base Matcha | Retain green suspension and recipe artwork with corrected positioning. |
| Base Milk Tea | Retain pearl bed and creamy tea; keep pearls in previews. |
| Orange Juice | Retain citrus detail, pulp/bubble effects, and ice in previews. |
| Chamomile Tea | Retain amber infusion and botanical detail in previews. |
| Smoothie | Retain berry texture and dense pink body in previews. |
| Lemonade | Retain lemon slice and rising bubbles in previews. |

## Verification and review

Run `node tests/drinks.cjs` from this folder. It checks 2,941 live/preview renders across all entries, recipe-specific equipment sets, boundary progress values, completion, rewind, and invalid input. Checks cover render exceptions, invalid numeric output, missing SVG definitions, duplicate IDs, persistent inside/outside layering, and unreachable equipment requirements. These checks do not measure animation smoothness or pixel-perfect appearance.

The test generates `tests/gallery.html` and `tests/review.html`. The review page provides drink/equipment controls, a progress slider, a 20-second replay, and simultaneous live/shop views. Shop previews deliberately remain static between progress updates. Tier names represent equipment selections; recipes with identical requirements naturally resolve to the highest available tier.

Browser verification: reviewed collection artwork and exercised the playback controls. Full automated pixel comparisons and exhaustive real-time playback of every drink are not included.


## Follow-up: realistic syrup and smoother liquid (September 16)

This revision supersedes the earlier cloudy marbling treatment. Syrup now uses unequal, curved glass-bound trails with rounded tips and restrained highlights. Brown Sugar Boba has a creamy milk-tea body and visible syrup at every equipment tier; legacy duplicate pearl/ice overlays are suppressed.

Cà Phê Sữa Đá, Dalgona, Egg Coffee, Iced Matcha, Caramel Macchiato, Irish Coffee and Brown Sugar Boba now use continuous vertical gradients instead of stacked translucent rectangles. Surface sauce lines are thinner. Shop previews share these changes.

Live progress eases toward timer updates through one cancellable animation loop. SVG elements are updated in place to preserve running animation phases, with immediate reset and reduced-motion handling. A drink swap starts fresh phases. Added deterministic checks cover easing completion, cancellation on swap, and reset during interpolation. Browser playback and screenshots checked brown sugar and iced matcha; no console errors appeared.


## Follow-up: randomized blended regions

Replaced the fixed curls with seven seeded, irregular color regions of varied sizes, rotations and positions. Noise displacement distorts their boundaries, and radial transparency mixes pigment and milk. The same seed holds throughout one brew; a new session creates a new arrangement. Individual regions move gently on separate 22–34-second cycles. Top and bottom alpha fades preserve the liquid surface and pearl contrast.

Five helper agents contributed marbling design review, layered palettes/details, motion review, regression tests and visual quality review, staggered to fit available concurrency. Layered colors now use eased multi-stop interpolation, and whipped/custard drinks have small surface bubbles. Animation reconciliation only retains the old phase when the animation identity matches.

3,001 render checks pass, including fixed-seed repeatability, different-seed geometry, boundary values and SVG references; easing/reset/swap checks also pass. The studio includes a New blend button to compare randomized live arrangements. Shop cards keep a stable pattern per card.

## Golden Hour mastercraft finish

House keeps its diffuse sunset glow. Signature adds a feathered solar core, one slow-moving corona and a few gold flecks. Mastercraft adds three overlapping corona arcs moving at different speeds, fifteen floating gold flakes, and seven soft horizontal reflections under the sun. Effects gradually emerge from 45–94% progress. Shop previews show the mastercraft finish. Reduced-motion preferences remain respected. Tier-specific regression assertions pass, and the mastercraft browser preview was visually checked without console errors.


## Pause behavior and recipe language (September 17)

The main timer now explicitly shares running/work-phase state with the drink. Pausing cancels fill interpolation and hides pouring while steam, gentle waves, marbling and light effects remain ambient. Resume continues toward the held target. Breaks, navigation, completion and resets synchronize this state; explicit reset/completion remain authoritative. Numeric and arrow-key time edits update brewing state, including a zero-duration reset. Pop-out drinks use shared work-session progress so they do not empty/refill during breaks. Static shop previews omit frozen pour streams.

All 405 recipe step labels now use concise café wording. Non-label recipe data is unchanged. Five helper agents contributed timer integration, motion review, recipe editing, playback tests and independent review; final integration and verification were completed in the main task.

Validation: 3,001 render checks; seeded randomness and animation checks; pause/held-progress/resume tests; timer integration and generated pop-out script checks. Browser testing confirmed paused pours are hidden, steam remains running, progress stays fixed, and resume continues from that value without console errors.
