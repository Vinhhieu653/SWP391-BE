import VaccineHistory from '../../models/data/vaccine_history.model.js'
import MedicalRecord from '../../models/data/medicalRecord.model.js'
import User from '../../models/data/user.model.js'
import Evidence from '../../models/data/evidence.model.js'
import cloudinary from '../../utils/cloudinary.js'
import Guardian from '../../models/data/guardian.model.js'
import GuardianUser from '../../models/data/guardian_user.model.js'
import Notification from '../../models/data/noti.model.js'
import Event from '../../models/data/event.model.js'
import UserEvent from '../../models/data/user_event.model.js'

export const createVaccineHistoryService = async (data) => {
  const event = await Event.create({
    dateEvent: data.Date_injection || new Date(),
    type: 'vaccine'
  })

  let mrIds = data.MR_ID

  if (!mrIds) {
    const medicalRecords = await MedicalRecord.findAll({ attributes: ['ID'] })
    mrIds = medicalRecords.map((record) => record.ID)
  } else {
    mrIds = Array.isArray(mrIds) ? mrIds : [mrIds]
  }

  const vaccineHistories = []

  for (const mrId of mrIds) {
    const vaccineHistory = await VaccineHistory.create({
      ...data,
      MR_ID: mrId,
      Event_ID: event.eventId
    })
    vaccineHistories.push(vaccineHistory)

    const medicalRecord = await MedicalRecord.findByPk(mrId)
    if (medicalRecord) {
      const guardianUsers = await GuardianUser.findAll({
        where: { userId: medicalRecord.userId }
      })
      const userEvent = await UserEvent.create({
        eventId: event.eventId,
        userId: medicalRecord.userId
      })
      await Promise.all(
        guardianUsers.map(async (guardianUser) => {
          const guardian = await Guardian.findByPk(guardianUser.obId)
          if (guardian) {
            await Notification.create({
              title: 'Con bạn có lịch tiêm chủng mới',
              mess: `Bấm vao để xem chi tiết lịch tiêm chủng cho con bạn`,
              userId: guardian.userId
            })
          }
        })
      )
    }
  }

  return {
    event,
    vaccineHistories
  }
}

export const createVaccineHistoryWithEvidenceService = async (data, imageFile) => {

    const event = await Event.create({
    dateEvent: data.Date_injection || new Date(),
    type: 'vaccine'
  })
  const mrId = data.MR_ID;

  if (!mrId) {
    throw { status: 400, message: 'MR_ID is required' }
  }

  const vaccineHistory = await VaccineHistory.create({
    ...data,
    MR_ID: mrId,
    Date_injection: data.Date_injection || new Date(),
     Event_ID: event.eventId,
    Status: 'Đã tiêm'
  });

  if (imageFile) {
    const result = await cloudinary.uploader.upload(imageFile.path);
    await Evidence.create({
      VH_ID: vaccineHistory.VH_ID,
      Image: result.secure_url
    });
  }

  const completeRecord = await VaccineHistory.findByPk(vaccineHistory.VH_ID);
  const evidence = await Evidence.findOne({
    where: { VH_ID: vaccineHistory.VH_ID }
  });

  return [{
    ...completeRecord.dataValues,
    evidence: evidence || null
  }];
}

export const getAllVaccineHistoryService = async () => {
  const records = await VaccineHistory.findAll({
    order: [['Date_injection', 'DESC']]
  })

  const result = await Promise.all(
    records.map(async (record) => {
      const medicalRecord = await MedicalRecord.findByPk(record.MR_ID)
      if (medicalRecord) {
        record.dataValues.MedicalRecord = medicalRecord
        const user = await User.findByPk(medicalRecord.userId, {
          attributes: ['fullname']
        })
        record.dataValues.PatientName = user ? user.fullname : null
      }
      return record
    })
  )

  return result
}

export const getVaccineHistoryByIdService = async (id) => {
  const record = await VaccineHistory.findByPk(id)
  if (!record) {
    throw { status: 404, message: 'Vaccine history record not found' }
  }

  const medicalRecord = await MedicalRecord.findByPk(record.MR_ID)
  if (medicalRecord) {
    record.dataValues.MedicalRecord = medicalRecord
    const user = await User.findByPk(medicalRecord.userId, {
      attributes: ['fullname']
    })
    record.dataValues.PatientName = user ? user.fullname : null
  }

  return record
}

export const getVaccineHistoryByMRIdService = async (MR_ID) => {
  const records = await VaccineHistory.findAll({
    where: { MR_ID },
    order: [['Date_injection', 'DESC']]
  })

  const medicalRecord = await MedicalRecord.findByPk(MR_ID)
  const user = medicalRecord
    ? await User.findByPk(medicalRecord.userId, {
        attributes: ['fullname']
      })
    : null

  return {
    patientName: user ? user.fullname : null,
    medicalRecord,
    vaccineHistory: records
  }
}

export const updateVaccineHistoryService = async (id, updateData) => {
  const record = await VaccineHistory.findByPk(id)
  if (!record) {
    throw { status: 404, message: 'Vaccine history record not found' }
  }

  delete updateData.Event_ID
  delete updateData.MR_ID

  await record.update(updateData)
  return await getVaccineHistoryByIdService(id)
}

