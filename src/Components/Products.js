import React from 'react';

const Products = ({ auth, products, addToCart })=> {
  return (
    <ul>
      {
        products.map( product => {
          return (
            <li key={ product.id }>
              { product.name }
            { auth.id ? <button onClick={()=> addToCart(product)}>+</button> : null }
            </li>
          );
        })
      }
    </ul>
  );
};

export default Products;
