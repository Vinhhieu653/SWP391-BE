// middlewares/basicAuth.js
export const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth) {
    res.set('WWW-Authenticate', 'Basic realm="Swagger Docs"')
    return res.status(401).send('Authentication required.')
  }

  const base64Credentials = auth.split(' ')[1]
  const [username, password] = Buffer.from(base64Credentials, 'base64').toString().split(':')

  if (username === '1' && password === '1') {
    next()
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Swagger Docs"')
    return res.status(401).send('Invalid Credentials.')
  }
}
