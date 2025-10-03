// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const Task = require('../models/Task');
// const User = require('../models/User');

// // Create task
// router.post('/', auth, async (req,res)=>{
//   try {
//     const { title, description, dueDate, priority, assignedTo } = req.body;
//     const task = new Task({
//       title, description, dueDate, priority,
//       assignedTo: assignedTo || req.user._id,
//       createdBy: req.user._id
//     });
//     await task.save();
//     res.json(task);
//   } catch (err) { res.status(500).send('Server error'); }
// });

// // Get tasks with pagination & filter for assigned user (if query param mine=true)
// router.get('/', auth, async (req,res)=>{
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const mine = req.query.mine === 'true'; // show only assigned to current user
//     const filters = {};
//     if (mine) filters.assignedTo = req.user._id;
//     if (req.query.status) filters.status = req.query.status;
//     if (req.query.priority) filters.priority = req.query.priority;

//     const total = await Task.countDocuments(filters);
//     const tasks = await Task.find(filters)
//       .populate('assignedTo','name email')
//       .sort({ dueDate: 1 })
//       .skip((page-1)*limit)
//       .limit(limit);

//     res.json({ tasks, total, page, pages: Math.ceil(total/limit) });
//   } catch (err) { res.status(500).send('Server error'); }
// });

// // Get task details
// router.get('/:id', auth, async (req,res)=>{
//   try {
//     const task = await Task.findById(req.params.id).populate('assignedTo','name email');
//     if (!task) return res.status(404).json({ msg: 'Not found' });
//     res.json(task);
//   } catch (err) { res.status(500).send('Server error'); }
// });

// // Update a task (edit fields)
// router.put('/:id', auth, async (req,res)=>{
//   try {
//     const { title, description, dueDate, status, priority, assignedTo } = req.body;
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ msg: 'Not found' });

//     // optionally restrict edit rights (e.g., creator or admin)
//     task.title = title ?? task.title;
//     task.description = description ?? task.description;
//     task.dueDate = dueDate ?? task.dueDate;
//     task.status = status ?? task.status;
//     task.priority = priority ?? task.priority;
//     task.assignedTo = assignedTo ?? task.assignedTo;

//     await task.save();
//     res.json(task);
//   } catch (err) { res.status(500).send('Server error'); }
// });

// // Delete task (with confirmation at frontend)
// router.delete('/:id', auth, async (req,res)=>{
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ msg: 'Not found' });
//     await task.remove();
//     res.json({ msg: 'Task removed' });
//   } catch (err) { res.status(500).send('Server error'); }
// });

// // Change status endpoint (quick toggle)
// router.patch('/:id/status', auth, async (req,res)=>{
//   try {
//     const { status } = req.body;
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ msg: 'Not found' });
//     task.status = status;
//     await task.save();
//     res.json(task);
//   } catch (err) { res.status(500).send('Server error'); }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id
    });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get tasks with pagination & filter
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const mine = req.query.mine === 'true';
    const filters = {};

    if (mine) filters.assignedTo = req.user._id;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;

    const total = await Task.countDocuments(filters);
    const tasks = await Task.find(filters)
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ tasks, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get task details
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ msg: 'Not found' });
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, dueDate, status, priority, assignedTo } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Not found' });

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.dueDate = dueDate ?? task.dueDate;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.assignedTo = assignedTo ?? task.assignedTo;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Not found' });
    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Change status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Not found' });

    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
