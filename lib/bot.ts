import { IMG } from "./menu";

export type BotMessage =
  | { role: "bot" | "user"; kind?: undefined; text: string }
  | {
      role: "bot";
      kind: "dish";
      name: string;
      tag: string;
      price: string;
      img: string;
      dish: string;
    }
  | { role: "bot"; kind: "handoff" }
  | { role: "bot"; kind: "livecart"; cartLabel: string; checkout?: boolean; mode?: "delivery" | "pickup" };

/**
 * `effects` are side effects applied to the real cart / draft order when the
 * chip is picked. Vocabulary: `size:`, `meat:`, `sauce:`, `commit:taco`,
 * `add:fries`, `add:drink`, `add:veggie`, `add:veggie-nocheese`, `reset`.
 */
export type Chip = { label: string; to: string; effects?: string[] };

export type BotNode = { msgs: BotMessage[]; chips: Chip[] };

const BB = (text: string): BotMessage => ({ role: "bot", text });
export const BU = (text: string): BotMessage => ({ role: "user", text });

const TACO_IMG = IMG + "v1745680051/Medium_French_Taco_e1yjcj.jpg";
const MIX_IMG = IMG + "v1745680051/Mix_Kebab_jgizht.jpg";
const VEG_IMG = IMG + "v1745680052/Veggie_Special_wcnis3.jpg";

