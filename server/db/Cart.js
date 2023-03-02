const client = require('./client');

const getCartWithLineItems = async(user_id)=> {
  const cart = await getCart(user_id);
  const SQL = `
    SELECT products.name, line_items.id, line_items.product_id, line_items.quantity 
    FROM line_items
    JOIN products
    ON products.id = line_items.product_id
    WHERE order_id = $1
  `;
  const response = await client.query(SQL, [cart.id])
  return {
    ...cart,
    line_items: response.rows
  };
};

const createOrder = async(user_id)=> {
  const cart = await getCart(user_id);
  const SQL = `
    UPDATE orders
    SET is_cart = false
    WHERE id = $1
  `;
  await client.query(SQL, [ cart.id ]);
};

const getCart = async(user_id) => {
  let cart;
  let SQL = `
    SELECT *
    FROM orders
    WHERE user_id = $1 AND is_cart = true
  `;
  let response = await client.query(SQL, [ user_id ]);
  if(!response.rows.length){
    SQL = `
      INSERT INTO orders(user_id)
      VALUES($1)
      RETURNING *
    `;
    response = await client.query(SQL, [ user_id ]);
    cart = response.rows[0];
  }
  else {
    cart = response.rows[0];
  }
  return cart;
};

const addProductToCart = async({ product_id, user_id }) => {
  const cart = await getCart(user_id);
  let line_item;

  let SQL = `
    SELECT *
    FROM line_items
    WHERE order_id = $1 AND product_id=$2
  `;

  response = await client.query(SQL, [ cart.id, product_id ]);
  if(response.rows.length){
    line_item = response.rows[0];
    SQL = `
      UPDATE line_items
      SET quantity=$1
      WHERE id = $2
    `;
    await client.query(SQL, [ line_item.quantity + 1, line_item.id]);
  }
  else {
    SQL = `
      INSERT INTO line_items(order_id, product_id)
      VALUES($1, $2)
    `;
    await client.query(SQL, [ cart.id, product_id ]);
  }
}

const removeProductFromCart = async({ product_id, user_id }) => {
  const cart = await getCart(user_id);
  const SQL = `
    DELETE FROM line_items
    WHERE product_id = $1 AND order_id = $2
  `;

  await client.query(SQL, [ product_id, user_id ]);
}



module.exports = {
  addProductToCart,
  removeProductFromCart,
  getCart,
  createOrder,
  getCartWithLineItems
};

