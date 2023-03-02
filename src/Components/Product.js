import React from 'react';
import { useParams } from 'react-router-dom';

const Product = ({ products })=> {
  const { id } = useParams();
  const product = products.find(product => product.id === id*1);
  if(!product){
    return null;
  }
  return (
    <h1>{ product.name }</h1>
  );
};

export default Product;
