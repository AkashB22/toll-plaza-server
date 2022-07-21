const express = require('express');
const router = express.Router();
const receiptsController = new (require('../controllers/receipts.controller'))();
/**
 * @swagger
 * paths:
 *   /receipts:
 *     post:
 *       summary: Add a new receipt for a vehicle
 *       description: Add a new receipt for a vehicle
 *       tags:
 *         - Receipt
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicleNo:
 *                   type: string
 *                 amount:
 *                   type: number
 *               example:
 *                 vehicleNo: TN01hd8931
 *                 amount: 100
 *       responses:
 *         '200':
 *            description: Successful operation
 */
router.post('/', receiptsController.add);
/**
 * @swagger
 * paths:
 *   /receipts:
 *     get:
 *       summary: get all receipts
 *       description: get all receipts
 *       tags:
 *         - Receipts
 *       parameters:
 *         - name: pageNo
 *           in: query
 *           description: Please provide your pageNo
 *           schema:
 *             type:
 *               string
 *           example: 1
 *         - name: perPageRecords
 *           in: query
 *           description: Please provide your perPageRecords
 *           schema:
 *             type:
 *               string
 *           example: 10
 *       responses:
 *         '200':
 *            description: Successful operation
 */
router.get('/', receiptsController.get);
/**
 * @swagger
 * paths:
 *   /receipts/{receiptId}/validate:
 *     get:
 *       summary: validate a return receipt
 *       description: validate a return receipt
 *       tags:
 *         - Receipts
 *       parameters:
 *         - in: path
 *           name: receiptId
 *           schema:
 *             type: string
 *           required: true
 *           example: 622b34f31f1e61902c584b58
 *       responses:
 *         '200':
 *            description: Successful operation
 */
 router.get('/:receiptId/validate', receiptsController.validate.bind(receiptsController));

module.exports = router;