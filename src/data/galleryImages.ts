export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: string;
  year: string;
  description: string;
}

const seeds = [
  "aurora",
  "bramble",
  "cascade",
  "cinder",
  "drift",
  "ember",
  "flint",
  "glacier",
  "harbor",
  "indigo",
  "juniper",
  "kestrel",
  "lumen",
  "meridian",
  "nimbus",
  "onyx",
  "petrel",
  "quartz",
  "rivulet",
  "solstice",
  "tundra",
  "umbra",
  "verve",
  "willow",
  "zephyr",
];

const categories = ["Editorial", "Portrait", "Landscape", "Still Life"];

export const galleryImages: GalleryImage[] = seeds.map((seed, index) => ({
  id: seed,
  // placeholder image source (900x1200) — swap for real assets later
  src: `https://picsum.photos/seed/${seed}/900/1200`,
  title: seed.charAt(0).toUpperCase() + seed.slice(1),
  category: categories[index % categories.length],
  year: String(2019 + (index % 6)),
  description:
    "Placeholder caption for this piece. Replace with real project notes, credits, or context once available.",
}));
