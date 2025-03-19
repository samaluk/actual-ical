import express from 'express'
import { generateIcal } from './ical'
import logger from './helpers/logger'

const app = express()

app.get('/actual.ics', async (_req, res) => {
  try {
    const iCalString = await generateIcal()
    res.send(iCalString)
  } catch (err) {
    logger.error(err)
    res.status(500).send('Internal server error')
  }
})

app.get('/healthcheck', (_req, res) => {
  res.send('OK')
})

export default app
