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
import { Op } from 'sequelize'

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
    status: 'created',
    School_year: data.schoolYear || '2024-2025',
    Event_ID: event.eventId
  })

  for (const mrId of mrIds) {
    const medicalRecord = await MedicalRecord.findByPk(mrId)
    if (!medicalRecord) continue

    console.log(`👉 MR ID: ${mrId}, userId: ${medicalRecord.userId}`)

    const guardianUsers = await GuardianUser.findAll({
      where: { userId: medicalRecord.userId }
    })

    if (!guardianUsers.length) {
      console.warn(`⚠️ Không tìm thấy GuardianUser cho userId: ${medicalRecord.userId}`)
    }

    await UserEvent.create({
      eventId: event.eventId,
      userId: medicalRecord.userId
    })

    await HistoryCheck.create({
      ID: mrId,
      HC_ID: health_check.HC_ID,
      Date_create: new Date()
    })

    for (const guardianUser of guardianUsers) {
      const guardian = await Guardian.findByPk(guardianUser.obId)

      console.log(`🧾 GuardianUser → obId: ${guardianUser.obId}, Guardian:`, guardian?.userId)

      if (guardian && guardian.userId) {
        try {
          const dateStr = new Date(event.dateEvent).toLocaleDateString('vi-VN')
          await Notification.create({
            title: `Con bạn có đợt khám sức khỏe mới vào ngày ${dateStr}`,
            mess: 'Bấm vào để xem chi tiết và xác nhận cho con bạn được khám sức khỏe',
            userId: guardian.userId
          })
          console.log(`✅ Gửi noti cho guardian userId ${guardian.userId}`)
        } catch (e) {
          console.error('❌ Lỗi khi gửi Notification:', e)
        }
      } else {
        console.warn(`⚠️ Guardian không tồn tại hoặc thiếu userId (guardianId: ${guardianUser.obId})`)
      }
    }
  }

  return {
    event,
    health_check
  }
}

export async function getAllHealthChecks() {
  const healthChecks = await HealthCheck.findAll({
    include: {
      model: Event,
      attributes: ['eventId', 'dateEvent', 'type']
    },
    order: [['createdAt', 'DESC']]
  })

  return healthChecks
}

export async function getHealthCheckById(id) {
  const hc = await HealthCheck.findByPk(id, {
    include: {
      model: Event,
      attributes: ['eventId', 'dateEvent', 'type']
    }
  })

  if (!hc) throw new Error('Không tìm thấy đợt khám')

  // 👉 Auto update status nếu đến ngày khám
  const today = new Date()
  const eventDate = new Date(hc.Event.dateEvent)
  if (hc.status === 'pending' && eventDate <= today) {
    await hc.update({ status: 'in progress' })
  }

  return {
    eventId: hc.Event.eventId,
    dateEvent: hc.Event.dateEvent,
    type: hc.Event.type,
    title: hc.title,
    description: hc.description,
    schoolYear: hc.School_year,
    status: hc.status // return status mới nhất
  }
}

export async function getHealthChecksByStudentId(studentId) {
  const forms = await FormCheck.findAll({
    where: { Student_ID: studentId },
    include: {
      model: HealthCheck,
      include: {
        model: Event,
        attributes: ['eventId', 'dateEvent', 'type']
      }
    }
  })

  if (!forms || forms.length === 0) {
    throw new Error('Học sinh này chưa tham gia đợt khám nào')
  }

  return forms.map((form) => ({
    formId: form.Form_ID,
    studentId: form.Student_ID,
    status: form.status,

    // from HealthCheck
    healthCheckId: form.HealthCheck?.HC_ID,
    title: form.HealthCheck?.title,
    description: form.HealthCheck?.description,
    schoolYear: form.HealthCheck?.School_year,

    // from Event
    eventId: form.HealthCheck?.Event?.eventId,
    dateEvent: form.HealthCheck?.Event?.dateEvent,
    type: form.HealthCheck?.Event?.type
  }))

  return forms.map((form) => ({
    formId: form.Form_ID,
    eventId: form.HealthCheck?.Event?.eventId,
    dateEvent: form.HealthCheck?.Event?.dateEvent,
    type: form.HealthCheck?.Event?.type,
    schoolYear: form.HealthCheck?.School_year,
    height: form.height,
    weight: form.weight,
    bloodPressure: form.blood_pressure,
    generalConclusion: form.general_conclusion
  }))
}

