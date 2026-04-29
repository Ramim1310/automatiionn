const mongoose = require('mongoose');

const academicRecordSchema = new mongoose.Schema(
  {
    result: { type: String, default: null },
    year: { type: Number, default: null },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    academic: {
      ssc: { type: academicRecordSchema, default: {} },
      hsc: { type: academicRecordSchema, default: {} },
      bsc: { type: academicRecordSchema, default: {} },
    },
    passport: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      default: null,
    },
    subject: {
      type: String,
      default: null,
    },
    birth_year: {
      type: Number,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
