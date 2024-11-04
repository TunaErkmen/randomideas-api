const express = require("express");
const router = express.Router();
const Idea = require("../models/idea");

//Get all ideas
router.get("/", async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json({ success: true, data: ideas });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

//Get idea by id
router.get("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    res.json({ success: true, data: idea });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

//Add an idea
router.post("/", async (req, res) => {
  const idea = new Idea({
    text: req.body.text,
    tag: req.body.tag,
    username: req.body.username,
  });
  try {
    const savedIdea = await idea.save();
     return res.json({ success: true, data: savedIdea });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

//Update idea
router.put("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    //match the usernames
    if (idea.username == req.body.username) {
      updatedIdea = await Idea.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            text: req.body.text,
            tag: req.body.tag,
          },
        },
        { new: true }
      );
    } 
    //Username does not match
      else {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to update this idea",
      });
    }
    return res.json({ success: true, data: updatedIdea });
  } catch (error) {
    console.log(error);
   return  res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

//delete idea
router.delete("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ success: false, error: "Idea not found" });
    }

    // Match the username
    if (idea.username == req.body.username) {
      await Idea.findByIdAndDelete(req.params.id);
      res.json({ success: true, data: {} });
    } else {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to delete this idea",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

module.exports = router;
