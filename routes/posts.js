const router = require("express").Router();
// const { findById, deleteOne } = require("../models/Post");
const Post = require("../models/Post");
const User = require("../models/User");


// create post
router.post("/", async (req, res) => {
    const newPost = await new Post(req.body);
    try {
        const post = await newPost.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).send(error);
    }
})
// update a post
router.put("/:id", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("your post has been updated")
        } else {
            res.status(403).json("you can only update your post")
        }
    } catch (error) {
        console.log(err);
        return res.status(500).json(err);
    }

});

// delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Post has been deleted");
        } else {
            res.status(403).json("you can only delete your post");
        }

    } catch (error) {
        res.status(500).json(error);
    }
})
// like dislike a post
router.put("/:id/like", async (req, res)=>{
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
})



// get a post

router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //get timeline posts
  
  router.get("/timeline/:userId", async (req, res) => {
    try {
      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      console.log(currentUser);
      console.log(userPosts)
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
   
      res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
      
    }
  });

    //get all posts of a user
  
    router.get("/profile/:username", async (req, res) => {
        try {
          const currentUser = await User.findOne({ username: req.params.username});
          const userPosts = await Post.find({ userId: currentUser._id });
          res.status(200).json(userPosts);
        } catch (err) {
          res.status(500).json(err);
          console.log(err);
          
        }
      });
    
    



module.exports = router;