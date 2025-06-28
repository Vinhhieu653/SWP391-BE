import * as guardianService from '../../services/guardian/guardian.service.js'

export const createGuardianWithStudents = async (req, res) => {
  try {
    const result = await guardianService.createGuardianWithStudents(req.body)
    res.status(201).json(result)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const getAllGuardians = async (req, res) => {
  try {
    const guardians = await guardianService.getAllGuardians()
    res.status(200).json(guardians)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

export const getGuardianById = async (req, res) => {
  try {
    const guardian = await guardianService.getGuardianById(req.params.id)
    res.status(200).json(guardian)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const updateGuardian = async (req, res) => {
  try {
    const updated = await guardianService.updateGuardian(req.params.id, req.body)
    res.status(200).json(updated)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const deleteGuardian = async (req, res) => {
  try {
    await guardianService.deleteGuardian(req.params.id)
    res.status(200).json({ message: 'Guardian deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const getStudentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const data = await guardianService.getStudentsByUserId(userId)
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const addStudentToGuardian = async (req, res) => {
  try {
    const { id_ob } = req.params
    const result = await guardianService.addStudentByGuardianId(id_ob, req.body)
    res.status(201).json(result)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const updateStudentByGuardian = async (req, res) => {
  try {
    const { guardianId, studentId } = req.params
    const result = await guardianService.updateStudentByGuardianId(guardianId, studentId, req.body)
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const deleteStudentByGuardian = async (req, res) => {
  try {
    const { guardianId, studentId } = req.params
    const result = await guardianService.deleteStudentByGuardianId(guardianId, studentId)
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({ message: error.message })
  }
}

export async function importGuardiansFromExcel(req, res) {
  try {
    console.log('req.file:', req.file) // ✅ debug

    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng upload file Excel' })
    }

    const result = await guardianService.importGuardiansExcelService(req.file.buffer)
    res.status(200).json({ message: 'Import thành công', data: result })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
