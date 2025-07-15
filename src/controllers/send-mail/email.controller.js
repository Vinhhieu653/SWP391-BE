import { sendMail } from '../../services/send-mail/email.service.js'

export const sendEmailController = async (req, res) => {
  const { to, subject, message, template, context } = req.body

  if (!to || !subject) {
    return res.status(400).json({ success: false, msg: 'Thiếu dữ liệu bắt buộc' })
  }

  try {
    if (template) {
      await sendMail({ to, subject, template, context: context || {} })
    } else if (message) {
      await sendMail({ to, subject, html: message })
    } else {
      await sendMail({ to, subject, template: 'email-noti', context: context || {} })
    }

    return res.json({ success: true, msg: 'Gửi mail thành công' })
  } catch (error) {
    return res.status(500).json({ success: false, msg: 'Gửi mail lỗi', error: error.message })
  }
}
