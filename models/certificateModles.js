const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  certificateNumber: {
    type: String,
    unique: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  isEmailSent: {
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

// Generate a unique certificate number before saving
certificateSchema.pre('save', function(next) {
  if (!this.certificateNumber) {
    // Format: CERT-YYYY-MM-RANDOMDIGITS
    const dateStr = new Date().toISOString().slice(0, 7).replace(/-/g, '');
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    this.certificateNumber = `CERT-${dateStr}-${randomDigits}`;
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema); 