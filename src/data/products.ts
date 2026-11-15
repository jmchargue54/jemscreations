export type Product = { id: number; name: string; category: string; price: number; image: string; alt: string; description: string; sold?: boolean };

export const products: Product[] = [
  { id: 1, name: "Ocean Wood Studs", category: "earrings", price: 28, image: "/images/ocean-wood.jpg", alt: "Blue resin and wood jewelry", description: "A one-of-a-kind pair of wood and ocean-blue resin stud earrings." },
  { id: 2, name: "Wildflower Circle", category: "necklace", price: 34, image: "/images/flower-circle.jpg", alt: "Flower-inspired round resin piece", description: "A colorful round piece inspired by pressed wildflowers and sunny walks." },
  { id: 3, name: "Redwood Keepsake", category: "other", price: 42, image: "/images/red-block.jpg", alt: "Handmade red wood keepsake", description: "A small, warm-toned keepsake made to hold the things you treasure." },
  { id: 4, name: "Midnight Trinket Box", category: "home goods", price: 56, image: "/images/blue-coffin.jpg", alt: "Blue handmade trinket box", description: "A character-filled trinket box with deep blue resin details." },
];
