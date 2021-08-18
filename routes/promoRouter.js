const express = require("express")
const bodyParser = require('body-parser')
const Promotions = require('../models/promotions')

const promoRouter = express.Router()
promoRouter.use(bodyParser.json())

promoRouter.route('/')
.get((req,res,next)=>{
  Promotions.find({})
  .then((promos)=>{
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.json(promos);
  },(err) => next(err))
  .catch((err)=> next(err));
})
.post((req,res,next)=>{
  Promotions.create(req.body)
  .then((promo)=>{
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.json(promo);
  },(err) => next(err))
  .catch((err)=> next(err));
})
.put((req,res,next)=>{
  res.statusCode = 403
  res.end('PUT Operation not supported on /promotions')
})
.delete((req,res,next)=>{
  Promotions.remove({})
  .then((resp)=>{
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.json(resp);
  },(err) => next(err))
  .catch((err)=> next(err));
});

promoRouter.route("/:promoId")
.get((req,res,next)=>{
  Promotions.findById(req.params.promoId)
  .then((promo)=>{
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.json(promo);
  },(err) => next(err))
  .catch((err)=> next(err));
})
.post((req,res,next)=>{
  res.statusCode = 403
  res.end('POST Operation not supported on /promotions/' + req.params.promoId)
})
.put((req,res,next)=>{
  Promotions.findByIdAndUpdate(req.params.promoId,{
    $set:req.body
  },{new:true}) //new true will return the updated dish as a json string
  .then((promo)=>{
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.json(promo);
  },(err) => next(err))
  .catch((err)=> next(err));
})
.delete((req,res,next)=>{
  Promotions.findByIdAndRemove(req.params.promoId)
  .then((resp)=>{
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.json(resp);
  },(err) => next(err))
  .catch((err)=> next(err));
});

module.exports = promoRouter