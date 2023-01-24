const router = require("express").Router();
const Conversation = require("../models/Conversation");


// create conversation
router.post("/", async (req, res) =>{
    const newConversation = await new Conversation({
        members:[req.body.senderId, req.body.receiverId]
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});


// get a conversation
router.get("/:userId", async (req, res) =>{
    try {
        const conversation = await Conversation.find({
            members:{$in:[req.params.userId]}
        })
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error)
    }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });



module.exports = router;