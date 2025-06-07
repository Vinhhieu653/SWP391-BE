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
  MedicalRecord.hasMany(HistoryOtherMedical, { foreignKey: 'MR_ID' })
  HistoryOtherMedical.belongsTo(MedicalRecord, { foreignKey: 'MR_ID' })

  //medicalRecord ↔ Outpatient
  MedicalRecord.hasMany(OutpatientMedication, { foreignKey: 'MR_ID' })
  OutpatientMedication.belongsTo(MedicalRecord, { foreignKey: 'MR_ID' })

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
  HealthCheck.hasOne(FormCheck, { foreignKey: 'HC_ID' })
  FormCheck.belongsTo(HealthCheck, { foreignKey: 'HC_ID' })

  //historyCheck ↔ medicalRecord
  MedicalRecord.hasMany(HistoryCheck, { foreignKey: 'MR_ID' })
  HistoryCheck.belongsTo(MedicalRecord, { foreignKey: 'MR_ID' })

  //otherMedical ↔ historyOtherMedical
  OtherMedical.hasMany(HistoryOtherMedical, { foreignKey: 'OrtherM_ID' })
  HistoryOtherMedical.belongsTo(OtherMedical, { foreignKey: 'OrtherM_ID' })



  //vaccineHistory ↔ Event
  Event.hasMany(VaccineHistory, { foreignKey: 'Event_ID' })
  VaccineHistory.belongsTo(Event, { foreignKey: 'Event_ID' })

  //vaccineHistory ↔ medicalRecord
  MedicalRecord.hasMany(VaccineHistory, { foreignKey: 'MR_ID' })
  VaccineHistory.belongsTo(MedicalRecord, { foreignKey: 'MR_ID' })

  //evidence ↔ vaccineHistory
  VaccineHistory.hasMany(Evidence, { foreignKey: 'VH_ID' })
  Evidence.belongsTo(VaccineHistory, { foreignKey: 'VH_ID' })

  //category ↔ blog
  Category.hasMany(Blog, { foreignKey: 'Category_id' })
  Blog.belongsTo(Category, { foreignKey: 'Category_id' })
}

export default applyAssociations
