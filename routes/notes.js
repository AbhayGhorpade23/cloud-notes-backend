const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middleware/auth");

// GET NOTES
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch {
    res.json({ error: "Failed to fetch notes" });
  }
});

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      userId: req.user.id,
      title,
      content
    });

    await note.save();
    res.json(note);
  } catch {
    res.json({ error: "Failed to create note" });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    res.json(note);
  } catch {
    res.json({ error: "Failed to update note" });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.json({ error: "Failed to delete note" });
  }
});

module.exports = router;