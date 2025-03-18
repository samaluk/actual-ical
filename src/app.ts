import express from 'express'
import { generateIcal } from './ical'

const app = express()

app.get('/actual.ics', async (_req, res) => {
  const iCalString = await generateIcal()
  res.send(iCalString)
})

export default app
