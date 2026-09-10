const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Surprise } = require('../models/database');

const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.fields([
    { name: 'soloPhotos', maxCount: 4 },
    { name: 'deckPhotos', maxCount: 85 }
]), async (req, res) => {
    try {
        const { recipientName, subtitle, countdownDate, traits, shayari } = req.body;
        
        const soloPhotoFiles = req.files['soloPhotos'] ? req.files['soloPhotos'].map(f => f.filename) : [];
        const deckPhotoFiles = req.files['deckPhotos'] ? req.files['deckPhotos'].map(f => f.filename) : [];
        
        let parsedTraits = [];
        try {
            parsedTraits = JSON.parse(traits);
        } catch (e) {
            if (typeof traits === 'string') {
                parsedTraits = traits.split(',').map(t => t.trim()).filter(t => t);
            } else {
                parsedTraits = traits;
            }
        }

        const newSurprise = await Surprise.create({
            id: uuidv4(),
            recipientName,
            subtitle,
            countdownDate: new Date(countdownDate),
            traits: parsedTraits,
            soloPhotos: soloPhotoFiles,
            deckPhotos: deckPhotoFiles,
            shayari: shayari || ''
        });

        res.json({ success: true, url: `/surprise/${newSurprise.id}` });
    } catch (error) {
        console.error('Error creating surprise:', error);
        res.status(500).json({ success: false, error: 'Failed to create surprise' });
    }
});

module.exports = router;
