import * as srv from '../../services/health-check/health-check.service.js'

export async function createHealthCheck(req, res) {
  try {
    // chắc chắn req.body có dateEvent
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
    await srv.confirmForm(+formId)
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
