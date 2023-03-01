const client = require('./client');


const createProduct = async({ name }) => {
  const SQL = `
    INSERT INTO products(name)
    VALUES($1) RETURNING *
  `;
  const response = await client.query(SQL, [ name ]);
  return response.rows[0];
}

const getProducts = async() => {
  const SQL = `
    SELECT * 
    FROM products
  `;
  const response = await client.query(SQL);
  return response.rows;
}


module.exports = {
  createProduct,
  getProducts
};

