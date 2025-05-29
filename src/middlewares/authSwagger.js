// middlewares/basicAuth.js
import dotenv from 'dotenv'
dotenv.config()

export const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth) {
    res.set('WWW-Authenticate', 'Basic realm="Swagger Docs"')
    return res.status(401).send('Authentication required.')
  }

  const base64Credentials = auth.split(' ')[1]
  if (!base64Credentials) {
    res.set('WWW-Authenticate', 'Basic realm="Swagger Docs"')
    return res.status(401).send('Invalid Authorization header.')
  }

  const [username, password] = Buffer.from(base64Credentials, 'base64').toString().split(':')

  if (username === process.env.API_DOCS_USERNAME && password === process.env.API_DOCS_PASSWORD) {
    next()
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Swagger Docs"')
    return res.status(401).send('Invalid Credentials.')
  }
}
