const express = require("express");
const bodyParser = require('body-parser');
const cors = require('./cors');
const Favorites = require('../models/favorites');
const authenticate = require('../authenticate');
const Dishes = require('../models/dishes');

const favoriteRouter = express.Router()
favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next)=>{
  Favorites.findOne({'user':req.user._id})
  .populate('user')
  .populate('dishes')
  .then((favorite)=>{
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.json(favorite);
  },(err) => next(err))
  .catch((err)=> next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({'user':req.user._id})
    .then((favorite)=>{
        if (favorite === null) {
            Favorites.create({user:req.user._id,dishes:[]})
            .then((favorite)=>{
                for (var i = 0;i < req.body.length; i++){
                    favorite.dishes.unshift(req.body[i]._id);
                }
                favorite.save()
                .then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                },(err) => next(err))
            },(err) => next(err))
        }else{
            for (var i = 0;i < req.body.length; i++){
                favorite.dishes.unshift(req.body[i]._id);
            }
            favorite.save()
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            },(err) => next(err))
        }
    },(err) => next(err))
.catch((err)=>next(err));    
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403
  res.end('PUT Operation not supported on /favorites')
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req,res,next)=>{
  Favorites.deleteOne({'user':req.user._id})
  .then((resp)=>{
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.json(resp);
  },(err) => next(err))
  .catch((err)=> next(err));
});

favoriteRouter.route("/:dishId")
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200);})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favorites.findOne({'user':req.user._id})
    .then((favorite)=>{
        if (favorite === null) {
            Favorites.create({user:req.user._id,dishes:[]})
            .then((favorite)=>{
                favorite.dishes.unshift(req.params.dishId);
                favorite.save()
                .then((favorite)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                },(err) => next(err))
            },(err) => next(err))
        }else{
            favorite.dishes.unshift(req.params.dishId);
            favorite.save()
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            },(err) => next(err))
        }
    },(err) => next(err))
    .catch((err)=>next(err));
})
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403
  res.end('GET Operation not supported on /favorites/' + req.params.dishId)
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403
    res.end('PUT Operation not supported on /favorites/' + req.params.dishId)
  })
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
  Favorites.findOne({'user':req.user._id},(err,favorite)=>{
    if (err) return next(err);
    else if (favorite == null){
        err = new Error('User has no favorites');
        err.status = 404;
        return next(err);
    } else if (favorite != null) {
        if (favorite.dishes.indexOf(req.params.dishId) === -1){
            err = new Error("Dish " + req.params.dishId + " not a user favorite");
            err.status = 404;
            return next(err);
        } else {
            favorite.dishes.splice(favorite.dishes.indexOf(req.params.dishId),1);
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            },(err) => next(err))
        }
    }
  });
});

module.exports = favoriteRouter;
