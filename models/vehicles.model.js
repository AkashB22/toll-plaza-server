const mongoose = require('mongoose');
const vehiclesSchema = new mongoose.Schema({
  'vehicleNo': {
    'type': String,
    'unique': true,
    'required': true
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v
      return ret;
    }
  },
  timestamps: true
});

module.exports = mongoose.model('vehicle', vehiclesSchema);