export async function updateHealthCheck(id, data) {
  const healthCheck = await HealthCheck.findByPk(id, { include: Event })
  if (!healthCheck) throw new Error('Không tìm thấy đợt khám')

  await healthCheck.update({
    title: data.title,
    status: 'pending',
    description: data.description,
    School_year: data.schoolYear
  })

  await healthCheck.Event.update({
    dateEvent: data.dateEvent,
    type: data.type
  })

  // ✅ Gửi noti cho phụ huynh liên quan
  const forms = await FormCheck.findAll({ where: { HC_ID: healthCheck.HC_ID } })
  const studentIds = forms.map((f) => f.Student_ID)

  const medicalRecords = await MedicalRecord.findAll({
    where: { userId: studentIds }
  })

  const allGuardianUsers = await GuardianUser.findAll({
    where: {
      userId: medicalRecords.map((r) => r.userId)
    }
  })

  const guardianIds = allGuardianUsers.map((g) => g.obId)

  const guardians = await Guardian.findAll({
    where: { obId: guardianIds }
  })

  await Promise.all(
    guardians.map((g) =>
      Notification.create({
        title: 'Thông tin đợt khám sức khỏe được cập nhật',
        mess: `Đợt khám "${healthCheck.title}" đã được cập nhật. Vui lòng kiểm tra lại thông tin.`,
        userId: g.userId
      })
    )
  )

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

  const event = await Event.findByPk(healthCheck.Event_ID)
  if (!event) throw new Error('Không tìm thấy sự kiện')

  await healthCheck.destroy() // soft delete
  await event.destroy() // soft delete
}

export async function sendConfirmForms(eventId) {
  const students = await User.findAll({
    where: { roleId: 3 },
    include: [
      {
        model: GuardianUser,
        include: [Guardian]
      }
    ]
  })

  if (!students.length) throw new Error('Không có học sinh trong đợt khám')

  const healthCheck = await HealthCheck.findOne({ where: { Event_ID: eventId } })
  if (!healthCheck) throw new Error('Không tìm thấy đợt khám')
  await healthCheck.update({ status: 'pending' })

  const forms = await FormCheck.bulkCreate(
    students.map((s) => ({
      HC_ID: healthCheck.HC_ID,
      Student_ID: s.id
    })),
    { returning: true }
  )

  // Gửi noti cho phụ huynh
  for (const student of students) {
    for (const gu of student.GuardianUsers) {
      const guardian = gu.Guardian
      if (guardian && guardian.userId) {
        await Notification.create({
          userId: guardian.userId,
          title: 'Xác nhận thông tin khám sức khỏe',
          mess: `Vui lòng xác nhận form khám sức khỏe của học sinh ${student.fullName || 'con bạn'}`,
          isRead: false
        })
      }
    }
  }

  return { createdForms: forms.length }
}

export async function submitResult(
  HC_ID,
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
    is_need_meet
  }
) {
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
      status: 'checked'
    },
    {
      where: {
        HC_ID: HC_ID,
        Student_ID: student_id
      }
    }
  )
}

