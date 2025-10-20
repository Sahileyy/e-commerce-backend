export function itsAdmin(req,res,next) {
    
    if(req.session.role === "admin"){
        console.log("admin logged");
        
      return  next()
    }else{
       return res.status(403).json("Access denied: admin only")
    }

}

export function itsUser(req,res,next) {
    
    if( req.session.role === "user"){
        console.log("user loggged");
        
      return  next()
    }else{
       return res.status(403).json("Access denied: user only")
    }

}