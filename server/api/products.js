const express = require('express');
const router = express.Router();
const {
  getProducts
} = require('../db');

module.exports = router;


router.get('/', async(req, res, next)=> {
  try {
    res.send(await getProducts());
  }
  catch(ex){
    next(ex);
  }
});
