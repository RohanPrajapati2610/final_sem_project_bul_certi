const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  signatoryName: {
    type: String,
    required: true
  },
  signatoryDesignation: {
    type: String
  },
  certificateType: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  shouldSendMail: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema); 