import React from 'react';

const Cart = ({ cart })=> {
  return (
    <ul>
      {
        cart.line_items.map( line_item => {
          return (
            <li key={ line_item.id }>
              { line_item.name }
              ({ line_item.quantity })
            </li>
          );
        })
      }
    </ul>
  );
};

export default Cart;
