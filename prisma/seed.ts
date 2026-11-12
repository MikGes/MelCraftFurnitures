import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create sole Administrator account
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@melcraft.com' },
    update: {
      role: Role.ADMIN,
      password: adminPassword,
    },
    create: {
      email: 'admin@melcraft.com',
      username: 'admin',
      password: adminPassword,
      name: 'MelCraft Administrator',
      phone: '+251912345678',
      role: Role.ADMIN,
      emailVerified: true,
    },
  });
  console.log('✅ Sole Admin account verified:', admin.email);

  // 2. Clear old test furniture and reseed with high-end editorial pieces
  await prisma.furniture.deleteMany({});

  const furnitureData = [
    // Sofas
    {
      furniture_name: 'Royal Velvet Sectional Sofa',
      furniture_type: 'Sofa',
      furniture_price: 0,
      furniture_description: 'Deep-cushioned modular velvet sectional designed for architectural comfort with solid beechwood internal frame.',
      special_description: 'Handcrafted Velvet Finish',
      furniture_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    },
    {
      furniture_name: 'Japandi Low-Profile Linen Lounge',
      furniture_type: 'Sofa',
      furniture_price: 0,
      furniture_description: 'Earthy textured Belgian linen sofa with exposed white oak plinth base and feather-down blend cushions.',
      special_description: 'Custom Fabric Selection',
      furniture_image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
    },

    // Beds
    {
      furniture_name: 'Scandinavian Solid Natural Oak Bed',
      furniture_type: 'Bed',
      furniture_price: 0,
      furniture_description: 'Solid natural oak king size bed frame with ergonomic angled headboard and acoustic slat support.',
      special_description: 'Solid White Oak Joinery',
      furniture_image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    },
    {
      furniture_name: 'Upholstered Italian Platform Bed',
      furniture_type: 'Bed',
      furniture_price: 0,
      furniture_description: 'Floating-silhouette platform bed wrapped in textural bouclé with recessed LED under-glow channel.',
      special_description: 'Integrated Lighting Option',
      furniture_image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80',
    },

    // Book Shelves
    {
      furniture_name: 'Nordic Modular Geometric Bookcase',
      furniture_type: 'Book_Shelf',
      furniture_price: 0,
      furniture_description: 'Architectural wall-mounted geometric bookcase crafted from reclaimed hardwood and blackened steel.',
      special_description: 'Modular Wall System',
      furniture_image: 'https://images.unsplash.com/photo-1594643156337-6714244e0559?auto=format&fit=crop&w=1200&q=80',
    },
    {
      furniture_name: 'Floor-to-Ceiling Library Unit',
      furniture_type: 'Book_Shelf',
      furniture_price: 0,
      furniture_description: 'Bespoke library wall with integrated display niches, soft-close lower credenzas, and brass library ladder.',
      special_description: 'Custom Room Dimensions',
      furniture_image: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=1200&q=80',
    },

    // Shoe Racks
    {
      furniture_name: 'Fluted Walnut Entryway Shoe Bench',
      furniture_type: 'Shoe_Rack',
      furniture_price: 0,
      furniture_description: 'Compact ventilated 3-tier shoe organizer with padded leather bench seat and tambour sliding doors.',
      special_description: 'Leather Seat & Tambour Doors',
      furniture_image: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=1200&q=80',
    },
    {
      furniture_name: 'Minimalist Louvered Timber Credenza',
      furniture_type: 'Shoe_Rack',
      furniture_price: 0,
      furniture_description: 'Ventilated slatted timber credenza providing discreet breathable storage for up to 24 pairs.',
      special_description: 'Natural Ash or Walnut',
      furniture_image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
    },

    // Floating Shelves
    {
      furniture_name: 'Brass Inlaid Floating Walnut Shelf',
      furniture_type: 'Floating_Shelf',
      furniture_price: 0,
      furniture_description: 'Hidden-bracket floating display shelf with recessed warm LED diffuser and hand-rubbed oil finish.',
      special_description: 'Concealed Heavy-Duty Mounting',
      furniture_image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
    },
    {
      furniture_name: 'Continuous Smoked Ash Display Shelf',
      furniture_type: 'Floating_Shelf',
      furniture_price: 0,
      furniture_description: 'Minimalist continuous floating shelf in smoked ash wood, ideal for books, sculpture, and curated pottery.',
      special_description: 'Continuous Custom Lengths',
      furniture_image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    },

    // Wardrobes
    {
      furniture_name: 'Luxury Fluted Glass Walk-in Wardrobe',
      furniture_type: 'Wardrobe',
      furniture_price: 0,
      furniture_description: 'Bespoke walk-in wardrobe featuring bronze fluted glass doors, interior velvet drawers, and concealed lighting.',
      special_description: 'Full Bespoke Configuration',
      furniture_image: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1200&q=80',
    },
    {
      furniture_name: 'Matte Charcoal Architectural Closet',
      furniture_type: 'Wardrobe',
      furniture_price: 0,
      furniture_description: 'Full-height seamless modular closet system with tactile matte finish, cedar lining, and brass hardware.',
      special_description: 'Solid Cedar Lining',
      furniture_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    },

    // Kitchen Cabinets
    {
      furniture_name: 'Artisan Seamless Kitchen Island & Cabinetry',
      furniture_type: 'Kitchen_Cabinet',
      furniture_price: 0,
      furniture_description: 'Turnkey solid timber kitchen cabinetry featuring hand-matched grain, integrated appliance panels, and Blum soft-close mechanics.',
      special_description: 'Turnkey Architectural Build',
      furniture_image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      furniture_name: 'Warm Oak & Stone Kitchen Credenza',
      furniture_type: 'Kitchen_Cabinet',
      furniture_price: 0,
      furniture_description: 'Standalone kitchen pantry and dry-bar credenza combining fluted oak tambour doors with natural quartz worktop.',
      special_description: 'Dry Bar & Pantry Option',
      furniture_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  for (const item of furnitureData) {
    await prisma.furniture.create({ data: item });
  }

  console.log(`✅ Seeded ${furnitureData.length} bespoke furniture pieces with rich images!`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
