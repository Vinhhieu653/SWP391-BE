import MedicalRecord from '../../models/data/medicalRecord.model.js'

const records = [
  {
    userId: 1,
    Class: '5A',
    height: 120.5,
    weight: 25.3,
    bloodType: 'O',
    chronicDiseases: 'Không có bệnh mãn tính',
    allergies: 'Dị ứng đậu phộng',
    pastIllnesses: 'Cúm thông thường'
  },
  {
    userId: 2,
    Class: '6B',
    height: 130.2,
    weight: 30.1,
    bloodType: 'A',
    chronicDiseases: 'Hen suyễn',
    allergies: 'Dị ứng bụi',
    pastIllnesses: 'Thủy đậu'
  },
  {
    userId: 3,
    Class: '7C',
    height: 140.7,
    weight: 35.9,
    bloodType: 'B',
    chronicDiseases: 'Thiếu máu di truyền',
    allergies: 'Dị ứng hải sản',
    pastIllnesses: 'Sởi'
  }
]

export async function seedMedicalRecords() {
  for (const record of records) {
    const [instance, created] = await MedicalRecord.findOrCreate({
      where: {
        userId: record.userId,
        Class: record.Class
      },
      defaults: {
        height: record.height,
        weight: record.weight,
        bloodType: record.bloodType,
        chronicDiseases: record.chronicDiseases,
        allergies: record.allergies,
        pastIllnesses: record.pastIllnesses
      }
    })

    if (created) {
      console.log(`✅ Created medical record for user ${record.userId}`)
    }
  }
}
