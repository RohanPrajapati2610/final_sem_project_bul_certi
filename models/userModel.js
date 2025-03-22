const mongoose = require('mongoose');

const  OrganizationSchema= new mongoose.Schema({
  organisationName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  
  address: {
    type: String,
    required: true,
    unique: true
  },
  adminName: {
    type: String,
    required: true,
    unique: true
  },
  adminEmail: {
    type: String,
    required: true,
    unique: true
   
  },
  adminPassword: {
    type: String,
    required: true,
    unique: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('user', OrganizationSchema); 