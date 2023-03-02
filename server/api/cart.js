const express = require('express');
const router = express.Router();
const {
  getUserByToken,
  getCartWithLineItems,
  addProductToCart
} = require('../db');

module.exports = router;


router.get('/', async(req, res, next)=> {
  try {
    const user = await getUserByToken(req.headers.authorization); 
    res.send(await getCartWithLineItems(user.id));
  }
  catch(ex){
    next(ex);
  }
});

router.post('/add', async(req, res, next)=> {
  try {
    const user = await getUserByToken(req.headers.authorization); 
    res.send(await addProductToCart({ user_id: user.id, product_id: req.body.product_id}));
  }
  catch(ex){
    next(ex);
  }
});
