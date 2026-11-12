// components/data/products.ts

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  features: string[];
  image: string;
}

export const interiorProducts: Product[] = [
  {
    id: 1,
    name: 'Wall Art Collection',
    category: 'Decor',
    description: 'Curated collection of premium wall art pieces to elevate your interior spaces.',
    features: ['Hand-selected pieces', 'Museum-quality prints', 'Various sizes included', 'Ready to hang'],
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Designer Lighting',
    category: 'Lighting',
    description: 'Statement lighting fixtures that combine functionality with artistic design.',
    features: ['Energy-efficient LED', 'Dimmable', 'Handcrafted metal', '3-year warranty'],
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Premium Curtains',
    category: 'Textiles',
    description: 'Luxurious curtains made from high-quality fabric with thermal and blackout properties.',
    features: ['Blackout lining', 'Thermal insulation', 'Machine washable', 'Custom sizing available'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Handwoven Area Rug',
    category: 'Flooring',
    description: 'Handwoven area rug with intricate patterns and premium materials for lasting beauty.',
    features: ['Handwoven wool', 'Non-slip backing', 'Stain-resistant', 'Ethically sourced'],
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Artisan Ceramic Vases',
    category: 'Decor',
    description: 'Set of artisan-crafted ceramic vases in complementary shapes and finishes.',
    features: ['Hand-thrown ceramic', 'Glazed finish', 'Set of 3 sizes', 'Waterproof interior'],
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Solid Wood Mirror Set',
    category: 'Wall Decor',
    description: 'Elegant mirror set with solid wooden frames to enhance light and space in any room.',
    features: ['Solid wood frames', 'Beveled edges', 'Wall mounting hardware included', 'Set of 2 sizes'],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  },
];