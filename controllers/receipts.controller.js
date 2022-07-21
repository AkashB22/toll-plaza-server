const Joi = require('joi');
const lodash = require('lodash');
const receiptsService = new (require('../services/receipts.service'))();
const validation = new (require('../services/validation'))();
const logger = require('../services/logger.service').getLogger();
class ReceiptsController {
  async add(req, res, next) {
    try {
      const body = req.body;
      const receiptSchema = Joi.object({
        'vehicleNo': Joi.string().required(),
        'amount': Joi.number().required()
      });
      const error = await validation.check(receiptSchema, body);
      if (lodash.isBoolean(error) && !error) {
        const result = await receiptsService.insert(body);
        if (result.error) {
          logger.info({ status: 400, data: JSON.stringify(result) });
          return res.status(400).json(result);
        } else {
          const output = result.toJSON();
          output.message = 'receipt added successfully'
          logger.info({ status: 200, data: output });
          return res.status(200).json(output);
        }
      } else {
        logger.info({ status: 400, data: error });
        return res.status(400).json(error);
      }
    } catch (error) {
      const data = { 'error': 'Internal Server Error', 'message': error.message }
      logger.error({ status: 500, error: data });
      return res.status(500).json(data);
    }
  }
  async get(req, res, next) {
    try {
      const pageNo = parseInt(req.query.pageNo) || 1;
      const perPageRecords = parseInt(req.query.perPageRecords) || 10;
      const receiptsDoc = await receiptsService.get({},
        {
          pageNo,
          perPageRecords
        });
      if (receiptsDoc && receiptsDoc.receipts && lodash.isArray(receiptsDoc.receipts) && receiptsDoc.receipts.length > 0) {
        logger.info({ status: 200, data: receiptsDoc });
        return res.status(200).json(receiptsDoc);
      } else {
        const data = {
          'message': 'no receipt data found'
        };
        logger.info({ status: 200, data });
        return res.status(200).json(data);
      }
    } catch (error) {
      const data = { 'error': 'Internal Server Error', 'message': error.message }
      logger.error({ status: 500, error: data });
      return res.status(500).json(data);
    }
  }
  isDateValid(date) {
    const currentDate = new Date();
    return (
      currentDate.getDate() === date.getDate() &&
      currentDate.getMonth() === date.getMonth() &&
      currentDate.getYear() === date.getYear()
    );
  }
  async validate(req, res, next) {
    try {
      const params = req.params;
      const receiptSchema = Joi.object({
        'receiptId': Joi.string().required(),
      });
      const error = await validation.check(receiptSchema, params);
      if (lodash.isBoolean(error) && !error) {
        const receiptDoc = await receiptsService.get({ _id: params.receiptId },
          {
            getOne: true
          }
        );
        if (receiptDoc && receiptDoc.type === 'two way' && receiptDoc.status === 'has return' && this.isDateValid(receiptDoc.createdAt)) {
          const updatedReceiptDoc = await receiptsService.update({
            _id: params.receiptId
          }, {
            status: 'used return',
          });
          const output = updatedReceiptDoc.toJSON();
          output.message = 'receipt validated successfully for return';
          logger.info({ status: 200, data: output });
          return res.status(200).json(output);
        } else if (receiptDoc && receiptDoc.type === 'one way') {
          const data = {
            'message': 'one way receipt data found'
          };
          logger.info({ status: 400, data: data });
          return res.status(400).json(data);
        } else if (receiptDoc && receiptDoc.status === 'used return') {
          const data = {
            'message': 'two way receipt has been already used'
          };
          logger.info({ status: 400, data: data });
          return res.status(400).json(data);
        } else if (receiptDoc && receiptDoc.status === 'has return' && !this.isDateValid(receiptDoc.createdAt)) {
          const data = {
            'message': 'two way receipt time has been expired'
          };
          logger.info({ status: 400, data: data });
          return res.status(400).json(data);
        } else {
          const data = {
            'message': 'no receipt data found'
          };
          logger.info({ status: 400, data: data });
          return res.status(400).json(data);
        }
      } else {
        logger.info({ status: 400, data: error });
        return res.status(400).json(error);
      }
    } catch (error) {
      const data = { 'error': 'Internal Server Error', 'message': error.message }
      logger.error({ status: 500, error: data });
      return res.status(500).json(data);
    }
  }
}
module.exports = ReceiptsController;