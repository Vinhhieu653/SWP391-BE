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
import sequelize from 'sequelize'

export const createVaccineHistoryService = async (data) => {
  const event = await Event.create({
    dateEvent: data.Date_injection || new Date(),
    type: 'vaccine'
  })

  let mrIds = data.ID
  const classFilter = data.Grade
  const vaccineName = data.Vaccine_name

  if (!mrIds) {
    const medicalRecords = await MedicalRecord.findAll({ attributes: ['ID', 'Class'] })
    mrIds = medicalRecords
      .filter((record) => {
        if (!classFilter) return true
        const match = record.Class ? record.Class.match(/^(\d+)/) : null
        const grade = match ? match[1] : null
        return grade === classFilter
      })
      .map((record) => record.ID)
  } else {
    mrIds = Array.isArray(mrIds) ? mrIds : [mrIds]
  }

  const vaccineHistories = []

  for (const mrId of mrIds) {
    const medicalRecord = await MedicalRecord.findByPk(mrId)
    if (!medicalRecord) continue
    if (classFilter) {
      const match = medicalRecord.Class ? medicalRecord.Class.match(/^(\d+)/) : null
      const grade = match ? match[1] : null
      if (grade !== classFilter) continue
    }
    const existed = await VaccineHistory.findOne({
      where: {
        ID: mrId,
        [sequelize.Op.and]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('Vaccine_name')), sequelize.fn('LOWER', vaccineName))
        ],
        Is_deleted: false
      }
    })
    if (existed && existed.Status !== 'Không tiêm') continue

    const vaccineHistory = await VaccineHistory.create({
      ...data,
      ID: mrId,
      Event_ID: event.eventId
    })
    vaccineHistories.push(vaccineHistory)

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
          const son = await User.findByPk(medicalRecord.userId, {
            attributes: ['fullname']
          })
          await Notification.create({
            title: 'Con bạn có lịch tiêm chủng mới',
            mess: `Bấm vào để xem lịch tiêm chủng và xác nhận cho cháu ${son ? son.fullname : 'Không rõ tên'}`,
            userId: guardian.userId
          })
        }
      })
    )
  }

  if (vaccineHistories.length === 0) {
    await event.destroy()
    throw { status: 400, message: 'Không có học sinh nào hợp lệ để tạo đợt tiêm chủng.' }
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
  const mrId = data.ID

  if (!mrId) {
    throw { status: 400, message: 'ID is required' }
  }

  const vaccineHistory = await VaccineHistory.create({
    ...data,
    ID: mrId,
    Date_injection: data.Date_injection || new Date(),
    Event_ID: event.eventId,
    Status: 'Đã tiêm',
    Is_created_by_guardian: true
  })

  if (imageFile) {
    const result = await cloudinary.uploader.upload(imageFile.path)
    await Evidence.create({
      VH_ID: vaccineHistory.VH_ID,
      Image: result.secure_url
    })
  }

  const completeRecord = await VaccineHistory.findByPk(vaccineHistory.VH_ID)
  const evidence = await Evidence.findOne({
    where: { VH_ID: vaccineHistory.VH_ID }
  })

  return [
    {
      ...completeRecord.dataValues,
      evidence: evidence || null
    }
  ]
}

export const getAllVaccineHistoryService = async () => {
  const records = await VaccineHistory.findAll({
    where: { Is_deleted: false },
    order: [['Date_injection', 'DESC']]
  })

  const result = await Promise.all(
    records.map(async (record) => {
      const medicalRecord = await MedicalRecord.findByPk(record.ID)
      let grade = null
      if (medicalRecord) {
        record.dataValues.MedicalRecord = medicalRecord
        const user = await User.findByPk(medicalRecord.userId, {
          attributes: ['fullname', 'dateOfBirth']
        })
        record.dataValues.PatientName = user ? user.fullname : null
        if (medicalRecord.Class) {
          const match = medicalRecord.Class.charAt(0)
          grade = match ? parseInt(match, 10) : null
        }
      }
      record.dataValues.grade = grade
      return record
    })
  )

  return result
}