export const confirmVaccineHistoryService = async (id, isConfirmed) => {
  const record = await VaccineHistory.findByPk(id)
  if (!record) {
    throw { status: 404, message: 'Vaccine history record not found' }
  }

  const medicalRecord = await MedicalRecord.findByPk(record.MR_ID)
  if (!medicalRecord) {
    throw { status: 404, message: 'Medical record not found' }
  }

  let statusUpdate = {}
  if (isConfirmed === true || isConfirmed === 'true') {
    statusUpdate.Status = 'Cho phép tiêm'
  } else {
    statusUpdate.Status = 'Không cho phép tiêm'
  }

  await record.update(statusUpdate)

  if (isConfirmed === true || isConfirmed === 'true') {
    await UserEvent.create({
      eventId: record.Event_ID,
      userId: medicalRecord.userId
    })
  }

  return await getVaccineHistoryByIdService(id)
}

export const deleteVaccineHistoryService = async (id) => {
  const record = await VaccineHistory.findByPk(id)
  if (!record) {
    throw { status: 404, message: 'Vaccine history record not found' }
  }

  await record.destroy()
  return { message: 'Vaccine history record deleted successfully' }
}

export const getStudentsByEventIdService = async (eventId) => {
  const vaccineHistories = await VaccineHistory.findAll({
    where: { Event_ID: eventId }
  })

  const result = await Promise.all(
    vaccineHistories.map(async (history) => {
      const medicalRecord = await MedicalRecord.findByPk(history.MR_ID)
      if (!medicalRecord) return null

      const student = await User.findByPk(medicalRecord.userId, {
        attributes: ['id', 'fullname']
      })

      if (!student) return null

      return {
        studentId: student.id,
        fullname: student.fullname,
        class: medicalRecord.class,
        vaccineHistory: {
          id: history.VH_ID,
          vaccine_name: history.Vaccine_name,
          vaccine_type: history.Vaccince_type,
          date_injection: history.Date_injection
        }
      }
    })
  )
  const filteredResult = result.filter((item) => item !== null)

  return {
    eventId,
    totalStudents: filteredResult.length,
    students: filteredResult
  }
}

export const updateVaccineStatusByMRIdService = async (updates) => {
  if (!Array.isArray(updates) || updates.length === 0) {
    throw { status: 400, message: 'Input must be a non-empty array of update objects' }
  }

  const vhIdList = updates.map(item => item.VH_ID);

 
  const records = await VaccineHistory.findAll({ where: { VH_ID: vhIdList } });
  if (records.length !== vhIdList.length) {
    throw { status: 404, message: 'Some VH_IDs do not exist in vaccine history' }
  }

  const notAllowed = records.filter(r => r.Status !== 'Cho phép tiêm');
  if (notAllowed.length > 0) {
    throw { status: 400, message: 'Chỉ được phép cập nhật khi tất cả trạng thái là "Cho phép tiêm"' }
  }


  await Promise.all(
    updates.map((item) =>
      VaccineHistory.update(
        {
          Status: item.status,
          note_affter_injection: item.note_affter_injection
        },
        { where: { VH_ID: item.VH_ID } }
      )
    )
  )

  return await VaccineHistory.findAll({ where: { VH_ID: vhIdList } })
}

export const getAllVaccineTypesService = async () => {
  const types = await VaccineHistory.findAll({
    attributes: [
      [VaccineHistory.sequelize.fn('DISTINCT', VaccineHistory.sequelize.col('Vaccine_name')), 'Vaccine_name']
    ],
    raw: true
  })
  return types.map((item) => item.Vaccine_name).filter((type) => !!type)
}

export const getVaccineHistoryByVaccineNameService = async (vaccineName) => {
  const records = await VaccineHistory.findAll({
    where: { Vaccine_name: vaccineName },
    order: [['Date_injection', 'DESC']]
  })

  const result = await Promise.all(
    records.map(async (record) => {
      const medicalRecord = await MedicalRecord.findByPk(record.MR_ID)
      if (medicalRecord) {
        record.dataValues.MedicalRecord = medicalRecord
        const user = await User.findByPk(medicalRecord.userId, {
          attributes: ['fullname']
        })
        record.dataValues.PatientName = user ? user.fullname : null
      }
      return record
    })
  )

  return result
}

export const getVaccineHistoryByGuardianUserIdService = async (guardianUserId) => {
  const guardian = await Guardian.findOne({ where: { userId: guardianUserId } })
  if (!guardian) {
    return {
      totalVaccine: 0,
      totalNeedConfirm: 0,
      histories: []
    }
  }

  const guardianUsers = await GuardianUser.findAll({
    where: { obId: guardian.obId }
  })

  if (!guardianUsers.length) {
    return {
      totalVaccine: 0,
      totalNeedConfirm: 0,
      histories: []
    }
  }

  const obIds = guardianUsers.map((gu) => gu.userId)

  const medicalRecords = await MedicalRecord.findAll({
    where: { userId: obIds }
  })

  let totalVaccine = 0
  let totalNeedConfirm = 0

  const allHistories = await Promise.all(
    medicalRecords.map(async (mr) => {
      const user = await User.findByPk(mr.userId, { attributes: ['id', 'fullname'] })
      const vaccineHistory = await VaccineHistory.findAll({
        where: { MR_ID: mr.ID },
        order: [['Date_injection', 'DESC']]
      })
      totalVaccine += vaccineHistory.filter((vh) => vh.Status === 'Đã tiêm').length
      totalNeedConfirm += vaccineHistory.filter((vh) => vh.Status === 'Chờ xác nhận').length
      return {
        totalVaccine,
        totalNeedConfirm,
        medicalRecord: mr,
        user: user ? { id: user.id, fullname: user.fullname } : null,
        vaccineHistory
      }
    })
  )

  return {
    histories: allHistories
  }
}
