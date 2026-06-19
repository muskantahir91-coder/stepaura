// Step Aura — product catalog
const SUBCATEGORIES = {
  men: ["Sneakers", "Formal Shoes", "Sports Shoes", "Sandals"],
  women: ["Heels", "Flats", "Sandals", "Sneakers"],
  kids: ["School Shoes", "Casual Shoes", "Sports Shoes"],
};

const PRODUCTS = [
  { id: "m-sn-1", name: "Aura Glide Sneaker", description: "Lightweight everyday sneaker with cushioned cloud sole.", price: 4999, oldPrice: 6499, discount: 23, image: "images/shoe-1.jpg", category: "men", subcategory: "Sneakers", badge: "BESTSELLER" },
  { id: "m-fr-1", name: "Onyx Oxford Classic", description: "Hand-stitched leather oxford crafted for sharp evenings.", price: 8999, image: "images/shoe-2.jpg", category: "men", subcategory: "Formal Shoes", badge: "NEW" },
  { id: "m-sp-1", name: "Velocity Runner Pro", description: "Performance running shoe with reactive foam midsole.", price: 6499, oldPrice: 7999, discount: 19, image: "images/shoe-3.jpg", category: "men", subcategory: "Sports Shoes" },
  { id: "m-sa-1", name: "Coastal Leather Sandal", description: "Premium tan leather sandal for relaxed days.", price: 3499, image: "images/shoe-9.jpg", category: "men", subcategory: "Sandals" },
  { id: "w-he-1", name: "Aura Stiletto 100", description: "Iconic pointed-toe stiletto in blush patent.", price: 7499, oldPrice: 8999, discount: 17, image: "images/shoe-4.jpg", category: "women", subcategory: "Heels", badge: "TRENDING" },
  { id: "w-sn-1", name: "Luna Rose Sneaker", description: "Minimalist white sneaker with rose gold accents.", price: 5499, image: "images/shoe-5.jpg", category: "women", subcategory: "Sneakers" },
  { id: "w-fl-1", name: "Soft Step Ballerina", description: "Buttery leather flats in warm caramel.", price: 3999, oldPrice: 4999, discount: 20, image: "images/shoe-6.jpg", category: "women", subcategory: "Flats" },
  { id: "w-sa-1", name: "Ribbon Strap Sandal", description: "Delicate strap sandal with cushioned footbed.", price: 4299, image: "images/shoe-4.jpg", category: "women", subcategory: "Sandals" },
  { id: "k-sp-1", name: "Tiny Bolt Sneaker", description: "Bright, springy sneaker built for adventures.", price: 2999, oldPrice: 3799, discount: 21, image: "images/shoe-7.jpg", category: "kids", subcategory: "Sports Shoes", badge: "KIDS PICK" },
  { id: "k-sc-1", name: "Scholar Black School Shoe", description: "Durable matte leather school shoe with grippy sole.", price: 2499, image: "images/shoe-8.jpg", category: "kids", subcategory: "School Shoes" },
  { id: "k-ca-1", name: "Playday Casual", description: "Easy slip-on casual for school-out fun.", price: 2299, image: "images/shoe-7.jpg", category: "kids", subcategory: "Casual Shoes" },
  { id: "m-sn-2", name: "Nightfall Court", description: "Court silhouette finished in deep ink leather.", price: 5999, image: "images/shoe-2.jpg", category: "men", subcategory: "Sneakers" },

  // ── Additional Men ──────────────────────────────────────────────────────────
  { id: "m-sp-2", name: "TrailMaster Hiker", description: "Rugged lace-up trail shoe with anti-slip outsole for rough terrain.", price: 7299, oldPrice: 8999, discount: 19, image: "images/shoe-3.jpg", category: "men", subcategory: "Sports Shoes", badge: "NEW" },
  { id: "m-fr-2", name: "Derby Charcoal Elite", description: "Sleek charcoal derby shoe with brogue detailing, perfect for the boardroom.", price: 9499, image: "images/shoe-1.jpg", category: "men", subcategory: "Formal Shoes" },
  { id: "m-sn-3", name: "CloudWalk Lite", description: "Ultra-light mesh sneaker with breathable knit upper for all-day comfort.", price: 4499, oldPrice: 5499, discount: 18, image: "images/shoe-5.jpg", category: "men", subcategory: "Sneakers", badge: "BESTSELLER" },
  { id: "m-sa-2", name: "Urban Slide Pro", description: "Contoured EVA footbed slide for effortless off-duty style.", price: 2799, image: "images/shoe-9.jpg", category: "men", subcategory: "Sandals" },
  { id: "m-sp-3", name: "SprintX Carbon", description: "High-performance sprint shoe with carbon fibre plate for speed training.", price: 8799, oldPrice: 10499, discount: 16, image: "images/shoe-3.jpg", category: "men", subcategory: "Sports Shoes", badge: "PRO" },

  // ── Additional Women ─────────────────────────────────────────────────────────
  { id: "w-he-2", name: "Block Heel Royale", description: "Stable block heel in ivory suede — comfort meets sophistication.", price: 6999, image: "images/shoe-4.jpg", category: "women", subcategory: "Heels", badge: "NEW" },
  { id: "w-sn-2", name: "Pastel Puff Sneaker", description: "Chunky sole sneaker in lilac with pastel pop details.", price: 5999, oldPrice: 6999, discount: 14, image: "images/shoe-5.jpg", category: "women", subcategory: "Sneakers", badge: "TRENDING" },
  { id: "w-fl-2", name: "Woven Mule Slide", description: "Natural woven strap mule with cushioned leather insole.", price: 3299, image: "images/shoe-6.jpg", category: "women", subcategory: "Flats" },
  { id: "w-sa-2", name: "Boho Tie Sandal", description: "Hand-tied suede lace sandal with a boho-chic silhouette.", price: 3799, oldPrice: 4499, discount: 16, image: "images/shoe-4.jpg", category: "women", subcategory: "Sandals" },
  { id: "w-he-3", name: "Kitten Mule Croc", description: "Croc-embossed kitten mule for understated evening glamour.", price: 7999, image: "images/shoe-6.jpg", category: "women", subcategory: "Heels" },

  // ── Additional Kids ──────────────────────────────────────────────────────────
  { id: "k-sc-2", name: "StarBright School Shoe", description: "Velcro-close patent leather school shoe with anti-slip sole.", price: 2199, oldPrice: 2799, discount: 21, image: "images/shoe-8.jpg", category: "kids", subcategory: "School Shoes", badge: "POPULAR" },
  { id: "k-sp-2", name: "MegaJump Soccer Cleat", description: "Lightweight turf cleat for young athletes who mean business.", price: 3299, image: "images/shoe-7.jpg", category: "kids", subcategory: "Sports Shoes", badge: "NEW" },
  { id: "k-ca-2", name: "Dino Print Casual", description: "Fun dino-print canvas shoe with elastic laces for tiny explorers.", price: 1999, image: "images/shoe-7.jpg", category: "kids", subcategory: "Casual Shoes" },
  { id: "k-ca-3", name: "Neon Flash Slip-On", description: "Bright neon slip-on with flexible sole — on in seconds, impossible to miss.", price: 2399, oldPrice: 2999, discount: 20, image: "images/shoe-8.jpg", category: "kids", subcategory: "Casual Shoes" },
];

const formatPKR = (n) => `Rs. ${n.toLocaleString("en-PK")}`;