export const getVaccineHistoryByIdService = async (id) => {
  const record = await VaccineHistory.findOne({
    where: { VH_ID: id, Is_deleted: false }
  })
  if (!record) {
    throw { status: 404, message: 'Vaccine history record not found' }
  }

  const medicalRecord = await MedicalRecord.findByPk(record.ID)
  if (medicalRecord) {
    record.dataValues.MedicalRecord = medicalRecord
    const user = await User.findByPk(medicalRecord.userId, {
      attributes: ['fullname', 'dateOfBirth']
    })
    record.dataValues.PatientName = user ? user.fullname : null
  }

  return record
}

export const getVaccineHistoryByMRIdService = async (ID) => {
  const records = await VaccineHistory.findAll({
    where: { ID, Is_deleted: false },
    order: [['Date_injection', 'DESC']]
  })

  const medicalRecord = await MedicalRecord.findByPk(ID)
  const user = medicalRecord
    ? await User.findByPk(medicalRecord.userId, {
        attributes: ['fullname', 'dateOfBirth']
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
  delete updateData.ID

  await record.update(updateData)
  return await getVaccineHistoryByIdService(id)
}

export const confirmVaccineHistoryService = async (id, isConfirmed) => {
  const record = await getVaccineHistoryByIdService(id)
  if (!record) {
    throw { status: 404, message: 'Vaccine history record not found' }
  }

  const medicalRecord = await MedicalRecord.findByPk(record.ID)
  if (!medicalRecord) {
    throw { status: 404, message: 'Medical record not found' }
  }

  let statusUpdate = {}
  if (isConfirmed === true || isConfirmed === 'true') {
    statusUpdate.Status = 'Cho phép tiêm'
  } else {
    statusUpdate.Status = 'Không tiêm'
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
  const record = await getVaccineHistoryByIdService(id)
  if (!record) {
    throw { status: 404, message: 'Vaccine history record not found' }
  }

  await record.update({ Is_deleted: true })
  return { message: 'Vaccine history record deleted successfully' }
}

export const getStudentsByEventIdService = async (eventId) => {
  const vaccineHistories = await VaccineHistory.findAll({
    where: { Event_ID: eventId, Is_deleted: false }
  })

  const result = await Promise.all(
    vaccineHistories.map(async (history) => {
      const medicalRecord = await MedicalRecord.findByPk(history.ID)
      if (!medicalRecord) return null

      const student = await User.findByPk(medicalRecord.userId, {
        attributes: ['id', 'fullname', 'dateOfBirth']
      })

      if (!student) return null

      history.dataValues.MedicalRecord = medicalRecord
      history.dataValues.PatientName = student.fullname

      const evidence = await Evidence.findOne({ where: { VH_ID: history.VH_ID } })
      history.dataValues.image_after_injection = evidence ? evidence.Image : null

      return history
    })
  )
  const filteredResult = result.filter((item) => item !== null)

  return filteredResult
}

export const updateVaccineStatusByMRIdService = async (updates, files) => {
  if (!Array.isArray(updates) || updates.length === 0) {
    throw { status: 400, message: 'Input must be a non-empty array of update objects' }
  }

  const vhIdList = updates.map((item) => item.VH_ID)
  const filesByVhId = (files || []).reduce((acc, file) => {
    const vhId = file.fieldname.split('_')[1]
    if (vhId) {
      acc[vhId] = file
    }
    return acc
  }, {})

  const records = await VaccineHistory.findAll({ where: { VH_ID: vhIdList, Is_deleted: false } })
  if (records.length !== vhIdList.length) {
    throw { status: 404, message: 'Some VH_IDs do not exist in vaccine history' }
  }

  await Promise.all(
    updates.map(async (item) => {
      const vaccineHistoryRecord = records.find((r) => r.VH_ID === item.VH_ID)
      const existingEvidence = await Evidence.findOne({ where: { VH_ID: item.VH_ID } })

      if (item.status === 'Đã tiêm' && !filesByVhId[item.VH_ID] && !existingEvidence) {
        throw { status: 400, message: `Evidence image is required for VH_ID ${item.VH_ID}` }
      }

      await vaccineHistoryRecord.update({
        Status: item.status,
        note_affter_injection: item.note_affter_injection
      })

      const imageFile = filesByVhId[item.VH_ID]
      if (imageFile) {
        const result = await cloudinary.uploader.upload(imageFile.path)
        if (existingEvidence) {
          await existingEvidence.update({ Image: result.secure_url })
        } else {
          await Evidence.create({
            VH_ID: item.VH_ID,
            Image: result.secure_url
          })
        }
      } else if (existingEvidence) {
        await existingEvidence.destroy()
      }

      const vh = await VaccineHistory.findByPk(item.VH_ID)
      if (vh) {
        const mr = await MedicalRecord.findByPk(vh.ID)
        if (mr) {
          const guardianUsers = await GuardianUser.findAll({ where: { userId: mr.userId } })
          for (const guardianUser of guardianUsers) {
            const guardian = await Guardian.findByPk(guardianUser.obId)
            if (guardian) {
              const son = await User.findByPk(mr.userId, { attributes: ['fullname'] })
              const namevaccine = vh.Vaccine_name || 'Không rõ tên vaccine'
              const status = item.status
              const mess =
                status === 'Đã tiêm'
                  ? `Cháu đã được tiêm, triệu chứng sau tiêm của cháu ${son ? son.fullname : 'Không rõ tên'} đã được cập nhật.`
                  : `Cháu đã Chưa được tiêm, lý do chưa được tiêm của cháu ${son ? son.fullname : 'Không rõ tên'} đã được cập nhật.`
              await Notification.create({
                title: `Cập nhật về việc tiêm chủng ${namevaccine}`,
                mess: mess,
                userId: guardian.userId
              })
            }
          }
        }
      }
    })
  )

  return await VaccineHistory.findAll({ where: { VH_ID: vhIdList } })
}

export const getAllVaccineTypesService = async () => {
  const types = await VaccineHistory.findAll({
    where: {
      Is_created_by_guardian: false,
      Is_deleted: false
    },
    attributes: ['Vaccine_name', 'ID', 'Event_ID', 'batch_number', 'Vaccince_type'],
    raw: true
  })

  const grouped = {}

  for (const item of types) {
    let grade = null
    if (item.ID) {
      const medicalRecord = await MedicalRecord.findByPk(item.ID)
      if (medicalRecord && medicalRecord.Class) {
        const match = medicalRecord.Class.match(/^(\d+)/)
        grade = match ? parseInt(match[1], 10) : null
      }
    }
    let eventdate = null
    let eventDateStr = ''
    if (item.Event_ID) {
      const event = await Event.findByPk(item.Event_ID)
      eventdate = event ? event.dateEvent : null
      eventDateStr = eventdate ? new Date(eventdate).toISOString().slice(0, 10) : ''
    }
    const key = `${item.Vaccine_name}_${item.Vaccince_type}_${grade}_${eventDateStr}_${item.batch_number}`
    if (!grouped[key]) {
      grouped[key] = {
        vaccineName: item.Vaccine_name,
        vaccineType: item.Vaccince_type,
        grade,
        eventdate,
        batch_number: item.batch_number
      }
    }
  }

  return Object.values(grouped)
}

export const getVaccineHistoryByVaccineNameService = async (vaccineName, grade, eventDate) => {
  let whereClause = { Vaccine_name: vaccineName, Is_deleted: false }
  const filterByGrade = !!grade
  const filterByDate = !!eventDate

  const allRecords = await VaccineHistory.findAll({
    where: whereClause,
    order: [['Date_injection', 'DESC']]
  })

  const filteredRecords = []
  for (const record of allRecords) {
    const medicalRecord = await MedicalRecord.findByPk(record.ID)
    let recordGrade = null
    if (medicalRecord && medicalRecord.Class) {
      const match = medicalRecord.Class.match(/^(\d+)/)
      recordGrade = match ? parseInt(match[1], 10) : null
    }

    let eventDateStr = null
    if (record.Event_ID) {
      const event = await Event.findByPk(record.Event_ID)
      if (event && event.dateEvent) {
        eventDateStr = new Date(event.dateEvent).toISOString().slice(0, 10)
      }
    }

    let matchGrade = true
    let matchDate = true
    if (filterByGrade) {
      matchGrade = recordGrade === parseInt(grade, 10)
    }
    if (filterByDate) {
      matchDate = eventDateStr === eventDate
    }

    if (matchGrade && matchDate) {
      record.dataValues.grade = recordGrade
      record.dataValues.eventDate = eventDateStr
      record.dataValues.MedicalRecord = medicalRecord
      if (medicalRecord) {
        const user = await User.findByPk(medicalRecord.userId, {
          attributes: ['fullname', 'dateOfBirth']
        })
        record.dataValues.PatientName = user ? user.fullname : null
      }
      const evidence = await Evidence.findOne({ where: { VH_ID: record.VH_ID } })
      record.dataValues.image_after_injection = evidence ? evidence.Image : null
      filteredRecords.push(record)
    }
  }
  return filteredRecords
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
      const user = await User.findByPk(mr.userId, { attributes: ['id', 'fullname', 'dateOfBirth'] })
      const vaccineHistoriesRaw = await VaccineHistory.findAll({
        where: { ID: mr.ID, Is_deleted: false },
        order: [['Date_injection', 'DESC']]
      })

      const vaccineHistory = await Promise.all(
        vaccineHistoriesRaw.map(async (vh) => {
          const evidence = await Evidence.findOne({ where: { VH_ID: vh.VH_ID } })
          vh.dataValues.image_after_injection = evidence ? evidence.Image : null
          return vh
        })
      )

      totalVaccine += vaccineHistory.filter((vh) => vh.Status === 'Đã tiêm').length
      totalNeedConfirm += vaccineHistory.filter((vh) => vh.Status === 'Chờ xác nhận').length

      return {
        medicalRecord: mr,
        user: user ? { id: user.id, fullname: user.fullname, dateOfBirth: user.dateOfBirth } : null,
        vaccineHistory
      }
    })
  )

  return {
    totalVaccine,
    totalNeedConfirm,
    histories: allHistories
  }
}

