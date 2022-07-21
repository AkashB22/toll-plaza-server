const mongoose = require('mongoose');
const { Schema } = mongoose;
const receiptsSchema = new mongoose.Schema({
  'vehicleId': {
    'type': Schema.Types.ObjectId,
    'ref': 'vehicle'
  },
  'amount': {
    'type': Number,
    'required': true,
    'enum': [
      100,
      200
    ]
  },
  'type': {
    'type': String,
    'default': 'one way',
    'enum': [
      'one way',
      'two way'
    ]
  },
  status: {
    'type': String,
    'default': 'no return',
    'enum': [
      'no return',
      'has return',
      'used return'
    ]
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

module.exports = mongoose.model('receipt', receiptsSchema);