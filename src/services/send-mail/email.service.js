import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import hbs from 'nodemailer-express-handlebars'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve(__dirname, '../../utils/templates'),
    defaultLayout: false
  },
  viewPath: path.resolve(__dirname, '../../utils/templates'),
  extName: '.hbs'
}

transporter.use('compile', hbs(handlebarOptions))

export const sendMail = async ({ to, subject, html, template, context }) => {
  if (template) {
    // Dùng template name truyền vào, ko cứng
    return transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      template: 'email-regular-health-check',
      context
    })
  }
  if (html) {
    return transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    })
  }
  throw new Error('Phải truyền html hoặc template')
}

// Thêm hàm này vào cuối file email service
export const sendRandomPasswordMail = async ({ to, studentName, password, actionLink }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Mật khẩu mới cho tài khoản y tế học đường',
    template: 'password-email',
    context: {
      studentName,
      password,
      actionLink
    }
  })
}
