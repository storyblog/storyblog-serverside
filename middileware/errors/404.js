'use strict';

function notFound(req,res){
  res.status(404).send('Error 404, This Page Is Not Found! :(');
}
module.exports = notFound;
