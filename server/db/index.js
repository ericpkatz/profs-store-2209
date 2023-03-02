const client = require('./client');
const {
  getUserByToken,
  createUser,
  authenticate
} = require('./User');

const {
  createProduct,
  getProducts
} = require('./Product');

const {
  addProductToCart,
  getCart,
  getCartWithLineItems,
  removeProductFromCart,
  createOrder
} = require('./Cart');

const syncTables = async()=> {
  const SQL = `
  DROP TABLE IF EXISTS line_items;
  DROP TABLE IF EXISTS orders;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS products;
  CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
  );
  CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
  );
  CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    is_cart BOOLEAN NOT NULL DEFAULT true
  );
  CREATE TABLE line_items(
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    UNIQUE(product_id, order_id)

  );
  `;
  await client.query(SQL);
};

const syncAndSeed = async()=> {
  await syncTables();
  const [moe, lucy]  = await Promise.all([
    createUser({
      username: 'moe',
      password: 'moe_password'
    }),
    createUser({
      username: 'lucy',
      password: 'lucy_password'
    })
  ]);
  console.log('--- seeded users ---');
  console.log(moe);
  console.log(lucy);
  const [foo, bar]  = await Promise.all([
    createProduct({
      name: 'foo'
    }),
    createProduct({
      name: 'bar'
    }),
    createProduct({
      name: 'bazz'
    })
  ]);
  console.log('--- seeded products ---');
  console.log(foo);
  console.log(bar);
  await addProductToCart({ product_id: foo.id, user_id: moe.id });
  await addProductToCart({ product_id: foo.id, user_id: moe.id });
  await addProductToCart({ product_id: bar.id, user_id: moe.id });
  let cart = await getCartWithLineItems(moe.id);
  await removeProductFromCart({ product_id: bar.id, user_id: moe.id });
  cart = await getCartWithLineItems(moe.id);
  await createOrder(moe.id);
  console.log(await getCartWithLineItems(moe.id));
  await addProductToCart({ product_id: foo.id, user_id: moe.id });
  await addProductToCart({ product_id: foo.id, user_id: moe.id });
  await addProductToCart({ product_id: bar.id, user_id: moe.id });
  await addProductToCart({ product_id: bar.id, user_id: lucy.id });
  await addProductToCart({ product_id: bar.id, user_id: lucy.id });

};


module.exports = {
  syncAndSeed,
  createUser,
  authenticate,
  getUserByToken,
  getProducts,
  getCartWithLineItems,
  addProductToCart,
  client
};
