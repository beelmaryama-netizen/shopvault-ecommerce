const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');

// Créer une catégorie (protégé)
router.post('/', auth, categoryController.create);

// Voir toutes les catégories
router.get('/', categoryController.getAll);

// Modifier une catégorie
router.put('/:id', auth, categoryController.update);

// Supprimer une catégorie
router.delete('/:id', auth, categoryController.delete);

module.exports = router;