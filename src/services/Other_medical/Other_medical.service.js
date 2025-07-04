import OtherMedical from '../../models/data/other_medical.model.js'
import HistoryOtherMedical from '../../models/data/history_other_medical.model.js'
import MedicalRecord from '../../models/data/medicalRecord.model.js'
import Guardian from '../../models/data/guardian.model.js'
import GuardianUser from '../../models/data/guardian_user.model.js'
import Notification from '../../models/data/noti.model.js'
import User from '../../models/data/user.model.js'

export const createOtherMedicalService = async (data, creator_by) => {
  if (!data.ID) {
    throw { status: 400, message: 'ID is required' }
  }
  const otherMedical = await OtherMedical.create(data)

  const historyOtherMedical = await HistoryOtherMedical.create({
    OrtherM_ID: otherMedical.OrtherM_ID,
    ID: data.ID,
    Date_create: new Date(),
    creater_by: creator_by || 'system'
  })

  const medicalRecord = await MedicalRecord.findByPk(data.ID)

  if (!medicalRecord) throw { status: 404, message: 'Medical record not found' }

  const guardianUsers = await GuardianUser.findOne({
    where: { userId: medicalRecord.userId }
  })

  const guardian = await Guardian.findByPk(guardianUsers.obId)

  if (guardian.userId) {
    try {
      const dateObj = new Date(historyOtherMedical.Date_create)
      dateObj.setHours(dateObj.getHours() + 7)
      const dateStr = dateObj.toLocaleDateString('vi-VN')
      const son = await User.findByPk(medicalRecord.userId, { attributes: ['fullname'] })
      await Notification.create({
        title: `Cháu ${son ? son.fullname : 'con bạn'} con bạn có vấn đề về sức khỏe vào ngày ${dateStr}`,
        mess: 'Bấm vào để xem chi tiết về vấn đề sức khỏe của con bạn.',
        userId: guardian.userId
      })
      console.log(`Gửi noti cho guardian userId ${guardian.userId}`)
    } catch (e) {
      console.error('Lỗi khi gửi Notification:', e)
    }
  } else {
    console.warn(`Guardian không tồn tại hoặc thiếu userId (guardianId: ${guardianUser.obId})`)
  }

  return otherMedical
}

export const getAllOtherMedicalService = async () => {
  const otherMedicalRecords = await OtherMedical.findAll({ where: { Is_deleted: false } })
  const result = await Promise.all(
    otherMedicalRecords.map(async (record) => {
      const history = await HistoryOtherMedical.findAll({ where: { OrtherM_ID: record.OrtherM_ID } })
      let ID = null
      if (history.length > 0) {
        record.dataValues.history = history
        ID = history[0].ID
      } else {
        record.dataValues.history = []
      }
      const medicalRecord = ID ? await MedicalRecord.findOne({ where: { ID: ID } }) : null
      if (medicalRecord) {
        record.dataValues.Medical_record = medicalRecord
        const user = medicalRecord.userId
          ? await User.findOne({ where: { id: medicalRecord.userId }, attributes: ['fullname'] })
          : null
        record.dataValues.UserFullname = user ? user.fullname : null
      } else {
        record.dataValues.Medical_record = null
        record.dataValues.UserFullname = null
      }
      return record
    })
  )
  return result
}

export const getOtherMedicalByIdService = async (id) => {
  const otherMedical = await OtherMedical.findOne({ where: { OrtherM_ID: id, Is_deleted: false } })
  if (!otherMedical) throw { status: 404, message: 'Other medical record not found' }

  const history = await HistoryOtherMedical.findAll({ where: { OrtherM_ID: id } })
  let ID = null
  if (history.length > 0) {
    otherMedical.dataValues.history = history
    ID = history[0].ID
  } else {
    otherMedical.dataValues.history = []
  }
  const medicalRecord = ID ? await MedicalRecord.findOne({ where: { ID: ID } }) : null
  if (medicalRecord) {
    otherMedical.dataValues.Medical_record = medicalRecord
    const user = medicalRecord.userId
      ? await User.findOne({ where: { id: medicalRecord.userId }, attributes: ['fullname'] })
      : null
    otherMedical.dataValues.UserFullname = user ? user.fullname : null

    const guardianUser = await GuardianUser.findOne({ where: { userId: medicalRecord.userId } })
    let guardian = null
    if (guardianUser) {
      const guardianRecord = await Guardian.findByPk(guardianUser.obId)
      if (guardianRecord) {
        const guardianUserInfo = await User.findByPk(guardianRecord.userId, { attributes: ['fullname'] })
        guardian = {
          ...guardianRecord.get({ plain: true }),
          fullname: guardianUserInfo ? guardianUserInfo.fullname : null
        }
      }
    }
    otherMedical.dataValues.guardian = guardian
  } else {
    otherMedical.dataValues.Medical_record = null
    otherMedical.dataValues.UserFullname = null
    otherMedical.dataValues.guardian = null
  }
  return otherMedical
}

