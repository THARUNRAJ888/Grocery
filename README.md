# Grocery MERN App

Mobile-first grocery experience built with React (Vite) + Tailwind and Node/Express/MongoDB.

## Quickstart

1) Backend
```
cd server
cp .env.example .env   # add MONGO_URI, JWT_SECRET, ADMIN_INVITE_CODE
npm install
npm run dev
```

2) Frontend
```
cd client
npm install
npm run dev
```

## Product data (required)
Import the provided JSON into MongoDB (adjust URI):
```
mongoimport --uri "<MONGO_URI>" --collection products --file data/products.json --jsonArray
```

### Using MongoDB Atlas
- Create an Atlas cluster and a database user.
- Add your IP or 0.0.0.0/0 to Network Access (for dev only).
- Set `MONGO_URI` in `server/.env`, e.g.  
  `MONGO_URI="mongodb+srv://USER:PASSWORD@cluster0.xxxxxx.mongodb.net/grocery?retryWrites=true&w=majority&appName=Cluster0"`
- Import products to Atlas (replace URI with your SRV string):
  ```
  mongoimport --uri "<MONGO_URI>" --collection products --file data/products.json --jsonArray
  ```

## Features
- Auth-first landing page with login/register/guest; admin via invite code.
- Responsive Tailwind UI with hamburger nav, cart badge, avatar menu.
- Product catalog with search, filters (category/price/rating/in-stock), sort, pagination, details.
- Cart for logged-in users stored in MongoDB; guest cart in localStorage with sync on login.
- Checkout with address CRUD, mock multi-step card or COD, order creation, stock decrement.
- Orders history, PDF invoice download, admin status updates (Placed→Processing→Out for Delivery→Delivered) plus delivery details.
- Admin product CRUD and sales reports (monthly/yearly) with CSV/PDF export.
- Contact form saved to MongoDB with admin view endpoint.

## API base
Default API URL: `http://localhost:5000`. Set `VITE_API_URL` in `client/.env` if different.

