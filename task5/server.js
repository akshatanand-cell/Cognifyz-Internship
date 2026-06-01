const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// In-memory database
let students = [
    { id: 1, name: 'Akshat Anand', email: 'akshat@gmail.com', 
      course: 'Computer Science', grade: 'A', age: 20 },
    { id: 2, name: 'Priya Sharma', email: 'priya@gmail.com', 
      course: 'Data Science', grade: 'B', age: 22 },
    { id: 3, name: 'Rahul Mehta', email: 'rahul@gmail.com', 
      course: 'AI & ML', grade: 'A', age: 21 },
];

let nextId = 4;

// ===== SERVE FRONTEND =====
app.get('/', (req, res) => {
    res.render('index');
});

// ===== REST API ENDPOINTS =====

// GET all students
app.get('/api/students', (req, res) => {
    const { search, course, grade } = req.query;
    let result = [...students];

    if (search) {
        result = result.filter(s => 
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase())
        );
    }
    if (course) {
        result = result.filter(s => s.course === course);
    }
    if (grade) {
        result = result.filter(s => s.grade === grade);
    }

    res.json({ 
        success: true, 
        count: result.length,
        students: result 
    });
});

// GET single student
app.get('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, student });
});

// POST create student
app.post('/api/students', (req, res) => {
    const { name, email, course, grade, age } = req.body;

    if (!name || !email || !course || !grade || !age) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required' 
        });
    }

    const student = { 
        id: nextId++, 
        name, email, course, grade, 
        age: parseInt(age) 
    };
    students.push(student);

    res.status(201).json({ success: true, student });
});

// PUT update student
app.put('/api/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }

    students[index] = { 
        ...students[index], 
        ...req.body, 
        id: students[index].id 
    };

    res.json({ success: true, student: students[index] });
});

// DELETE student
app.delete('/api/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }

    students.splice(index, 1);
    res.json({ success: true, message: 'Student deleted' });
});

// GET statistics
app.get('/api/stats', (req, res) => {
    const total = students.length;
    const gradeA = students.filter(s => s.grade === 'A').length;
    const gradeB = students.filter(s => s.grade === 'B').length;
    const gradeC = students.filter(s => s.grade === 'C').length;
    const avgAge = total > 0 ? 
        Math.round(students.reduce((sum, s) => sum + s.age, 0) / total) : 0;
    const courses = [...new Set(students.map(s => s.course))].length;

    res.json({ success: true, stats: { 
        total, gradeA, gradeB, gradeC, avgAge, courses 
    }});
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});