import mongoose from 'mongoose';

const gnDivisionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameSi: { type: String, required: true },
  dsDivisionId: { type: mongoose.Schema.Types.ObjectId, ref: 'DsDivision', required: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
}, { timestamps: true });

const GnDivision = mongoose.model('GnDivision', gnDivisionSchema);
export default GnDivision;
