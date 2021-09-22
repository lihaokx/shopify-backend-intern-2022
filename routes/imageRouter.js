var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const userModel = require('../models/user');
var authenticate = require('../authenticate');
const multer = require('multer');
const fs = require('fs')
const storage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, './public/images')
        },
        filename: function(req, file, cb){
            var d = new Date(Date.now()); 
            console.log("req.user.username: ",req.user.username )
            // const uniqueSuffix =  d.getDate().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString()+ '-' + Math.round(Math.random() * 1E1)
            
            var formt = file.originalname ;
            cb(null, req.user.username + formt);
        }
    }
)

const imageFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG)$/)){
        var err = new Error('You can only upload image files with jpg/jpeg/png/gif format!');
        err.status = 500;
        cb( err, false);
    }
    else{
        cb(null, true);
    }
}
const upload = multer({
    storage: storage,
    fileFilter: imageFilter
});

const imageRouter = express.Router();
imageRouter.use(bodyParser.json());
imageRouter.route('/')
.post( 
    authenticate.verifyUser,
    upload.array('imageFile', 10), 
    (req, res, next) =>{
        console.log("req.user._id: ", req.user._id)
        req.body.user = req.user._id;
        userModel.findById( req.user._id )
        .then((user) => {
            console.log("user: ", user)
            // console.log("user: ", user)
            if (user != null) {
                // dish.comments.push(req.body);
                // req.body.dishes = req.user._id;
                var namePath = []
            // check if the image in the database, 
            // if yes, do not add it
            // if no, add it 

                for(let i=0; i<req.files.length; i++){
                    var curr = req.files[i].filename;
                    if(user.images.length ==0){
                        namePath.push({
                            PathName: curr
                        })
                    }
                    else{
                        if( !user.images.some((currimg)=>{
                            return currimg.PathName === curr
                        })){
                            namePath.push({
                                PathName: curr
                            })
                        }
                    }
                }

                user.images = user.images.concat(namePath);
                user.save()
                .then((user) => {
                    console.log("user after: ", user)
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({imagesPosted: req.files, ImagesInDatabase: user.images});
                    })  
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    }
)

imageRouter.route('/:imgId')
.delete(  
    authenticate.verifyUser,
    (req, res, next) => {
    console.log("req.body: ", req.body)
    req.body.user = req.user._id;
    userModel.findById( req.user._id )
    .then( async (user)  => {

        if(user!=null){
            try {
                var pathDlt = ''
                for(var i =0; i<user.images.length; i++){
                    if(user.images[i].PathName.toString() === req.params.imgId){
                        pathDlt = user.images[i].PathName;
                    }
                }
                if(pathDlt === ''){
                    res.statusCode = 403;
                    res.end("Delete action failed! \nYou are not allowed to delete it or there is no such file: '" + req.params.imgId +"'");
                    console.log("You are not allowed to delete it or there is no such file: " , req.params.imgId);
                }
                else{
                    for(var i =0; i<user.images.length; i++){
                        if(user.images[i].PathName === req.params.imgId){
                            console.log('i, ',i)
                            pathDlt = user.images[i].PathName;
                            user.images.pull(user.images[i]._id.toString())
                            
                            break;
                        }
                    }
                    console.log(".......")
                    user.save()
                        .then(( ) => {
                            console.log("after delete: ", user.images)
                            fs.unlink('./public/images/'+pathDlt, (err)=>{
                                if(err){throw err;}
                                console.log(pathDlt, " was deleted")
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({successfullyDeleted: "Yes", DeletedImgName: req.params.imgId, DeletedImgPath: './public/images/'+pathDlt, RemainImagesInDatabase: user.images});
                        })  
                    })
                }
            }
            catch(err) {
            console.error(err)
            }
 
        }
        else{
            err = new Error('You do not have images. Thus, nothing can be deleted!');
            err.status = 404;
            return next(err);
        }

    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = imageRouter;















