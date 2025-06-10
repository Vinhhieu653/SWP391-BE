import MedicalRecord from '../../models/data/medicalRecord.model.js'

const records = [
  {
    userId: 1,
    class: '5A',
    historyHealth: 'Allergic to peanuts'
  },
  {
    userId: 2,
    class: '6B',
    historyHealth: 'Asthma'
  },
  {
    userId: 3,
    class: '7C',
    historyHealth: 'No known issues'
  }
]

export async function seedMedicalRecords() {
  for (const record of records) {
    const [instance, created] = await MedicalRecord.findOrCreate({
      where: {
        userId: record.userId,
        class: record.class
      },
      defaults: {
        historyHealth: record.historyHealth
      }
    })

    if (created) {
      console.log(`✅ Created medical record for user ${record.userId}`)
    }
  }
}
