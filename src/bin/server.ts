import { configDotenv } from 'dotenv'
configDotenv({ path: '.env' })

import app from '../app'
import logger from '../helpers/logger'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`)
})
