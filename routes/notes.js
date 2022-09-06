const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Note = require("../models/Notes");
const mongoose = require("mongoose")


// get notes
router.get("/", fetchUser, async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

// add notes

router.post(
  "/",
  fetchUser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Enter a valid Title").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured");
    }
  }
);

// update note

router.put(
  "/:id",
  fetchUser,
  [
    // body("title", "Enter a valid Title").isLength({ min: 3 }),
    // body("description", "Enter a valid Title").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    try {
      const { title, description, tag } = req.body;
      const newNote = {}
      if(title){newNote.title = title}
      if(description){newNote.description = description}
      if(tag){newNote.tag = tag}

      let note = await Note.findById(req.params.id)

      if (!note) {
        return res.status(404).send('not found')
      }

      if (note.user.toString() !== req.user.id) {
        return res.status(401)
      }

      note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
      res.json(note)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured");
    }
  }
);


// delete note 

router.delete('/:id', fetchUser, async(req, res) =>{
  try {



    let note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).send('not found')
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401)
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json("deleted")
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
})

module.exports = router;
