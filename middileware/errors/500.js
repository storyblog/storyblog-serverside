'use strict';

function serverError(req,res,err){
  res.status(500).json({err: err});
}

module.exports = serverError;
