# Drink experience review — September 17

The goal is an enjoyable preparation sequence and a finished drink worth keeping on screen. More motion is not automatically better. Everyday coffee should look appetizing; dessert drinks need texture and height; fantasy drinks need a recognizable visual theme.

## Changes in this pass

- Finishes start at 68% progress, build through 91%, and gain their final garnish at 88–100%. Their geometry follows progress, so pausing holds preparation.
- Cherry Blossom now has a blended pink body and a whipped pink cream crown. House has blush foam and one blossom; signature has a modest cream swirl; mastercraft has a taller piped crown, two placed blossoms and pink crumbs.
- Cream-topped drinks fill nearer the rim. Crowns render in front of the rim and are not covered by lids.
- Hot Chocolate, Mocha and Vienna Coffee gain tiered cream crowns with appropriate cocoa/sauce finishes. Hot Chocolate mastercraft gets a chocolate shard. Chocolate is mixed into the body rather than shown as cloudy syrup patches.
- Latte progresses from a milk dot to a heart to a rosette. Matcha progresses from tea dust to a leaf to a green rosette. Flat White keeps its compact microfoam signature.
- Affogato gets a gelato scoop, espresso trails and a mastercraft wafer. Dalgona gains a sculpted coffee-foam peak. Egg Coffee keeps a custard float with cocoa detail.
- Rose Gold gets rose-shaped petals and a mastercraft gold leaf. Midnight Espresso gets a cream crescent, with a small star at mastercraft.
- Galaxy and Void star density now follows tier. Galaxy gains a nebula at signature; Aurora gains a second then third color band. Golden Hour retains its recent tiered solar finish.
- Removed legacy recipe artwork that duplicated ice, gelato or native cosmic effects.
- Completed cups no longer have a percentage over the drink. The generic completion sparkle is brief, leaving the drink itself as the lasting reward.
- Shop previews now use the tier selected by owned equipment, rather than always showing mastercraft details.

## Collection decisions

“Retain” means the existing treatment was reviewed and kept; it is not a claim of new artwork.

| Drink | House | Signature | Mastercraft |
|---|---|---|---|
| Espresso | Retain dark extraction | Retain light crema | Retain tiger crema |
| Americano | Retain clean dark body | Retain fine crema edge | Retain subtle coffee depth |
| Flat White | Compact milk dot | Dot with pull-through | Larger silky microfoam mark |
| Hot Chocolate | Cocoa-dusted foam | Modest whipped cream | Cream, chocolate sauce and shard |
| Matcha Latte | Matcha dust | Green leaf | Green rosette |
| Lavender Latte | Small lavender sprig | Pale floral cap | Fuller sprig and honey marbling |
| Iced Matcha | Retain green/milk fade | Retain oat milk layering | Retain ice and depth; remove duplicate ice |
| Brown Sugar Boba | Retain blended syrup and pearls | Soft milk cap | Caramel flecks over milk cap |
| Egg Coffee | Custard float | Fuller custard float | Custard with finer cocoa detail |
| Caramel Macchiato | Thin caramel line | More defined finish | Caramel finish with amber flecks |
| Cà Phê Sữa Đá | Retain coffee/condensed milk | Retain layered depth | Retain ice and cream; remove duplicate ice |
| Dalgona | Low coffee-foam peak | Fuller whipped coffee | Tall sculpted coffee foam |
| Irish Coffee | Retain dark coffee and cream | Retain light floating cream | Retain silky cream and recipe finish |
| Latte | Milk dot | Heart | Rosette |
| Cappuccino | Light cocoa dust | More textured foam | Cocoa dust with foam heart |
| Mocha | Cocoa foam | Chocolate cream | Taller cream with chocolate finish |
| Macchiato | Retain small foam spot | Retain brighter foam | Retain precise microfoam mark |
| Vienna Coffee | Simple cream | Whipped cream | Tall whipped crown with dusting |
| Affogato | Small scoop and coffee | Larger gelato scoop | Espresso trails and wafer |
| Rose Gold Latte | Rose on blush foam | Rose cream | Rose cream with gold leaf |
| Cherry Blossom | Blush foam and blossom | Piped pink cream and blossom | Tall cream, two blossoms and pink crumbs |
| Galaxy Cold Brew | Sparse stars | Nebula and more stars | Dense starfield and nebula |
| Midnight Espresso | Retain dark surface | Cream crescent | Crescent and small star |
| Barista’s Secret | Retain teal effervescence | Retain light foam | Retain siphon glow and halo |
| Golden Hour | Retain warm glow | Retain sun and corona | Retain solar halos, flecks and reflections |
| Aurora Brew | One color band | Two color bands | Three flowing bands |
| The Void | Sparse starfield | More stars and outer orbit | Full stars and second orbit |

The seven base choices have no equipment tiers. Coffee retains crema; Matcha has tea dust; Milk Tea retains pearls; Orange Juice and Lemonade gain a citrus garnish; Chamomile gains a small flower; Smoothie gains berries and a leaf. Birthday Cake remains a dedicated tier-assembly animation, now with a brief completion sparkle and no final percentage overlay.

## Verification

- `node tests/drinks.cjs`: 2,981 render checks plus seed, playback, reset and tier checks.
- `node tests/drink-tiers.cjs`: 729 progress-stage renders over 27 recipes × 3 controlled tiers. Generates `tests/tiers.html` for side-by-side comparison.
- `node tests/timer-drinks.cjs`: timer/drink synchronization checks.
- Browser review: Cherry Blossom live and shop composition, full 81-finish contact sheet, and console checks.

The controlled tier sheet selects recipe levels directly for review. In the app, equipment resolves to the highest eligible level; some recipes share requirements across levels. The review does not change that progression rule. Automated checks catch rendering regressions, not whether a particular user will enjoy every visual indefinitely.
