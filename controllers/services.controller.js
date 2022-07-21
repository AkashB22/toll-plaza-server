class Services {
  async health(req, res, next) {
    try {
      const output = {
        'service': true
      };
      logger.info({ status: 200, data: output });
      return res.status(200).json(output);
    } catch (error) {
      logger.error({ status: 500, error: error });
      return res.status(500).json({ 'error': 'Internal Server Error', 'message': error.message });
    }
  }
}
module.exports = Services;