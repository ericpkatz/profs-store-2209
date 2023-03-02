const express = require('express');
const router = express.Router();
const {
  getUserByToken,
  getCartWithLineItems
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
