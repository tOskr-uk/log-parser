const express = require('express');
const encounterController = require('../controllers/encounterController')

const router = express.Router();

router
    .route('/')
    .get(encounterController.getAllEncounters)

router
    .route('/:id')
    .get(encounterController.getEncounter)
    .delete(encounterController.deleteEncounter)


// EXPORTS
module.exports = router;