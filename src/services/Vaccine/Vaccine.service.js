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

      await Promise.all(
        guardianUsers.map(async (guardianUser) => {
          const guardian = await Guardian.findByPk(guardianUser.obId)
          if (guardian) {
            await Notification.create({
              title: 'New Vaccine Record',
              mess: `A new vaccine record has been created for your dependent`,
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
  let mrIds = data.MR_ID

  if (!mrIds) {
    const medicalRecords = await MedicalRecord.findAll({ attributes: ['ID'] })
    mrIds = medicalRecords.map((record) => record.ID)
  } else {
    mrIds = Array.isArray(mrIds) ? mrIds : [mrIds]
  }

  const results = []

  for (const mrId of mrIds) {
    const vaccineHistory = await VaccineHistory.create({
      ...data,
      MR_ID: mrId,
      Date_injection: data.Date_injection || new Date()
    })

    if (imageFile) {
      const result = await cloudinary.uploader.upload(imageFile.path)
      await Evidence.create({
        VH_ID: vaccineHistory.VH_ID,
        Image: result.secure_url
      })
    }

    const medicalRecord = await MedicalRecord.findByPk(mrId)
    if (medicalRecord) {
      const guardianUsers = await GuardianUser.findAll({
        where: { userId: medicalRecord.userId }
      })

      await Promise.all(
        guardianUsers.map(async (guardianUser) => {
          const guardian = await Guardian.findByPk(guardianUser.obId)
          if (guardian) {
            await Notification.create({
              title: 'New Vaccine Record with Evidence',
              mess: `A new vaccine record with evidence has been created for your dependent`,
              userId: guardian.userId
            })
          }
        })
      )
    }

    const completeRecord = await VaccineHistory.findByPk(vaccineHistory.VH_ID)
    const evidence = await Evidence.findOne({
      where: { VH_ID: vaccineHistory.VH_ID }
    })

    results.push({
      ...completeRecord.dataValues,
      evidence: evidence || null
    })
  }

  return results
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

export const confirmVaccineHistoryService = async (id) => {
  const record = await VaccineHistory.findByPk(id)
  if (!record) {
    throw { status: 404, message: 'Vaccine history record not found' }
  }

  const medicalRecord = await MedicalRecord.findByPk(record.MR_ID)
  if (!medicalRecord) {
    throw { status: 404, message: 'Medical record not found' }
  }

  await UserEvent.create({
    eventId: record.Event_ID,
    userId: medicalRecord.userId
  })

  await record.update({ Is_confirmed: true })
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
          date_injection: history.Date_injection,
          is_confirmed: history.Is_confirmed
        }
      }
    })
  )
  const filteredResult = result.filter((item) => item !== null)

  return {
    eventId,
    totalStudents: filteredResult.length,
    confirmedCount: filteredResult.filter((item) => item.vaccineHistory.is_confirmed).length,
    students: filteredResult
  }
}
