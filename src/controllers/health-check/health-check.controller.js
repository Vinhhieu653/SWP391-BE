import * as srv from '../../services/health-check/health-check.service.js'

export async function createHealthCheck(req, res) {
  try {
    if (!req.body.dateEvent) {
      return res.status(400).json({ success: false, message: 'dateEvent là bắt buộc' })
    }
    const data = await srv.createHealthCheck(req.body)
    return res.json({ success: true, data })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false, message: e.message || 'Internal Server Error' })
  }
}

export const getHealthChecks = async (req, res) => {
  try {
    const result = await srv.getAllHealthChecks()
    res.status(200).json({ message: 'Lấy thành công', data: result })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getHealthCheckById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await srv.getHealthCheckById(id)
    res.json({ success: true, data })
  } catch (err) {
    res.status(404).json({ success: false, message: err.message })
  }
}

export const getHealthCheckByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params
    const data = await srv.getHealthChecksByStudentId(studentId)
    res.json({ success: true, data })
  } catch (err) {
    res.status(404).json({ success: false, message: err.message })
  }
}

export const updateHealthCheck = async (req, res) => {
  try {
    const { id } = req.query
    const result = await srv.updateHealthCheck(id, req.body)
    res.status(200).json({ message: 'Cập nhật thành công', data: result })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteHealthCheck = async (req, res) => {
  try {
    const { id } = req.query
    await srv.deleteHealthCheck(id)
    res.status(200).json({ message: 'Xoá thành công' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function sendConfirmForms(req, res) {
  try {
    await srv.sendConfirmForms(+req.params.id)
    return res.json({ success: true, message: 'Đã gửi form xác nhận' })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false, message: e.message || 'Internal Server Error' })
  }
}

export async function submitResult(req, res) {
  try {
    const { id } = req.params
    await srv.submitResult(+id, req.body)
    return res.json({ success: true, message: 'Submit kết quả thành công' })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false, message: e.message || 'Internal Server Error' })
  }
}

export const handleGetForm = async (req, res) => {
  try {
    const { id } = req.params
    const { student_id } = req.query
    const form = await srv.getFormResult(id, student_id) // ✅ đổi sang srv
    res.status(200).json(form)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const handleGetAllForms = async (req, res) => {
  try {
    const { id } = req.params
    const forms = await srv.getAllFormsByEvent(id) // ✅ đổi sang srv
    res.status(200).json(forms)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

export const handleUpdateForm = async (req, res) => {
  try {
    const { id } = req.params
    const { student_id } = req.body
    const result = await srv.updateFormResult(id, student_id, req.body) // ✅ đổi sang srv
    res.status(200).json({ message: result })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const handleResetForm = async (req, res) => {
  try {
    const { id } = req.params
    const { student_id } = req.query
    const result = await srv.resetFormResult(id, student_id) // ✅ đổi sang srv
    res.status(200).json({ message: result })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export async function sendResult(req, res) {
  try {
    await srv.sendResult(+req.params.id)
    return res.json({ success: true, message: 'Kết quả đã gửi về phụ huynh' })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false, message: e.message || 'Internal Server Error' })
  }
}

// controller
export async function confirmForm(req, res) {
  try {
    const { formId } = req.params
    const { action } = req.body

    await srv.confirmForm(+formId, action)
    return res.json({ success: true, message: 'Phụ huynh đã xác nhận form' })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false, message: e.message || 'Internal Server Error' })
  }
}

// controller
export async function getStudentsByEvent(req, res) {
  try {
    const students = await srv.getStudentsByEvent(+req.params.id)
    return res.json({ success: true, data: students })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false, message: e.message || 'Internal Server Error' })
  }
}

// controller
export async function getFormDetail(req, res) {
  try {
    const form = await srv.getFormDetail(+req.params.formId)
    return res.json({ success: true, data: form })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false, message: e.message || 'Internal Server Error' })
  }
}
