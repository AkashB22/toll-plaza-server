const mongoose = require('mongoose');
const receiptsModel = require('../models/receipts.model');
const vehiclesModel = require('../models/vehicles.model');
class ReceiptsDao {
  async insert(data) {
    try {
      const vehicle = { vehicleNo: data.vehicleNo };
      let vehicleDoc = await vehiclesModel.findOne(vehicle);
      if (!vehicleDoc) {
        const vehicleData = new vehiclesModel(vehicle);
        vehicleDoc = await vehicleData.save();
      }
      const receipt = {
        vehicleId: vehicleDoc._id,
        amount: data.amount,
      };
      if (data.amount === 200) {
        receipt.type = 'two way';
        receipt.status = 'has return';
      }
      const result = await (new receiptsModel(receipt)).save();
      return result;
    } catch (error) {
      if (error.name === 'CastError' || error.name === 'ValidationError') return { error: error.message };
      throw error;
    }
  }
  async get(query = {}, options = null) {
    try {
      let result = {};
      if (query._id && typeof (query._id) === 'string') {
        query._id = mongoose.Types.ObjectId(query._id);
      }
      if (options && options.pageNo && options.perPageRecords) {
        const skip = (options.pageNo - 1) * options.perPageRecords;
        const limit = options.perPageRecords;
        const receipts = await receiptsModel.find(query).sort({ createdAt: -1 }).populate('vehicleId')
          .skip(skip)
          .limit(limit);
        const count = await receiptsModel.count({});
        result.totalCount = count;
        result.receipts = receipts;
      } else if (options.getOne) {
        result = await receiptsModel.findOne(query).populate('vehicleId');
      } else {
        result = await receiptsModel.find(query).populate('vehicleId');
      }
      return result;
    } catch (error) {
      if (error.name === 'CastError' || error.name === 'ValidationError') return { error: error.message };
      throw error;
    }
  }
  async update(query, data) {
    try {
      const result = await receiptsModel.findOneAndUpdate(query, data, { new: true });
      return result;
    } catch (error) {
      if (error.name === 'CastError' || error.name === 'ValidationError') return { error: error.message };
      throw error;
    }
  }
  async delete(query) {
    try {
      const result = await receiptsModel.findOneAndDelete(query);
      return result;
    } catch (error) {
      if (error.name === 'CastError' || error.name === 'ValidationError') return { error: error.message };
      throw error;
    }
  }
}

module.exports = ReceiptsDao;