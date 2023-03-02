import React, { useEffect, useState } from 'react';
import Home from './Home';
import Products from './Products';
import Product from './Product';
import Login from './Login';
import Cart from './Cart';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';


const App = ()=> {
  const [auth, setAuth] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ line_items: []});
  const location = useLocation();
  const navigate = useNavigate();

  const addToCart = (product)=> {
    const token = window.localStorage.getItem('token');
    fetch(
      '/api/cart/add',
      {
        method: 'POST',
        headers: {
          'authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: product.id })
      }
    )
    .then(()=> fetchCart());
  };

  const fetchCart = ()=> {
    const token = window.localStorage.getItem('token');
    fetch(
      '/api/cart/',
      {
        method: 'GET',
        headers: {
          'authorization': token 
        }
      }
    )
    .then( response => response.json())
    .then( cart => setCart(cart));
  };


  //TODO - move fetch calls somewhere else
  const attemptLogin = ()=> {
    const token = window.localStorage.getItem('token');
    if(token){
      fetch(
        '/api/auth/',
        {
          method: 'GET',
          headers: {
            'authorization': token 
          }
        }
      )
      .then( response => response.json())
      .then( user => setAuth(user));
    }
  };

  useEffect(()=> {
    attemptLogin();
  }, []);

  useEffect(()=> {
    if(auth.id){
      const token = window.localStorage.getItem('token');
      fetch(
        '/api/cart/',
        {
          method: 'GET',
          headers: {
            'authorization': token 
          }
        }
      )
      .then( response => response.json())
      .then( cart => setCart(cart));
    }
  }, [auth]);

  useEffect(()=> {
    fetch('/api/products')
      .then(response => response.json())
      .then( products => {
        setProducts(products);
      })
  }, []);

  const logout = ()=> {
    window.localStorage.removeItem('token');
    setAuth({});
  }

  const login = async({ username, password})=> {
    fetch(
      '/api/auth/',
      {
        method: 'POST',
        body: JSON.stringify({ username, password}),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then( response => response.json())
    .then( (data) => {
      if(data.token){
        window.localStorage.setItem('token', data.token);
        attemptLogin();
        navigate('/');
      }
      else {
        console.log(data);
      }
    });
  };

  return (
    <div>
      <h1>FS UNI App Template</h1>
      <nav>
        {
          auth.id ? (
            <>
              <Link className={ location.pathname === '/' ? 'selected': ''}  to='/'>Home</Link>
              <Link className={ location.pathname === '/cart' ? 'selected': ''} to='/cart'>Cart ({ cart.line_items.reduce((acc, line_item)=> {
                return acc += line_item.quantity
              }, 0)})</Link>
              <button onClick={ logout }>Logout { auth.username }</button>
            </>
          ) : (
            <>
              <Link to='/login'>Login</Link>
            </>
          )
        }
        <Link to='/products' className={ location.pathname === '/products' ? 'selected': ''} >Products ({ products.length })</Link>
      </nav>
      <Routes>
        <Route path='/products' element= { <Products products={ products } auth={ auth } addToCart={ addToCart } /> } />
        <Route path='/products/:id' element={ <Product products={ products }/> } />
        {
          auth.id ? (
            <>
            <Route path='/' element= { <Home auth={ auth }/> } />
            <Route path='/cart' element= { <Cart cart={ cart }/> } />
            </>

          ): (
            <>
            <Route path='/login' element= { <Login login={ login }/> } />
            </>
          )
        }
      </Routes>
    </div>
  );
};

export default App;