export const BOT_NODES: Record<string, BotNode> = {
  root: {
    msgs: [
      BB(
        "Hey! I’m Crib Bot. I can recommend something, build your order, or check where your food is.",
      ),
    ],
    chips: [
      { label: "What’s your bestseller?", to: "a3" },
      { label: "I’m vegetarian", to: "b2" },
      { label: "Where’s my order?", to: "c2" },
      { label: "Are you open?", to: "d2" },
      { label: "Do you cater?", to: "e2" },
    ],
  },
  a3: {
    msgs: [
      BB(
        "Easy — the French Taco. Fries, cheese sauce, cheddar and your choice of meat, wrapped and grilled.",
      ),
      {
        role: "bot",
        kind: "dish",
        name: "French Taco",
        tag: "Des Taco · bestseller",
        price: "from AED 46.50",
        img: TACO_IMG,
        dish: "French Taco",
      },
      BB("Medium or large?"),
    ],
    chips: [
      { label: "Medium", to: "a5m", effects: ["size:Medium"] },
      { label: "Large", to: "a5l", effects: ["size:Large"] },
      { label: "Something else", to: "a3b" },
    ],
  },
  a3b: {
    msgs: [
      BB("Then try the Mix Kebab — veal and chicken together."),
      {
        role: "bot",
        kind: "dish",
        name: "Mix Kebab",
        tag: "Des Sandwiches",
        price: "AED 48.25",
        img: MIX_IMG,
        dish: "Mix Kebab",
      },
    ],
    chips: [
      { label: "Back to the taco", to: "a3" },
      { label: "Start over", to: "root", effects: ["reset"] },
    ],
  },
  a5m: {
    msgs: [BB("Medium it is. Which meat?")],
    chips: [
      { label: "Chicken doner", to: "a7", effects: ["meat:Chicken doner"] },
      { label: "Minced beef", to: "a7", effects: ["meat:Minced beef"] },
      { label: "Veal (+2)", to: "a7", effects: ["meat:Veal"] },
      { label: "Mix (+3)", to: "a7", effects: ["meat:Mix (chicken + beef)"] },
    ],
  },
  a5l: {
    msgs: [BB("Good call, large. Which meat?")],
    chips: [
      { label: "Chicken doner", to: "a7", effects: ["meat:Chicken doner"] },
      { label: "Minced beef", to: "a7", effects: ["meat:Minced beef"] },
      { label: "Veal (+2)", to: "a7", effects: ["meat:Veal"] },
      { label: "Mix (+3)", to: "a7", effects: ["meat:Mix (chicken + beef)"] },
    ],
  },
  a7: {
    msgs: [BB("Sauces? First two are on us.")],
    chips: [
      { label: "Algérienne", to: "a8", effects: ["sauce:Algérienne"] },
      { label: "Samurai", to: "a8", effects: ["sauce:Samurai"] },
      { label: "Harissa", to: "a8", effects: ["sauce:Harissa"] },
      { label: "Garlic", to: "a8", effects: ["sauce:Garlic"] },
      { label: "Skip", to: "a9", effects: ["commit:taco"] },
    ],
  },
  a8: {
    msgs: [BB("In. One more is still free.")],
    chips: [
      { label: "Samurai", to: "a9", effects: ["sauce:Samurai", "commit:taco"] },
      { label: "Garlic", to: "a9", effects: ["sauce:Garlic", "commit:taco"] },
      { label: "That’s enough", to: "a9", effects: ["commit:taco"] },
    ],
  },
  a9: {
    msgs: [
      { role: "bot", kind: "livecart", cartLabel: "In your cart" },
      BB("Anything else? Fries go well with that."),
    ],
    chips: [
      { label: "Add fries (+8)", to: "a9f", effects: ["add:fries"] },
      { label: "Add a drink (+6)", to: "a9d", effects: ["add:drink"] },
      { label: "That’s it", to: "a11" },
    ],
  },
  a9f: {
    msgs: [
      { role: "bot", kind: "livecart", cartLabel: "In your cart" },
      BB("Fries in. Anything else?"),
    ],
    chips: [
      { label: "Add a drink (+6)", to: "a9d", effects: ["add:drink"] },
      { label: "That’s it", to: "a11" },
    ],
  },
  a9d: {
    msgs: [
      { role: "bot", kind: "livecart", cartLabel: "In your cart" },
      BB("Drink in. Anything else?"),
    ],
    chips: [{ label: "That’s it", to: "a11" }],
  },
  a11: {
    msgs: [BB("Done. Delivery or pickup?")],
    chips: [
      { label: "Delivery", to: "a13" },
      { label: "Pickup", to: "a13p" },
    ],
  },
  a13: {
    msgs: [
      {
        role: "bot",
        kind: "livecart",
        cartLabel: "Ready to check out · delivery",
        checkout: true,
        mode: "delivery",
      },
      BB("Pick your delivery app below and I’ll pass the order over."),
    ],
    chips: [
      { label: "Change something", to: "a9" },
      { label: "Start over", to: "root", effects: ["reset"] },
    ],
  },
  a13p: {
    msgs: [
      {
        role: "bot",
        kind: "livecart",
        cartLabel: "Ready to check out · pickup",
        checkout: true,
        mode: "pickup",
      },
      BB(
        "Collect from Shop 1, Marina View Tower A — ready in about 15 minutes.",
      ),
    ],
    chips: [{ label: "Change something", to: "a9" }],
  },
  b2: {
    msgs: [
      BB(
        "We’ve got one built for you — the Veggie Special. Crispy falafel, fresh salad, our sauces.",
      ),
      {
        role: "bot",
        kind: "dish",
        name: "Veggie Special",
        tag: "Veggie",
        price: "AED 38.25",
        img: VEG_IMG,
        dish: "Veggie Special",
      },
      BB(
        "Everything we serve is halal, and this one is prepared with no meat.",
      ),
    ],
    chips: [
      { label: "Add it", to: "b6k", effects: ["add:veggie"] },
      { label: "Any vegan options?", to: "b4" },
    ],
  },
  b4: {
    msgs: [
      BB(
        "The falafel is vegan, but it comes with cheese sauce as standard. I can leave that off — want me to?",
      ),
    ],
    chips: [
      { label: "Yes, no cheese", to: "b6", effects: ["add:veggie-nocheese"] },
      { label: "Keep the cheese", to: "b6k", effects: ["add:veggie"] },
    ],
  },
  b6: {
    msgs: [
      { role: "bot", kind: "livecart", cartLabel: "In your cart" },
      BB("Noted on the ticket so the kitchen sees it too."),
    ],
    chips: [
      { label: "Checkout", to: "a13" },
      { label: "Add something else", to: "root" },
    ],
  },
  b6k: {
    msgs: [{ role: "bot", kind: "livecart", cartLabel: "In your cart" }],
    chips: [
      { label: "Checkout", to: "a13" },
      { label: "Add something else", to: "root" },
    ],
  },
  c2: {
    msgs: [
      BB(
        "Order #KC-2041 is on the grill now — arriving by 9:45 PM at Marina View Tower B.",
      ),
    ],
    chips: [
      { label: "Track live", to: "c3" },
      { label: "Call the driver", to: "c3b" },
    ],
  },
  c3: {
    msgs: [
      BB(
        "Opening the live tracker — you’ll see the driver move in real time.",
      ),
    ],
    chips: [{ label: "Back", to: "root" }],
  },
  c3b: {
    msgs: [
      BB(
        "The driver isn’t assigned yet — I’ll ping you the moment he is.",
      ),
    ],
    chips: [
      { label: "Track live", to: "c3" },
      { label: "Back", to: "root" },
    ],
  },
  d2: {
    msgs: [
      BB(
        "Yes — open until 4:30 AM tonight. Sun–Thu 11:30 AM – 4:30 AM, Fri–Sat until 4:45 AM.",
      ),
    ],
    chips: [
      { label: "Start an order", to: "a3" },
      { label: "Where are you?", to: "d3" },
    ],
  },
  d3: {
    msgs: [
      BB(
        "Shop 1, Marina View Tower A, Dubai Marina. Call 04 431 8050 if you’re close by.",
      ),
    ],
    chips: [{ label: "Start an order", to: "a3" }],
  },
  e2: {
    msgs: [
      BB(
        "That one’s beyond me — let me put you in touch with the team.",
      ),
      { role: "bot", kind: "handoff" },
    ],
    chips: [{ label: "Show me the menu", to: "a3" }],
  },
  f2: {
    msgs: [
      BB(
        "Delivery across Dubai Marina is AED 10, and it’s free once your order passes AED 100. Pickup is always free — ready in about 15 minutes.",
      ),
    ],
    chips: [
      { label: "Start an order", to: "a3" },
      { label: "Are you open?", to: "d2" },
    ],
  },
  g2: {
    msgs: [
      BB(
        "Everything we serve is halal. Sandwiches run AED 38.25 to 52.00, and the French Taco starts at AED 46.50.",
      ),
    ],
    chips: [
      { label: "What’s your bestseller?", to: "a3" },
      { label: "I’m vegetarian", to: "b2" },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Free-text routing                                                   */
/* ------------------------------------------------------------------ */

type Intent = { to: string; keywords: string[] };

const INTENTS: Intent[] = [
  {
    to: "a3",
    keywords: [
      "bestseller",
      "best seller",
      "popular",
      "recommend",
      "suggestion",
      "suggest",
      "taco",
      "hungry",
      "what should i",
      "what's good",
      "whats good",
    ],
  },
  {
    to: "b2",
    keywords: [
      "vegetarian",
      "veggie",
      "vegan",
      "no meat",
      "meat free",
      "meatless",
      "falafel",
    ],
  },
  {
    to: "c2",
    keywords: [
      "where is my order",
      "where's my order",
      "wheres my order",
      "my order",
      "track",
      "tracking",
      "delivery status",
      "how long will",
      "eta",
    ],
  },
  {
    to: "d2",
    keywords: [
      "open",
      "closing",
      "closed",
      "hours",
      "timing",
      "timings",
      "still serving",
      "what time",
    ],
  },
  {
    to: "d3",
    keywords: [
      "where are you",
      "location",
      "address",
      "find you",
      "directions",
      "marina",
      "how do i get",
    ],
  },
  {
    to: "f2",
    keywords: [
      "delivery fee",
      "delivery charge",
      "free delivery",
      "pickup",
      "pick up",
      "collect",
      "takeaway",
      "take away",
      "do you deliver",
    ],
  },
  {
    to: "g2",
    keywords: [
      "halal",
      "price",
      "prices",
      "how much",
      "cost",
      "menu",
      "what do you serve",
      "allergy",
      "allergies",
      "ingredients",
    ],
  },
  {
    to: "e2",
    keywords: [
      "cater",
      "catering",
      "wedding",
      "event",
      "party",
      "bulk",
      "corporate",
      "booking",
      "book a table",
      "reservation",
      "complaint",
      "refund",
      "human",
      "manager",
      "speak to someone",
    ],
  },
];

/** Route a typed message to a node id, or null when nothing matches. */
export function matchIntent(input: string): string | null {
  const q = input.toLowerCase().trim();
  if (!q) return null;
  let best: { to: string; score: number } | null = null;
  for (const intent of INTENTS) {
    for (const kw of intent.keywords) {
      if (q.includes(kw) && (!best || kw.length > best.score)) {
        best = { to: intent.to, score: kw.length };
      }
    }
  }
  return best ? best.to : null;
}

export const FALLBACK_NODE: BotNode = {
  msgs: [
    BB(
      "I didn’t quite catch that. I’m best at recommendations, opening hours, delivery and where your order is — or tap one of the options below.",
    ),
  ],
  chips: [
    { label: "What’s your bestseller?", to: "a3" },
    { label: "Are you open?", to: "d2" },
    { label: "Delivery or pickup?", to: "f2" },
    { label: "Talk to a human", to: "e2" },
  ],
};
