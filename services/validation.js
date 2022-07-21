class Validation {
  async check(schema, data) {
    try {
      await schema.validateAsync(data);
      return false;
    } catch (error) {
      return error.details;
    }
  }
}

module.exports = Validation;