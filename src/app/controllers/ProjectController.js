const Project = require("../models/Project");

const createProgrammer = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(404).json("cannot be empty");
  } else if (!req.body.firstName || !req.body.lastName || !req.body.age) {
    return res.status(404).json("must provide firstName, lastName, and age");
  }

  try {
    const newProgrammer = await Project.create(req.body);
    res.status(201).json(newProgrammer);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getAllProgrammers = async (req, res) => {
  try {
    const data = await Project.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getProgrammer = async (req, res) => {
  try {
    const data = await Project.findById(req.params.id);

    res.status(200).json(data);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Invalid ID format" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

const updateProgrammer = async (req, res) => {
  try {
    const data = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteProgrammer = async (req, res) => {
  if (!req.params.id) {
    return res.status(404).json("must provide user id");
  }

  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json("delete success");
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  // index,
  // indexSorted,
  // show,
  // store,
  // update,
  // destroy,
  getAllProgrammers,
  createProgrammer,
  getProgrammer,
  updateProgrammer,
  deleteProgrammer,
};