export async function updateFormResult(HC_ID, studentId, data) {
  const [updated] = await FormCheck.update(
    {
      Height: data.height,
      Weight: data.weight,
      Blood_Pressure: data.blood_pressure,
      Vision_Left: data.vision_left,
      Vision_Right: data.vision_right,
      Dental_Status: data.dental_status,
      ENT_Status: data.ent_status,
      Skin_Status: data.skin_status,
      General_Conclusion: data.general_conclusion,
      Is_need_meet: data.is_need_meet,
      status: data.status
    },
    {
      where: {
        HC_ID: HC_ID,
        Student_ID: studentId
      }
    }
  )

  if (!updated) throw new Error('Không tìm thấy form khám để cập nhật')

  // ✅ Gửi noti cho phụ huynh của học sinh này
  const guardianUsers = await GuardianUser.findAll({
    where: { userId: studentId }
  })

  const guardianIds = guardianUsers.map((g) => g.obId)

  const guardians = await Guardian.findAll({
    where: { obId: guardianIds }
  })

  await Promise.all(
    guardians.map((g) =>
      Notification.create({
        title: 'Kết quả khám sức khỏe đã được cập nhật',
        mess: `Kết quả khám sức khỏe của học sinh đã được cập nhật. Vui lòng kiểm tra lại thông tin.`,
        userId: g.userId
      })
    )
  )

  return 'Cập nhật thành công'
}

export async function resetFormResult(formId) {
  const [updated] = await FormCheck.update(
    {
      Height: null,
      Weight: null,
      Blood_Pressure: null,
      Vision_Left: null,
      Vision_Right: null,
      Dental_Status: null,
      ENT_Status: null,
      Skin_Status: null,
      General_Conclusion: null,
      Is_need_meet: null,
      status: 'approved' // hoặc 'confirmed' tùy logic của m
    },
    {
      where: {
        Form_ID: formId
      }
    }
  )

  if (!updated) throw new Error('Không tìm thấy form khám để reset')
  return 'Đã reset kết quả khám'
}

export async function getFormResult(HC_ID, studentId) {
  const form = await FormCheck.findOne({
    where: {
      HC_ID: HC_ID,
      Student_ID: studentId
    }
  })

  if (!form) throw new Error('Không tìm thấy form khám')
  return form
}

export async function getAllFormsByEvent(eventId) {
  const healthCheck = await HealthCheck.findOne({ where: { Event_ID: eventId } })
  if (!healthCheck) throw new Error('Không tìm thấy đợt khám')

  const forms = await FormCheck.findAll({
    where: {
      HC_ID: healthCheck.HC_ID
    }
  })

  return forms
}

export async function sendResult(HC_ID) {
  const forms = await FormCheck.findAll({
    where: { HC_ID: HC_ID },
    include: [
      {
        model: User,
        as: 'Student',
        include: [{ model: Guardian }]
      }
    ]
  })

  for (const form of forms) {
    if (form.status !== 'approved') continue

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
              mess: 'Bấm vào để xem chi tiết và xác nhận kết quả khám sức khỏe',
              userId: guardian.userId
            })
          }
        })
      )
    }
    form.status = 'checked'
    await form.save()
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

export async function getStudentsByEvent(HC_ID) {
  const forms = await FormCheck.findAll({
    where: { HC_ID },
    include: [
      {
        model: User,
        as: 'Student',
        include: [{ model: Guardian }]
      }
    ]
  })

  const studentsId = forms.map((form) => form.Student.id)

  const records = await MedicalRecord.findAll({
    where: {
      userId: {
        [Op.in]: studentsId
      }
    },
    attributes: ['userId', 'Class'] // nhớ lấy userId để mapping
  })

  // Tạo map userId -> Class
  const classMap = {}
  records.forEach((record) => {
    classMap[record.userId] = record.Class
  })

  // Gán Class vào Student
  forms.forEach((form) => {
    const student = form.Student
    if (student && classMap[student.id]) {
      student.Class = classMap[student.id]
    }
  })

  return forms
}

export async function getFormDetail(formId) {
  const form = await FormCheck.findByPk(formId, {
    include: [{ model: User, as: 'Student' }]
  })
  if (!form) throw new Error('Không tìm thấy form')
  return form
}
