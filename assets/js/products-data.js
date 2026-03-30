/**
 * products-data.js
 * Central source of truth for all products across UJINN.RVN.
 */

const productsData = [
  // Tops
  { id: 1, name: "Cream Knit Sweater", price: 36000, oldPrice: 48000, badge: 'sale', category: 'tops', icon: 'shirt', image: 'https://images.unsplash.com/photo-1576809948016-35e330ad0e9b?auto=format&fit=crop&q=80&w=800', description: "A luxuriously soft knit sweater in a sophisticated cream shade, perfect for layering during cooler evenings. Features a classic crew neck and ribbed cuffs for a refined urban look." },
  { id: 2, name: "Linen Button-Up", price: 28000, oldPrice: null, badge: 'new', category: 'tops', icon: 'shirt', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c717658?auto=format&fit=crop&q=80&w=800', description: "Lightweight and breathable linen shirt, ideal for the Lagos heat. Its tailored fit ensures a sharp silhouette throughout the day." },
  { id: 3, name: "Silk Camp Shirt", price: 46000, oldPrice: null, badge: 'new', category: 'tops', icon: 'shirt', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800', description: "Premium silk blend camp shirt with a unique tropical print. Designed for comfort and effortless summer style." },
  { id: 4, name: "Denim Jacket", price: 32000, oldPrice: 42000, badge: 'sale', category: 'tops', icon: 'shirt', image: 'https://images.unsplash.com/photo-1576905341935-4201b972e60c?auto=format&fit=crop&q=80&w=800', description: "Classic mid-wash denim jacket with copper hardware. Durable, timeless, and essential for every wardrobe." },
  { id: 5, name: "Merino Cardigan", price: 55000, oldPrice: null, badge: 'new', category: 'tops', icon: 'shirt', image: 'https://images.unsplash.com/photo-1614676466623-f435e9324440?auto=format&fit=crop&q=80&w=800', description: "A tailored merino wool cardigan in navy. Lightweight yet warm, a perfect companion for the modern globe-trotter." },
  
  // Bottoms
  { id: 6, name: "Rust Chino Pants", price: 30000, oldPrice: null, badge: 'new', category: 'bottoms', icon: 'pants', image: 'https://images.unsplash.com/photo-1473966968600-fa804b869628?auto=format&fit=crop&q=80&w=800', description: "Standard-fit chinos in a rich rust tone. Crafted from high-quality stretch cotton for all-day comfort and durability." },
  { id: 7, name: "Tailored Trousers", price: 38000, oldPrice: 45000, badge: 'sale', category: 'bottoms', icon: 'pants', image: 'https://images.unsplash.com/photo-1594932224010-77f3ad593356?auto=format&fit=crop&q=80&w=800', description: "Modern-fit tailored trousers with a sharp crease. An essential piece for formal events or elevated workwear." },
  { id: 8, name: "Pleated Pants", price: 35000, oldPrice: 48000, badge: 'sale', category: 'bottoms', icon: 'pants', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800', description: "Relaxed-fit pleated pants in charcoal gray. Combines vintage aesthetics with modern comfort." },
  { id: 9, name: "Cargo Shorts", price: 15000, oldPrice: 20000, badge: 'sale', category: 'bottoms', icon: 'pants', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800', description: "Utility cargo shorts in olive drab. Features reinforced pockets and a comfortable, adventure-ready fit." },
  { id: 10, name: "Linen Trousers", price: 30000, oldPrice: null, badge: 'new', category: 'bottoms', icon: 'pants', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80&w=800', description: "Breathable linen trousers in a light sand color. Ideal for outdoor events and relaxed weekends." },

  // Accessories
  { id: 11, name: "Urban Backpack", price: 42000, oldPrice: null, badge: 'new', category: 'accessories', icon: 'bag', image: 'https://images.unsplash.com/photo-1553062407-98eeb94c6a62?auto=format&fit=crop&q=80&w=800', description: "A versatile, water-resistant backpack featuring multiple compartments for all your tech essentials. Minimalist design for the modern professional." },
  { id: 12, name: "Classic Sunglasses", price: 24000, oldPrice: 33000, badge: 'sale', category: 'accessories', icon: 'glasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800', description: "Timeless aviator-style sunglasses with polarized lenses, offering superior protection and an effortless cool factor." },
  { id: 13, name: "Straw Sun Hat", price: 48000, oldPrice: null, badge: 'new', category: 'accessories', icon: 'hat', image: 'https://images.unsplash.com/photo-1521316730702-829a8e30dfd0?auto=format&fit=crop&q=80&w=800', description: "Hand-woven straw hat with a wide brim, providing elegant sun protection for your beach escapes and garden parties." },
  { id: 14, name: "Pilot Watch", price: 18000, oldPrice: 29000, badge: 'sale', category: 'accessories', icon: 'watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', description: "A rugged yet sophisticated pilot watch with a leather strap. Features a large, easy-to-read dial and precise quartz movement." },
  { id: 15, name: "Woven Belt", price: 54000, oldPrice: null, badge: 'new', category: 'accessories', icon: 'belt', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800', description: "Intricately woven leather belt in dark brown. Adds a touch of texture and character to any casual or professional look." },
  { id: 16, name: "Bucket Hat", price: 12000, oldPrice: 18000, badge: 'sale', category: 'accessories', icon: 'hat', image: 'https://images.unsplash.com/photo-1589831377283-33ceadd97a3c?auto=format&fit=crop&q=80&w=800', description: "Casual corduroy bucket hat in mustard yellow. A playful accessory to round out your streetwear ensemble." },
  { id: 17, name: "Messenger Bag", price: 58000, oldPrice: null, badge: 'new', category: 'accessories', icon: 'bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800', description: "Hand-crafted leather messenger bag with an adjustable crossbody strap. Spacious enough for a 15-inch laptop." },
  
  // Footwear
  { id: 18, name: "Leather Sneakers", price: 12000, oldPrice: 23000, badge: 'sale', category: 'footwear', icon: 'shoe', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800', description: "Premium calf leather sneakers with a clean, low-profile design. Features a cushioned footbed for maximum support on the go." },
  { id: 19, name: "Chelsea Boots", price: 42000, oldPrice: null, badge: 'new', category: 'footwear', icon: 'shoe', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800', description: "Smooth suede Chelsea boots with an ergonomic sole. The perfect transition piece for year-round style." },
  { id: 20, name: "White Loafers", price: 45000, oldPrice: null, badge: 'new', category: 'footwear', icon: 'shoe', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800', description: "Clean white suede loafers with gold-bit detailing. A bold statement piece for formal and semi-formal occasions." }
];

// Helper to get formatted price
function formatPrice(n) {
  return '₦' + n.toLocaleString('en-NG');
}
