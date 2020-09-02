const { v1: uuidv1 } = require('uuid')
const cookieSession = require('cookie-session')
const express = require('express')
const app = express()
const router = express.Router()
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const { check, validationResult } = require('express-validator')
const sendMessage = require('./sender/send-message')

nunjucks.configure('./app/views', {
  autoescape: true,
  express: app
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
  name: 'session',
  maxAge: 28 * 24 * 60 * 60 * 1000, // 28 days in millis
  secret: 'secret'
}))

app.use(favicon('./app/favicon.ico'))

router.get('/', function (req, res) {
  const { session: { body } } = req
  res.render('index.njk', { body })
})

router.post('/', [
  check('connectionString')
    .contains('Endpoint=sb://')
    .withMessage('Connection string Endpoint missing')
    .contains(';SharedAccessKeyName=')
    .withMessage('Connection string SharedAccessKeyName missing')
    .contains(';SharedAccessKey=')
    .withMessage('Connection string SharedAccessKey missing')
    .trim(),
  check('queue').isLength({ min: 1 })
    .withMessage('Invalid queue')
    .trim(),
  check('messageId').isLength({ min: 2 })
    .withMessage('Message Id Property Name missing')
    .trim(),
  check('message')
    .isJSON()
    .withMessage('Invalid JSON message')
    .trim()
], async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.send(errors.array().map(x => `<p>${x.msg}</p>`))
  }
  const { connectionString, format, message, messageId, queue } = req.body

  // set session to contain body, might want to set specific properties to avoid it being overloaded
  req.session.body = req.body

  const msg = JSON.parse(message)
  msg[messageId] = uuidv1()

  const messageToSend = format === 'json' ? msg : JSON.stringify(msg)
  const response = await sendMessage(
    connectionString,
    queue,
    messageToSend,
    format
  )
  res.send(response)
})

app.use('/', router)

module.exports = app
