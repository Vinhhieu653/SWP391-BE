import * as VaccineService from '../../services/Vaccine/Vaccine.service.js'

export const createVaccineHistory = async (req, res) => {
  try {
    // Now returns { event, vaccineHistories }
    const result = await VaccineService.createVaccineHistoryService(req.body)
    res.status(201).json({
      message: 'Vaccine histories created successfully',
      data: result
    })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' })
  }
}

export const createVaccineWithEvidence = async (req, res) => {
  try {
    // Now returns array of records with evidence
    const results = await VaccineService.createVaccineHistoryWithEvidenceService(req.body, req.file)
    res.status(201).json({
      message: 'Vaccine histories with evidence created successfully',
      data: results
    })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' })
  }
}

export const getAllVaccineHistory = async (req, res) => {
  try {
    const records = await VaccineService.getAllVaccineHistoryService()
    res.status(200).json(records)
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error' })
  }
}

export const getVaccineHistoryById = async (req, res) => {
  try {
    const record = await VaccineService.getVaccineHistoryByIdService(req.params.id)
    res.status(200).json(record)
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' })
  }
}

export const getVaccineHistoryByMRId = async (req, res) => {
  try {
    const records = await VaccineService.getVaccineHistoryByMRIdService(req.params.mrId)
    res.status(200).json(records)
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' })
  }
}

export const updateVaccineHistory = async (req, res) => {
  try {
    const updated = await VaccineService.updateVaccineHistoryService(req.params.id, req.body)
    res.status(200).json({
      message: 'Vaccine history updated successfully',
      data: updated
    })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' })
  }
}

export const confirmVaccineHistory = async (req, res) => {
  try {
    // Now also creates user-event association
    const confirmed = await VaccineService.confirmVaccineHistoryService(req.params.id)
    res.status(200).json({
      message: 'Vaccine history confirmed and user event created',
      data: confirmed
    })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' })
  }
}

export const deleteVaccineHistory = async (req, res) => {
  try {
    const result = await VaccineService.deleteVaccineHistoryService(req.params.id)
    res.status(200).json({ message: result.message })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' })
  }
}

export const getStudentsByEventId = async (req, res) => {
  try {
    const result = await VaccineService.getStudentsByEventIdService(req.params.eventId)
    res.status(200).json({
      message: 'Students for event retrieved successfully',
      data: result
    })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' })
  }
}
