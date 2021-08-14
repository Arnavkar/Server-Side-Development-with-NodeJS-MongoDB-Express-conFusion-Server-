const express = require("express")
const bodyParser = require('body-parser')

const dishRouter = express.Router()
//req.body is parsed via the bodyParser module
dishRouter.use(bodyParser.json())

dishRouter.route('/')
.all((req,res,next)=>{
  res.statusCode = 200
  res.setHeader('Content-type','text/plain');
  //The function above will pass it's output as the "next" input param here
  next(); //It will continue on to look for additional specifications that look for /dishes
})
.get((req,res,next)=>{
  res.end("Will send all the dishes to you!");
})
.post((req,res,next)=>{
  res.end(`Will add the dish: ${req.body.name} with details ${req.body.description}`)
})
.put((req,res,next)=>{
  res.statusCode = 403
  res.end('PUT Operation not supported on /dishes')
})
.delete((req,res,next)=>{
  res.end('Deleting all dishes') //Quite a dangeous option!
}); //Semicolon only comes at the end to indicate that all these methods are chained

dishRouter.route("/:dishId")
.get((req,res,next)=>{
  res.end(`Will send details of the dish: ${req.params.dishId} to you!`);
})
.post((req,res,next)=>{
  res.statusCode = 403
  res.end('POST Operation not supported on /dishes/' + req.params.dishId)
})
.put((req,res,next)=>{
  res.write('Updating the dish: ' + req.params.dishId + '\n')
  res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description)
})
.delete((req,res,next)=>{
  res.end('Deleting dish: ' + req.params.dishId)
});

module.exports = dishRouter
