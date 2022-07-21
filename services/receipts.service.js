const receiptsDao = new (require('../daos/receipts.dao'))();
class ReceiptsService {
  async insert(data) {
    try {
      const result = await receiptsDao.insert(data);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async get(query, options = {}) {
    try {
      let result = null;
      result = await receiptsDao.get(query, options);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async update(query, data) {
    try {
      const result = await receiptsDao.update(query, data);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReceiptsService;