const Note = require("../models/Note");

exports.getNotes = async (req, res) => {
  const { q, tag } = req.query;

  let filter = { user: req.user.id };

  if (q) {
    filter.$or = [
      { title: new RegExp(q, "i") },
      { content: new RegExp(q, "i") },
      { tags: new RegExp(q, "i") },
    ];
  }

  if (tag) filter.tags = tag;

  const notes = await Note.find(filter);
  res.json(notes);
};

exports.createNote = async (req, res) => {
  const { title, content, tags } = req.body;

  const note = await Note.create({
    user: req.user.id,
    title,
    content,
    tags,
  });

  res.status(201).json(note);
};

exports.updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(note);
};

exports.deleteNote = async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ msg: "Deleted" });
};
