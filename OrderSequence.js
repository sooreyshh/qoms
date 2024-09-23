const mongoose = require('mongoose');
const orderSequenceSchema = new mongoose.Schema({
  sequenceValue: { type: Number, default: 0 },
});

const OrderSequence = mongoose.model('OrderSequence', orderSequenceSchema);
module.exports = OrderSequence;
