import mongoose from 'mongoose';

/**
 * Question schema maps one Airtable field -> one question
 * limited to supported types and custom label
 */
const questionSchema = new mongoose.Schema({
  airtableFieldId: { type: String, required: true },
  airtableFieldName: { type: String, required: true },
  airtableFieldType: { type: String, required: true }, // text, longText, singleSelect, multiSelect, attachment
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
}, { _id: false });

/**
 * Conditional rules: show question if ALL rules match (AND)
 * each rule compares a prior question's answer
 */
const ruleSchema = new mongoose.Schema({
  targetQuestionIndex: { type: Number, required: true }, // this question is shown if rules evaluate true
  rules: [{
    questionIndex: Number,
    operator: { type: String, enum: ['eq','neq','in','nin','contains'] },
    value: mongoose.Schema.Types.Mixed
  }]
}, { _id: false });

const formSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  title: { type: String, required: true },
  airtable: {
    baseId: { type: String, required: true },
    tableId: { type: String, required: true }
  },

  questions: [questionSchema],
  conditionalLogic: [ruleSchema],

  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Form', formSchema);
