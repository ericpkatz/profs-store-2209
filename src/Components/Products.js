import React from 'react';
import { Link } from 'react-router-dom';

const Products = ({ auth, products, addToCart })=> {
  return (
    <ul>
      {
        products.map( product => {
          return (
            <li key={ product.id }>
              <Link to={`/products/${product.id}`}>{ product.name }</Link>
            { auth.id ? <button onClick={()=> addToCart(product)}>+</button> : null }
            </li>
          );
        })
      }
    </ul>
  );
};

export default Products;
