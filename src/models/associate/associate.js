// models/associate.js
import User from '../data/user.model.js'
import Role from '../data/role.model.js'
import Blog from '../data/blog.model.js'
import Notification from '../data/noti.model.js'
import GuardianUser from '../data/guardian_user.model.js'
import Guardian from '../data/guardian.model.js'
import Event from '../data/event.model.js'
import UserEvent from '../data/user_event.model.js'
import MedicalRecord from '../data/medicalRecord.model.js'
import HistoryOtherMedical from '../data/history_other_medical.model.js'
import OutpatientMedication from '../data/outpatient_medication.model.js'
import MedicalSent from '../data/medical_sent.model.js'
import HealthCheck from '../data/health_check.model.js'
import HistoryCheck from '../data/history_check.model.js'
import FormCheck from '../data/form_check.model.js'
import OtherMedical from '../data/other_medical.model.js'
import VaccineHistory from '../data/vaccine_history.model.js'
import Evidence from '../data/evidence.model.js'
import Category from '../data/category.model.js'

// Thiết lập associations ở đây
function applyAssociations() {
  // User ↔ Role
  User.belongsTo(Role, { foreignKey: 'roleId' })
  Role.hasMany(User, { foreignKey: 'roleId' })

  // User ↔ Blog
  User.hasMany(Blog, { foreignKey: 'userId' })
  Blog.belongsTo(User, { foreignKey: 'userId' })

  // User ↔ Notification
  User.hasMany(Notification, { foreignKey: 'userId' })
  Notification.belongsTo(User, { foreignKey: 'userId' })

  // User ↔ Guardian (Many-to-Many thông qua GuardianUser)
  User.belongsToMany(Guardian, {
    through: GuardianUser,
    foreignKey: 'userId',
    otherKey: 'obId'
  })

  Guardian.belongsToMany(User, {
    through: GuardianUser,
    foreignKey: 'obId',
    otherKey: 'userId'
  })

  // GuardianUser có thể include được User và Guardian
  GuardianUser.belongsTo(User, { foreignKey: 'userId' })
  GuardianUser.belongsTo(Guardian, { foreignKey: 'obId' })

  // Optional: nếu muốn truy ngược từ User hoặc Guardian
  User.hasMany(GuardianUser, { foreignKey: 'userId' })
  Guardian.hasMany(GuardianUser, { foreignKey: 'obId' })

  // User ↔ Event (Many-to-Many thông qua UserEvent)
  User.belongsToMany(Event, {
    through: UserEvent,
    foreignKey: 'userId',
    otherKey: 'eventId'
  })
  Event.belongsToMany(User, {
    through: UserEvent,
    foreignKey: 'eventId',
    otherKey: 'userId'
  })

  // User ↔ Medical_Record
  User.hasOne(MedicalRecord, { foreignKey: 'userId' })
  MedicalRecord.belongsTo(User, { foreignKey: 'userId' })

  //Medical_Record ↔ HistoryOtherMedical
  MedicalRecord.hasMany(HistoryOtherMedical, { foreignKey: 'ID' })
  HistoryOtherMedical.belongsTo(MedicalRecord, { foreignKey: 'ID' })

  //medicalRecord ↔ Outpatient
  MedicalRecord.hasMany(OutpatientMedication, { foreignKey: 'ID' })
  OutpatientMedication.belongsTo(MedicalRecord, { foreignKey: 'ID' })

  //outpatient ↔ medicationSent
  OutpatientMedication.hasMany(MedicalSent, { foreignKey: 'OM_ID' })
  MedicalSent.belongsTo(OutpatientMedication, { foreignKey: 'OM_ID' })

  //event ↔ healthCheck
  Event.hasMany(HealthCheck, { foreignKey: 'Event_ID' })
  HealthCheck.belongsTo(Event, { foreignKey: 'Event_ID' })

  //HistoryCheck ↔ HealthCheck
  HealthCheck.hasMany(HistoryCheck, { foreignKey: 'HC_ID' })
  HistoryCheck.belongsTo(HealthCheck, { foreignKey: 'HC_ID' })

  //FormCheck ↔ HealthCheck
  HealthCheck.hasMany(FormCheck, { foreignKey: 'HC_ID' })
  FormCheck.belongsTo(HealthCheck, { foreignKey: 'HC_ID' })

  User.hasMany(FormCheck, { foreignKey: 'Student_ID' })
  FormCheck.belongsTo(User, { foreignKey: 'Student_ID', as: 'Student' })

  //FormCheck ↔ GuardianUser
  FormCheck.belongsTo(GuardianUser, { foreignKey: 'GuardianUserId' })
  GuardianUser.hasMany(FormCheck, { foreignKey: 'GuardianUserId' })

  FormCheck.hasOne(MedicalSent, { foreignKey: 'Form_ID' })
  MedicalSent.belongsTo(FormCheck, { foreignKey: 'Form_ID' })

  //historyCheck ↔ medicalRecord
  MedicalRecord.hasMany(HistoryCheck, { foreignKey: 'ID' })
  HistoryCheck.belongsTo(MedicalRecord, { foreignKey: 'ID' })

  //otherMedical ↔ historyOtherMedical
  OtherMedical.hasMany(HistoryOtherMedical, { foreignKey: 'OrtherM_ID' })
  HistoryOtherMedical.belongsTo(OtherMedical, { foreignKey: 'OrtherM_ID' })

  //vaccineHistory ↔ Event
  Event.hasMany(VaccineHistory, { foreignKey: 'Event_ID' })
  VaccineHistory.belongsTo(Event, { foreignKey: 'Event_ID' })

  //vaccineHistory ↔ medicalRecord
  MedicalRecord.hasMany(VaccineHistory, { foreignKey: 'ID' })
  VaccineHistory.belongsTo(MedicalRecord, { foreignKey: 'ID' })

  //evidence ↔ vaccineHistory
  VaccineHistory.hasMany(Evidence, { foreignKey: 'VH_ID' })
  Evidence.belongsTo(VaccineHistory, { foreignKey: 'VH_ID' })

  //category ↔ blog
  Category.hasMany(Blog, { foreignKey: 'Category_id' })
  Blog.belongsTo(Category, { foreignKey: 'Category_id' })
}

export default applyAssociations