export const deleteVaccineHistoriesByNameDateGradeService = async (vaccineName, dateInjection) => {
  if (!vaccineName || !dateInjection || typeof dateInjection !== 'string') {
    throw { status: 400, message: 'vaccineName và dateInjection (YYYY-MM-DD) là bắt buộc' }
  }

  const histories = await VaccineHistory.findAll({
    where: { Vaccine_name: vaccineName, Is_deleted: false }
  })

  let deletedCount = 0

  for (const history of histories) {
    const medicalRecord = await MedicalRecord.findByPk(history.ID)

    let historyDate = null
    if (history.Date_injection instanceof Date) {
      historyDate = history.Date_injection.toISOString().slice(0, 10)
    } else if (typeof history.Date_injection === 'string') {
      historyDate = history.Date_injection.slice(0, 10)
    }

    if (historyDate === dateInjection) {
      if (medicalRecord) {
        const guardianUsers = await GuardianUser.findAll({ where: { userId: medicalRecord.userId } })
        for (const guardianUser of guardianUsers) {
          const guardian = await Guardian.findByPk(guardianUser.obId)
          if (guardian) {
            const dateObj = new Date(dateInjection)
            dateObj.setHours(dateObj.getHours() + 7)
            const dateStr = dateObj.toLocaleDateString('vi-VN')
            const son = await User.findByPk(medicalRecord.userId, { attributes: ['fullname'] })
            await Notification.create({
              title: `Lịch tiêm chủng đã bị hủy`,
              mess: `Lịch tiêm chủng vaccine ${vaccineName} cho cháu ${
                son ? son.fullname : 'Không rõ tên'
              } vào ngày ${dateStr} đã bị hủy, chúng tôi sẽ thông báo khi có lịch tiêm chủng mới.`,
              userId: guardian.userId
            })
          }
        }
      }
      await history.update({ Is_deleted: true })
      deletedCount++
    }
  }

  return { deletedCount }
}
