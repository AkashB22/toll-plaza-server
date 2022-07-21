const express = require('express');
const router = express.Router();
const servicesController = new (require('../controllers/services.controller'))();
/**
 * @swagger
 * paths:
 *   /services/health:
 *     get:
 *       summary: Check the service health
 *       description: Check the service health
 *       tags:
 *         - Services
 *       responses:
 *         '200':
 *            description: Successful operation
 */
router.get('/health', servicesController.health);

module.exports = router;