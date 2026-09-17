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
        20: { label: "Warming the espresso cup", fill: "transparent" },
        40: { label: "Preparing the coffee", fill: "transparent" },
        60: { label: "Pouring a dark coffee base", fill: "url(#houseEspresso)" },
        80: { label: "Letting the coffee settle", fill: "url(#houseEspresso)" },
        100: { label: "House espresso ready", fill: "url(#houseEspresso)", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(120, 67, 39, 0.15)",
      defs: `<linearGradient id="sigEspresso" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a2c1b"/><stop offset="100%" stop-color="#1c0f0a"/></linearGradient>`,
      steps: {
        20: { label: "Warming the demitasse", fill: "transparent" },
        40: { label: "Tamping the freshly ground beans", fill: "transparent" },
        60: { label: "Pulling a single-origin espresso", fill: "url(#sigEspresso)" },
        80: { label: "Letting the crema settle", fill: "url(#sigEspresso)" },
        100: { label: "Finishing with golden crema", fill: "url(#sigEspresso)", foamFill: "rgba(222, 165, 112, 0.6)" }
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
        20: { label: "Gently soaking the coffee grounds", fill: "transparent" },
        40: { label: "Preparing a hand-tamped basket", fill: "transparent" },
        60: { label: "Pulling a syrupy ristretto", fill: "url(#masterEspresso)" },
        80: { label: "Letting rich coffee oils bloom", fill: "url(#masterEspresso)" },
        100: { label: "Finishing with tiger-striped crema", fill: "url(#masterEspresso)", foamFill: "url(#tigerCrema)" }
      }
    }
  },

  americano: {
    allPossibleEquipment: ["EspressoMachine"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseAmer" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3a2818"/><stop offset="50%" stop-color="#1e1208"/><stop offset="100%" stop-color="#080502"/></linearGradient>`,
      steps: {
        20: { label: "Setting out the glass", fill: "transparent" },
        40: { label: "Pouring hot water", fill: "rgba(190, 155, 110, 0.18)" },
        60: { label: "Adding a rich coffee concentrate", fill: "#2a1c14" },
        80: { label: "Stirring until smooth", fill: "#2a1c14" },
        100: { label: "House americano ready", fill: "#2a1c14", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(120, 67, 39, 0.08)",
      defs: `<linearGradient id="sigAmer" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38251c"/><stop offset="100%" stop-color="#170e0a"/></linearGradient>`,
      steps: {
        20: { label: "Pouring fresh hot water", fill: "rgba(195, 165, 120, 0.22)" },
        40: { label: "Preparing a double espresso", fill: "rgba(195, 165, 120, 0.22)" },
        60: { label: "Pulling espresso over the water", fill: "url(#sigAmer)" },
        80: { label: "Letting the coffee mingle", fill: "url(#sigAmer)" },
        100: { label: "Keeping a delicate crema ring", fill: "url(#sigAmer)", foamFill: "rgba(197, 142, 97, 0.35)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(217, 119, 6, 0.15)",
      defs: `<linearGradient id="masterAmer" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#543310"/><stop offset="30%" stop-color="#1c1007"/><stop offset="100%" stop-color="#0b0502"/></linearGradient>`,
      steps: {
        20: { label: "Preparing the hot water", fill: "rgba(200, 170, 120, 0.25)" },
        40: { label: "Grinding a fragrant light roast", fill: "rgba(200, 170, 120, 0.25)" },
        60: { label: "Layering espresso over the water", fill: "url(#masterAmer)" },
        80: { label: "Letting the coffee bloom", fill: "url(#masterAmer)" },
        100: { label: "Light-roast americano ready", fill: "url(#masterAmer)", foamFill: "transparent" }
      }
    }
  },

  flatWhite: {
    allPossibleEquipment: ["EspressoMachine", "SteamWand"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Warming the flat white cup", fill: "transparent" },
        40: { label: "Pouring a strong coffee base", fill: "#543d32" },
        60: { label: "Adding warm milk", fill: "#c8a878" },
        80: { label: "Blending the coffee and milk", fill: "#c8a878" },
        100: { label: "House flat white ready", fill: "#c8a878", foamFill: "rgba(255,255,255,0.55)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(217, 180, 143, 0.15)",
      defs: `<linearGradient id="sigFlat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a88574"/><stop offset="100%" stop-color="#4a3227"/></linearGradient>`,
      steps: {
        20: { label: "Preparing a double espresso", fill: "transparent" },
        40: { label: "Pulling the espresso shots", fill: "#362218" },
        60: { label: "Pouring warm milk over espresso", fill: "url(#sigFlat)" },
        80: { label: "Letting the milk mingle", fill: "url(#sigFlat)" },
        100: { label: "Finishing with a light milk foam", fill: "url(#sigFlat)", foamFill: "rgba(255,255,255,0.75)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SteamWand"],
      bgGlow: "rgba(251, 191, 36, 0.15)",
      defs: `<linearGradient id="masterFlat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#dfc3b3"/><stop offset="40%" stop-color="#ba9684"/><stop offset="100%" stop-color="#5e3d2c"/></linearGradient>`,
      steps: {
        20: { label: "Pulling a short double ristretto", fill: "#211108" },
        40: { label: "Steaming silky whole milk", fill: "#211108" },
        60: { label: "Pouring milk close to the surface", fill: "url(#masterFlat)" },
        80: { label: "Blending milk into rich espresso", fill: "url(#masterFlat)" },
        100: { label: "Finishing with a simple milk dot", fill: "url(#masterFlat)", foamFill: "#ffffff", garnishSvg: `
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
        20: { label: "Spooning in sweet cocoa", fill: "transparent" },
        40: { label: "Adding hot water", fill: "#24140a" },
        60: { label: "Stirring the cocoa smooth", fill: "#6a3010" },
        80: { label: "Pouring in a splash of milk", fill: "#6a3010" },
        100: { label: "House hot chocolate ready", fill: "#6a3010", foamFill: "rgba(100,45,20,0.5)" }
      }
    },
    signature: {
      requires: ["SteamWand"],
      bgGlow: "rgba(146, 64, 14, 0.15)",
      defs: `<linearGradient id="sigChoc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5c3a26"/><stop offset="100%" stop-color="#2b170c"/></linearGradient>`,
      steps: {
        20: { label: "Melting chocolate chips in milk", fill: "transparent" },
        40: { label: "Warming the chocolate milk", fill: "transparent" },
        60: { label: "Steaming until smooth", fill: "url(#sigChoc)" },
        80: { label: "Pouring rich hot chocolate", fill: "url(#sigChoc)" },
        100: { label: "Finishing with delicate cocoa foam", fill: "url(#sigChoc)", foamFill: "rgba(69, 41, 24, 0.6)" }
      }
    },
    mastercraft: {
      requires: ["SteamWand"],
      bgGlow: "rgba(146, 64, 14, 0.25)",
      defs: `<linearGradient id="masterChoc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3d2010"/><stop offset="50%" stop-color="#241107"/><stop offset="100%" stop-color="#120500"/></linearGradient>`,
      steps: {
        20: { label: "Mixing dark cocoa with cream", fill: "transparent" },
        40: { label: "Steaming the chocolate until silky", fill: "transparent" },
        60: { label: "Building a rich chocolate body", fill: "url(#masterChoc)" },
        80: { label: "Pouring glossy dark chocolate", fill: "url(#masterChoc)" },
        100: { label: "Finishing with chocolate drizzle", fill: "url(#masterChoc)", foamFill: "rgba(255,255,255,0.05)", garnishSvg: `
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
        20: { label: "Spooning matcha into the bowl", fill: "transparent" },
        40: { label: "Mixing matcha with warm water", fill: "#3b5237" },
        60: { label: "Pouring in fresh milk", fill: "#8aaa70" },
        80: { label: "Blending until smooth", fill: "#8aaa70" },
        100: { label: "House matcha latte ready", fill: "#8aaa70", foamFill: "rgba(210,240,200,0.55)" }
      }
    },
    signature: {
      requires: ["MilkFrother"],
      bgGlow: "rgba(34, 197, 94, 0.12)",
      defs: `<linearGradient id="sigMatcha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#769c6d"/><stop offset="100%" stop-color="#3c5934"/></linearGradient>`,
      steps: {
        20: { label: "Whisking the green tea smooth", fill: "#273b21" },
        40: { label: "Frothing the milk", fill: "#273b21" },
        60: { label: "Pouring milk over the matcha", fill: "url(#sigMatcha)" },
        80: { label: "Letting green tea and milk mingle", fill: "url(#sigMatcha)" },
        100: { label: "Finishing with a cloud of milk foam", fill: "url(#sigMatcha)", foamFill: "#f0fdf4" }
      }
    },
    mastercraft: {
      requires: ["SteamWand", "MilkFrother"],
      bgGlow: "rgba(34, 197, 94, 0.25)",
      defs: `<linearGradient id="masterMatcha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#94be8b"/><stop offset="50%" stop-color="#658e5c"/><stop offset="100%" stop-color="#233b1e"/></linearGradient>`,
      steps: {
        20: { label: "Sifting ceremonial matcha", fill: "transparent" },
        40: { label: "Whisking a bright green froth", fill: "#1c3017" },
        60: { label: "Pouring silky milk into matcha", fill: "url(#masterMatcha)" },
        80: { label: "Letting the green and cream blend", fill: "url(#masterMatcha)" },
        100: { label: "Drawing a matcha rosette", fill: "url(#masterMatcha)", foamFill: "#ffffff", garnishSvg: `
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
        20: { label: "Warming the egg coffee cup", fill: "transparent" },
        40: { label: "Pouring rich black coffee", fill: "#241812" },
        60: { label: "Adding sweet egg cream", fill: "#f0d870" },
        80: { label: "Letting the cream meet the coffee", fill: "#2a1208" },
        100: { label: "House egg coffee ready", fill: "#2a1208", foamFill: "rgba(248,220,100,0.7)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(245, 158, 11, 0.12)",
      defs: `<linearGradient id="sigEggBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3d2619"/><stop offset="100%" stop-color="#1c0f08"/></linearGradient>`,
      steps: {
        20: { label: "Warming the serving cup", fill: "transparent" },
        40: { label: "Pulling a bold espresso", fill: "url(#sigEggBase)" },
        60: { label: "Whisking egg cream with condensed milk", fill: "url(#sigEggBase)" },
        80: { label: "Pouring the dark coffee base", fill: "url(#sigEggBase)" },
        100: { label: "Spooning on golden egg cream", fill: "url(#sigEggBase)", foamFill: "#fff7ed" }
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
        20: { label: "Pulling a rich Robusta espresso", fill: "url(#masterEggBase)" },
        40: { label: "Blending egg cream with honey and condensed milk", fill: "url(#masterEggBase)" },
        60: { label: "Whipping the cream until fluffy", fill: "url(#masterEggBase)" },
        80: { label: "Pouring coffee beneath the golden cream", fill: "url(#masterEggBase)" },
        100: { label: "Crowning with a cloud of egg cream", fill: "url(#masterEggBase)", foamFill: "url(#eggCustard)", garnishSvg: `
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
        20: { label: "Setting out the milk tea glass", fill: "transparent" },
        40: { label: "Pouring freshly brewed milk tea", fill: "#b8906a" },
        60: { label: "Adding more creamy tea", fill: "#b8906a" },
        80: { label: "Letting the milk tea settle", fill: "#b8906a" },
        100: { label: "House milk tea ready", fill: "#b8906a", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["BobaCooker", "MilkFrother"],
      bgGlow: "rgba(217, 180, 143, 0.2)",
      defs: `<linearGradient id="sigBobaFluid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c9a070"/><stop offset="100%" stop-color="#8a5838"/></linearGradient>`,
      steps: {
        20: { label: "Spooning in chewy boba pearls", fill: "transparent", svgContent: `
          <circle cx="38" cy="140" r="7" fill="#111827"/><circle cx="58" cy="145" r="7" fill="#1f2937"/>
          <circle cx="78" cy="141" r="7" fill="#111827"/><circle cx="98" cy="146" r="7" fill="#374151"/>
          <circle cx="116" cy="142" r="7" fill="#1f2937"/><circle cx="50" cy="132" r="6" fill="#1f2937"/>
          <circle cx="88" cy="134" r="6" fill="#111827"/>
        `},
        40: { label: "Letting the pearls settle", fill: "transparent" },
        60: { label: "Pouring creamy milk tea", fill: "url(#sigBobaFluid)" },
        80: { label: "Filling around the boba", fill: "url(#sigBobaFluid)" },
        100: { label: "Topping with a soft milk foam", fill: "url(#sigBobaFluid)", foamFill: "rgba(255,255,255,0.9)" }
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
        20: { label: "Adding caramelized brown sugar syrup", fill: "url(#bsDrizzle)" },
        40: { label: "Spooning in warm boba pearls", fill: "url(#bsDrizzle)", svgContent: `
          <circle cx="36" cy="138" r="7" fill="#1c0a00"/><circle cx="56" cy="143" r="7" fill="#2d1305"/>
          <circle cx="76" cy="140" r="7" fill="#1c0a00"/><circle cx="96" cy="145" r="7" fill="#451a03"/>
          <circle cx="114" cy="139" r="7" fill="#1c0a00"/><circle cx="48" cy="130" r="6.5" fill="#2d1305"/>
          <circle cx="68" cy="133" r="6.5" fill="#1c0a00"/><circle cx="88" cy="128" r="6.5" fill="#451a03"/>
        `},
        60: { label: "Adding fresh ice cubes", fill: "url(#masterBobaFluid)", svgContent: `
          <rect x="68" y="145" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.45" transform="rotate(18 80 157)"/>
          <rect x="108" y="135" width="26" height="26" rx="4" fill="#e0f2fe" opacity="0.55" transform="rotate(-12 121 148)"/>
        `},
        80: { label: "Pouring silky milk tea over the syrup", fill: "url(#masterBobaFluid)" },
        100: { label: "Letting brown sugar bloom through the milk", fill: "url(#masterBobaFluid)", foamFill: "#ffffff" }
      }
    }
  },

  caramelMacchiato: {
    allPossibleEquipment: ["EspressoMachine", "SyrupShelf", "SteamWand"],
    house: {
      bgGlow: "transparent",
      steps: {
        20: { label: "Adding a little caramel syrup", fill: "transparent" },
        40: { label: "Pouring warm milk", fill: "#f4ede8" },
        60: { label: "Adding a dark coffee base", fill: "#2e1008" },
        80: { label: "Stirring coffee and caramel together", fill: "#2e1008" },
        100: { label: "House caramel coffee ready", fill: "#2e1008", foamFill: "rgba(255,255,255,0.55)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(180, 83, 9, 0.12)",
      defs: `<linearGradient id="sigMacch" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a1208"/><stop offset="55%" stop-color="#8a5020"/><stop offset="100%" stop-color="#fffbeb"/></linearGradient>`,
      steps: {
        20: { label: "Adding a caramel syrup base", fill: "transparent" },
        40: { label: "Pouring warm whole milk", fill: "#fffbeb" },
        60: { label: "Pouring espresso over the milk", fill: "url(#sigMacch)" },
        80: { label: "Letting the coffee settle into the milk", fill: "url(#sigMacch)" },
        100: { label: "Finishing with a soft cream cap", fill: "url(#sigMacch)", foamFill: "rgba(255,255,255,0.65)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SyrupShelf", "SteamWand"],
      bgGlow: "rgba(245, 158, 11, 0.22)",
      defs: `<linearGradient id="masterMacch" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3d1d06"/><stop offset="35%" stop-color="#8a5022"/><stop offset="70%" stop-color="#f5e6d3"/><stop offset="100%" stop-color="#fffdfa"/></linearGradient>`,
      steps: {
        20: { label: "Adding vanilla bean syrup", fill: "transparent" },
        40: { label: "Steaming silky milk", fill: "#fffdfa" },
        60: { label: "Slowly pouring espresso over the milk", fill: "url(#masterMacch)" },
        80: { label: "Letting the espresso layers soften", fill: "url(#masterMacch)" },
        100: { label: "Drizzling caramel over the foam", fill: "url(#masterMacch)", foamFill: "#ffffff", garnishSvg: `
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
        20: { label: "Setting out the coffee glass", fill: "transparent" },
        40: { label: "Preparing the coffee filter", fill: "transparent" },
        60: { label: "Brewing a dark Robusta coffee", fill: "#fce8b3" },
        80: { label: "Filling the glass with coffee", fill: "#1f1610" },
        100: { label: "House Vietnamese coffee ready", fill: "#1f1610", foamFill: "transparent" }
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
        20: { label: "Spooning in sweet condensed milk", fill: "url(#condensed)" },
        40: { label: "Preparing the espresso basket", fill: "url(#condensed)" },
        60: { label: "Pulling espresso over condensed milk", fill: "url(#vietCoffeeSig)" },
        80: { label: "Letting the coffee and milk settle", fill: "url(#vietCoffeeSig)" },
        100: { label: "Finishing with a delicate crema", fill: "url(#vietCoffeeSig)", foamFill: "rgba(184, 131, 88, 0.5)" }
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
        20: { label: "Adding a rich condensed milk base", fill: "url(#vietCondensedMaster)" },
        40: { label: "Filling the glass with crushed ice", fill: "url(#vietCondensedMaster)", svgContent: `
          <circle cx="65" cy="200" r="5" fill="#e0f2fe" opacity="0.7"/>
          <circle cx="80" cy="205" r="6" fill="#ffffff" opacity="0.8"/>
          <circle cx="115" cy="198" r="5" fill="#e0f2fe" opacity="0.6"/>
          <circle cx="130" cy="203" r="7" fill="#ffffff" opacity="0.8"/>
          <circle cx="95" cy="192" r="6" fill="#e0f2fe" opacity="0.7"/>
        `},
        60: { label: "Slowly brewing coffee through a phin", fill: "url(#vietMarble)", svgContent: `
          <circle cx="65" cy="160" r="5" fill="#e0f2fe" opacity="0.5"/>
          <circle cx="82" cy="145" r="6" fill="#ffffff" opacity="0.6"/>
          <circle cx="118" cy="155" r="5" fill="#e0f2fe" opacity="0.5"/>
          <circle cx="128" cy="138" r="7" fill="#ffffff" opacity="0.6"/>
        `},
        80: { label: "Letting coffee ripple through sweet milk", fill: "url(#vietMarble)" },
        100: { label: "Finishing with creamy coffee swirls", fill: "url(#vietMarble)", foamFill: "transparent" }
      }
    }
  },

  lavenderHoneyLatte: {
    allPossibleEquipment: ["EspressoMachine", "SyrupShelf", "SteamWand"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseLavender" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c8a8d8"/><stop offset="55%" stop-color="#9070b0"/><stop offset="100%" stop-color="#3c2850"/></linearGradient>`,
      steps: {
        20: { label: "Adding lavender syrup", fill: "transparent" },
        40: { label: "Pouring a little hot water", fill: "#ebdcf0" },
        60: { label: "Adding a rich coffee base", fill: "url(#houseLavender)" },
        80: { label: "Stirring in the lavender sweetness", fill: "url(#houseLavender)" },
        100: { label: "House lavender coffee ready", fill: "url(#houseLavender)", foamFill: "rgba(220,190,248,0.6)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(168, 85, 247, 0.15)",
      defs: `<linearGradient id="sigLavender" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#705675"/><stop offset="100%" stop-color="#3d2c40"/></linearGradient>`,
      steps: {
        20: { label: "Spooning in amber honey", fill: "transparent" },
        40: { label: "Pulling a double espresso", fill: "#2b1830" },
        55: { label: "Pouring warm milk", fill: "url(#sigLavender)" },
        80: { label: "Blending honey and lavender coffee", fill: "url(#sigLavender)" },
        100: { label: "Finishing with a light milk foam", fill: "url(#sigLavender)", foamFill: "rgba(243, 232, 255, 0.5)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SyrupShelf", "SteamWand"],
      bgGlow: "rgba(168, 85, 247, 0.3)",
      defs: `<linearGradient id="masterLavender" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d8b4fe"/><stop offset="40%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>`,
      steps: {
        20: { label: "Steeping culinary lavender syrup", fill: "transparent" },
        40: { label: "Adding fragrant wildflower honey", fill: "transparent" },
        60: { label: "Steaming silky milk", fill: "#4c1d95" },
        80: { label: "Pouring espresso into lavender milk", fill: "url(#masterLavender)" },
        100: { label: "Scattering lavender blossoms over the foam", fill: "url(#masterLavender)", foamFill: "#ffffff", garnishSvg: `
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
        20: { label: "Adding a splash of water", fill: "transparent" },
        40: { label: "Pouring chilled milk", fill: "#fcfbfa" },
        60: { label: "Stirring coffee with sugar and warm water", fill: "#fffbeb" },
        80: { label: "Pouring sweet coffee over the milk", fill: "#ca8a04" },
        100: { label: "House dalgona coffee ready", fill: "#ca8a04", foamFill: "rgba(180,80,20,0.7)" }
      }
    },
    signature: {
      requires: ["MilkFrother"],
      bgGlow: "rgba(234, 179, 8, 0.15)",
      steps: {
        20: { label: "Pouring chilled fresh milk", fill: "#fffbeb" },
        40: { label: "Mixing coffee with sugar and hot water", fill: "#fffbeb" },
        60: { label: "Whipping the coffee until airy", fill: "#fffbeb" },
        80: { label: "Letting the chilled milk settle", fill: "#fffbeb" },
        100: { label: "Spooning whipped coffee over the milk", fill: "#fffbeb", foamFill: "#b45309" }
      }
    },
    mastercraft: {
      requires: ["MilkFrother", "IceBucket"],
      bgGlow: "rgba(234, 179, 8, 0.3)",
      defs: `<linearGradient id="dalgonaCream" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b45309"/><stop offset="100%" stop-color="#78350f"/></linearGradient>`,
      steps: {
        20: { label: "Preparing a chilled milk base", fill: "#fffdfa" },
        40: { label: "Adding clear ice cubes", fill: "#fffdfa", svgContent: `
          <rect x="72" y="160" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.5" transform="rotate(20 84 172)"/>
          <rect x="104" y="150" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.6" transform="rotate(-15 116 162)"/>
        `},
        60: { label: "Whipping coffee into a glossy cream", fill: "#fffdfa", svgContent: `
          <rect x="72" y="160" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.3" transform="rotate(20 84 172)"/>
          <rect x="104" y="150" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.4" transform="rotate(-15 116 162)"/>
        `},
        80: { label: "Pouring milk around the ice", fill: "#fffdfa" },
        100: { label: "Sculpting soft peaks of coffee foam", fill: "#fffdfa", foamFill: "url(#dalgonaCream)", garnishSvg: `
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
        20: { label: "Pouring cool water", fill: "transparent" },
        40: { label: "Mixing in green matcha", fill: "#f5f0e8" },
        60: { label: "Pouring the matcha tea", fill: "#3a7040" },
        80: { label: "Letting the green tea settle", fill: "#3a7040" },
        100: { label: "House iced matcha ready", fill: "#3a7040", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["OatMilkDispenser"],
      bgGlow: "rgba(74, 222, 128, 0.15)",
      defs: `<linearGradient id="sigIcedMatcha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#557d4f"/><stop offset="100%" stop-color="#f5fafd"/></linearGradient>`,
      steps: {
        20: { label: "Preparing chilled oat milk", fill: "#f5fafd" },
        40: { label: "Pouring a creamy oat milk base", fill: "#f5fafd" },
        60: { label: "Layering whisked matcha over oat milk", fill: "url(#sigIcedMatcha)" },
        80: { label: "Letting the green tea meet the milk", fill: "url(#sigIcedMatcha)" },
        100: { label: "Finishing with soft green and cream layers", fill: "url(#sigIcedMatcha)", foamFill: "transparent" }
      }
    },
    mastercraft: {
      requires: ["IceBucket", "OatMilkDispenser"],
      bgGlow: "rgba(74, 222, 128, 0.3)",
      defs: `<linearGradient id="masterIcedMatcha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#22c55e"/><stop offset="50%" stop-color="#15803d"/><stop offset="100%" stop-color="#f0fdf4"/></linearGradient>`,
      steps: {
        20: { label: "Pouring rich oat milk", fill: "#f0fdf4" },
        40: { label: "Adding clear ice cubes", fill: "#f0fdf4", svgContent: `
          <rect x="65" y="150" width="26" height="26" rx="4" fill="#e0f2fe" opacity="0.5" transform="rotate(10 78 163)"/>
          <rect x="105" y="140" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.6" transform="rotate(-25 117 152)"/>
        `},
        60: { label: "Whisking stone-ground matcha", fill: "url(#masterIcedMatcha)", svgContent: `
          <rect x="65" y="150" width="26" height="26" rx="4" fill="#e0f2fe" opacity="0.3" transform="rotate(10 78 163)"/>
          <rect x="105" y="140" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.4" transform="rotate(-25 117 152)"/>
        `},
        80: { label: "Pouring matcha gently over the ice", fill: "url(#masterIcedMatcha)" },
        100: { label: "Letting green matcha clouds drift through the milk", fill: "url(#masterIcedMatcha)", foamFill: "transparent" }
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
        20: { label: "Adding a little rose syrup", fill: "transparent" },
        40: { label: "Pouring a splash of hot water", fill: "#fcebf0" },
        60: { label: "Mixing in warm milk", fill: "#c89060" },
        80: { label: "Blending the rose milk smooth", fill: "#c89060" },
        100: { label: "House rose latte ready", fill: "#c89060", foamFill: "rgba(255,215,160,0.5)" }
      }
    },
    signature: {
      requires: ["EspressoMachine", "PetalPress"],
      bgGlow: "rgba(244, 63, 94, 0.18)",
      defs: `<linearGradient id="sigRose" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e0a870"/><stop offset="55%" stop-color="#c07060"/><stop offset="100%" stop-color="#703040"/></linearGradient>`,
      steps: {
        20: { label: "Preparing fragrant rose petals", fill: "transparent" },
        40: { label: "Pressing a delicate rose infusion", fill: "transparent" },
        60: { label: "Pulling a blonde espresso", fill: "url(#sigRose)" },
        80: { label: "Pouring warm rose milk", fill: "url(#sigRose)" },
        100: { label: "Finishing with a rosy foam cap", fill: "url(#sigRose)", foamFill: "rgba(255,205,155,0.75)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "PetalPress", "GoldFlakeJar"],
      bgGlow: "rgba(244, 63, 94, 0.3)",
      defs: `<linearGradient id="masterRose" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0c890"/><stop offset="45%" stop-color="#d08068"/><stop offset="100%" stop-color="#883050"/></linearGradient>`,
      steps: {
        20: { label: "Preparing a fragrant rose infusion", fill: "transparent" },
        40: { label: "Adding a touch of golden sweetness", fill: "transparent" },
        60: { label: "Blending rose milk with silky foam", fill: "url(#masterRose)" },
        80: { label: "Pouring shimmering rose-gold milk", fill: "url(#masterRose)" },
        100: { label: "Floating edible gold flakes over the foam", fill: "url(#masterRose)", foamFill: "#ffe8d0", garnishSvg: `
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
        20: { label: "Setting out the espresso glass", fill: "transparent" },
        40: { label: "Preparing a little warm water", fill: "rgba(80,60,120,0.25)" },
        60: { label: "Adding a deep-roasted coffee base", fill: "url(#houseMidnight)" },
        80: { label: "Letting the dark coffee settle", fill: "url(#houseMidnight)" },
        100: { label: "House midnight coffee ready", fill: "url(#houseMidnight)", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(63, 63, 70, 0.18)",
      defs: `<linearGradient id="sigMidnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#24212e"/><stop offset="100%" stop-color="#0b0a0f"/></linearGradient>`,
      steps: {
        20: { label: "Warming the espresso machine", fill: "transparent" },
        40: { label: "Pulling a dark-roast espresso", fill: "url(#sigMidnight)" },
        60: { label: "Pouring the rich espresso", fill: "url(#sigMidnight)" },
        80: { label: "Letting the dark coffee settle", fill: "url(#sigMidnight)" },
        100: { label: "Finishing with a dark crema ring", fill: "url(#sigMidnight)", foamFill: "rgba(63, 63, 70, 0.4)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "IceBucket"],
      bgGlow: "rgba(39, 39, 42, 0.35)",
      defs: `<linearGradient id="masterMidnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#09090b"/><stop offset="60%" stop-color="#18181b"/><stop offset="100%" stop-color="#020205"/></linearGradient>`,
      steps: {
        20: { label: "Chilling the serving glass", fill: "transparent" },
        40: { label: "Adding crystal-clear ice", fill: "transparent", svgContent: `
          <rect x="70" y="150" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.35" transform="rotate(30 82 162)"/>
          <rect x="106" y="140" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.45" transform="rotate(-20 118 152)"/>
        `},
        60: { label: "Pulling a bold ristretto", fill: "url(#masterMidnight)", svgContent: `
          <rect x="70" y="150" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.2" transform="rotate(30 82 162)"/>
          <rect x="106" y="140" width="24" height="24" rx="4" fill="#e0f2fe" opacity="0.25" transform="rotate(-20 118 152)"/>
        `},
        80: { label: "Pouring dark espresso over the ice", fill: "url(#masterMidnight)" },
        100: { label: "Finishing with a twist of citrus", fill: "url(#masterMidnight)", foamFill: "transparent", garnishSvg: `
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
        20: { label: "Adding cherry blossom syrup", fill: "transparent" },
        40: { label: "Pouring warm milk", fill: "#faebd7" },
        60: { label: "Stirring to a soft blush", fill: "#f0d8e4" },
        80: { label: "Letting the blossom milk settle", fill: "#c8a0b8" },
        100: { label: "House cherry blossom latte ready", fill: "#c8a0b8", foamFill: "rgba(255,240,248,0.6)" }
      }
    },
    signature: {
      requires: ["EspressoMachine", "PetalPress"],
      bgGlow: "rgba(236, 72, 153, 0.18)",
      defs: `<linearGradient id="sigSakura" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f4dce8"/><stop offset="55%" stop-color="#c898b0"/><stop offset="100%" stop-color="#7a3858"/></linearGradient>`,
      steps: {
        20: { label: "Preparing culinary cherry blossoms", fill: "transparent" },
        40: { label: "Pressing a delicate blossom infusion", fill: "transparent" },
        60: { label: "Pulling a light-roast espresso", fill: "url(#sigSakura)" },
        80: { label: "Pouring warm blossom milk", fill: "url(#sigSakura)" },
        100: { label: "Finishing with a soft mauve foam", fill: "url(#sigSakura)", foamFill: "#fdf0f8" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "PetalPress", "SteamWand"],
      bgGlow: "rgba(236, 72, 153, 0.35)",
      defs: `<linearGradient id="masterSakura" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fce8f0"/><stop offset="50%" stop-color="#d8a8c0"/><stop offset="100%" stop-color="#7a3858"/></linearGradient>`,
      steps: {
        20: { label: "Preparing a fragrant sakura infusion", fill: "transparent" },
        40: { label: "Steaming velvety milk", fill: "transparent" },
        60: { label: "Pouring milk into the blossom base", fill: "url(#masterSakura)" },
        80: { label: "Letting the pastel colors mingle", fill: "url(#masterSakura)" },
        100: { label: "Placing sakura blossoms on whipped pink cream", fill: "url(#masterSakura)", foamFill: "#fdf8fc", garnishSvg: `
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
    allPossibleEquipment: ["IceBucket", "ColdBrewTower"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseGalaxy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a1a4a"/><stop offset="55%" stop-color="#16102a"/><stop offset="100%" stop-color="#080510"/></linearGradient>`,
      steps: {
        20: { label: "Pouring a cold brew base", fill: "transparent" },
        40: { label: "Adding cool water", fill: "#22183a" },
        60: { label: "Adding a splash of blue infusion", fill: "url(#houseGalaxy)" },
        80: { label: "Letting the dark colors mingle", fill: "url(#houseGalaxy)" },
        100: { label: "House galaxy cold brew ready", fill: "url(#houseGalaxy)", foamFill: "rgba(120,80,200,0.3)" }
      }
    },
    signature: {
      requires: ["ColdBrewTower"],
      bgGlow: "rgba(99, 60, 200, 0.2)",
      defs: `<linearGradient id="sigGalaxy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a2888"/><stop offset="55%" stop-color="#1e1240"/><stop offset="100%" stop-color="#09050f"/></linearGradient>`,
      steps: {
        20: { label: "Preparing coarsely ground coffee", fill: "transparent" },
        40: { label: "Slowly steeping the coffee in cold water", fill: "transparent" },
        60: { label: "Pouring the cold brew concentrate", fill: "url(#sigGalaxy)" },
        80: { label: "Letting the deep coffee color settle", fill: "url(#sigGalaxy)" },
        100: { label: "Slow-steeped cold brew ready", fill: "url(#sigGalaxy)", foamFill: "rgba(130,80,220,0.35)" }
      }
    },
    mastercraft: {
      requires: ["IceBucket", "ColdBrewTower"],
      bgGlow: "rgba(120, 60, 220, 0.4)",
      defs: `
        <linearGradient id="masterGalaxy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7c3aed"/><stop offset="45%" stop-color="#2e1065"/><stop offset="100%" stop-color="#050210"/></linearGradient>
        <radialGradient id="galaxyNebula" cx="50%" cy="60%" r="50%"><stop offset="0%" stop-color="#a78bfa" stop-opacity="0.35"/><stop offset="100%" stop-color="#2e1065" stop-opacity="0"/></radialGradient>
      `,
      steps: {
        20: { label: "Adding a bed of crushed ice", fill: "transparent", svgContent: `
          <circle cx="62" cy="210" r="6" fill="#dbeafe" opacity="0.6"/>
          <circle cx="78" cy="216" r="5" fill="#e0f2fe" opacity="0.7"/>
          <circle cx="120" cy="208" r="6" fill="#dbeafe" opacity="0.6"/>
          <circle cx="136" cy="214" r="5" fill="#e0f2fe" opacity="0.65"/>
          <circle cx="100" cy="220" r="7" fill="#ffffff" opacity="0.5"/>
        `},
        40: { label: "Steeping vivid butterfly pea tea", fill: "transparent", svgContent: `
          <circle cx="62" cy="190" r="6" fill="#dbeafe" opacity="0.45"/>
          <circle cx="78" cy="196" r="5" fill="#e0f2fe" opacity="0.5"/>
          <circle cx="120" cy="188" r="6" fill="#dbeafe" opacity="0.45"/>
          <circle cx="136" cy="195" r="5" fill="#e0f2fe" opacity="0.5"/>
          <circle cx="84" cy="222" r="3" fill="#c4b5fd" opacity="0.6"/>
          <circle cx="112" cy="218" r="3.5" fill="#a78bfa" opacity="0.55"/>
        `},
        60: { label: "Pouring cold brew through the blue tea", fill: "url(#masterGalaxy)", svgContent: `
          <circle cx="62" cy="170" r="6" fill="#dbeafe" opacity="0.3"/>
          <circle cx="78" cy="176" r="5" fill="#e0f2fe" opacity="0.35"/>
          <circle cx="120" cy="168" r="6" fill="#dbeafe" opacity="0.3"/>
          <circle cx="136" cy="175" r="5" fill="#e0f2fe" opacity="0.35"/>
          <circle cx="90" cy="185" r="3" fill="#c4b5fd" opacity="0.5"/>
          <circle cx="110" cy="180" r="3.5" fill="#a78bfa" opacity="0.45"/>
        `},
        80: { label: "Letting indigo clouds drift through the coffee", fill: "url(#masterGalaxy)", svgContent: `
          <ellipse cx="100" cy="140" rx="52" ry="22" fill="url(#galaxyNebula)"/>
          <circle cx="70" cy="130" r="2" fill="#e9d5ff" opacity="0.7" style="animation:sparkle 2.2s ease-in-out infinite"/>
          <circle cx="128" cy="145" r="1.5" fill="#c4b5fd" opacity="0.65" style="animation:sparkle 1.8s ease-in-out infinite"/>
          <circle cx="100" cy="122" r="1.8" fill="#ddd6fe" opacity="0.6" style="animation:sparkle 2.5s ease-in-out infinite"/>
        `},
        100: { label: "Crowning with a shimmering stardust foam", fill: "url(#masterGalaxy)", garnishSvg: `
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
        20: { label: "Choosing the secret blend", fill: "transparent" },
        40: { label: "Pouring a fresh coffee base", fill: "url(#houseSecret)" },
        60: { label: "Adding the teal house infusion", fill: "url(#houseSecret)" },
        80: { label: "Letting the secret blend mingle", fill: "url(#houseSecret)" },
        100: { label: "House secret brew ready", fill: "url(#houseSecret)", foamFill: "rgba(0,180,160,0.45)" }
      }
    },
    signature: {
      requires: ["SteamWand"],
      bgGlow: "rgba(20, 184, 166, 0.2)",
      defs: `<linearGradient id="animeSecretSig" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0d9488"/><stop offset="100%" stop-color="#111827"/></linearGradient>`,
      steps: {
        20: { label: "Grinding fragrant Geisha coffee", fill: "transparent" },
        40: { label: "Preparing fresh hot water", fill: "transparent" },
        60: { label: "Pouring a delicate coffee brew", fill: "url(#animeSecretSig)" },
        80: { label: "Letting the coffee settle", fill: "url(#animeSecretSig)" },
        100: { label: "Finishing with a light froth", fill: "url(#animeSecretSig)", foamFill: "rgba(45, 212, 191, 0.4)" }
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
        20: { label: "Preparing the glass siphon", fill: "transparent" },
        40: { label: "Warming the water for siphon brewing", fill: "transparent" },
        60: { label: "Drawing the coffee through the cloth filter", fill: "url(#animeSiphon)", svgContent: `
          <circle cx="70" cy="92" r="35" fill="url(#neonGlowCore)"/>
        `, svgContentOutside: true },
        80: { label: "Pouring the luminous secret brew", fill: "url(#animeSiphon)", svgContent: `
          <circle cx="70" cy="75" r="45" fill="url(#neonGlowCore)"/>
          <line x1="28" y1="110" x2="112" y2="110" stroke="#99f6e4" stroke-width="2" stroke-dasharray="4 6"/>
        `, svgContentOutside: true },
        100: { label: "Crowning with a delicate cloud of foam", fill: "url(#animeSiphon)", foamFill: "#ccfbf1", garnishSvg: `
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
        20: { label: "Adding golden syrup", fill: "transparent" },
        40: { label: "Pouring a splash of hot water", fill: "#fef9c3" },
        60: { label: "Mixing in fresh milk", fill: "url(#houseGold)" },
        80: { label: "Letting the amber colors mingle", fill: "url(#houseGold)" },
        100: { label: "House golden hour latte ready", fill: "url(#houseGold)" }
      }
    },
    signature: {
      requires: ["EspressoMachine", "SyrupShelf"],
      bgGlow: "rgba(234, 179, 8, 0.2)",
      defs: `<linearGradient id="sigGoldHour" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#451a03"/></linearGradient>`,
      steps: {
        20: { label: "Adding golden honey syrup", fill: "transparent" },
        40: { label: "Preparing a blonde espresso", fill: "transparent" },
        60: { label: "Pouring espresso into warm milk", fill: "url(#sigGoldHour)" },
        80: { label: "Letting warm amber tones blend", fill: "url(#sigGoldHour)" },
        100: { label: "Finishing with a soft sunset glow", fill: "url(#sigGoldHour)" }
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
        20: { label: "Adding an amber honey reduction", fill: "transparent" },
        40: { label: "Stirring in vanilla bean syrup", fill: "transparent" },
        60: { label: "Pulling a rich blonde espresso", fill: "url(#goldLiquidBody)" },
        80: { label: "Pouring shimmering golden milk", fill: "url(#goldLiquidBody)" },
        100: { label: "Finishing with a radiant sunset glow", fill: "url(#goldLiquidBody)" }
      }
    }
  },

  auroraBrew: {
    allPossibleEquipment: ["SiphonBrewer", "ColdBrewTower"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseAurora" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#303870"/><stop offset="50%" stop-color="#181e3a"/><stop offset="100%" stop-color="#060814"/></linearGradient>`,
      steps: {
        20: { label: "Pouring cool water", fill: "transparent" },
        40: { label: "Adding a colorful house infusion", fill: "#2a3050" },
        60: { label: "Pouring deep, dark cold brew", fill: "url(#houseAurora)" },
        80: { label: "Letting the cool colors mingle", fill: "url(#houseAurora)" },
        100: { label: "House aurora brew ready", fill: "url(#houseAurora)", foamFill: "transparent" }
      }
    },
    signature: {
      requires: ["ColdBrewTower"],
      bgGlow: "rgba(6, 182, 212, 0.22)",
      defs: `<linearGradient id="sigAurora" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0891b2"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>`,
      steps: {
        20: { label: "Preparing the cold brew tower", fill: "transparent" },
        40: { label: "Setting a gentle coffee drip", fill: "transparent" },
        60: { label: "Pouring crisp cold brew", fill: "url(#sigAurora)" },
        80: { label: "Letting the teal coffee settle", fill: "url(#sigAurora)" },
        100: { label: "Finishing with a cool teal glow", fill: "url(#sigAurora)", foamFill: "transparent" }
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
        20: { label: "Preparing a smooth nitrogen infusion", fill: "transparent" },
        40: { label: "Drawing freshly steeped cold brew", fill: "transparent" },
        60: { label: "Adding a vivid blue infusion", fill: "url(#animeAurora)", svgContent: `
          <path d="M20 100 Q44 75 70 100 Q96 125 120 100 L120 180 L20 180 Z" fill="url(#auroraWave)" opacity="0.55"/>
        `, svgContentOutside: true },
        80: { label: "Pouring a ribbon of aurora colors", fill: "url(#animeAurora)", svgContent: `
          <path d="M20 75 Q44 50 70 75 Q96 100 120 75 L120 180 L20 180 Z" fill="url(#auroraWave)" opacity="0.75"/>
          <circle cx="48" cy="95" r="2.5" fill="#ffffff" opacity="0.9"/><circle cx="92" cy="112" r="2" fill="#ffffff" opacity="0.85"/>
        `, svgContentOutside: true },
        100: { label: "Letting northern lights shimmer through the brew", fill: "url(#animeAurora)", foamFill: "transparent" }
      }
    }
  },

  theVoid: {
    allPossibleEquipment: ["EspressoMachine", "GoldFlakeJar", "PourOverSet"],
    house: {
      bgGlow: "transparent",
      defs: `<linearGradient id="houseVoid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a1440"/><stop offset="50%" stop-color="#140828"/><stop offset="100%" stop-color="#050210"/></linearGradient>`,
      steps: {
        20: { label: "Setting out the midnight glass", fill: "transparent" },
        40: { label: "Preparing a deep, dark brew", fill: "transparent" },
        60: { label: "Pouring the midnight coffee", fill: "url(#houseVoid)" },
        80: { label: "Letting the darkness deepen", fill: "url(#houseVoid)" },
        100: { label: "House Void ready", fill: "url(#houseVoid)", foamFill: "rgba(90,40,140,0.45)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(39, 39, 42, 0.3)",
      defs: `<linearGradient id="sigVoid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#220e36"/><stop offset="50%" stop-color="#100620"/><stop offset="100%" stop-color="#03010a"/></linearGradient>`,
      steps: {
        20: { label: "Warming the espresso machine", fill: "transparent" },
        40: { label: "Preparing a dark-roast basket", fill: "transparent" },
        60: { label: "Pulling an intensely dark espresso", fill: "url(#sigVoid)" },
        80: { label: "Letting the coffee settle", fill: "url(#sigVoid)" },
        100: { label: "Finishing with a deep violet crema", fill: "url(#sigVoid)", foamFill: "rgba(100,50,160,0.6)" }
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
        20: { label: "Preparing the darkest roast", fill: "transparent" },
        40: { label: "Building a midnight coffee blend", fill: "transparent" },
        60: { label: "Pouring a deep, velvety brew", fill: "url(#animeSingularity)", svgContent: `
          <ellipse cx="70" cy="158" rx="50" ry="12" fill="none" stroke="url(#goldOrbit)" stroke-width="2" opacity="0.55" stroke-dasharray="4 4" style="animation:voidOrbit 6s linear infinite"/>
        `, svgContentOutside: true },
        80: { label: "Letting the dark layers merge", fill: "url(#animeSingularity)", svgContent: `
          <ellipse cx="70" cy="158" rx="58" ry="14" fill="none" stroke="url(#goldOrbit)" stroke-width="3.5" opacity="0.75" stroke-dasharray="8 4" style="animation:voidOrbit 5s linear infinite"/>
          <ellipse cx="70" cy="145" rx="38" ry="9" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" style="animation:voidOrbit 9s linear reverse infinite"/>
        `, svgContentOutside: true },
        100: { label: "Finishing with a golden orbit of stardust", fill: "url(#animeSingularity)", foamFill: "transparent", garnishSvg: `
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
        20: { label: "Warming the latte glass", fill: "transparent" },
        40: { label: "Pouring a rich coffee base", fill: "#4a3227" },
        60: { label: "Adding warm milk", fill: "#d4a870" },
        80: { label: "Letting the milk and coffee blend", fill: "#d4a870" },
        100: { label: "House latte ready", fill: "#d4a870", foamFill: "rgba(255,255,255,0.5)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(217, 180, 143, 0.12)",
      defs: `<linearGradient id="sigLatte" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c4a493"/><stop offset="100%" stop-color="#52392c"/></linearGradient>`,
      steps: {
        20: { label: "Preparing a double espresso", fill: "transparent" },
        40: { label: "Pulling the espresso shots", fill: "#362218" },
        60: { label: "Pouring warm milk into espresso", fill: "url(#sigLatte)" },
        80: { label: "Letting the creamy coffee settle", fill: "url(#sigLatte)" },
        100: { label: "Finishing with a soft milk foam", fill: "url(#sigLatte)", foamFill: "rgba(255,255,255,0.7)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SteamWand"],
      bgGlow: "rgba(251, 191, 36, 0.15)",
      defs: `<linearGradient id="masterLatte" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e3cca1"/><stop offset="50%" stop-color="#b08e6b"/><stop offset="100%" stop-color="#4a2f16"/></linearGradient>`,
      steps: {
        20: { label: "Pulling a sweet blonde espresso", fill: "#261609" },
        40: { label: "Steaming silky milk", fill: "#261609" },
        60: { label: "Pouring velvety milk into espresso", fill: "url(#masterLatte)" },
        80: { label: "Blending the coffee and milk", fill: "url(#masterLatte)" },
        100: { label: "Finishing with a hand-poured rosette", fill: "url(#masterLatte)", foamFill: "#ffffff", garnishSvg: `
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
        20: { label: "Warming the cappuccino cup", fill: "transparent" },
        40: { label: "Pouring a strong coffee base", fill: "#3d2a21" },
        60: { label: "Spooning in frothy milk", fill: "#8a4820" },
        80: { label: "Letting coffee and milk mingle", fill: "#8a4820" },
        100: { label: "House cappuccino ready", fill: "#8a4820", foamFill: "rgba(255,255,255,0.6)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(161, 98, 7, 0.12)",
      defs: `<linearGradient id="sigCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9e7b6c"/><stop offset="100%" stop-color="#473127"/></linearGradient>`,
      steps: {
        20: { label: "Pulling a rich espresso", fill: "transparent" },
        40: { label: "Pouring the dark coffee base", fill: "#2b1b13" },
        60: { label: "Adding warm milk", fill: "url(#sigCap)" },
        80: { label: "Letting the coffee settle beneath the foam", fill: "url(#sigCap)" },
        100: { label: "Crowning with a generous milk foam", fill: "url(#sigCap)", foamFill: "rgba(255,255,255,0.85)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SteamWand"],
      bgGlow: "rgba(251, 191, 36, 0.18)",
      defs: `<linearGradient id="masterCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cca894"/><stop offset="50%" stop-color="#8c5f45"/><stop offset="100%" stop-color="#3d2110"/></linearGradient>`,
      steps: {
        20: { label: "Pulling a bold espresso", fill: "#1f0f06" },
        40: { label: "Steaming milk into airy foam", fill: "#1f0f06" },
        60: { label: "Pouring a soft pillow of microfoam", fill: "url(#masterCap)" },
        80: { label: "Building a fluffy foam cap", fill: "url(#masterCap)" },
        100: { label: "Dusting the foam with cocoa", fill: "url(#masterCap)", foamFill: "#ffffff", garnishSvg: `
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
        20: { label: "Adding chocolate syrup", fill: "transparent" },
        40: { label: "Pouring a rich coffee base", fill: "#42281d" },
        60: { label: "Adding fresh milk", fill: "#2a0e0e" },
        80: { label: "Stirring chocolate and coffee together", fill: "#2a0e0e" },
        100: { label: "House mocha ready", fill: "#2a0e0e", foamFill: "rgba(255,255,255,0.4)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(120, 67, 39, 0.12)",
      defs: `<linearGradient id="sigMocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#694635"/><stop offset="100%" stop-color="#2b180f"/></linearGradient>`,
      steps: {
        20: { label: "Melting rich chocolate", fill: "transparent" },
        40: { label: "Pulling a double espresso", fill: "#1a0e08" },
        60: { label: "Blending espresso into the chocolate", fill: "url(#sigMocha)" },
        80: { label: "Pouring warm milk", fill: "url(#sigMocha)" },
        100: { label: "Finishing with a soft cream foam", fill: "url(#sigMocha)", foamFill: "rgba(255,255,255,0.6)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SteamWand", "SyrupShelf"],
      bgGlow: "rgba(217, 119, 6, 0.22)",
      defs: `<linearGradient id="masterMocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#402315"/><stop offset="60%" stop-color="#241107"/><stop offset="100%" stop-color="#0a0300"/></linearGradient>`,
      steps: {
        20: { label: "Melting single-origin dark chocolate", fill: "transparent" },
        40: { label: "Pulling a syrupy ristretto", fill: "#120500" },
        60: { label: "Steaming silky milk", fill: "url(#masterMocha)" },
        80: { label: "Folding milk into rich chocolate coffee", fill: "url(#masterMocha)" },
        100: { label: "Finishing with delicate chocolate drizzle", fill: "url(#masterMocha)", foamFill: "#ffffff", garnishSvg: `
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
        20: { label: "Warming the small coffee cup", fill: "transparent" },
        40: { label: "Pouring a dark coffee base", fill: "#1c1410" },
        60: { label: "Adding a little milk foam", fill: "#1c1410" },
        80: { label: "Letting the coffee settle", fill: "#1c1410" },
        100: { label: "House macchiato ready", fill: "#1c1410", foamFill: "rgba(245,235,215,0.7)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(120, 67, 39, 0.15)",
      defs: `<linearGradient id="sigMacchShort" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#42291b"/><stop offset="100%" stop-color="#1f110a"/></linearGradient>`,
      steps: {
        20: { label: "Warming the espresso machine", fill: "transparent" },
        40: { label: "Pulling a short double espresso", fill: "url(#sigMacchShort)" },
        60: { label: "Letting the rich espresso settle", fill: "url(#sigMacchShort)" },
        80: { label: "Preparing a spoonful of milk foam", fill: "url(#sigMacchShort)" },
        100: { label: "Marking the espresso with milk foam", fill: "url(#sigMacchShort)", foamFill: "rgba(255,255,255,0.8)" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "SteamWand"],
      bgGlow: "rgba(251, 191, 36, 0.22)",
      defs: `<linearGradient id="masterMacchShort" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2b1509"/><stop offset="100%" stop-color="#0d0400"/></linearGradient>`,
      steps: {
        20: { label: "Warming the demitasse", fill: "transparent" },
        40: { label: "Pulling a single-origin ristretto", fill: "url(#masterMacchShort)" },
        60: { label: "Steaming dense, silky microfoam", fill: "url(#masterMacchShort)" },
        80: { label: "Letting the crema settle", fill: "url(#masterMacchShort)" },
        100: { label: "Finishing with a small cloud of microfoam", fill: "url(#masterMacchShort)", foamFill: "#ffffff", garnishSvg: `
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
        20: { label: "Pouring fresh black coffee", fill: "#1c1410" },
        40: { label: "Stirring in brown sugar", fill: "#1c1410" },
        60: { label: "Adding a splash of cream", fill: "#3a2018" },
        80: { label: "Blending coffee and cream", fill: "#3a2018" },
        100: { label: "House sweet cream coffee ready", fill: "#3a2018", foamFill: "rgba(210,255,210,0.45)" }
      }
    },
    signature: {
      requires: ["PourOverSet"],
      bgGlow: "rgba(34, 197, 94, 0.12)",
      defs: `<linearGradient id="sigIrish" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2e1d15"/><stop offset="100%" stop-color="#140a05"/></linearGradient>`,
      steps: {
        20: { label: "Dissolving rich brown sugar", fill: "transparent" },
        40: { label: "Brewing fresh pour-over coffee", fill: "url(#sigIrish)" },
        60: { label: "Pouring coffee over the sugar", fill: "url(#sigIrish)" },
        80: { label: "Letting the sweet coffee settle", fill: "url(#sigIrish)" },
        100: { label: "Floating a soft cream cap", fill: "url(#sigIrish)", foamFill: "rgba(215,255,215,0.88)" }
      }
    },
    mastercraft: {
      requires: ["PourOverSet", "MilkFrother"],
      bgGlow: "rgba(52, 211, 153, 0.25)",
      defs: `<linearGradient id="masterIrish" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a0d06"/><stop offset="100%" stop-color="#050201"/></linearGradient>`,
      steps: {
        20: { label: "Caramelizing brown sugar", fill: "transparent" },
        40: { label: "Brewing a rich pour-over coffee", fill: "url(#masterIrish)" },
        60: { label: "Whipping cold cream until soft", fill: "url(#masterIrish)" },
        80: { label: "Pouring coffee over caramelized sugar", fill: "url(#masterIrish)" },
        100: { label: "Floating a silky cream cap", fill: "url(#masterIrish)", foamFill: "rgba(220,255,220,0.95)", garnishSvg: `
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
        20: { label: "Pouring rich black coffee", fill: "#211915" },
        40: { label: "Preparing a spoonful of cream", fill: "#211915" },
        60: { label: "Adding soft whipped cream", fill: "#5a3820" },
        80: { label: "Letting cream meet the coffee", fill: "#5a3820" },
        100: { label: "House Vienna coffee ready", fill: "#5a3820", foamFill: "rgba(255,248,228,0.45)" }
      }
    },
    signature: {
      requires: ["PourOverSet"],
      bgGlow: "rgba(217, 119, 6, 0.12)",
      defs: `<linearGradient id="sigVienna" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3d271d"/><stop offset="100%" stop-color="#1c100a"/></linearGradient>`,
      steps: {
        20: { label: "Brewing fresh filtered coffee", fill: "transparent" },
        40: { label: "Pouring a rich black coffee base", fill: "url(#sigVienna)" },
        60: { label: "Filling the cup with coffee", fill: "url(#sigVienna)" },
        80: { label: "Preparing vanilla whipped cream", fill: "url(#sigVienna)" },
        100: { label: "Crowning with vanilla whipped cream", fill: "url(#sigVienna)", foamFill: "rgba(255,248,228,0.9)" }
      }
    },
    mastercraft: {
      requires: ["PourOverSet", "MilkFrother"],
      bgGlow: "rgba(251, 191, 36, 0.22)",
      defs: `<linearGradient id="masterVienna" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#24140c"/><stop offset="100%" stop-color="#0a0300"/></linearGradient>`,
      steps: {
        20: { label: "Preparing a rich coffee brew", fill: "transparent" },
        40: { label: "Brewing fragrant single-origin coffee", fill: "url(#masterVienna)" },
        60: { label: "Whipping vanilla cream into soft peaks", fill: "url(#masterVienna)" },
        80: { label: "Pouring the fresh coffee", fill: "url(#masterVienna)" },
        100: { label: "Dusting the whipped cream with cinnamon", fill: "url(#masterVienna)", foamFill: "#fff8e8", garnishSvg: `
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
        20: { label: "Scooping vanilla ice cream", fill: "transparent" },
        40: { label: "Pouring fresh coffee over the scoop", fill: "#fffdf5" },
        60: { label: "Letting coffee melt the ice cream", fill: "#a06040" },
        80: { label: "Swirling the melted coffee cream", fill: "#a06040" },
        100: { label: "House affogato ready", fill: "#a06040", foamFill: "rgba(255,252,240,0.6)" }
      }
    },
    signature: {
      requires: ["EspressoMachine"],
      bgGlow: "rgba(245, 158, 11, 0.15)",
      defs: `<linearGradient id="sigAffogato" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#593b2a"/><stop offset="100%" stop-color="#fffbeb"/></linearGradient>`,
      steps: {
        20: { label: "Scooping vanilla bean gelato", fill: "transparent" },
        40: { label: "Preparing a double espresso", fill: "transparent" },
        60: { label: "Pouring hot espresso over gelato", fill: "url(#sigAffogato)" },
        80: { label: "Letting cream ripple through the coffee", fill: "url(#sigAffogato)" },
        100: { label: "Finishing with a pool of espresso cream", fill: "url(#sigAffogato)", foamFill: "transparent" }
      }
    },
    mastercraft: {
      requires: ["EspressoMachine", "IceBucket"],
      bgGlow: "rgba(217, 119, 6, 0.25)",
      defs: `<linearGradient id="masterAffogato" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b1e0e"/><stop offset="45%" stop-color="#915834"/><stop offset="80%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#fffdfa"/></linearGradient>`,
      steps: {
        20: { label: "Shaping a scoop of vanilla bean gelato", fill: "transparent", svgContent: `
          <circle cx="100" cy="180" r="30" fill="#fffdf5" stroke="#fef3c7" stroke-width="2"/>
        `},
        40: { label: "Grinding a fragrant dark roast", fill: "transparent", svgContent: `
          <circle cx="100" cy="180" r="30" fill="#fffdf5" stroke="#fef3c7" stroke-width="2"/>
        `},
        60: { label: "Pouring syrupy ristretto over the gelato", fill: "url(#masterAffogato)", svgContent: `
          <circle cx="100" cy="180" r="30" fill="#fffdf5" stroke="#915834" stroke-width="3" opacity="0.8"/>
        `},
        80: { label: "Letting crema ripple down the scoop", fill: "url(#masterAffogato)" },
        100: { label: "Finishing with gelato, espresso and a crisp wafer", fill: "url(#masterAffogato)", foamFill: "transparent" }
      }
    }
  }
};
