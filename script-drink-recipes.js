// recipes-manifest.js
// Enhanced 20-Drink Economy Matrix for LetsFocus Animation Engine

const DRINK_RECIPES = {
  // ==========================================
  // COMMON DRINKS (Grounded Realism & Deep Fluid Depth)
  // ==========================================
  espresso: {
    allPossibleEquipment: ["EspressoMachine"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseEspresso" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5a2a14"/><stop offset="45%" stop-color="#2e1208"/><stop offset="100%" stop-color="#0a0301"/></linearGradient>`,
      steps: {
        20: { label: "Placing short demitasse glass", fill: "transparent" },
        40: { label: "Standard atmospheric baseline check", fill: "transparent" },
        60: { label: "Pouring standard dark coffee wash", fill: "url(#houseEspresso)" },
        80: { label: "Filling core vessel lines", fill: "url(#houseEspresso)" },
        100: { label: "Espresso complete", fill: "url(#houseEspresso)", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(120, 67, 39, 0.15)",
      defs: `<linearGradient id="sigEspresso" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a2c1b"/><stop offset="100%" stop-color="#1c0f0a"/></linearGradient>`,
      steps: {
        20: { label: "Pre-heating extraction column templates", fill: "transparent" },
        40: { label: "Engaging 9-bar high pressure group head locks", fill: "transparent" },
        60: { label: "Extracting rich single-origin espresso shot", fill: "url(#sigEspresso)" },
        80: { label: "Stabilizing fluid density layout templates", fill: "url(#sigEspresso)" },
        100: { label: "Forming natural light golden crema head", fill: "url(#sigEspresso)", foamFill: "rgba(222, 165, 112, 0.6)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(245, 158, 11, 0.2)",
      defs: `
        <linearGradient id="masterEspresso" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2d170b"/><stop offset="100%" stop-color="#0d0502"/></linearGradient>
        <linearGradient id="tigerCrema" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#b45309"/><stop offset="25%" stop-color="#d97706"/><stop offset="50%" stop-color="#78350f"/><stop offset="75%" stop-color="#b45309"/><stop offset="100%" stop-color="#592004"/></linearGradient>
      `,
      steps: {
        20: { label: "Initiating 6-second low pressure pre-infusion step", fill: "transparent" },
        40: { label: "Locking precision hand-tamped bottomless portafilter", fill: "transparent" },
        60: { label: "Extracting thick, honey-like Ristretto pull", fill: "url(#masterEspresso)" },
        80: { label: "Swirling oily lipid arrays within the cup center", fill: "url(#masterEspresso)" },
        100: { label: "Spreading authentic high-density tiger-striped crema", fill: "url(#masterEspresso)", foamFill: "url(#tigerCrema)" }
      }
    }
  },

  americano: {
    allPossibleEquipment: ["EspressoMachine"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseAmer" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3a2818"/><stop offset="50%" stop-color="#1e1208"/><stop offset="100%" stop-color="#080502"/></linearGradient>`,
      steps: {
        20: { label: "Positioning standard clear glass tumbler", fill: "transparent" },
        40: { label: "Adding lukewarm tap water volume base", fill: "rgba(190, 155, 110, 0.18)" },
        60: { label: "Adding generic dark instant coffee mix blend", fill: "#2a1c14" },
        80: { label: "Stirring solution pathways manually", fill: "#2a1c14" },
        100: { label: "Basic Americano blend complete", fill: "#2a1c14", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(120, 67, 39, 0.08)",
      defs: `<linearGradient id="sigAmer" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38251c"/><stop offset="100%" stop-color="#170e0a"/></linearGradient>`,
      steps: {
        20: { label: "Filling vessel with purified 93°C hot water base", fill: "rgba(195, 165, 120, 0.22)" },
        40: { label: "Locking double-shot basket array configurations", fill: "rgba(195, 165, 120, 0.22)" },
        60: { label: "Extracting fresh espresso directly over hot water canvas", fill: "url(#sigAmer)" },
        80: { label: "Blending fluid thresholds gracefully", fill: "url(#sigAmer)" },
        100: { label: "Preserving soft perimeter ring layer of crema", fill: "url(#sigAmer)", foamFill: "rgba(197, 142, 97, 0.35)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(217, 119, 6, 0.15)",
      defs: `<linearGradient id="masterAmer" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#543310"/><stop offset="30%" stop-color="#1c1007"/><stop offset="100%" stop-color="#0b0502"/></linearGradient>`,
      steps: {
        20: { label: "Calibrating pristine alkaline water reservoir levels", fill: "rgba(200, 170, 120, 0.25)" },
        40: { label: "Grinding premium light-roast specialty bean profiles", fill: "rgba(200, 170, 120, 0.25)" },
        60: { label: "Layering dense pulled espresso over hot water canvas", fill: "url(#masterAmer)" },
        80: { label: "Suspended watercolor oil dispersion active", fill: "url(#masterAmer)" },
        100: { label: "Perfect extraction layout integration achieved", fill: "url(#masterAmer)", foamFill: "transparent" }
      }
    }
  },

  flatWhite: {
    allPossibleEquipment: ["EspressoMachine", "SteamWand"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Setting standard ceramic cup", fill: "transparent" },
        40: { label: "Pouring instant coffee water mix", fill: "#543d32" },
        60: { label: "Stirring in cold standard table milk volume", fill: "#c8a878" },
        80: { label: "Integrating solution profiles completely", fill: "#c8a878" },
        100: { label: "Flat white style drink completed", fill: "#c8a878", foamFill: "rgba(255,255,255,0.55)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(217, 180, 143, 0.15)",
      defs: `<linearGradient id="sigFlat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a88574"/><stop offset="100%" stop-color="#4a3227"/></linearGradient>`,
      steps: {
        20: { label: "Readying double shot espresso profile bases", fill: "transparent" },
        40: { label: "Running extraction processing parameters", fill: "#362218" },
        60: { label: "Pouring standard warm milk into espresso core", fill: "url(#sigFlat)" },
        80: { label: "Expanding drink volume layout channels", fill: "url(#sigFlat)" },
        100: { label: "Adding loose open standard milk foam layer head", fill: "url(#sigFlat)", foamFill: "rgba(255,255,255,0.75)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SteamWand"],
      bgGlow: "rgba(251, 191, 36, 0.15)",
      defs: `<linearGradient id="masterFlat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#dfc3b3"/><stop offset="40%" stop-color="#ba9684"/><stop offset="100%" stop-color="#5e3d2c"/></linearGradient>`,
      steps: {
        20: { label: "Extracting rich, short double ristretto base foundation", fill: "#211108" },
        40: { label: "Stretching whole milk to build a smooth microfoam matrix", fill: "#211108" },
        60: { label: "Pouring silky, textured milk velvet from low height", fill: "url(#masterFlat)" },
        80: { label: "Rising emulsion layers merging perfectly", fill: "url(#masterFlat)" },
        100: { label: "Drawing precise minimalist solid milk dot art profile", fill: "url(#masterFlat)", foamFill: "#ffffff", garnishSvg: `
          <circle cx="100" cy="54" r="15" fill="#ffffff"/>
          <path d="M 100 70 Q 95 58 100 42" fill="none" stroke="#ba9684" stroke-width="2.5" stroke-linecap="round"/>
        `}
      }
    }
  },

  hotChocolate: {
    allPossibleEquipment: ["SteamWand"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Adding sweet generic cocoa powder scoops", fill: "transparent" },
        40: { label: "Pouring standard hot water base lines", fill: "#24140a" },
        60: { label: "Stirring manually to break up dry lumps", fill: "#6a3010" },
        80: { label: "Adding splash of thin cold milk directly", fill: "#6a3010" },
        100: { label: "Basic Hot Cocoa ready", fill: "#6a3010", foamFill: "rgba(100,45,20,0.5)" }
      }
    },
    signature: {
      requires: ["SteamWand"],
      bgGlow: "rgba(146, 64, 14, 0.15)",
      defs: `<linearGradient id="sigChoc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5c3a26"/><stop offset="100%" stop-color="#2b170c"/></linearGradient>`,
      steps: {
        20: { label: "Melting sweet chocolate chips in whole milk vectors", fill: "transparent" },
        40: { label: "Submerging single-hole steam wand into pitcher", fill: "transparent" },
        60: { label: "Heating chocolate core matrix to exactly 65°C", fill: "url(#sigChoc)" },
        80: { label: "Pouring uniform, integrated hot chocolate stream", fill: "url(#sigChoc)" },
        100: { label: "Thin layer of aerated chocolate bubbles formed", fill: "url(#sigChoc)", foamFill: "rgba(69, 41, 24, 0.6)" }
      }
    },
    mastercraft: {
      requires: ["SteamWand"],
      bgGlow: "rgba(146, 64, 14, 0.25)",
      defs: `<linearGradient id="masterChoc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3d2010"/><stop offset="50%" stop-color="#241107"/><stop offset="100%" stop-color="#120500"/></linearGradient>`,
      steps: {
        20: { label: "Blending dark Dutch process cocoa with real cream", fill: "transparent" },
        40: { label: "Engaging steam wand vortex to texture dark matrix", fill: "transparent" },
        60: { label: "Creating dense, ultra-velvety hot chocolate body", fill: "url(#masterChoc)" },
        80: { label: "Pouring rich, glossy gourmet liquid fudge base", fill: "url(#masterChoc)" },
        100: { label: "Garnishing with premium dark chocolate sauce lines", fill: "url(#masterChoc)", foamFill: "rgba(255,255,255,0.05)", garnishSvg: `
          <path d="M 50 55 C 75 75, 125 35, 150 60 M 60 45 C 85 65, 115 25, 140 50" fill="none" stroke="#0f0501" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
        `}
      }
    }
  },

  // ==========================================
  // UNCOMMON DRINKS (Rich Textures & Unique Structural Logic)
  // ==========================================
  matchaLatte: {
    allPossibleEquipment: ["SteamWand", "MilkFrother"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Adding culinary grade matcha powder base", fill: "transparent" },
        40: { label: "Mixing with hot tap water structures", fill: "#3b5237" },
        60: { label: "Pouring un-textured grocery store skim milk", fill: "#8aaa70" },
        80: { label: "Blending solution channels together", fill: "#8aaa70" },
        100: { label: "Basic Matcha mix complete", fill: "#8aaa70", foamFill: "rgba(210,240,200,0.55)" }
      }
    },
    signature: {
      requires: ["MilkFrother"],
      bgGlow: "rgba(34, 197, 94, 0.12)",
      defs: `<linearGradient id="sigMatcha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#769c6d"/><stop offset="100%" stop-color="#3c5934"/></linearGradient>`,
      steps: {
        20: { label: "Whisking authentic green tea matcha slurry matrix", fill: "#273b21" },
        40: { label: "Spinning milk at high speeds to establish foam structures", fill: "#273b21" },
        60: { label: "Pouring frothy sweet milk base over matcha mix", fill: "url(#sigMatcha)" },
        80: { label: "Fluid boundary expanding cleanly", fill: "url(#sigMatcha)" },
        100: { label: "Layering thick cold milk foam top deck element", fill: "url(#sigMatcha)", foamFill: "#f0fdf4" }
      }
    },
    mastercraft: {
      requires: ["SteamWand", "MilkFrother"],
      bgGlow: "rgba(34, 197, 94, 0.25)",
      defs: `<linearGradient id="masterMatcha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#94be8b"/><stop offset="50%" stop-color="#658e5c"/><stop offset="100%" stop-color="#233b1e"/></linearGradient>`,
      steps: {
        20: { label: "Sifting ceremonial Japanese Uji matcha into bowl", fill: "transparent" },
        40: { label: "Using bamboo whisk to form vibrant green crema slurry", fill: "#1c3017" },
        60: { label: "Pouring glossy microfoam to split green canvas fields", fill: "url(#masterMatcha)" },
        80: { label: "Velvety suspension rising evenly", fill: "url(#masterMatcha)" },
        100: { label: "Drawing precise custom green matcha rosette leaf design", fill: "url(#masterMatcha)", foamFill: "#ffffff", garnishSvg: `
          <path d="M100,68 Q90,54 100,44 Q110,54 100,68 Z" fill="#527849"/>
          <path d="M100,54 Q93,44 100,36 Q107,44 100,54 Z" fill="#527849"/>
          <path d="M100,42 Q96,35 100,28 Q104,35 100,42 Z" fill="#527849"/>
        `}
      }
    }
  },

  eggCoffee: {
    allPossibleEquipment: ["EspressoMachine", "MilkFrother"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Setting cup baseline configurations", fill: "transparent" },
        40: { label: "Pouring filtered basic black coffee roast blend", fill: "#241812" },
        60: { label: "Adding simple spoonful of liquid egg yolk base", fill: "#f0d870" },
        80: { label: "Merging liquid stages rudimentarily", fill: "#2a1208" },
        100: { label: "Basic egg drink variation complete", fill: "#2a1208", foamFill: "rgba(248,220,100,0.7)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(245, 158, 11, 0.12)",
      defs: `<linearGradient id="sigEggBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3d2619"/><stop offset="100%" stop-color="#1c0f08"/></linearGradient>`,
      steps: {
        20: { label: "Warming base vessel structures properly", fill: "transparent" },
        40: { label: "Extracting high intensity dark espresso profiles", fill: "url(#sigEggBase)" },
        60: { label: "Whisking egg yolk manually with condensed sugar drops", fill: "url(#sigEggBase)" },
        80: { label: "Pouring dense espresso layer into cup volume", fill: "url(#sigEggBase)" },
        100: { label: "Adding raw beaten egg foam layer top element", fill: "url(#sigEggBase)", foamFill: "#fff7ed" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "MilkFrother"],
      bgGlow: "rgba(245, 158, 11, 0.25)",
      defs: `
        <linearGradient id="masterEggBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#26140a"/><stop offset="100%" stop-color="#0a0300"/></linearGradient>
        <linearGradient id="eggCustard" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>
      `,
      steps: {
        20: { label: "Extracting premium Robusta espresso foundation matrix", fill: "url(#masterEggBase)" },
        40: { label: "Blending egg yolks, honey, and sweet condensed milk paste", fill: "url(#masterEggBase)" },
        60: { label: "Using electric frother to whip mixture into thick custard", fill: "url(#masterEggBase)" },
        80: { label: "Injecting robust espresso base beneath custard layer", fill: "url(#masterEggBase)" },
        100: { label: "Crowning drink with a decadent, soufflé-like golden egg foam", fill: "url(#masterEggBase)", foamFill: "url(#eggCustard)", garnishSvg: `
          <circle cx="100" cy="52" r="8" fill="#78350f" opacity="0.4"/>
          <path d="M 85 52 Q 100 62 115 52" fill="none" stroke="#78350f" stroke-width="2" opacity="0.5"/>
        `}
      }
    }
  },

  brownSugarBoba: {
    allPossibleEquipment: ["BobaCooker", "MilkFrother", "SyrupShelf", "IceBucket", "SteamWand"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Setting base cup asset", fill: "transparent" },
        40: { label: "Pouring flat base milk tea blend", fill: "#b8906a" },
        60: { label: "Expanding base layout volume", fill: "#b8906a" },
        80: { label: "Filling core container lines", fill: "#b8906a" },
        100: { label: "Standard Milk Tea complete", fill: "#b8906a", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["BobaCooker", "MilkFrother"],
      bgGlow: "rgba(217, 180, 143, 0.2)",
      defs: `<linearGradient id="sigBobaFluid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c9a070"/><stop offset="100%" stop-color="#8a5838"/></linearGradient>`,
      steps: {
        20: { label: "Injecting slow-cooked Indigo Boba Pearls", fill: "transparent", svgContent: `
          <circle cx="38" cy="140" r="7" fill="#111827"/><circle cx="58" cy="145" r="7" fill="#1f2937"/>
          <circle cx="78" cy="141" r="7" fill="#111827"/><circle cx="98" cy="146" r="7" fill="#374151"/>
          <circle cx="116" cy="142" r="7" fill="#1f2937"/><circle cx="50" cy="132" r="6" fill="#1f2937"/>
          <circle cx="88" cy="134" r="6" fill="#111827"/>
        `},
        40: { label: "Settling structural assets inside glass boundaries", fill: "transparent" },
        60: { label: "Streaming standard emulsion tea liquid", fill: "url(#sigBobaFluid)" },
        80: { label: "Fluid level rising over pearl clusters", fill: "url(#sigBobaFluid)" },
        100: { label: "Layering cold texturized milk foam cap", fill: "url(#sigBobaFluid)", foamFill: "rgba(255,255,255,0.9)" }
      }
    },
    mastercraft: {
      requires: ["BobaCooker", "MilkFrother", "SyrupShelf", "IceBucket", "SteamWand"],
      bgGlow: "rgba(245, 158, 11, 0.2)",
      defs: `
        <linearGradient id="bsDrizzle" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2b1103" stop-opacity="0.95"/><stop offset="40%" stop-color="#542307" stop-opacity="0.6"/><stop offset="100%" stop-color="#78350f" stop-opacity="0.1"/></linearGradient>
        <linearGradient id="masterBobaFluid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d4a880"/><stop offset="60%" stop-color="#a06040"/><stop offset="100%" stop-color="#7a4020"/></linearGradient>
      `,
      steps: {
        20: { label: "Painting walls with caramelized Brown Sugar drizzle", fill: "url(#bsDrizzle)" },
        40: { label: "Dropping warm signature honey boba pearls", fill: "url(#bsDrizzle)", svgContent: `
          <circle cx="36" cy="138" r="7" fill="#1c0a00"/><circle cx="56" cy="143" r="7" fill="#2d1305"/>
          <circle cx="76" cy="140" r="7" fill="#1c0a00"/><circle cx="96" cy="145" r="7" fill="#451a03"/>
          <circle cx="114" cy="139" r="7" fill="#1c0a00"/><circle cx="48" cy="130" r="6.5" fill="#2d1305"/>
          <circle cx="68" cy="133" r="6.5" fill="#1c0a00"/><circle cx="88" cy="128" r="6.5" fill="#451a03"/>
        `},
        60: { label: "Dropping premium hard-frozen square ice block arrays", fill: "url(#masterBobaFluid)", svgContent: `
          <rect x="68" y="145" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.45" transform="rotate(18 80 157)"/>
          <rect x="108" y="135" width="26" height="26" rx="4" fill="#e0f2fe" opacity="0.55" transform="rotate(-12 121 148)"/>
        `},
        80: { label: "Infusing high-pressure micro-foamed milk tea matrix", fill: "url(#masterBobaFluid)" },
        100: { label: "Brown sugar syrup fully marbled through the tea", fill: "url(#masterBobaFluid)", foamFill: "#ffffff" }
      }
    }
  },

  caramelMacchiato: {
    allPossibleEquipment: ["EspressoMachine", "SyrupShelf", "SteamWand"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Dosing basic high-fructose corn syrup sugar drop", fill: "transparent" },
        40: { label: "Adding scalded standard utility milk profiles", fill: "#f4ede8" },
        60: { label: "Pouring standard dark roast coffee mix", fill: "#2e1008" },
        80: { label: "Stirring solution layout paths together", fill: "#2e1008" },
        100: { label: "Sweet coffee blend complete", fill: "#2e1008", foamFill: "rgba(255,255,255,0.55)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(180, 83, 9, 0.12)",
      defs: `<linearGradient id="sigMacch" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a1208"/><stop offset="55%" stop-color="#8a5020"/><stop offset="100%" stop-color="#fffbeb"/></linearGradient>`,
      steps: {
        20: { label: "Coating baseline with generic store caramel syrup lines", fill: "transparent" },
        40: { label: "Filling glass layout with warm whole dairy bases", fill: "#fffbeb" },
        60: { label: "Pouring fresh espresso across the surface center point", fill: "url(#sigMacch)" },
        80: { label: "Expanding macro-layer thresholds", fill: "url(#sigMacch)" },
        100: { label: "Soft cream layer expansion completed", fill: "url(#sigMacch)", foamFill: "rgba(255,255,255,0.65)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SyrupShelf", "SteamWand"],
      bgGlow: "rgba(245, 158, 11, 0.22)",
      defs: `<linearGradient id="masterMacch" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3d1d06"/><stop offset="35%" stop-color="#8a5022"/><stop offset="70%" stop-color="#f5e6d3"/><stop offset="100%" stop-color="#fffdfa"/></linearGradient>`,
      steps: {
        20: { label: "Injecting pure Madagascar vanilla bean syrup base", fill: "transparent" },
        40: { label: "Steaming silky microfoam with integrated steam wand techniques", fill: "#fffdfa" },
        60: { label: "Pouring bold espresso shots slowly to lock dynamic vertical layers", fill: "url(#masterMacch)" },
        80: { label: "Stabilizing beautiful layered density bands", fill: "url(#masterMacch)" },
        100: { label: "Etching an authentic multi-point lattice-work caramel drizzle grid", fill: "url(#masterMacch)", foamFill: "#ffffff", garnishSvg: `
          <path d="M 55 52 L 145 52 M 55 58 L 145 58 M 55 64 L 145 64 M 75 44 L 75 72 M 100 44 L 100 72 M 125 44 L 125 72" fill="none" stroke="#b45309" stroke-width="2.5" stroke-linecap="round"/>
        `}
      }
    }
  },

  // ==========================================
  // RARE DRINKS (Advanced Gradients & Specialized Asset Layering)
  // ==========================================
  caPhedaSuaDa: {
    allPossibleEquipment: ["EspressoMachine", "CrushedIceMaker", "PourOverSet"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Aligning workspace layout modules", fill: "transparent" },
        40: { label: "Direct baseline processing parameters", fill: "transparent" },
        60: { label: "Extracting standard Robusta dark roast extraction", fill: "#fce8b3" },
        80: { label: "Increasing baseline layout structures", fill: "#1f1610" },
        100: { label: "Finished standard filter profile", fill: "#1f1610", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(120, 67, 39, 0.2)",
      defs: `
        <linearGradient id="condensed" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fffbeb"/><stop offset="100%" stop-color="#fce8b3"/></linearGradient>
        <linearGradient id="vietCoffeeSig" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2e190e"/><stop offset="100%" stop-color="#140a05"/></linearGradient>
      `,
      steps: {
        20: { label: "Pouring thick sweetened condensed milk base layer", fill: "url(#condensed)" },
        40: { label: "Readying commercial group configuration arrays", fill: "url(#condensed)" },
        60: { label: "Injecting rich high-crema premium espresso pull", fill: "url(#vietCoffeeSig)" },
        80: { label: "Developing clean dual-phase horizontal boundary lines", fill: "url(#vietCoffeeSig)" },
        100: { label: "Crema head separation active and stable", fill: "url(#vietCoffeeSig)", foamFill: "rgba(184, 131, 88, 0.5)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "CrushedIceMaker", "PourOverSet"],
      bgGlow: "rgba(217, 119, 6, 0.25)",
      defs: `
        <linearGradient id="vietCondensedMaster" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fffdf5"/><stop offset="100%" stop-color="#fbe094"/></linearGradient>
        <linearGradient id="vietMarble" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#140904"/><stop offset="35%" stop-color="#422212"/><stop offset="75%" stop-color="#f5d68c"/><stop offset="100%" stop-color="#fffdf5"/></linearGradient>
      `,
      steps: {
        20: { label: "Depositing organic slow-drained condensed milk base", fill: "url(#vietCondensedMaster)" },
        40: { label: "Shaving premium high-surface crushed pebble ice", fill: "url(#vietCondensedMaster)", svgContent: `
          <circle cx="65" cy="200" r="5" fill="#e0f2fe" opacity="0.7"/>
          <circle cx="80" cy="205" r="6" fill="#ffffff" opacity="0.8"/>
          <circle cx="115" cy="198" r="5" fill="#e0f2fe" opacity="0.6"/>
          <circle cx="130" cy="203" r="7" fill="#ffffff" opacity="0.8"/>
          <circle cx="95" cy="192" r="6" fill="#e0f2fe" opacity="0.7"/>
        `},
        60: { label: "Deploying traditional Phin-style slow drip over-pour filter", fill: "url(#vietMarble)", svgContent: `
          <circle cx="65" cy="160" r="5" fill="#e0f2fe" opacity="0.5"/>
          <circle cx="82" cy="145" r="6" fill="#ffffff" opacity="0.6"/>
          <circle cx="118" cy="155" r="5" fill="#e0f2fe" opacity="0.5"/>
          <circle cx="128" cy="138" r="7" fill="#ffffff" opacity="0.6"/>
        `},
        80: { label: "Merging structural multi-density coffee streams into marble matrix", fill: "url(#vietMarble)" },
        100: { label: "Achieved signature dynamic marble swirl execution", fill: "url(#vietMarble)", foamFill: "transparent" }
      }
    }
  },

  lavenderHoneyLatte: {
    allPossibleEquipment: ["EspressoMachine", "SyrupShelf", "SteamWand"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseLavender" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c8a8d8"/><stop offset="55%" stop-color="#9070b0"/><stop offset="100%" stop-color="#3c2850"/></linearGradient>`,
      steps: {
        20: { label: "Dosing imitation artificial lavender dye chemicals", fill: "transparent" },
        40: { label: "Adding generic hot water liquid volumes", fill: "#ebdcf0" },
        60: { label: "Adding simple coffee powder color blends", fill: "url(#houseLavender)" },
        80: { label: "Mixing fluid layout pathways together", fill: "url(#houseLavender)" },
        100: { label: "Basic sweet lavender mix completed", fill: "url(#houseLavender)", foamFill: "rgba(220,190,248,0.6)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(168, 85, 247, 0.15)",
      defs: `<linearGradient id="sigLavender" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#705675"/><stop offset="100%" stop-color="#3d2c40"/></linearGradient>`,
      steps: {
        20: { label: "Adding real amber honey foundation lines down first", fill: "transparent" },
        40: { label: "Extracting double-shot dark coffee profiles", fill: "#2b1830" },
        55: { label: "Pouring standard hot dairy liquids evenly across cup", fill: "url(#sigLavender)" },
        80: { label: "Blending liquids into cohesive purple-brown field", fill: "url(#sigLavender)" },
        100: { label: "Faint white foam top skin established", fill: "url(#sigLavender)", foamFill: "rgba(243, 232, 255, 0.5)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SyrupShelf", "SteamWand"],
      bgGlow: "rgba(168, 85, 247, 0.3)",
      defs: `<linearGradient id="masterLavender" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d8b4fe"/><stop offset="40%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>`,
      steps: {
        20: { label: "Infusing slow-simmered organic French lavender flower syrup", fill: "transparent" },
        40: { label: "Drizzling raw local wildflower honey along internal glass walls", fill: "transparent" },
        60: { label: "Steaming rich alternative milk to optimal silky microfoam weight", fill: "#4c1d95" },
        80: { label: "Pouring precision espresso layers to produce distinct herbal banding profiles", fill: "url(#masterLavender)" },
        100: { label: "Suspending dried culinary lavender botanical blossoms on foam", fill: "url(#masterLavender)", foamFill: "#ffffff", garnishSvg: `
          <circle cx="90" cy="54" r="2" fill="#c084fc"/><circle cx="98" cy="50" r="1.5" fill="#a855f7"/>
          <circle cx="106" cy="55" r="2.5" fill="#c084fc"/><circle cx="114" cy="51" r="2" fill="#a855f7"/>
        `}
      }
    }
  },

  dalgonaCoffee: {
    allPossibleEquipment: ["MilkFrother", "IceBucket"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Pouring plain water matrix paths into container", fill: "transparent" },
        40: { label: "Pouring standard cold tap milk directly", fill: "#fcfbfa" },
        60: { label: "Mixing instant coffee and hot water via spoon", fill: "#fffbeb" },
        80: { label: "Pouring flat liquid layer directly over milk", fill: "#ca8a04" },
        100: { label: "Unwhipped Dalgona variant ready", fill: "#ca8a04", foamFill: "rgba(180,80,20,0.7)" }
      }
    },
    signature: {
      requires: ["MilkFrother"],
      bgGlow: "rgba(234, 179, 8, 0.15)",
      steps: {
        20: { label: "Filling container with farm fresh chilled milk volume", fill: "#fffbeb" },
        40: { label: "Combining instant roast grids, sugar, and boiling liquids", fill: "#fffbeb" },
        60: { label: "Using motorized milk frother to spin dark foam masses", fill: "#fffbeb" },
        80: { label: "Pouring milk foundation down into the cup structure", fill: "#fffbeb" },
        100: { label: "Spoon-feeding dynamic whipped coffee meringue mounds", fill: "#fffbeb", foamFill: "#b45309" }
      }
    },
    mastercraft: {
      requires: ["MilkFrother", "IceBucket"],
      bgGlow: "rgba(234, 179, 8, 0.3)",
      defs: `<linearGradient id="dalgonaCream" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b45309"/><stop offset="100%" stop-color="#78350f"/></linearGradient>`,
      steps: {
        20: { label: "Setting up hyper-dense chilled sweet whole milk profile", fill: "#fffdfa" },
        40: { label: "Dropping high-clarity sub-zero solid block ice squares", fill: "#fffdfa", svgContent: `
          <rect x="72" y="160" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.5" transform="rotate(20 84 172)"/>
          <rect x="104" y="150" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.6" transform="rotate(-15 116 162)"/>
        `},
        60: { label: "Whipping premium spray-dried coffee crystals into micro-foam paste", fill: "#fffdfa", svgContent: `
          <rect x="72" y="160" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.3" transform="rotate(20 84 172)"/>
          <rect x="104" y="150" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.4" transform="rotate(-15 116 162)"/>
        `},
        80: { label: "Stabilizing the structured dairy emulsion layer below ice lines", fill: "#fffdfa" },
        100: { label: "Sculpting glossy, gravity-defying thick coffee foam peaks", fill: "#fffdfa", foamFill: "url(#dalgonaCream)", garnishSvg: `
          <path d="M 65 54 Q 100 25 135 54 Z" fill="#592004"/>
        `}
      }
    }
  },

  icedMatcha: {
    allPossibleEquipment: ["IceBucket", "OatMilkDispenser"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Pouring plain water matrix paths into container", fill: "transparent" },
        40: { label: "Shaking generic matcha tea powder in solution", fill: "#f5f0e8" },
        60: { label: "Pouring standard green dilution fluid line directly", fill: "#3a7040" },
        80: { label: "Fluid rising inside standard vessel assets", fill: "#3a7040" },
        100: { label: "Basic iced tea completed", fill: "#3a7040", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["OatMilkDispenser"],
      bgGlow: "rgba(74, 222, 128, 0.15)",
      defs: `<linearGradient id="sigIcedMatcha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#557d4f"/><stop offset="100%" stop-color="#f5fafd"/></linearGradient>`,
      steps: {
        20: { label: "Activating pressurized alternative oat milk lines", fill: "#f5fafd" },
        40: { label: "Dispensing artisanal creamy plant-based cream profile", fill: "#f5fafd" },
        60: { label: "Layering whisked green tea directly over oat milk cream", fill: "url(#sigIcedMatcha)" },
        80: { label: "Developing clean dual-phase color separation fields", fill: "url(#sigIcedMatcha)" },
        100: { label: "Clean dual-phase color separation established", fill: "url(#sigIcedMatcha)", foamFill: "transparent" }
      }
    },
    mastercraft: {
      requires: ["IceBucket", "OatMilkDispenser"],
      bgGlow: "rgba(74, 222, 128, 0.3)",
      defs: `<linearGradient id="masterIcedMatcha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#22c55e"/><stop offset="50%" stop-color="#15803d"/><stop offset="100%" stop-color="#f0fdf4"/></linearGradient>`,
      steps: {
        20: { label: "Dispensing organic, high-body barista edition oat milk", fill: "#f0fdf4" },
        40: { label: "Dropping clean geometric hard-frozen ice structures", fill: "#f0fdf4", svgContent: `
          <rect x="65" y="150" width="26" height="26" rx="4" fill="#e0f2fe" opacity="0.5" transform="rotate(10 78 163)"/>
          <rect x="105" y="140" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.6" transform="rotate(-25 117 152)"/>
        `},
        60: { label: "Whisking intense high-density green stoneground tea matchas", fill: "url(#masterIcedMatcha)", svgContent: `
          <rect x="65" y="150" width="26" height="26" rx="4" fill="#e0f2fe" opacity="0.3" transform="rotate(10 78 163)"/>
          <rect x="105" y="140" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.4" transform="rotate(-25 117 152)"/>
        `},
        80: { label: "Pouring concentrate gently over ice to force floating green clouds", fill: "url(#masterIcedMatcha)" },
        100: { label: "Stunning high-contrast floating cloud separation locked", fill: "url(#masterIcedMatcha)", foamFill: "transparent" }
      }
    }
  },

  // ==========================================
  // EPIC DRINKS (Advanced Concepts & Highly Detailed Graphics)
  // ==========================================
  roseGoldLatte: {
    allPossibleEquipment: ["EspressoMachine", "PetalPress", "GoldFlakeJar"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Dropping pink coloring agents into base vessel", fill: "transparent" },
        40: { label: "Pouring standard boiling water fluid channels", fill: "#fcebf0" },
        60: { label: "Mixing simple utility milk components directly", fill: "#c89060" },
        80: { label: "Integrating fluid thresholds complete", fill: "#c89060" },
        100: { label: "Warm latte imitation complete", fill: "#c89060", foamFill: "rgba(255,215,160,0.5)" }
      }
    },
    signature: {
      requires: ["EspressoMachine", "PetalPress"],
      bgGlow: "rgba(244, 63, 94, 0.18)",
      defs: `<linearGradient id="sigRose" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e0a870"/><stop offset="55%" stop-color="#c07060"/><stop offset="100%" stop-color="#703040"/></linearGradient>`,
      steps: {
        20: { label: "Loading fresh organic rose petals into mechanics", fill: "transparent" },
        40: { label: "Activating physical petal press to extract flower oils", fill: "transparent" },
        60: { label: "Extracting blonde espresso blend components into mixture", fill: "url(#sigRose)" },
        80: { label: "Streaming pressed floral oils with textured hot milk", fill: "url(#sigRose)" },
        100: { label: "Warm rose-copper foam layer top deck deployment", fill: "url(#sigRose)", foamFill: "rgba(255,205,155,0.75)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "PetalPress", "GoldFlakeJar"],
      bgGlow: "rgba(244, 63, 94, 0.3)",
      defs: `<linearGradient id="masterRose" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0c890"/><stop offset="45%" stop-color="#d08068"/><stop offset="100%" stop-color="#883050"/></linearGradient>`,
      steps: {
        20: { label: "Extracting aromatic warm rose hydrosol essence fields", fill: "transparent" },
        40: { label: "Infusing champagne gold botanical oils under high pressure", fill: "transparent" },
        60: { label: "Blending warm gold microfoam with rose-copper concentrates", fill: "url(#masterRose)" },
        80: { label: "Pouring shimmering rose-gold metallic liquid emulsion", fill: "url(#masterRose)" },
        100: { label: "Floating genuine 24k gold leaf flakes on champagne foam", fill: "url(#masterRose)", foamFill: "#ffe8d0", garnishSvg: `
          <ellipse cx="100" cy="50" rx="14" ry="9" fill="none" stroke="#d4a060" stroke-width="1.5" opacity="0.8"/>
          <circle cx="88" cy="47" r="2" fill="#fbbf24" style="animation:sparkle 1.8s ease-in-out infinite"/>
          <circle cx="112" cy="53" r="1.5" fill="#f59e0b" style="animation:sparkle 2.2s ease-in-out infinite"/>
          <circle cx="100" cy="44" r="1.8" fill="#fbbf24" style="animation:sparkle 1.5s ease-in-out infinite"/>
          <circle cx="94" cy="57" r="1.2" fill="#f59e0b" style="animation:sparkle 2.0s ease-in-out infinite"/>
        `}
      }
    }
  },

  midnightEspresso: {
    allPossibleEquipment: ["EspressoMachine", "IceBucket"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseMidnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#302848"/><stop offset="50%" stop-color="#18101e"/><stop offset="100%" stop-color="#060408"/></linearGradient>`,
      steps: {
        20: { label: "Setting simple clear glass shell", fill: "transparent" },
        40: { label: "Filling with warm room temperature tap water", fill: "rgba(80,60,120,0.25)" },
        60: { label: "Dropping standard dark food colorings inside", fill: "url(#houseMidnight)" },
        80: { label: "Expanding drink configuration volume", fill: "url(#houseMidnight)" },
        100: { label: "Basic mix complete", fill: "url(#houseMidnight)", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(63, 63, 70, 0.18)",
      defs: `<linearGradient id="sigMidnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#24212e"/><stop offset="100%" stop-color="#0b0a0f"/></linearGradient>`,
      steps: {
        20: { label: "Priming internal high-pressure line groups", fill: "transparent" },
        40: { label: "Extracting dense, dark espresso roast streams", fill: "url(#sigMidnight)" },
        60: { label: "Pouring rich dark espresso directly down center point", fill: "url(#sigMidnight)" },
        80: { label: "Rising solution boundary paths matching metrics", fill: "url(#sigMidnight)" },
        100: { label: "Thin charcoal color crema ring formed cleanly", fill: "url(#sigMidnight)", foamFill: "rgba(63, 63, 70, 0.4)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "IceBucket"],
      bgGlow: "rgba(39, 39, 42, 0.35)",
      defs: `<linearGradient id="masterMidnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#09090b"/><stop offset="60%" stop-color="#18181b"/><stop offset="100%" stop-color="#020205"/></linearGradient>`,
      steps: {
        20: { label: "Chilling glass structure to below 0°C thresholds", fill: "transparent" },
        40: { label: "Dropping high-clarity dense geometric glacier ice cubes", fill: "transparent", svgContent: `
          <rect x="70" y="150" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.35" transform="rotate(30 82 162)"/>
          <rect x="106" y="140" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.45" transform="rotate(-20 118 152)"/>
        `},
        60: { label: "Extracting concentrated obsidian black ristretto shots", fill: "url(#masterMidnight)", svgContent: `
          <rect x="70" y="150" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.2" transform="rotate(30 82 162)"/>
          <rect x="106" y="140" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.25" transform="rotate(-20 118 152)"/>
        `},
        80: { label: "Pouring dark extract over crystal ice structures to trap carbon hues", fill: "url(#masterMidnight)" },
        100: { label: "Garnishing presentation with an elegant expression of citrus oils", fill: "url(#masterMidnight)", foamFill: "transparent", garnishSvg: `
          <path d="M 60 54 Q 100 35 140 50" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
        `}
      }
    }
  },

  cherryBlossomLatte: {
    allPossibleEquipment: ["EspressoMachine", "PetalPress", "SteamWand"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Dosing processed sweet cherry imitation fluids", fill: "transparent" },
        40: { label: "Adding generic untextured boiled dairy lines", fill: "#faebd7" },
        60: { label: "Stirring contents manually into soft blush field", fill: "#f0d8e4" },
        80: { label: "Fluid expanding across vessel constraints", fill: "#c8a0b8" },
        100: { label: "Soft sakura blush variant ready", fill: "#c8a0b8", foamFill: "rgba(255,240,248,0.6)" }
      }
    },
    signature: {
      requires: ["EspressoMachine", "PetalPress"],
      bgGlow: "rgba(236, 72, 153, 0.18)",
      defs: `<linearGradient id="sigSakura" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f4dce8"/><stop offset="55%" stop-color="#c898b0"/><stop offset="100%" stop-color="#7a3858"/></linearGradient>`,
      steps: {
        20: { label: "Loading freshly harvested sakura cherry blossoms", fill: "transparent" },
        40: { label: "Stamping flower petals to yield pure floral oil essence", fill: "transparent" },
        60: { label: "Extracting standard light espresso roast layers directly", fill: "url(#sigSakura)" },
        80: { label: "Combining flower essence with hot milk into cup base", fill: "url(#sigSakura)" },
        100: { label: "Thin dusty-mauve foam top deck integration completed", fill: "url(#sigSakura)", foamFill: "#fdf0f8" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "PetalPress", "SteamWand"],
      bgGlow: "rgba(236, 72, 153, 0.35)",
      defs: `<linearGradient id="masterSakura" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fce8f0"/><stop offset="50%" stop-color="#d8a8c0"/><stop offset="100%" stop-color="#7a3858"/></linearGradient>`,
      steps: {
        20: { label: "Formulating true Japanese sakura flower absolute fluid matrix", fill: "transparent" },
        40: { label: "Using high-output steam wand to texture velvety milk microfoam", fill: "transparent" },
        60: { label: "Pouring texturized milk to lift beautiful ethereal blush layers", fill: "url(#masterSakura)" },
        80: { label: "Suspended delicate pastel matrix expanding perfectly", fill: "url(#masterSakura)" },
        100: { label: "Floating delicate 5-petal sakura blossoms on silken foam", fill: "url(#masterSakura)", foamFill: "#fdf8fc", garnishSvg: `
          <g transform="translate(85,52)">
            <path d="M0,-10 Q5,-5 0,0 Q-5,-5 0,-10Z" fill="#f4c8dc" opacity="0.9"/>
            <path d="M9,-3 Q5,2 0,0 Q3,-5 9,-3Z" fill="#f4c8dc" opacity="0.9"/>
            <path d="M5,8 Q0,5 0,0 Q5,3 5,8Z" fill="#f4c8dc" opacity="0.9"/>
            <path d="M-5,8 Q0,5 0,0 Q-5,3 -5,8Z" fill="#f4c8dc" opacity="0.9"/>
            <path d="M-9,-3 Q-3,-5 0,0 Q-5,2 -9,-3Z" fill="#f4c8dc" opacity="0.9"/>
            <circle cx="0" cy="0" r="2.5" fill="#fde68a"/>
          </g>
          <g transform="translate(114,56)">
            <path d="M0,-9 Q4,-4 0,0 Q-4,-4 0,-9Z" fill="#e8b0cc" opacity="0.85"/>
            <path d="M8,-3 Q4,2 0,0 Q3,-4 8,-3Z" fill="#e8b0cc" opacity="0.85"/>
            <path d="M4,7 Q0,4 0,0 Q4,2 4,7Z" fill="#e8b0cc" opacity="0.85"/>
            <path d="M-4,7 Q0,4 0,0 Q-4,2 -4,7Z" fill="#e8b0cc" opacity="0.85"/>
            <path d="M-8,-3 Q-3,-4 0,0 Q-4,2 -8,-3Z" fill="#e8b0cc" opacity="0.85"/>
            <circle cx="0" cy="0" r="2" fill="#fde68a"/>
          </g>
        `}
      }
    }
  },

  galaxyColdBrew: {
    allPossibleEquipment: ["IceBucket", "ColdBrewTower", "ButterflyPeaJar"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseGalaxy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a1a4a"/><stop offset="55%" stop-color="#16102a"/><stop offset="100%" stop-color="#080510"/></linearGradient>`,
      steps: {
        20: { label: "Pouring store-bought cold brew concentrate into plain vessel", fill: "transparent" },
        40: { label: "Filling with tap water across standard mix ratios", fill: "#22183a" },
        60: { label: "Adding artificial blue food dye drops to darken solution", fill: "url(#houseGalaxy)" },
        80: { label: "Expanding liquid volume across vessel boundary thresholds", fill: "url(#houseGalaxy)" },
        100: { label: "Basic dark cold brew imitation complete", fill: "url(#houseGalaxy)", foamFill: "rgba(120,80,200,0.3)" }
      }
    },
    signature: {
      requires: ["ColdBrewTower"],
      bgGlow: "rgba(99, 60, 200, 0.2)",
      defs: `<linearGradient id="sigGalaxy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a2888"/><stop offset="55%" stop-color="#1e1240"/><stop offset="100%" stop-color="#09050f"/></linearGradient>`,
      steps: {
        20: { label: "Loading coarsely ground single-origin dark roast into cold tower", fill: "transparent" },
        40: { label: "Allowing chilled filtered water to steep for 16 hours under cold brew tower", fill: "transparent" },
        60: { label: "Drawing slow cold-steeped concentrate extract down into vessel", fill: "url(#sigGalaxy)" },
        80: { label: "Liquid deepening into rich dark coffee extraction field", fill: "url(#sigGalaxy)" },
        100: { label: "Deep cold brew concentrate complete — cold tower yield locked", fill: "url(#sigGalaxy)", foamFill: "rgba(130,80,220,0.35)" }
      }
    },
    mastercraft: {
      requires: ["IceBucket", "ColdBrewTower", "ButterflyPeaJar"],
      bgGlow: "rgba(120, 60, 220, 0.4)",
      defs: `
        <linearGradient id="masterGalaxy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7c3aed"/><stop offset="45%" stop-color="#2e1065"/><stop offset="100%" stop-color="#050210"/></linearGradient>
        <radialGradient id="galaxyNebula" cx="50%" cy="60%" r="50%"><stop offset="0%" stop-color="#a78bfa" stop-opacity="0.35"/><stop offset="100%" stop-color="#2e1065" stop-opacity="0"/></radialGradient>
      `,
      steps: {
        20: { label: "Laying a bed of crushed clear ice across the bottom of the vessel", fill: "transparent", svgContent: `
          <circle cx="62" cy="210" r="6" fill="#dbeafe" opacity="0.6"/>
          <circle cx="78" cy="216" r="5" fill="#e0f2fe" opacity="0.7"/>
          <circle cx="120" cy="208" r="6" fill="#dbeafe" opacity="0.6"/>
          <circle cx="136" cy="214" r="5" fill="#e0f2fe" opacity="0.65"/>
          <circle cx="100" cy="220" r="7" fill="#ffffff" opacity="0.5"/>
        `},
        40: { label: "Steeping dried butterfly pea flowers to yield vivid indigo concentrate", fill: "transparent", svgContent: `
          <circle cx="62" cy="190" r="6" fill="#dbeafe" opacity="0.45"/>
          <circle cx="78" cy="196" r="5" fill="#e0f2fe" opacity="0.5"/>
          <circle cx="120" cy="188" r="6" fill="#dbeafe" opacity="0.45"/>
          <circle cx="136" cy="195" r="5" fill="#e0f2fe" opacity="0.5"/>
          <circle cx="84" cy="222" r="3" fill="#c4b5fd" opacity="0.6"/>
          <circle cx="112" cy="218" r="3.5" fill="#a78bfa" opacity="0.55"/>
        `},
        60: { label: "Pouring cold brew concentrate through butterfly pea infusion layer", fill: "url(#masterGalaxy)", svgContent: `
          <circle cx="62" cy="170" r="6" fill="#dbeafe" opacity="0.3"/>
          <circle cx="78" cy="176" r="5" fill="#e0f2fe" opacity="0.35"/>
          <circle cx="120" cy="168" r="6" fill="#dbeafe" opacity="0.3"/>
          <circle cx="136" cy="175" r="5" fill="#e0f2fe" opacity="0.35"/>
          <circle cx="90" cy="185" r="3" fill="#c4b5fd" opacity="0.5"/>
          <circle cx="110" cy="180" r="3.5" fill="#a78bfa" opacity="0.45"/>
        `},
        80: { label: "Nebula swirl expanding as cold brew merges with blue pea layer", fill: "url(#masterGalaxy)", svgContent: `
          <ellipse cx="100" cy="140" rx="52" ry="22" fill="url(#galaxyNebula)"/>
          <circle cx="70" cy="130" r="2" fill="#e9d5ff" opacity="0.7" style="animation:sparkle 2.2s ease-in-out infinite"/>
          <circle cx="128" cy="145" r="1.5" fill="#c4b5fd" opacity="0.65" style="animation:sparkle 1.8s ease-in-out infinite"/>
          <circle cx="100" cy="122" r="1.8" fill="#ddd6fe" opacity="0.6" style="animation:sparkle 2.5s ease-in-out infinite"/>
        `},
        100: { label: "Topping with stardust shimmer milk foam — a cup of the cosmos", fill: "url(#masterGalaxy)", foamFill: "rgba(196,165,255,0.6)", garnishSvg: `
          <circle cx="78" cy="50" r="1.8" fill="#e9d5ff" style="animation:sparkle 1.6s ease-in-out infinite"/>
          <circle cx="92" cy="47" r="2.5" fill="#ddd6fe" style="animation:sparkle 2.1s ease-in-out infinite"/>
          <circle cx="108" cy="52" r="2" fill="#c4b5fd" style="animation:sparkle 1.9s ease-in-out infinite"/>
          <circle cx="122" cy="46" r="1.5" fill="#e9d5ff" style="animation:sparkle 2.4s ease-in-out infinite"/>
          <circle cx="84" cy="56" r="1.2" fill="#a78bfa" style="animation:sparkle 1.7s ease-in-out infinite"/>
        `}
      }
    }
  },

  // ==========================================
  // LEGENDARY DRINKS (Highly Stylized Anime Aesthetics & Dynamic Fluid Systems)
  // ==========================================
  baristasSecretBrew: {
    allPossibleEquipment: ["SiphonBrewer", "SteamWand"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseSecret" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a4840"/><stop offset="50%" stop-color="#0a2820"/><stop offset="100%" stop-color="#021008"/></linearGradient>`,
      steps: {
        20: { label: "Checking core secret database registries", fill: "transparent" },
        40: { label: "Pouring standard leftover counter coffee drips", fill: "url(#houseSecret)" },
        60: { label: "Discovering teal cold brew in the back fridge", fill: "url(#houseSecret)" },
        80: { label: "Rising solution layouts matched inside framework", fill: "url(#houseSecret)" },
        100: { label: "Mystery teal blend finished", fill: "url(#houseSecret)", foamFill: "rgba(0,180,160,0.45)" }
      }
    },
    signature: {
      requires: ["SteamWand"],
      bgGlow: "rgba(20, 184, 166, 0.2)",
      defs: `<linearGradient id="animeSecretSig" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0d9488"/><stop offset="100%" stop-color="#111827"/></linearGradient>`,
      steps: {
        20: { label: "Grinding premium geisha bean lots meticulously", fill: "transparent" },
        40: { label: "Boiling pure distilled water to optimal thresholds", fill: "transparent" },
        60: { label: "Pouring highly-aerated clean coffee solution into cup", fill: "url(#animeSecretSig)" },
        80: { label: "Fluid level climbing across container layout lines", fill: "url(#animeSecretSig)" },
        100: { label: "Frothy light coffee ring layer locked in place", fill: "url(#animeSecretSig)", foamFill: "rgba(45, 212, 191, 0.4)" }
      }
    },
    mastercraft: {
      requires: ["SiphonBrewer", "SteamWand"],
      bgGlow: "rgba(20, 184, 166, 0.5)",
      defs: `
        <linearGradient id="animeSiphon" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2dd4bf"/><stop offset="50%" stop-color="#0f766e"/><stop offset="100%" stop-color="#042f2e"/></linearGradient>
        <radialGradient id="neonGlowCore" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#99f6e4" stop-opacity="0.8"/><stop offset="100%" stop-color="#0f766e" stop-opacity="0"/></radialGradient>
      `,
      steps: {
        20: { label: "Assembling custom dual-globe vacuum glass siphon columns", fill: "transparent" },
        40: { label: "Igniting butane burner to push boiling water into upper glass globe", fill: "transparent" },
        60: { label: "Extinguishing flame to draw crystal-clear brew down through cloth filters", fill: "url(#animeSiphon)", svgContent: `
          <circle cx="70" cy="92" r="35" fill="url(#neonGlowCore)"/>
        `, svgContentOutside: true },
        80: { label: "Decanting effervescent luminescent siphon fluid directly into cup", fill: "url(#animeSiphon)", svgContent: `
          <circle cx="70" cy="75" r="45" fill="url(#neonGlowCore)"/>
          <line x1="28" y1="110" x2="112" y2="110" stroke="#99f6e4" stroke-width="2" stroke-dasharray="4 6"/>
        `, svgContentOutside: true },
        100: { label: "Crowning with an ethereal microfoam cloud via delicate wand work", fill: "url(#animeSiphon)", foamFill: "#ccfbf1", garnishSvg: `
          <line x1="50" y1="54" x2="142" y2="54" stroke="#06b6d4" stroke-width="3" stroke-dasharray="1 5" stroke-linecap="round"/>
          <polygon points="96,40 100,48 108,48 102,53 104,61 96,56 88,61 90,53 84,48 92,48" fill="#2dd4bf"/>
        `}
      }
    }
  },

  goldenHourLatte: {
    allPossibleEquipment: ["EspressoMachine", "GoldFlakeJar", "SyrupShelf"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e0a830"/><stop offset="50%" stop-color="#8a5818"/><stop offset="100%" stop-color="#2e1a06"/></linearGradient>`,
      steps: {
        20: { label: "Adding cheap yellow food coloring dye matrices", fill: "transparent" },
        40: { label: "Pouring standard boiling industrial water channels", fill: "#fef9c3" },
        60: { label: "Mixing plain room temperature store milk volumes", fill: "url(#houseGold)" },
        80: { label: "Drink canvas matching alignment limits", fill: "url(#houseGold)" },
        100: { label: "Amber golden drink execution complete", fill: "url(#houseGold)", foamFill: "rgba(252,210,60,0.55)" }
      }
    },
    signature: {
      requires: ["EspressoMachine", "SyrupShelf"],
      bgGlow: "rgba(234, 179, 8, 0.2)",
      defs: `<linearGradient id="sigGoldHour" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#451a03"/></linearGradient>`,
      steps: {
        20: { label: "Injecting heavy synthetic golden honeycomb syrup lines", fill: "transparent" },
        40: { label: "Locking high extraction espresso hardware structures", fill: "transparent" },
        60: { label: "Running extraction over dairy to combine elements smoothly", fill: "url(#sigGoldHour)" },
        80: { label: "Fluid layers shifting inside layout borders", fill: "url(#sigGoldHour)" },
        100: { label: "Soft cream colored top foam head applied neatly", fill: "url(#sigGoldHour)", foamFill: "#fef9c3" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "GoldFlakeJar", "SyrupShelf"],
      bgGlow: "rgba(234, 179, 8, 0.55)",
      defs: `
        <linearGradient id="animeGold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#fef08a"/><stop offset="25%" stop-color="#fbbf24"/><stop offset="50%" stop-color="#f59e0b"/><stop offset="75%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#fef08a"/></linearGradient>
        <linearGradient id="goldLiquidBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="70%" stop-color="#b45309"/><stop offset="100%" stop-color="#451a03"/></linearGradient>
      `,
      steps: {
        20: { label: "Layering real, organic raw amber maple honey reduction fields", fill: "transparent" },
        40: { label: "Infusing thick dark vanilla bean pod syrup paste down walls", fill: "transparent" },
        60: { label: "Extracting high-fat blonde espresso crema down center targets", fill: "url(#goldLiquidBody)", svgContent: `
          <path d="M28 115 Q70 92 112 115 Z" fill="url(#animeGold)" opacity="0.65"/>
        `},
        80: { label: "Pouring shimmering metallic golden-amber liquid configuration", fill: "url(#goldLiquidBody)", svgContent: `
          <path d="M28 85 Q70 62 112 85 Z" fill="url(#animeGold)" opacity="0.85"/>
          <circle cx="50" cy="105" r="2.5" fill="#ffffff" opacity="0.8"/><circle cx="92" cy="95" r="2" fill="#ffffff" opacity="0.8"/>
        `},
        100: { label: "Floating multiple sheets of pure, genuine 24k gold leaf flakes", fill: "url(#goldLiquidBody)", foamFill: "url(#animeGold)", garnishSvg: `
          <polygon points="96,34 100,44 110,44 102,50 105,60 96,54 87,60 90,50 82,44 92,44" fill="#ffffff"/>
          <polygon points="65,48 68,53 74,53 70,56 71,62 65,59 59,62 60,56 56,53 62,53" fill="#ffffff" opacity="0.7"/>
          <polygon points="125,48 128,53 134,53 130,56 131,62 125,59 119,62 120,56 116,53 122,53" fill="#ffffff" opacity="0.7"/>
        `}
      }
    }
  },

  auroraBrew: {
    allPossibleEquipment: ["SiphonBrewer", "ColdBrewTower"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseAurora" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#303870"/><stop offset="50%" stop-color="#181e3a"/><stop offset="100%" stop-color="#060814"/></linearGradient>`,
      steps: {
        20: { label: "Pouring tap water into baseline container profiles", fill: "transparent" },
        40: { label: "Stirring in leftover dye powders from inventory", fill: "#2a3050" },
        60: { label: "Pouring deep space cold brew mixture", fill: "url(#houseAurora)" },
        80: { label: "Drink volume rising matching baseline metrics", fill: "url(#houseAurora)" },
        100: { label: "Deep space cold brew complete", fill: "url(#houseAurora)", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["ColdBrewTower"],
      bgGlow: "rgba(6, 182, 212, 0.22)",
      defs: `<linearGradient id="sigAurora" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0891b2"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>`,
      steps: {
        20: { label: "Aligning dedicated vertical drip tower columns", fill: "transparent" },
        40: { label: "Setting drip output calibrations to 1 drip per 2 seconds", fill: "transparent" },
        60: { label: "Pouring crisp, clean iced teal coffee concentrate lines", fill: "url(#sigAurora)" },
        80: { label: "Fluid matrix distribution expanding smoothly", fill: "url(#sigAurora)" },
        100: { label: "Clean monochromatic teal tone locked in place", fill: "url(#sigAurora)", foamFill: "transparent" }
      }
    },
    mastercraft: {
      requires: ["SiphonBrewer", "ColdBrewTower"],
      bgGlow: "rgba(139, 92, 246, 0.6)",
      defs: `
        <linearGradient id="animeAurora" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a78bfa"/><stop offset="33%" stop-color="#22d3ee"/><stop offset="66%" stop-color="#34d399"/><stop offset="100%" stop-color="#1e1b4b"/></linearGradient>
        <radialGradient id="auroraWave" cx="50%" cy="30%" r="60%"><stop offset="0%" stop-color="#67e8f9" stop-opacity="0.8"/><stop offset="50%" stop-color="#818cf8" stop-opacity="0.4"/><stop offset="100%" stop-color="#1e1b4b" stop-opacity="0"/></radialGradient>
      `,
      steps: {
        20: { label: "Engaging low-temperature nitrogen gas siphon brewing chambers", fill: "transparent" },
        40: { label: "Pulling slow drip tower coffee directly into vaporized fields", fill: "transparent" },
        60: { label: "Injecting blue spirulina flower concentrates under light vacuum pressures", fill: "url(#animeAurora)", svgContent: `
          <path d="M20 100 Q44 75 70 100 Q96 125 120 100 L120 180 L20 180 Z" fill="url(#auroraWave)" opacity="0.55"/>
        `, svgContentOutside: true },
        80: { label: "Dispensing mesmerizing green-to-purple iridescent northern lights gradient", fill: "url(#animeAurora)", svgContent: `
          <path d="M20 75 Q44 50 70 75 Q96 100 120 75 L120 180 L20 180 Z" fill="url(#auroraWave)" opacity="0.75"/>
          <circle cx="48" cy="95" r="2.5" fill="#ffffff" opacity="0.9"/><circle cx="92" cy="112" r="2" fill="#ffffff" opacity="0.85"/>
        `, svgContentOutside: true },
        100: { label: "Dynamic active color wave system established successfully", fill: "url(#animeAurora)", foamFill: "transparent" }
      }
    }
  },

  theVoid: {
    allPossibleEquipment: ["EspressoMachine", "GoldFlakeJar", "PourOverSet"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseVoid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a1440"/><stop offset="50%" stop-color="#140828"/><stop offset="100%" stop-color="#050210"/></linearGradient>`,
      steps: {
        20: { label: "Calibrating target core environment", fill: "transparent" },
        40: { label: "Readying framework configurations", fill: "transparent" },
        60: { label: "Extracting cosmic void essence", fill: "url(#houseVoid)" },
        80: { label: "Increasing target layout boundaries", fill: "url(#houseVoid)" },
        100: { label: "The Void stabilized", fill: "url(#houseVoid)", foamFill: "rgba(90,40,140,0.45)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(39, 39, 42, 0.3)",
      defs: `<linearGradient id="sigVoid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#220e36"/><stop offset="50%" stop-color="#100620"/><stop offset="100%" stop-color="#03010a"/></linearGradient>`,
      steps: {
        20: { label: "Engaging commercial high-bar pressure pump settings", fill: "transparent" },
        40: { label: "Priming group head infrastructure mechanics", fill: "transparent" },
        60: { label: "Executing absolute darkness extraction compression", fill: "url(#sigVoid)" },
        80: { label: "Macro volume expanding cleanly", fill: "url(#sigVoid)" },
        100: { label: "Developing structural deep-violet micro-crema layer", fill: "url(#sigVoid)", foamFill: "rgba(100,50,160,0.6)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "GoldFlakeJar", "PourOverSet"],
      bgGlow: "rgba(0, 0, 0, 0.95)",
      defs: `
        <radialGradient id="animeSingularity" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#000000"/><stop offset="55%" stop-color="#09090b"/><stop offset="85%" stop-color="#3f3f46"/><stop offset="100%" stop-color="#71717a"/></radialGradient>
        <linearGradient id="goldOrbit" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#eab308"/><stop offset="100%" stop-color="#ca8a04"/></linearGradient>
      `,
      steps: {
        20: { label: "Opening absolute gravitational spatial baseline models", fill: "transparent" },
        40: { label: "Configuring multi-axis layered dynamic filter grid arrays", fill: "transparent" },
        60: { label: "Stabilizing black hole central density singularity flow", fill: "url(#animeSingularity)", svgContent: `
          <ellipse cx="70" cy="158" rx="50" ry="12" fill="none" stroke="url(#goldOrbit)" stroke-width="2" opacity="0.55" stroke-dasharray="4 4" style="animation:voidOrbit 6s linear infinite"/>
        `, svgContentOutside: true },
        80: { label: "Compressing cosmic matter profiles into liquid fields", fill: "url(#animeSingularity)", svgContent: `
          <ellipse cx="70" cy="158" rx="58" ry="14" fill="none" stroke="url(#goldOrbit)" stroke-width="3.5" opacity="0.75" stroke-dasharray="8 4" style="animation:voidOrbit 5s linear infinite"/>
          <ellipse cx="70" cy="145" rx="38" ry="9" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" style="animation:voidOrbit 9s linear reverse infinite"/>
        `, svgContentOutside: true },
        100: { label: "Suspending high-contrast stardust gold ring system vectors", fill: "url(#animeSingularity)", foamFill: "transparent", garnishSvg: `
          <circle cx="96" cy="54" r="28" fill="none" stroke="url(#goldOrbit)" stroke-width="4" stroke-dasharray="12 6"/>
          <circle cx="96" cy="54" r="14" fill="#000000" stroke="#ffffff" stroke-width="2"/>
          <circle cx="74" cy="45" r="2" fill="#ffffff"/>
          <circle cx="118" cy="63" r="1.5" fill="#ffffff"/>
        `}
      }
    }
  },

  // ==========================================
  // CONTINUATION OF BASE ECONOMY MATRIX LISTINGS
  // ==========================================
  latte: {
    allPossibleEquipment: ["EspressoMachine", "SteamWand"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Positioning standard clear glass mug", fill: "transparent" },
        40: { label: "Pouring standard coffee base mix", fill: "#4a3227" },
        60: { label: "Pouring un-textured boiling table milk", fill: "#d4a870" },
        80: { label: "Rising fluid boundaries complete", fill: "#d4a870" },
        100: { label: "Basic Latte complete", fill: "#d4a870", foamFill: "rgba(255,255,255,0.5)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(217, 180, 143, 0.12)",
      defs: `<linearGradient id="sigLatte" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c4a493"/><stop offset="100%" stop-color="#52392c"/></linearGradient>`,
      steps: {
        20: { label: "Priming standard double basket profiles", fill: "transparent" },
        40: { label: "Extracting standard espresso foundations", fill: "#362218" },
        60: { label: "Pouring steamed milk layers smoothly into base", fill: "url(#sigLatte)" },
        80: { label: "Expanding drink layer distributions", fill: "url(#sigLatte)" },
        100: { label: "Soft cream colored top head applied neatly", fill: "url(#sigLatte)", foamFill: "rgba(255,255,255,0.7)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SteamWand"],
      bgGlow: "rgba(251, 191, 36, 0.15)",
      defs: `<linearGradient id="masterLatte" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e3cca1"/><stop offset="50%" stop-color="#b08e6b"/><stop offset="100%" stop-color="#4a2f16"/></linearGradient>`,
      steps: {
        20: { label: "Extracting complex sweet double shot blonde base", fill: "#261609" },
        40: { label: "Steaming rich alternative milk to optimal silky microfoam weight", fill: "#261609" },
        60: { label: "Pouring high-definition liquid velvet across espresso grids", fill: "url(#masterLatte)" },
        80: { label: "Developing balanced body presentation tiers", fill: "url(#masterLatte)" },
        100: { label: "Pouring thick micro-foam layer + Latte Rosetta Art design", fill: "url(#masterLatte)", foamFill: "#ffffff", garnishSvg: `
          <path d="M100,72 Q88,56 100,42 Q112,56 100,72 Z" fill="#b08e6b" opacity="0.6"/>
          <path d="M100,58 Q92,44 100,32 Q108,44 100,58 Z" fill="#ffffff"/>
        `}
      }
    }
  },

  cappuccino: {
    allPossibleEquipment: ["EspressoMachine", "SteamWand"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Setting standard wide ceramic bowl cup", fill: "transparent" },
        40: { label: "Pouring utility instant coffee mix blend", fill: "#3d2a21" },
        60: { label: "Adding loose spooned bubbly hot milk directly", fill: "#8a4820" },
        80: { label: "Merging volume layouts together", fill: "#8a4820" },
        100: { label: "Basic Cappuccino style ready", fill: "#8a4820", foamFill: "rgba(255,255,255,0.6)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(161, 98, 7, 0.12)",
      defs: `<linearGradient id="sigCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9e7b6c"/><stop offset="100%" stop-color="#473127"/></linearGradient>`,
      steps: {
        20: { label: "Running standard high pressure extraction sequences", fill: "transparent" },
        40: { label: "Filling vessel base with dark roast profiles", fill: "#2b1b13" },
        60: { label: "Streaming standard warm dairy elements cleanly", fill: "url(#sigCap)" },
        80: { label: "Drink volume boundary rising properly", fill: "url(#sigCap)" },
        100: { label: "Crowning with a prominent structural layer of foam", fill: "url(#sigCap)", foamFill: "rgba(255,255,255,0.85)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SteamWand"],
      bgGlow: "rgba(251, 191, 36, 0.18)",
      defs: `<linearGradient id="masterCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cca894"/><stop offset="50%" stop-color="#8c5f45"/><stop offset="100%" stop-color="#3d2110"/></linearGradient>`,
      steps: {
        20: { label: "Extracting standard target espresso profile arrays", fill: "#1f0f06" },
        40: { label: "Aerating whole milk to double its structural volume structures", fill: "#1f0f06" },
        60: { label: "Pouring thick microfoam down center marks to build pillows", fill: "url(#masterCap)" },
        80: { label: "Rising fluffy dry foam cap matrix steadily", fill: "url(#masterCap)" },
        100: { label: "Sifting fine premium organic cocoa powder lines directly", fill: "url(#masterCap)", foamFill: "#ffffff", garnishSvg: `
          <path d="M 60 48 Q 100 68 140 48" fill="none" stroke="#52301c" stroke-width="3" stroke-dasharray="4 4" stroke-linecap="round"/>
        `}
      }
    }
  },

  mocha: {
    allPossibleEquipment: ["EspressoMachine", "SteamWand", "SyrupShelf"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Adding thin commercial chocolate syrup lines", fill: "transparent" },
        40: { label: "Pouring utility generic coffee solution loops", fill: "#42281d" },
        60: { label: "Adding untextured grocery store whole milk", fill: "#2a0e0e" },
        80: { label: "Stirring solution channels manually together", fill: "#2a0e0e" },
        100: { label: "Basic sweet mocha mix complete", fill: "#2a0e0e", foamFill: "rgba(255,255,255,0.4)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(120, 67, 39, 0.12)",
      defs: `<linearGradient id="sigMocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#694635"/><stop offset="100%" stop-color="#2b180f"/></linearGradient>`,
      steps: {
        20: { label: "Melting premium chocolate compound bases down first", fill: "transparent" },
        40: { label: "Extracting standard double espresso shot modules", fill: "#1a0e08" },
        60: { label: "Combining espresso with chocolate fluids evenly", fill: "url(#sigMocha)" },
        80: { label: "Pouring standard hot dairy liquids down layout center", fill: "url(#sigMocha)" },
        100: { label: "Soft cream colored top foam head applied neatly", fill: "url(#sigMocha)", foamFill: "rgba(255,255,255,0.6)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SteamWand", "SyrupShelf"],
      bgGlow: "rgba(217, 119, 6, 0.22)",
      defs: `<linearGradient id="masterMocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#402315"/><stop offset="60%" stop-color="#241107"/><stop offset="100%" stop-color="#0a0300"/></linearGradient>`,
      steps: {
        20: { label: "Blending authentic dark Venezuelan single-origin liquid fudge", fill: "transparent" },
        40: { label: "Extracting high-fat specialty espresso ristretto shot lines", fill: "#120500" },
        60: { label: "Steaming rich alternative milk to optimal silky microfoam weight", fill: "url(#masterMocha)" },
        80: { label: "Integrating velvet microfoam structures into chocolate core bases", fill: "url(#masterMocha)" },
        100: { label: "Crowning with chocolate curls + perfect custom design layouts", fill: "url(#masterMocha)", foamFill: "#ffffff", garnishSvg: `
          <circle cx="85" cy="52" r="3" fill="#120500"/><circle cx="100" cy="48" r="2.5" fill="#120500"/><circle cx="115" cy="55" r="3" fill="#120500"/>
        `}
      }
    }
  },

  macchiato: {
    allPossibleEquipment: ["EspressoMachine", "SteamWand"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Placing short demitasse glass vessel", fill: "transparent" },
        40: { label: "Pouring standard utility dark roast mix lines", fill: "#1c1410" },
        60: { label: "Adding simple dollop of standard table milk foam", fill: "#1c1410" },
        80: { label: "Final alignment parsing complete cleanly", fill: "#1c1410" },
        100: { label: "Basic Macchiato ready", fill: "#1c1410", foamFill: "rgba(245,235,215,0.7)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(120, 67, 39, 0.15)",
      defs: `<linearGradient id="sigMacchShort" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#42291b"/><stop offset="100%" stop-color="#1f110a"/></linearGradient>`,
      steps: {
        20: { label: "Running high pressure atmospheric group head configurations", fill: "transparent" },
        40: { label: "Extracting intense short double espresso profile lines", fill: "url(#sigMacchShort)" },
        60: { label: "Expanding drink layouts within core container marks", fill: "url(#sigMacchShort)" },
        80: { label: "Awaiting final manual asset drops gracefully", fill: "url(#sigMacchShort)" },
        100: { label: "Marking surface center with loose steam milk foam spoon", fill: "url(#sigMacchShort)", foamFill: "rgba(255,255,255,0.8)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SteamWand"],
      bgGlow: "rgba(251, 191, 36, 0.22)",
      defs: `<linearGradient id="masterMacchShort" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2b1509"/><stop offset="100%" stop-color="#0d0400"/></linearGradient>`,
      steps: {
        20: { label: "Pre-heating heavy custom obsidian demitasse glass frames", fill: "transparent" },
        40: { label: "Extracting premium single-origin ristretto essence extractions", fill: "url(#masterMacchShort)" },
        60: { label: "Steaming tight high-density microfoam blocks inside pitcher", fill: "url(#masterMacchShort)" },
        80: { label: "Rising fluid oil lines settling smoothly together", fill: "url(#masterMacchShort)" },
        100: { label: "Staining espresso centers with an exact dollop of dense microfoam velvet", fill: "url(#masterMacchShort)", foamFill: "#ffffff", garnishSvg: `
          <circle cx="100" cy="54" r="8" fill="#ffffff"/>
          <circle cx="100" cy="54" r="5" fill="none" stroke="#2b1509" stroke-width="1.5"/>
        `}
      }
    }
  },

  irishCoffee: {
    allPossibleEquipment: ["PourOverSet", "MilkFrother"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Pouring standard filtered black coffee mix", fill: "#1c1410" },
        40: { label: "Adding generic brown table sugar granules", fill: "#1c1410" },
        60: { label: "Adding simple splash of cold table heavy cream", fill: "#3a2018" },
        80: { label: "Stirring solution layout paths together", fill: "#3a2018" },
        100: { label: "Basic sweet coffee variant complete", fill: "#3a2018", foamFill: "rgba(210,255,210,0.45)" }
      }
    },
    signature: {
      requires: ["PourOverSet"],
      bgGlow: "rgba(34, 197, 94, 0.12)",
      defs: `<linearGradient id="sigIrish" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2e1d15"/><stop offset="100%" stop-color="#140a05"/></linearGradient>`,
      steps: {
        20: { label: "Dissolving rich brown cane sugar into base vessels", fill: "transparent" },
        40: { label: "Running high temperature pour over drip routines manually", fill: "url(#sigIrish)" },
        60: { label: "Expanding baseline drink volume layout frameworks", fill: "url(#sigIrish)" },
        80: { label: "Fluid level climbing matching structural marks", fill: "url(#sigIrish)" },
        100: { label: "Floating Irish green-kissed cream layer", fill: "url(#sigIrish)", foamFill: "rgba(215,255,215,0.88)" }
      }
    },
    mastercraft: {
      requires: ["PourOverSet", "MilkFrother"],
      bgGlow: "rgba(52, 211, 153, 0.25)",
      defs: `<linearGradient id="masterIrish" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a0d06"/><stop offset="100%" stop-color="#050201"/></linearGradient>`,
      steps: {
        20: { label: "Caramelizing authentic raw brown sugar crystals over burners", fill: "transparent" },
        40: { label: "Executing precision target ratio pour-over filter infusions", fill: "url(#masterIrish)" },
        60: { label: "Using electric frother to shake up premium alternative cold thick cream", fill: "url(#masterIrish)" },
        80: { label: "Layering base components perfectly without disturbing solution lines", fill: "url(#masterIrish)" },
        100: { label: "Floating custom aerated green-kissed cream head flawlessly", fill: "url(#masterIrish)", foamFill: "rgba(220,255,220,0.95)", garnishSvg: `
          <g transform="translate(100,54)">
            <path d="M0,-12 Q8,-6 0,0 Q-8,-6 0,-12Z" fill="#34d399" opacity="0.75"/>
            <path d="M11,-4 Q6,6 0,0 Q5,-7 11,-4Z" fill="#34d399" opacity="0.75"/>
            <path d="M7,10 Q-3,8 0,0 Q6,4 7,10Z" fill="#34d399" opacity="0.75"/>
            <path d="M-7,10 Q3,8 0,0 Q-6,4 -7,10Z" fill="#34d399" opacity="0.75"/>
            <path d="M-11,-4 Q-6,6 0,0 Q-5,-7 -11,-4Z" fill="#34d399" opacity="0.75"/>
            <circle cx="0" cy="0" r="2.5" fill="#fbbf24"/>
          </g>
        `}
      }
    }
  },

  viennaCoffee: {
    allPossibleEquipment: ["PourOverSet", "MilkFrother"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Pouring standard utility black coffee blends", fill: "#211915" },
        40: { label: "Skipping specialized whipped cream injection modules", fill: "#211915" },
        60: { label: "Squirting standard store bought oil cream directly", fill: "#5a3820" },
        80: { label: "Merging solution stages rudimentarily", fill: "#5a3820" },
        100: { label: "Basic sweet coffee style finished", fill: "#5a3820", foamFill: "rgba(255,248,228,0.45)" }
      }
    },
    signature: {
      requires: ["PourOverSet"],
      bgGlow: "rgba(217, 119, 6, 0.12)",
      defs: `<linearGradient id="sigVienna" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3d271d"/><stop offset="100%" stop-color="#1c100a"/></linearGradient>`,
      steps: {
        20: { label: "Running manual filter grid drip processing profiles", fill: "transparent" },
        40: { label: "Filling container frames with clean black roast lines", fill: "url(#sigVienna)" },
        60: { label: "Expanding drink capacity layout lines cleanly", fill: "url(#sigVienna)" },
        80: { label: "Awaiting final topping additions patiently", fill: "url(#sigVienna)" },
        100: { label: "Crowning presentation with thick vanilla whipped cream", fill: "url(#sigVienna)", foamFill: "rgba(255,248,228,0.9)" }
      }
    },
    mastercraft: {
      requires: ["PourOverSet", "MilkFrother"],
      bgGlow: "rgba(251, 191, 36, 0.22)",
      defs: `<linearGradient id="masterVienna" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#24140c"/><stop offset="100%" stop-color="#0a0300"/></linearGradient>`,
      steps: {
        20: { label: "Calibrating long-extraction master filter grid arrangements", fill: "transparent" },
        40: { label: "Infusing high body single origin espresso bean matrices", fill: "url(#masterVienna)" },
        60: { label: "Using electric frother to build rigid peaks inside vanilla heavy creams", fill: "url(#masterVienna)" },
        80: { label: "Rising coffee solution lines leveling perfectly across grids", fill: "url(#masterVienna)" },
        100: { label: "Floating elegant vanilla-infused whipped cream peaks with cinnamon", fill: "url(#masterVienna)", foamFill: "#fff8e8", garnishSvg: `
          <path d="M 70 54 Q 100 15 130 54 Z" fill="#fff8e8"/>
          <circle cx="100" cy="36" r="3.5" fill="#92400e"/>
          <circle cx="88" cy="44" r="1.5" fill="#b45309" opacity="0.6"/>
          <circle cx="112" cy="44" r="1.5" fill="#b45309" opacity="0.6"/>
        `}
      }
    }
  },

  affogato: {
    allPossibleEquipment: ["EspressoMachine", "IceBucket"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Placing plain scoop of standard grocery retail ice cream", fill: "transparent" },
        40: { label: "Pouring leftover cold counter coffee liquid over scoop", fill: "#fffdf5" },
        60: { label: "Gelato meeting hot coffee, melting gracefully", fill: "#a06040" },
        80: { label: "Increasing base layout volume dimensions", fill: "#a06040" },
        100: { label: "Basic coffee dessert execution completed", fill: "#a06040", foamFill: "rgba(255,252,240,0.6)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(245, 158, 11, 0.15)",
      defs: `<linearGradient id="sigAffogato" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#593b2a"/><stop offset="100%" stop-color="#fffbeb"/></linearGradient>`,
      steps: {
        20: { label: "Depositing large uniform scoop of organic vanilla bean gelato", fill: "transparent" },
        40: { label: "Locking high extraction espresso machine configurations", fill: "transparent" },
        60: { label: "Extracting fresh hot double shot espresso directly over gelato scoop", fill: "url(#sigAffogato)" },
        80: { label: "Watching creamy thermal boundary lines interact fluidly", fill: "url(#sigAffogato)" },
        100: { label: "Melted espresso cream perimeter pool finalized cleanly", fill: "url(#sigAffogato)", foamFill: "transparent" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "IceBucket"],
      bgGlow: "rgba(217, 119, 6, 0.25)",
      defs: `<linearGradient id="masterAffogato" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b1e0e"/><stop offset="45%" stop-color="#915834"/><stop offset="80%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#fffdfa"/></linearGradient>`,
      steps: {
        20: { label: "Sculpting premium high density custom Madagascar artisan gelato spheres", fill: "transparent", svgContent: `
          <circle cx="100" cy="180" r="30" fill="#fffdf5" stroke="#fef3c7" stroke-width="2"/>
        `},
        40: { label: "Grinding elite dark roast reserve specialty coffee components", fill: "transparent", svgContent: `
          <circle cx="100" cy="180" r="30" fill="#fffdf5" stroke="#fef3c7" stroke-width="2"/>
        `},
        60: { label: "Extracting thick syrupy 94°C short ristretto extractions across gelato apex lines", fill: "url(#masterAffogato)", svgContent: `
          <circle cx="100" cy="180" r="30" fill="#fffdf5" stroke="#915834" stroke-width="3" opacity="0.8"/>
        `},
        80: { label: "Tracking deep marble crema streams eroding gelato wall profiles beautifully", fill: "url(#masterAffogato)" },
        100: { label: "Perfect hot-and-cold gourmet dessert melting equilibrium established", fill: "url(#masterAffogato)", foamFill: "transparent" }
      }
    }
  }
};
