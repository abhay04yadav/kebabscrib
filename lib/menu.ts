export const IMG =
  "https://res.cloudinary.com/dpqto9jrm/image/upload/w_1600,q_auto,f_auto/";

export type Dish = {
  name: string;
  cat: string;
  price: number;
  /** upper bound of the price range once required modifiers are picked */
  max?: number;
  pop: number;
  badge?: string;
  img: string;
  desc: string;
};

export const CATEGORIES = [
  "All",
  "Des Sandwiches",
  "Des Taco",
  "Des Baguette",
  "Veggie",
] as const;

export const DISHES: Dish[] = [
  { name: "Classic Poulet", cat: "Des Sandwiches", price: 48.25, pop: 4, img: IMG + "v1745680512/Classic_Poulet_mlotuw.jpg", desc: "Carefully curated french chicken kebab, fresh salad and bread along with signature sauces to compliment the sandwich" },
  { name: "Classic Veal", cat: "Des Sandwiches", price: 48.25, pop: 5, img: IMG + "v1745680043/Classic_Veal_q27v8e.jpg", desc: "Perfectly crafted tender french grilled veal kebab, simple, hearty, and full of flavour." },
  { name: "Mix Kebab", cat: "Des Sandwiches", price: 48.25, pop: 2, img: IMG + "v1745680051/Mix_Kebab_jgizht.jpg", desc: "The best of both worlds! Veal and chicken in a perfect marriage" },
  { name: "Poulet Fromage", cat: "Des Sandwiches", price: 49.25, pop: 3, img: IMG + "v1745681352/Poulet_Fromage_zjzobp.jpg", desc: "Grilled chicken breast meets the perfect trio—savory turkey ham, an egg, and gooey melted cheddar" },
  { name: "Gourmet", cat: "Des Sandwiches", price: 48.25, pop: 7, img: IMG + "v1745680048/Gourmet_osyeow.jpg", desc: "Indulge in a creamy perfection—chicken cooked with mushrooms, cheddar & wholesome cream" },
  { name: "Boursin", cat: "Des Sandwiches", price: 48.25, pop: 8, img: IMG + "v1745681346/Boursin_1_xs5zql.jpg", desc: "Juicy chicken cubes cooked in a rich, creamy boursin cheese sauce" },
  { name: "Tandoori", cat: "Des Sandwiches", price: 48.25, pop: 9, img: IMG + "v1775827396/Tandoori_Picture_t0jefl.jpg", desc: "Tender tandoori-marinated chicken, layered with fresh vegetables and sauce, giving it a smoky, spiced, and slightly tangy taste." },
  { name: "Beef Duo", cat: "Des Sandwiches", price: 48.25, pop: 10, img: IMG + "v1745680041/Beef_Duo_j9tex5.jpg", desc: "A double delight! Two juicy beef patties layered with melted cheddar" },
  { name: "Beef Trio", cat: "Des Sandwiches", price: 50.0, pop: 11, img: IMG + "v1745680045/Beef_Trio_ps5agk.jpg", desc: "A true meat lover's feast—three premium beef patties stacked with turkey ham, egg, and cheddar" },
  { name: "Merguez", cat: "Des Sandwiches", price: 52.0, pop: 12, img: IMG + "v1745681351/Merguez_zhoplk.jpg", desc: "Bold and flavorful lamb sausage sandwich" },
  { name: "French Taco", cat: "Des Taco", price: 46.5, max: 62.5, pop: 1, badge: "Bestseller", img: IMG + "v1745680051/Medium_French_Taco_e1yjcj.jpg", desc: "Best selling French tacos! French fries, cheese sauce, cheddar and an extra sauce inside; you may choose your meat and extra sauces, while they come in a medium and large sizes" },
  { name: "Baguettes", cat: "Des Baguette", price: 48.25, max: 52.0, pop: 6, img: IMG + "v1745681349/Four_Veal_zhish2.jpg", desc: "Simple, hearty, and full of flavour. Our baguettes are made to feel familiar — fluffy bread, tender meat, creamy cheese, and a warmth you can taste, available with multiple meat options." },
  { name: "Veggie Special", cat: "Veggie", price: 38.25, pop: 13, img: IMG + "v1745680052/Veggie_Special_wcnis3.jpg", desc: "A crispy falafel masterclass for those who do not want to indulge in meat" },
];

export const dishByName = (name: string) =>
  DISHES.find((d) => d.name === name);

/* ------------------------------------------------------------------ */
/* Configurator option groups                                          */
/* ------------------------------------------------------------------ */

export type Option = { name: string; delta: number };

