const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { Surprise } = require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use API routes
app.use('/api', apiRoutes);

// Landing page for generator
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'generator.html'));
});

// View generated surprise
app.get('/surprise/:id', async (req, res) => {
    try {
        const surprise = await Surprise.findByPk(req.params.id);
        if (!surprise) {
            return res.status(404).send('Surprise not found');
        }
        res.render('surprise', { surprise });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
