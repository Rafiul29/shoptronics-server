const { getTokenFromHeader } = require("../utils/getTokenFromHeader")
const { verifyToken } = require("../utils/verifyToken")

const isloggedIn=(req,res,next)=>{
  // get token form header
  const token=getTokenFromHeader(req)
  // verify the token
  const decodedUser=verifyToken(token)
  // save the user into req obj
  if(!decodedUser){
    throw new Error("Invalid/Expire token, please login again")
  }else{
    req.userAuthId=decodedUser?.id;
    next();
  }
}

module.exports=isloggedIn;