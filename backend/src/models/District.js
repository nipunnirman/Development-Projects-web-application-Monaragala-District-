import mongoose from 'mongoose';

const districtSchema = new mongoose.Schema({
  name: { type: String, required: true },        // English name
  nameSi: { type: String, required: true },      // Sinhala name
  province: { type: String, required: true },
}, { timestamps: true });

const District = mongoose.model('District', districtSchema);
export default District;
