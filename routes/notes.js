const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middleware/auth");

// GET
router.get("/", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.user.id });
  res.json(notes);
});

// CREATE
router.post("/", auth, async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id
  });

  const saved = await note.save();
  res.json(saved);
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  const updated = await Note.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      content: req.body.content
    },
    { new: true }
  );

  res.json(updated);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;