export const updateOtherMedicalService = async (id, updateData) => {
  const otherMedical = await OtherMedical.findOne({ where: { OrtherM_ID: id, Is_deleted: false } })
  if (!otherMedical) throw { status: 404, message: 'Other medical record not found' }
  await otherMedical.update(updateData)
  const history = await HistoryOtherMedical.findOne({ where: { OrtherM_ID: id } })
  await HistoryOtherMedical.update({ Date_create: new Date() }, { where: { OrtherM_ID: id } })

  if (history) {
    const medicalRecord = await MedicalRecord.findByPk(history.ID)
    if (medicalRecord) {
      const guardianUsers = await GuardianUser.findAll({ where: { userId: medicalRecord.userId } })
      for (const guardianUser of guardianUsers) {
        const guardian = await Guardian.findByPk(guardianUser.obId)
        if (guardian && guardian.userId) {
          const son = await User.findByPk(medicalRecord.userId, { attributes: ['fullname'] })
          const dateObj = new Date()
          dateObj.setHours(dateObj.getHours() + 7)
          const dateStr = dateObj.toLocaleDateString('vi-VN')
          await Notification.create({
            title: `Cập nhật vấn đề về sức khỏe vào ngày ${dateStr} cho cháu ${son ? son.fullname : 'con bạn'}`,
            mess: `Thông tin sức khỏe của cháu đã được cập nhật vào ngày ${dateStr}. Vui lòng kiểm tra.`,
            userId: guardian.userId
          })
        }
      }
    }
  }

  return otherMedical
}

export const deleteOtherMedicalService = async (id) => {
  const otherMedical = await OtherMedical.findOne({ where: { OrtherM_ID: id, Is_deleted: false } })
  if (!otherMedical) throw { status: 404, message: 'Other medical record not found' }

  const history = await HistoryOtherMedical.findOne({ where: { OrtherM_ID: id } })
  if (history) {
    const medicalRecord = await MedicalRecord.findByPk(history.ID)
    if (medicalRecord) {
      const guardianUsers = await GuardianUser.findAll({ where: { userId: medicalRecord.userId } })
      for (const guardianUser of guardianUsers) {
        const guardian = await Guardian.findByPk(guardianUser.obId)
        if (guardian && guardian.userId) {
          const son = await User.findByPk(medicalRecord.userId, { attributes: ['fullname'] })
          const dateObj = new Date()
          dateObj.setHours(dateObj.getHours() + 7)
          const dateStr = dateObj.toLocaleDateString('vi-VN')
          await Notification.create({
            title: `Một vấn đề về sức khỏe vào ngày ${dateStr} của cháu ${son ? son.fullname : 'con bạn'} đã được xóa`,
            mess: `Một ghi chú về sức khỏe của cháu đã được xóa. Chúng tôi xin lỗi vì sự nhầm lẫn này. Chúng tôi sẽ tiếp tục theo dõi và cập nhật thông tin sức khỏe của cháu trong tương lai.`,
            userId: guardian.userId
          })
        }
      }
    }
  }

  await otherMedical.update({ Is_deleted: true })
}

export const getOtherMedicalByGuardianUserIdService = async (guardianUserId) => {
  const guardians = await Guardian.findAll({ where: { userId: guardianUserId } })
  if (!guardians || guardians.length === 0) return []

  const obIds = guardians.map((g) => g.obId)

  const guardianUsers = await GuardianUser.findAll({ where: { obId: obIds } })
  if (!guardianUsers || guardianUsers.length === 0) return []

  const userIds = guardianUsers.map((gu) => gu.userId)

  const medicalRecords = await MedicalRecord.findAll({ where: { userId: userIds } })
  if (!medicalRecords || medicalRecords.length === 0) return []

  const medicalRecordIds = medicalRecords.map((mr) => mr.ID)

  const histories = await HistoryOtherMedical.findAll({ where: { ID: medicalRecordIds } })
  if (!histories || histories.length === 0) return []

  const otherMedicalIds = histories.map((h) => h.OrtherM_ID)

  const otherMedicals = await OtherMedical.findAll({
    where: { OrtherM_ID: otherMedicalIds, Is_deleted: false }
  })

  const result = await Promise.all(
    otherMedicals.map(async (record) => {
      const recordHistories = histories.filter((h) => h.OrtherM_ID === record.OrtherM_ID)
      let ID = null
      if (recordHistories.length > 0) {
        record.dataValues.history = recordHistories
        ID = recordHistories[0].ID
      } else {
        record.dataValues.history = []
      }
      const medicalRecord = ID ? medicalRecords.find((mr) => mr.ID === ID) : null
      if (medicalRecord) {
        record.dataValues.Medical_record = medicalRecord
        const user = medicalRecord.userId
          ? await User.findOne({ where: { id: medicalRecord.userId }, attributes: ['fullname'] })
          : null
        record.dataValues.UserFullname = user ? user.fullname : null
      } else {
        record.dataValues.Medical_record = null
        record.dataValues.UserFullname = null
      }
      return record
    })
  )
  return result
}
