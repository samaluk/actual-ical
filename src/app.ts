import express from 'express'
import { generateIcal } from './ical'

const app = express()

app.get('/actual.ics', async (_req, res) => {
  try {
    const iCalString = await generateIcal()
    res.send(iCalString)
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal server error')
  }
})

export default app
