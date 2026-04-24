import mongoose from 'mongoose';

const dsDivisionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameSi: { type: String, required: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
}, { timestamps: true });

const DsDivision = mongoose.model('DsDivision', dsDivisionSchema);
export default DsDivision;
