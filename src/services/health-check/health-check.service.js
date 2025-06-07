// src/services/health-check/health-check.service.js

import Event from '../../models/data/event.model.js'
import User from '../../models/data/user.model.js'
import FormCheck from '../../models/data/form_check.model.js'
import HealthCheck from '../../models/data/health_check.model.js'
import MedicalSent from '../../models/data/medical_sent.model.js'

export async function createHealthCheck({ title, description, dateEvent, schoolYear }) {
  if (!dateEvent) throw new Error('dateEvent là bắt buộc')
  if (!schoolYear) throw new Error('schoolYear là bắt buộc')

  // Tạo Event trước
  const event = await Event.create({ title, description, dateEvent, type: 'health_check' })

  // Tạo HealthCheck liên kết với Event_ID và School_year
  await HealthCheck.create({
    Event_ID: event.eventId,
    School_year: schoolYear
  })

  return event
}

export async function sendConfirmForms(eventId) {
  const students = await User.findAll({
    where: { roleId: 3 } // giả sử 3 là id role của học sinh
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
