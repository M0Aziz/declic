const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
  content: String,
  date: Date,
  visibility: { type: Boolean, default: true } 

});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
