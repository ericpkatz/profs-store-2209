import React, { useEffect, useState } from 'react';
import Home from './Home';
import Products from './Products';
import Login from './Login';
import { Link, Routes, Route } from 'react-router-dom';


const App = ()=> {
  const [auth, setAuth] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ line_items: []});

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
              <Link to='/'>Home</Link>
              <Link to='/cart'>Cart ({ cart.line_items.length})</Link>
              <button onClick={ logout }>Logout { auth.username }</button>
            </>
          ) : (
            <>
              <Link to='/login'>Login</Link>
            </>
          )
        }
        <Link to='/products'>Products ({ products.length })</Link>
      </nav>
      <Routes>
        <Route path='/Products' element= { <Products products={ products }/> } />
        {
          auth.id ? (
            <>
            <Route path='/' element= { <Home auth={ auth }/> } />
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
