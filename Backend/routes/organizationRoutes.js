// routes/organizationRoutes.js
const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');

router.post('/', organizationController.createOrganization);
router.get('/', organizationController.getOrganizations); // Add this line back
router.get('/:id', organizationController.getOrganization);

module.exports = router;