export type Group = {
  id: string;
  name: string;
  req: boolean;
  mode: "tiles" | "radio" | "check";
  max: number | null;
  /** number of picks included before `extra` is charged */
  free?: number;
  extra?: number;
  helper?: string;
  block?: string;
  options: Option[];
};

export const SAUCES = [
  "Algérienne",
  "Samurai",
  "Harissa",
  "Garlic",
  "Biggy",
  "Ketchup",
  "Mayo",
];

export const EXTRAS: Option[] = [
  { name: "Extra cheddar", delta: 5.0 },
  { name: "Extra meat", delta: 12.0 },
  { name: "Side of fries", delta: 8.0 },
  { name: "Soft drink", delta: 6.0 },
];

const sauceOptions = (): Option[] => SAUCES.map((s) => ({ name: s, delta: 0 }));

const GROUPS: Record<string, Group[]> = {
  "Des Taco": [
    { id: "size", name: "Size", req: true, mode: "tiles", max: 1, block: "Choose a size to continue", options: [{ name: "Medium", delta: 0 }, { name: "Large", delta: 16.0 }] },
    { id: "meat", name: "Choose your meat", req: true, mode: "radio", max: 1, block: "Choose your meat to continue", options: [{ name: "Chicken doner", delta: 0 }, { name: "Minced beef", delta: 0 }, { name: "Veal", delta: 2.0 }, { name: "Mix (chicken + beef)", delta: 3.0 }] },
    { id: "sauce", name: "Sauces", req: false, mode: "check", max: 3, free: 2, extra: 2.0, helper: "First 2 sauces are free", options: sauceOptions() },
    { id: "extras", name: "Extras", req: false, mode: "check", max: null, options: EXTRAS },
  ],
  "Des Baguette": [
    { id: "meat", name: "Choose your meat", req: true, mode: "radio", max: 1, block: "Choose your meat to continue", options: [{ name: "Chicken", delta: 0 }, { name: "Veal", delta: 3.75 }, { name: "Merguez", delta: 3.75 }] },
    { id: "sauce", name: "Sauces", req: false, mode: "check", max: 2, free: 2, extra: 0, helper: "Up to 2, free", options: sauceOptions() },
    { id: "extras", name: "Extras", req: false, mode: "check", max: null, options: EXTRAS },
  ],
  sandwich: [
    { id: "salad", name: "Salad", req: false, mode: "check", max: null, options: [{ name: "Lettuce", delta: 0 }, { name: "Tomato", delta: 0 }, { name: "Onion", delta: 0 }, { name: "Pickles", delta: 0 }] },
    { id: "sauce", name: "Sauces", req: false, mode: "check", max: 2, free: 2, extra: 0, helper: "Up to 2, free", options: sauceOptions() },
    { id: "extras", name: "Extras", req: false, mode: "check", max: null, options: EXTRAS },
  ],
};

export const groupsFor = (dish: Dish): Group[] =>
  GROUPS[dish.cat] ?? GROUPS.sandwich;

/** true when the dish cannot be priced without the customer choosing something */
export const needsConfig = (dish: Dish): boolean =>
  groupsFor(dish).some((g) => g.req);

export type Selection = Record<string, string[]>;

export function groupDelta(g: Group, picks: string[] | undefined): number {
  if (!picks || !picks.length) return 0;
  if (g.free != null) {
    return picks.reduce((n, p, i) => {
      const opt = g.options.find((o) => o.name === p);
      return n + (opt ? opt.delta : 0) + (i >= (g.free as number) ? g.extra ?? 0 : 0);
    }, 0);
  }
  return picks.reduce((n, p) => {
    const opt = g.options.find((o) => o.name === p);
    return n + (opt ? opt.delta : 0);
  }, 0);
}

export function unitPrice(dish: Dish, sel: Selection): number {
  return groupsFor(dish).reduce(
    (n, g) => n + groupDelta(g, sel[g.id]),
    dish.price,
  );
}

export function summarise(dish: Dish, sel: Selection): string {
  return groupsFor(dish)
    .map((g) => (sel[g.id] || []).join(", "))
    .filter(Boolean)
    .join(" · ");
}

export const money = (n: number) => n.toFixed(2);

export const DELIVERY_PARTNERS = [
  { name: "Talabat", href: "https://www.talabat.com/uae" },
  { name: "Careem", href: "https://www.careem.com/food" },
  { name: "Deliveroo", href: "https://deliveroo.ae" },
  { name: "Noon", href: "https://food.noon.com" },
  { name: "Keeta", href: "https://keeta.com" },
];
