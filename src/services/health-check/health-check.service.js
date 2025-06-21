import Event from '../../models/data/event.model.js'
import User from '../../models/data/user.model.js'
import FormCheck from '../../models/data/form_check.model.js'
import HealthCheck from '../../models/data/health_check.model.js'
import MedicalSent from '../../models/data/medical_sent.model.js'
import Guardian from '../../models/data/guardian.model.js'
import UserEvent from '../../models/data/user_event.model.js'
import Notification from '../../models/data/noti.model.js'
import MedicalRecord from '../../models/data/medicalRecord.model.js'
import HistoryCheck from '../../models/data/history_check.model.js'
import GuardianUser from '../../models/data/guardian_user.model.js'

export const createHealthCheck = async (data) => {
  const event = await Event.create({
    dateEvent: data.dateEvent || new Date(),
    type: 'Health Check'
  })

  let mrIds = data.ID

  if (!mrIds) {
    const medicalRecords = await MedicalRecord.findAll({ attributes: ['ID'] })
    mrIds = medicalRecords.map((record) => record.ID)
  } else {
    mrIds = Array.isArray(mrIds) ? mrIds : [mrIds]
  }

  const health_check = await HealthCheck.create({
    ...data,
    School_year: data.schoolYear || '2024-2025',
    Event_ID: event.eventId
  })
  for (const mrId of mrIds) {
    const medicalRecord = await MedicalRecord.findByPk(mrId)
    if (medicalRecord) {
      const guardianUsers = await GuardianUser.findAll({
        where: { userId: medicalRecord.userId }
      })
      const userEvent = await UserEvent.create({
        eventId: event.eventId,
        userId: medicalRecord.userId
      })
      const historyCheck = await HistoryCheck.create({
        ID: mrId,
        HC_ID: health_check.HC_ID,
        Date_create: new Date()
      })
      await Promise.all(
        guardianUsers.map(async (guardianUser) => {
          const guardian = await Guardian.findByPk(guardianUser.obId)
          if (guardian) {
            const date = new Date(event.dateEvent)
            await Notification.create({
              title: `Con bạn có đợt khám sức khỏe mới vào ngày ${date.toLocaleDateString('vi-VN')}`,
              mess: 'Bấm vào để xem chi tiết và xác nhận cho con bạn được khám sức khỏe',
              userId: guardian.userId
            })
          }
        })
      )
    }
  }

  return {
    event,
    health_check
  }
}

export async function getAllHealthChecks() {
  return await HealthCheck.findAll({
    include: {
      model: Event,
      attributes: ['eventId', 'dateEvent', 'type']
    },
    order: [['createdAt', 'DESC']]
  })
}

export async function getHealthCheckById(id) {
  const hc = await HealthCheck.findByPk(id, {
    include: {
      model: Event,
      attributes: ['eventId', 'dateEvent', 'type']
    }
  })

  if (!hc) throw new Error('Không tìm thấy đợt khám')

  return {
    eventId: hc.Event.eventId,
    dateEvent: hc.Event.dateEvent,
    type: hc.Event.type,
    title: hc.title,
    description: hc.description,
    schoolYear: hc.School_year
  }
}

export async function updateHealthCheck(id, data) {
  const healthCheck = await HealthCheck.findByPk(id, { include: Event })
  if (!healthCheck) throw new Error('Không tìm thấy đợt khám')

  await healthCheck.update({
    title: data.title,
    description: data.description,
    School_year: data.schoolYear
  })

  await healthCheck.Event.update({
    dateEvent: data.dateEvent,
    type: data.type
  })

  return {
    eventId: healthCheck.Event.eventId,
    dateEvent: healthCheck.Event.dateEvent,
    type: healthCheck.Event.type,
    title: healthCheck.title,
    description: healthCheck.description,
    schoolYear: healthCheck.School_year
  }
}

export async function deleteHealthCheck(id) {
  const healthCheck = await HealthCheck.findByPk(id)
  if (!healthCheck) throw new Error('Không tìm thấy đợt khám')

  const eventId = healthCheck.Event_ID
  await healthCheck.destroy()
  await Event.destroy({ where: { eventId } })
}

