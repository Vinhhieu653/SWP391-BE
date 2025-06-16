import MedicalSent from '../../models/data/medical_sent.model.js';
import OutpatientMedication from '../../models/data/outpatient_medication.model.js';
import MedicalRecord from '../../models/data/medicalRecord.model.js';

// Tạo mới MedicalSent và liên kết OutpatientMedication
export const createMedicalSentService = async (data, creator_by = 'system') => {
  const {
    userId,
    guardianPhone,
    class: studentClass,
    prescriptionImage,
    medications,
    deliveryTime,
    status,
    notes
  } = data;

  if (!userId) throw { status: 400, message: 'userId is required' };

  // 1. Tìm MedicalRecord theo userId
  const medicalRecord = await MedicalRecord.findOne({ where: { userId: userId } });
  if (!medicalRecord) throw { status: 404, message: 'Medical record not found for this user' };

  const MR_ID = medicalRecord.MR_ID;

  // 2. Tìm hoặc tạo OutpatientMedication theo MR_ID
  let outpatient = await OutpatientMedication.findOne({ where: { MR_ID: MR_ID } });
  if (!outpatient) {
    outpatient = await OutpatientMedication.create({ MR_ID: MR_ID });
  }

  // 3. Tạo bản ghi MedicalSent
  const medicalSent = await MedicalSent.create({
  User_ID: userId,
  Guardian_phone: guardianPhone,
  Class: studentClass,
  Image_prescription: prescriptionImage,
  Medications: medications,
  Delivery_time: deliveryTime,
  Status: status,
  Notes: notes,
  Created_at: new Date()
});

  const { Form_ID, Outpatient_medication, OM_ID, ...cleaned } = medicalSent.get({ plain: true });
  return cleaned;
};

// Lấy toàn bộ MedicalSent
export const getAllMedicalSentService = async () => {
  const records = await MedicalSent.findAll({
    include: [
      {
        model: OutpatientMedication,
        include: [MedicalRecord],
      },
    ],
  });

  return records.map((record) => {
    const { Form_ID, Outpatient_medication, OM_ID, ...rest } = record.get({ plain: true });
    return rest;
  });
};

// Lấy 1 bản ghi MedicalSent theo ID
export const getMedicalSentByIdService = async (id) => {
  const record = await MedicalSent.findByPk(id, {
    include: [
      {
        model: OutpatientMedication,
        include: [MedicalRecord],
      },
    ],
  });

  if (!record) throw { status: 404, message: 'Medical sent record not found' };

const { Form_ID, Outpatient_medication, OM_ID, ...cleaned } = record.get({ plain: true });
  return cleaned;
};

// Cập nhật MedicalSent
export const updateMedicalSentService = async (id, updateData) => {
  const record = await MedicalSent.findByPk(id);
  if (!record) throw { status: 404, message: 'Medical sent record not found' };

  await record.update(updateData);
const { Form_ID, Outpatient_medication, OM_ID, ...cleaned } = record.get({ plain: true });
  return cleaned;
};

// Xóa MedicalSent
export const deleteMedicalSentService = async (id) => {
  const record = await MedicalSent.findByPk(id);
  if (!record) throw { status: 404, message: 'Medical sent record not found' };

  await record.destroy();
  return { message: 'Deleted successfully' };
};
