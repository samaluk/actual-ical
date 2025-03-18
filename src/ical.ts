import * as actualApi from '@actual-app/api'
import ical from 'ical-generator'
import { RRule } from 'rrule'
import { DateTime } from 'luxon'
import { BaseConditionEntity, ScheduleEntity } from '@actual-app/api/@types/loot-core/types/models'
import { formatCurrency } from './helpers/number'

const {
  ACTUAL_SERVER,
  ACTUAL_MAIN_PASSWORD,
  ACTUAL_SYNC_ID,
  ACTUAL_SYNC_PASSWORD,
  ACTUAL_PATH = 'actual-local',
  TZ = 'UTC',
} = process.env

const getSchedules = async () => {
  await actualApi.init({
    // Budget data will be cached locally here, in subdirectories for each file.
    dataDir: ACTUAL_PATH,
    serverURL: ACTUAL_SERVER,
    password: ACTUAL_MAIN_PASSWORD,
  })

  await actualApi.downloadBudget(ACTUAL_SYNC_ID, {
    password: ACTUAL_SYNC_PASSWORD,
  })

  const query = actualApi.q('schedules')
    .filter({
      completed: false,
    })
    .select(['*'])

  const { data } = await actualApi.runQuery(query) as { data: ScheduleEntity[] }

  return data
}

const resolveFrequency = (frequency: string) => {
  switch (frequency) {
    case 'yearly':
      return RRule.YEARLY
    case 'monthly':
      return RRule.MONTHLY
    case 'weekly':
      return RRule.WEEKLY
    case 'daily':
      return RRule.DAILY
    default:
      throw new Error(`Invalid frequency: ${frequency}`)
  }
}

export const generateIcal = async () => {
  const schedules = await getSchedules()

  const calendar = ical({
    name: 'Actual Balance iCal',
  })

  schedules.forEach((schedule) => {
    const recurringCondition = schedule._conditions.find((condition) => {
      return condition.field === 'date' && condition.op === 'isapprox'
    }) as BaseConditionEntity<'date', 'isapprox'> | undefined

    if (!recurringCondition) {
      return
    }

    if (typeof recurringCondition.value === 'string') {
      console.error('Skipping schedule with invalid recurring condition')
      return
    }

    const recurringData = recurringCondition.value

    const getEndDate = () => {
      if (recurringData.endMode === 'never') {
        return
      }

      if (recurringData.endMode === 'after_n_occurrences') {
        const windowMap = {
          daily: 'days',
          weekly: 'weeks',
          monthly: 'months',
          yearly: 'years',
        }
        return DateTime.fromISO(recurringData.start).plus({
          [windowMap[recurringData.frequency]]: recurringData.endOccurrences,
        }).toJSDate()
      }

      if (!recurringData.endDate) {
        return
      }

      return DateTime.fromISO(recurringData.endDate).toJSDate()
    }

    const rule = new RRule({
      freq: resolveFrequency(recurringData.frequency),
      count: recurringData.endOccurrences,
      interval: 1,
      dtstart: DateTime.fromISO(recurringData.start).toJSDate(),
      until: getEndDate(),
      tzid: TZ,
    })

    const formatAmount = () => {
      const amount = schedule._amount
      if (typeof amount === 'number') {
        return formatCurrency(amount)
      }

      return `${formatCurrency(amount.num1)} - ${formatCurrency(amount.num2)}`
    }

    return rule.all().map((date) => {
      return calendar.createEvent({
        start: date,
        summary: schedule.name,
        description: formatAmount(),
        allDay: true,
        timezone: TZ,
      })
    })
  })

  return calendar.toString()
}
