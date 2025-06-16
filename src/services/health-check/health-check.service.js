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

export async function createHealthCheck({ title, description, dateEvent, schoolYear, type }) {
  if (!dateEvent) throw new Error('dateEvent là bắt buộc')
  if (!schoolYear) throw new Error('schoolYear là bắt buộc')
  if (!type) throw new Error('type là bắt buộc')

  const event = await Event.create({ dateEvent, type })

  const healthCheck = await HealthCheck.create({
    Event_ID: event.eventId,
    School_year: schoolYear,
    title,
    description
  })

  // lấy danh sách học sinh
  const students = await User.findAll({ where: { roleId: 1 } })

  // tạo UserEvent + Notification
  const userEvents = []
  const notiList = []

  for (const s of students) {
    userEvents.push({ eventId: event.eventId, userId: s.id })

    notiList.push({
      userId: s.id,
      title: 'Thông báo khám sức khỏe',
      mess: `Đã tạo đợt khám sức khỏe năm học ${schoolYear}. Vui lòng xác nhận thông tin.`,
      isRead: false
    })
  }

  await UserEvent.bulkCreate(userEvents)
  await Notification.bulkCreate(notiList)

  return {
    eventId: event.eventId,
    dateEvent,
    type,
    title,
    description,
    schoolYear
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
    where: { roleId: 1 }, // học sinh
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
    is_confirmed_by_guardian
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
      Is_confirmed_by_guardian: is_confirmed_by_guardian
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

  const forms = await FormCheck.findAll({ where: { HC_ID: healthCheck.HC_ID } })

  for (const form of forms) {
    // Gửi kết quả
    await MedicalSent.create({
      Form_ID: form.Form_ID,
      Sent_by: 'system',
      Date_sent: new Date(),
      Is_confirm: false,
      Image_prescription: null
    })

    // Tìm medical record
    const mr = await MedicalRecord.findOne({ where: { userId: form.Student_ID } })
    if (!mr) continue

    // Ghi history check
    await HistoryCheck.create({
      MR_ID: mr.ID,
      HC_ID: healthCheck.HC_ID,
      Date_create: new Date()
    })
  }
  await Notification.create({
    userId: guardian.id,
    title: 'Kết quả khám sức khỏe',
    mess: `Đã có kết quả khám sức khỏe của ${student.fullName}`,
    isRead: false
  })
}

// service
export async function confirmForm(formId) {
  const form = await FormCheck.findByPk(formId)
  if (!form) throw new Error('Không tìm thấy form')
  form.Is_confirmed_by_guardian = true
  await form.save()
}

// service
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

// service
export async function getFormDetail(formId) {
  const form = await FormCheck.findByPk(formId, {
    include: [{ model: User, as: 'Student' }]
  })
  if (!form) throw new Error('Không tìm thấy form')
  return form
}
