const fs = require("fs");
const path = require("path");

const categories = {
  Fruits: {
    names: [
      "Honeycrisp Apples",
      "Bananas",
      "Blueberries",
      "Strawberries",
      "Grapes",
      "Oranges",
      "Mangoes",
      "Kiwis",
      "Pineapple",
      "Peaches",
    ],
    imageSeed: "fruits",
  },
  Vegetables: {
    names: [
      "Broccoli",
      "Baby Spinach",
      "Carrots",
      "Cherry Tomatoes",
      "Bell Peppers",
      "Cucumbers",
      "Zucchini",
      "Cauliflower",
      "Sweet Potatoes",
      "Red Onions",
    ],
    imageSeed: "vegetables",
  },
  Dairy: {
    names: [
      "Whole Milk",
      "Greek Yogurt",
      "Cheddar Cheese",
      "Butter",
      "Eggs",
      "Cottage Cheese",
      "Mozzarella",
      "Cream Cheese",
      "Oat Milk",
      "Almond Milk",
    ],
    imageSeed: "dairy",
  },
  Bakery: {
    names: [
      "Sourdough Bread",
      "Whole Wheat Bread",
      "Bagels",
      "Croissants",
      "Brioche Buns",
      "Multigrain Loaf",
      "Ciabatta Rolls",
      "English Muffins",
      "Tortillas",
      "Pita Bread",
    ],
    imageSeed: "bakery",
  },
  Meat: {
    names: [
      "Chicken Breast",
      "Ground Beef",
      "Pork Chops",
      "Bacon",
      "Beef Steak",
      "Chicken Thighs",
      "Turkey Breast",
      "Lamb Chops",
      "Sausages",
      "Ham Slices",
    ],
    imageSeed: "meat",
  },
  Seafood: {
    names: [
      "Salmon Fillet",
      "Shrimp",
      "Tilapia",
      "Cod Fillet",
      "Crab Meat",
      "Scallops",
      "Tuna Steak",
      "Mussels",
      "Clams",
      "Lobster Tail",
    ],
    imageSeed: "seafood",
  },
  Pantry: {
    names: [
      "Olive Oil",
      "Basmati Rice",
      "Pasta Penne",
      "Black Beans",
      "Chickpeas",
      "Tomato Sauce",
      "Peanut Butter",
      "Rolled Oats",
      "Quinoa",
      "Flour",
    ],
    imageSeed: "pantry",
  },
  Snacks: {
    names: [
      "Granola Bars",
      "Potato Chips",
      "Trail Mix",
      "Pretzels",
      "Popcorn",
      "Protein Bars",
      "Rice Cakes",
      "Dark Chocolate",
      "Cookies",
      "Crackers",
    ],
    imageSeed: "snacks",
  },
  Beverages: {
    names: [
      "Orange Juice",
      "Sparkling Water",
      "Cold Brew Coffee",
      "Green Tea",
      "Lemonade",
      "Coconut Water",
      "Herbal Tea",
      "Energy Drink",
      "Iced Tea",
      "Kombucha",
    ],
    imageSeed: "beverages",
  },
  Frozen: {
    names: [
      "Frozen Peas",
      "Frozen Berries",
      "Ice Cream",
      "Frozen Pizza",
      "Frozen Dumplings",
      "Frozen Corn",
      "Frozen Waffles",
      "Frozen Fries",
      "Frozen Spinach",
      "Frozen Mixed Veg",
    ],
    imageSeed: "frozen",
  },
};

const items = [];
const cats = Object.keys(categories);
for (let i = 0; i < 500; i++) {
  const cat = cats[i % cats.length];
  const info = categories[cat];
  const name = info.names[i % info.names.length];
  const id = cat.toLowerCase().replace(/\s+/g, "-") + "-" + (i + 1);
  const sku = "SKU-" + String(i + 1).padStart(4, "0");
  const price = parseFloat((Math.random() * 15 + 3).toFixed(2));
  const discount = Math.random() > 0.5 ? parseFloat((price * 0.9).toFixed(2)) : undefined;
  const seed = `${info.imageSeed}-${(i % 50) + 1}`;
  items.push({
    id,
    name,
    sku,
    category: cat,
    price,
    discountPrice: discount,
    desc: `${name} — premium ${cat.toLowerCase()} item for your kitchen.`,
    images: [`https://picsum.photos/seed/${seed}/640/640`],
    stock: Math.floor(Math.random() * 80) + 20,
    unit: "1 pc",
    rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    tags: [cat.toLowerCase(), "fresh", "grocery"],
    reviews: [],
  });
}

const out = path.join(process.cwd(), "data", "products.json");
fs.writeFileSync(out, JSON.stringify(items, null, 2));
console.log("updated", items.length, "products");

