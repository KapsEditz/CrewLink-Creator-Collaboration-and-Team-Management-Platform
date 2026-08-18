require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const Project = require('./models/Project');
const User = require('./models/User'); 

const app = express();
const { protect } = require('./middleware/auth');

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to local MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- REGISTER ---
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role, title, rate, skills } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const skillsArray = typeof skills === 'string' && skills.trim() !== '' 
            ? skills.split(',').map(skill => skill.trim()) 
            : [];

        const user = await User.create({ 
            name, 
            email, 
            password, 
            role: role || 'creator', 
            title: title || "", 
            rate: rate || "", 
            skills: skillsArray 
        });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
    } catch (error) { 
        console.error("❌ REGISTRATION ERROR:", error);
        res.status(500).json({ error: error.message || 'Server error during registration' }); 
    }
});

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        if (typeof user.matchPassword !== 'function') {
            return res.status(500).json({ error: 'Server configuration error: matchPassword missing' });
        }

        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("❌ LOGIN ERROR:", error); 
        res.status(500).json({ error: error.message || 'Server error during login' });
    }
});

// --- USER PROFILE ---
app.put('/api/users/profile', protect, async (req, res) => {
    try {
        const { name, title, rate, skills, avatar, status } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (name) user.name = name;
        if (avatar !== undefined) user.avatar = avatar; 
        if (title !== undefined) user.title = title;
        if (rate !== undefined) user.rate = rate;
        if (status !== undefined) user.status = status;
        
        if (skills !== undefined) {
            user.skills = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;
        }

        await user.save();
        res.json({ message: 'Profile updated', user });
    } catch (error) { 
        console.error("❌ PROFILE UPDATE ERROR:", error); // <-- This will tell us the exact error in your terminal!
        res.status(500).json({ error: error.message || 'Failed to update profile' }); 
    }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// --- PROJECTS ---
app.get('/api/projects', protect, async (req, res) => {
    try {
        const projects = await Project.find({ $or: [{ owner: req.user.id }, { crew: req.user.id }] }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch projects' }); }
});

app.post('/api/projects', protect, async (req, res) => {
    try {
        const { title, isPublic, assignee, progress, status } = req.body;
        const newProject = await Project.create({ title, owner: req.user.id, isPublic: isPublic || false, assignee, progress: progress || 0, status: status || 'neutral' });
        res.status(201).json(newProject);
    } catch (error) { res.status(500).json({ error: 'Failed to create project' }); }
});

app.get('/api/projects/:id', protect, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, $or: [{ owner: req.user.id }, { crew: req.user.id }] })
        .populate('owner', 'name avatar')
        .populate('crew', 'name role title avatar')
        .populate('applicants', 'name role title avatar');
        
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch project' }); }
});

app.post('/api/projects/:id/tasks', protect, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, $or: [{ owner: req.user.id }, { crew: req.user.id }] });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        project.tasks.push({ title: req.body.title });
        await project.save();
        res.json(project);
    } catch (error) { res.status(500).json({ error: 'Failed to add task' }); }
});

app.post('/api/projects/:id/approve', protect, async (req, res) => {
    try {
        const { applicantId } = req.body;
        const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        project.applicants = project.applicants.filter(id => id.toString() !== applicantId);
        if (!project.crew.includes(applicantId)) project.crew.push(applicantId);
        await project.save();
        res.json({ message: 'Applicant approved and added to crew!' });
    } catch (error) { res.status(500).json({ error: 'Failed to approve applicant' }); }
});

app.post('/api/projects/:id/reject', protect, async (req, res) => {
    try {
        const { applicantId } = req.body;
        const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        project.applicants = project.applicants.filter(id => id.toString() !== applicantId);
        await project.save();
        res.json({ message: 'Applicant rejected.' });
    } catch (error) { res.status(500).json({ error: 'Failed to reject applicant' }); }
});

app.put('/api/projects/:id/tasks/:taskId', protect, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, $or: [{ owner: req.user.id }, { crew: req.user.id }] });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        const task = project.tasks.id(req.params.taskId);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        task.isCompleted = !task.isCompleted;
        const completedCount = project.tasks.filter(t => t.isCompleted).length;
        const progress = Math.round((completedCount / project.tasks.length) * 100);
        project.status = progress === 100 ? 'success' : progress > 50 ? 'neutral' : 'warning';
        await project.save();
        res.json(project);
    } catch (error) { res.status(500).json({ error: 'Failed to update task' }); }
});

app.delete('/api/projects/:id/tasks/:taskId', protect, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, $or: [{ owner: req.user.id }, { crew: req.user.id }] });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        project.tasks = project.tasks.filter(task => task._id.toString() !== req.params.taskId);
        if (project.tasks.length === 0) { project.status = 'neutral'; } 
        else {
            const completedCount = project.tasks.filter(t => t.isCompleted).length;
            project.status = Math.round((completedCount / project.tasks.length) * 100) === 100 ? 'success' : 'neutral';
        }
        await project.save();
        res.json(project);
    } catch (error) { res.status(500).json({ error: 'Failed to delete task' }); }
});

app.delete('/api/projects/:id', protect, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) { res.status(500).json({ error: 'Failed to delete project' }); }
});

// --- TALENT & JOBS ---
app.get('/api/freelancers', async (req, res) => {
  try {
    const freelancers = await User.find({ role: 'freelancer' }).select('-password');
    res.json(freelancers);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch talent' }); }
});

app.get('/api/jobs', protect, async (req, res) => {
    try {
        const jobs = await Project.find({ isPublic: true }).populate('owner', 'name avatar').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch jobs' }); }
});

app.post('/api/projects/:id/apply', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        if (project.applicants.includes(req.user.id)) return res.status(400).json({ error: 'You have already applied to this project' });
        if (project.crew.includes(req.user.id)) return res.status(400).json({ error: 'You are already on the crew' });
        project.applicants.push(req.user.id);
        await project.save();
        res.json({ message: 'Application submitted successfully!' });
    } catch (error) { res.status(500).json({ error: 'Failed to submit application' }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`🚀 Server running on http://localhost:${PORT}`); });