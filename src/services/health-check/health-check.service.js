import Event from '../../models/data/event.model.js'
import User from '../../models/data/user.model.js'
import FormCheck from '../../models/data/form_check.model.js'
import HealthCheck from '../../models/data/health_check.model.js'
import MedicalSent from '../../models/data/medical_sent.model.js'
import Guardian from '../../models/data/guardian.model.js'

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
    where: { roleId: 1 } // giả sử 1 là id role của học sinh
  })
  if (!students.length) throw new Error('Không có học sinh trong đợt khám')

  // Tạo form cho từng học sinh thuộc event
  const healthCheck = await HealthCheck.findOne({ where: { Event_ID: eventId } })
  if (!healthCheck) throw new Error('Không tìm thấy đợt khám')

  const forms = students.map((s) => ({
    HC_ID: healthCheck.HC_ID,
    Student_ID: s.id
    // các field khác để default null hoặc bỏ qua
  }))

  await FormCheck.bulkCreate(forms)
  // Todo: gửi email/notification cho phụ huynh
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
    // giả sử gửi kết quả (gửi notification/email)
    await MedicalSent.create({
      Form_ID: form.Form_ID,
      Sent_by: 'system',
      Date_sent: new Date(),
      Is_confirm: false,
      Image_prescription: null
    })
  }
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
