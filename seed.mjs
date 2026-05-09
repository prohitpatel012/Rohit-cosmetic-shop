const categories = [
  { name: 'Skincare', description: 'Everything you need for a healthy, glowing skin.' },
  { name: 'Makeup', description: 'Cosmetics to enhance your natural beauty.' },
  { name: 'Haircare', description: 'Shampoos, conditioners, and treatments for luscious locks.' },
  { name: 'Fragrance', description: 'Perfumes and colognes for every occasion.' },
  { name: 'Bath & Body', description: 'Soaps, lotions, and bath bombs for relaxation.' },
  { name: 'Nails', description: 'Polishes, tools, and treatments for perfect manicures.' },
  { name: 'Tools & Brushes', description: 'Essential applicators and beauty tools.' },
  { name: 'Men\'s Grooming', description: 'Skincare, shaving, and haircare for men.' },
  { name: 'Vegan Beauty', description: '100% cruelty-free and vegan cosmetic products.' },
  { name: 'Korean Beauty', description: 'Popular K-beauty skincare and makeup brands.' }
];

const productsData = [
  { name: 'Hyaluronic Acid Serum', description: 'Intense hydration for plump skin.', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop', price: 24.99, discount: 10, isavailable: true },
  { name: 'Matte Liquid Lipstick', description: 'Long-lasting, smudge-proof lip color.', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=400&fit=crop', price: 18.50, discount: 0, isavailable: true },
  { name: 'Argan Oil Shampoo', description: 'Nourishing shampoo for dry and damaged hair.', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop', price: 15.00, discount: 5, isavailable: true },
  { name: 'Floral Eau de Parfum', description: 'A light, romantic floral fragrance.', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=400&fit=crop', price: 65.00, discount: 15, isavailable: true },
  { name: 'Lavender Bath Salts', description: 'Relaxing bath salts with essential oils.', image: 'https://images.unsplash.com/photo-1608248593842-808c502b4d1b?w=600&h=400&fit=crop', price: 12.99, discount: 0, isavailable: true },
  { name: 'Gel Nail Polish Set', description: 'Set of 6 popular pastel colors.', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=400&fit=crop', price: 29.99, discount: 20, isavailable: true },
  { name: 'Professional Brush Set', description: '12-piece synthetic makeup brush set.', image: 'https://images.unsplash.com/photo-1596462502278-27bf850338dd?w=600&h=400&fit=crop', price: 45.00, discount: 0, isavailable: true },
  { name: 'Beard Trimming Kit', description: 'Everything needed to maintain a perfect beard.', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&h=400&fit=crop', price: 35.00, discount: 10, isavailable: true },
  { name: 'Organic Face Cream', description: 'Vegan and organic daily moisturizer.', image: 'https://images.unsplash.com/photo-1611077544665-27a3c3066601?w=600&h=400&fit=crop', price: 28.00, discount: 0, isavailable: true },
  { name: 'Snail Mucin Essence', description: 'Popular K-beauty essence for skin repair.', image: 'https://images.unsplash.com/photo-1570194065650-d7aefc2cb5f6?w=600&h=400&fit=crop', price: 22.50, discount: 5, isavailable: true }
];

async function seed() {
  console.log("Starting seed...");
  
  const createdCats = [];
  for (const cat of categories) {
    try {
      const res = await fetch('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat)
      });
      const data = await res.json();
      if (res.ok) {
          console.log("Created category:", cat.name);
          createdCats.push(data.category);
      } else {
          console.log("Category might exist:", cat.name);
          const listRes = await fetch('http://localhost:3000/api/categories');
          const list = await listRes.json();
          const existing = list.find(c => c.name === cat.name);
          if(existing) createdCats.push(existing);
      }
    } catch (e) {
      console.error(e);
    }
  }

  for (let i = 0; i < productsData.length; i++) {
    const product = productsData[i];
    product.category = createdCats[i % createdCats.length]?._id;
    
    if(!product.category) continue;

    try {
      const res = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) {
          console.log("Created product:", product.name);
      } else {
          console.error("Failed to create product:", product.name, await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  console.log("Seeding complete!");
}

seed();