export async function sendConfirmForms(eventId) {
  const students = await User.findAll({
    where: { roleId: 3 }, // học sinh
    include: [{ model: Guardian }]
  })
  if (!students.length) throw new Error('Không có học sinh trong đợt khám')

  const healthCheck = await HealthCheck.findOne({ where: { Event_ID: eventId } })
  if (!healthCheck) throw new Error('Không tìm thấy đợt khám')

  const forms = await FormCheck.bulkCreate(
    students.map((s) => ({
      HC_ID: healthCheck.HC_ID,
      Student_ID: s.id
    })),
    { returning: true }
  )

  // Gửi noti cho phụ huynh
  for (let i = 0; i < students.length; i++) {
    const student = students[i]
    const guardian = student.Guardian

    if (guardian) {
      await Notification.create({
        userId: guardian.id,
        title: 'Xác nhận thông tin khám sức khỏe',
        mess: `Vui lòng xác nhận form khám sức khỏe của học sinh ${student.fullName || 'con bạn'}`,
        isRead: false
      })
    }
  }

  return { createdForms: forms.length }
}

export async function submitResult(
  eventId,
  {
    student_id,
    height,
    weight,
    blood_pressure,
    vision_left,
    vision_right,
    dental_status,
    ent_status,
    skin_status,
    general_conclusion,
    is_need_meet,
    status
  }
) {
  const healthCheck = await HealthCheck.findOne({ where: { Event_ID: eventId } })
  if (!healthCheck) throw new Error('Không tìm thấy đợt khám')

  // Cập nhật form khám cho học sinh
  await FormCheck.update(
    {
      Height: height,
      Weight: weight,
      Blood_Pressure: blood_pressure,
      Vision_Left: vision_left,
      Vision_Right: vision_right,
      Dental_Status: dental_status,
      ENT_Status: ent_status,
      Skin_Status: skin_status,
      General_Conclusion: general_conclusion,
      Is_need_meet: is_need_meet,
      status: status
    },
    {
      where: {
        HC_ID: healthCheck.HC_ID,
        Student_ID: student_id
      }
    }
  )
}

export async function sendResult(eventId) {
  const healthCheck = await HealthCheck.findOne({ where: { Event_ID: eventId } })
  if (!healthCheck) throw new Error('Không tìm thấy đợt khám')

  const forms = await FormCheck.findAll({
    where: { HC_ID: healthCheck.HC_ID },
    include: [
      {
        model: User,
        as: 'Student',
        include: [{ model: Guardian }]
      }
    ]
  })

  for (const form of forms) {
    const mr = await MedicalRecord.findOne({ where: { userId: form.Student_ID } })

    if (mr) {
      const guardianUsers = await GuardianUser.findAll({
        where: { userId: mr.userId }
      })
      await Promise.all(
        guardianUsers.map(async (guardianUser) => {
          const guardian = await Guardian.findByPk(guardianUser.obId)
          if (guardian) {
            await Notification.create({
              title: 'Đã có kết quả khám sức khỏe cho con bạn',
              mess: `Bấm vao để xem chi tiết và xác nhận kết quả khám sức khỏe`,
              userId: guardian.userId
            })
          }
        })
      )
    }
  }
}

export async function confirmForm(formId, action) {
  const form = await FormCheck.findByPk(formId)
  if (!form) throw new Error('Không tìm thấy form')

  if (action === 'approve') {
    form.status = 'approved'
  } else if (action === 'reject') {
    form.status = 'rejected'
  } else {
    throw new Error('Hành động không hợp lệ')
  }

  await form.save()
}

export async function getStudentsByEvent(eventId) {
  const healthCheck = await HealthCheck.findOne({ where: { Event_ID: eventId } })
  if (!healthCheck) throw new Error('Không tìm thấy đợt khám')

  const forms = await FormCheck.findAll({
    where: { HC_ID: healthCheck.HC_ID },
    include: [
      {
        model: User,
        as: 'Student',
        include: [{ model: Guardian }]
      }
    ]
  })

  return forms // ← QUAN TRỌNG
}

export async function getFormDetail(formId) {
  const form = await FormCheck.findByPk(formId, {
    include: [{ model: User, as: 'Student' }]
  })
  if (!form) throw new Error('Không tìm thấy form')
  return form
}
