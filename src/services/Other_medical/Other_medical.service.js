import OtherMedical from "../../models/data/other_medical.model.js";
import HistoryOtherMedical from "../../models/data/history_other_medical.model.js"; 
import MedicalRecord from "../../models/data/medicalRecord.model.js";
import User from "../../models/data/user.model.js"; 

export const createOtherMedicalService = async (data, creator_by) => {

  if (!data.MR_ID) {
    throw { status: 400, message: "MR_ID is required" };
  }
  const otherMedical = await OtherMedical.create(data);

  await HistoryOtherMedical.create({
    OrtherM_ID: otherMedical.OrtherM_ID, 
    MR_ID: data.MR_ID,
    Date_create: new Date(),
    creater_by: creator_by || "system" 
  });

  return otherMedical;
};


export const getAllOtherMedicalService = async () => {
  const otherMedicalRecords = await OtherMedical.findAll();
  const result = await Promise.all(otherMedicalRecords.map(async (record) => {
    const history = await HistoryOtherMedical.findAll({ where: { OrtherM_ID: record.OrtherM_ID } });
    let MR_ID = null;
    if (history.length > 0) {
      record.dataValues.history = history;
      MR_ID = history[0].MR_ID;
    } else {
      record.dataValues.history = [];
    }
    const medicalRecord = MR_ID
      ? await MedicalRecord.findOne({ where: { ID: MR_ID } })
      : null;
    if (medicalRecord) {
      record.dataValues.Medical_record = medicalRecord;
      const user = medicalRecord.userId
        ? await User.findOne({ where: { id: medicalRecord.userId }, attributes: ['fullname'] })
        : null;
      record.dataValues.UserFullname = user ? user.fullname : null;
    } else {
      record.dataValues.Medical_record = null;
      record.dataValues.UserFullname = null;
    }
    return record;
  }));
  return result;
};

 
export const getOtherMedicalByIdService = async (id) => {
  const otherMedical = await OtherMedical.findByPk(id);
  if (!otherMedical) throw { status: 404, message: "Other medical record not found" };

  const history = await HistoryOtherMedical.findAll({ where: { OrtherM_ID: id } });
  let MR_ID = null;
  if (history.length > 0) {
    otherMedical.dataValues.history = history;
    MR_ID = history[0].MR_ID; 
  } else {
    otherMedical.dataValues.history = [];
  }
  const medicalRecord = MR_ID
    ? await MedicalRecord.findOne({ where: { ID: MR_ID } })
    : null;
  if (medicalRecord) {
    otherMedical.dataValues.Medical_record = medicalRecord;
    const user = medicalRecord.userId
      ? await User.findOne({ where: { id: medicalRecord.userId }, attributes: ['fullname'] })
      : null;
    otherMedical.dataValues.UserFullname = user ? user.fullname : null;
  } else {
    otherMedical.dataValues.Medical_record = null;
    otherMedical.dataValues.UserFullname = null;
  }
  return otherMedical;
};


export const updateOtherMedicalService = async (id, updateData) => {
  const otherMedical = await OtherMedical.findByPk(id);
  if (!otherMedical) throw { status: 404, message: "Other medical record not found" };
  await otherMedical.update(updateData);
  await HistoryOtherMedical.update(
    { Date_create: new Date() },
    { where: { OrtherM_ID: id } }
  );

  return otherMedical;
};

export const deleteOtherMedicalService = async (id) => {
  const otherMedical = await OtherMedical.findByPk(id);
  if (!otherMedical) throw { status: 404, message: "Other medical record not found" };

  await HistoryOtherMedical.destroy({ where: { OrtherM_ID: id } });

  await otherMedical.destroy();
};