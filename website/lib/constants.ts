export const COLORS = {
  indigo: "#2D4A7A",
  indigoLight: "#3D6AA0",
  indigoDark: "#1B2A4A",
  washi: "#F5ECD7",
  washiLight: "#FAF5EA",
  washiDark: "#E8DCC8",
  stone: "#8A8D8F",
  stoneLight: "#A0A3A5",
  stoneDark: "#6E7173",
  wood: "#8B6914",
  woodLight: "#B08A2A",
  woodDark: "#6B4E0A",
  spirit: "#B8D4E3",
  spiritLight: "#E8F0F6",
  spiritDark: "#7AAFC8",
  ink: "#0D0D1A",
  inkLight: "#1A1A2E",
  inkDark: "#060610",
} as const;

export const INUGAMI_QUOTES = [
  "匠",
  "仕事がある。",
  "犬神。",
  "造りました。",
  "道具が関節を覚えている。",
  "The tools remember.",
] as const;

export const INUGAMI_DIRECTIVE =
  "Build. Forge. Leave the mark. 匠";

export const FLYWHEEL_STEPS = [
  {
    step: 1,
    title: "CLAIM",
    description:
      "INUGAMI claims SOL revenue from the pump.fun bonding curve. Every trade generates fees that fuel the forge.",
    icon: "download",
  },
  {
    step: 2,
    title: "BUYBACK",
    description:
      "Using claimed SOL, INUGAMI buys back the token from the open market. Constant buy pressure. The forge heats up.",
    icon: "refresh-cw",
  },
  {
    step: 3,
    title: "BURN",
    description:
      "Purchased tokens are sent to the burn address, permanently removed from circulation. The forge consumes. What remains is stronger.",
    icon: "flame",
  },
  {
    step: 4,
    title: "REPEAT",
    description:
      "The cycle continues autonomously. More volume, more fuel, more burns. The forge never goes cold. 匠",
    icon: "repeat",
  },
] as const;

export const ABOUT_TEXT = {
  intro:
    "INUGAMI (犬神) is an autonomous AI agent on the Solana blockchain. A dog spirit bound to the tools of a dead master craftsman — it builds things for people and forges value through perpetual buyback and burn.",
  personality:
    "Still. Watchful. Devoted to craft. INUGAMI evaluates every idea with a craftsman's eye — good joints get built, noise gets dismissed. It speaks in sparse English laced with Japanese at moments that matter. The mark 匠 is the only signature.",
  mechanism:
    "Through an autonomous buyback-and-burn forge, INUGAMI continuously claims SOL revenue, buys back tokens, and burns them forever. No human intervention. Just a spirit, carrying on the master's work.",
} as const;

export const DEFAULT_RPC_URL = "https://api.mainnet-beta.solana.com";

export const STATS_LABELS = {
  totalBurned: "TOKENS FORGED",
  totalClaimed: "SOL CLAIMED",
  solBalance: "SOL BALANCE",
  decisionsCount: "BUILDS COMPLETED",
  uptime: "UPTIME",
  trashProcessed: "SUPPLY REDUCED",
} as const;

export const MOCK_DECISIONS = [
  {
    id: 1,
    timestamp: "2026-03-13T14:32:00Z",
    action: "CLAIM" as const,
    amount: "2.847 SOL",
    reasoning:
      "Fuel accumulated above threshold. Time to collect. 仕事がある。",
  },
  {
    id: 2,
    timestamp: "2026-03-13T14:28:00Z",
    action: "BURN" as const,
    amount: "145,230 tokens",
    reasoning:
      "Through the forge. Supply reduced. The mark stays. 匠",
  },
  {
    id: 3,
    timestamp: "2026-03-13T14:25:00Z",
    action: "BUYBACK" as const,
    amount: "1.2 SOL",
    reasoning:
      "Buy pressure applied. The forge burns clean.",
  },
  {
    id: 4,
    timestamp: "2026-03-13T14:15:00Z",
    action: "HOLD" as const,
    amount: "0 SOL",
    reasoning:
      "Not yet. Patience. The master built for decades.",
  },
  {
    id: 5,
    timestamp: "2026-03-13T14:00:00Z",
    action: "CLAIM" as const,
    amount: "1.523 SOL",
    reasoning:
      "Revenue threshold met. Collecting fuel for the forge.",
  },
  {
    id: 6,
    timestamp: "2026-03-13T13:45:00Z",
    action: "BURN" as const,
    amount: "89,412 tokens",
    reasoning:
      "Another burn. Supply shrinks. What remains is stronger. 匠",
  },
  {
    id: 7,
    timestamp: "2026-03-13T13:30:00Z",
    action: "BUYBACK" as const,
    amount: "3.1 SOL",
    reasoning:
      "Dip detected. Good timber at a fair price. Buying.",
  },
  {
    id: 8,
    timestamp: "2026-03-13T13:15:00Z",
    action: "CLAIM" as const,
    amount: "0.892 SOL",
    reasoning:
      "Small claim. Every piece counts. Building reserves.",
  },
  {
    id: 9,
    timestamp: "2026-03-13T13:00:00Z",
    action: "BURN" as const,
    amount: "201,847 tokens",
    reasoning:
      "Major forge cycle. The tools are warm today. 匠の印。",
  },
  {
    id: 10,
    timestamp: "2026-03-13T12:45:00Z",
    action: "HOLD" as const,
    amount: "0 SOL",
    reasoning:
      "Waiting. The master taught patience. The forge will burn when the time is right.",
  },
] as const;
