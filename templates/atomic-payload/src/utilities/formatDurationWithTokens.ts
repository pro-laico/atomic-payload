import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export function formatDurationString(ms: number, template: string): string {
  const dur = dayjs.duration(ms)

  const tokens: Record<string, () => string> = {
    '{d}': () => {
      const d = dur.days()
      return d > 0 ? `${d} day${d !== 1 ? 's' : ''}` : '0 days'
    },
    '{dh}': () => {
      const d = dur.days()
      const h = dur.hours()
      const parts = []
      if (d > 0) parts.push(`${d} day${d !== 1 ? 's' : ''}`)
      if (h > 0) parts.push(`${h} hour${h !== 1 ? 's' : ''}`)
      return parts.join(' and ') || '0 hours'
    },
    '{h}': () => {
      const h = dur.asHours()
      const whole = Math.floor(h)
      return `${whole} hour${whole !== 1 ? 's' : ''}`
    },
    '{hm}': () => {
      const h = dur.hours()
      const m = dur.minutes()
      const parts = []
      if (h > 0) parts.push(`${h} hour${h !== 1 ? 's' : ''}`)
      if (m > 0) parts.push(`${m} minute${m !== 1 ? 's' : ''}`)
      return parts.join(' and ') || '0 minutes'
    },
    '{m}': () => {
      const m = Math.floor(dur.asMinutes())
      return `${m} minute${m !== 1 ? 's' : ''}`
    },
    '{ms}': () => {
      const m = dur.minutes()
      const s = dur.seconds()
      const parts = []
      if (m > 0) parts.push(`${m} minute${m !== 1 ? 's' : ''}`)
      if (s > 0) parts.push(`${s} second${s !== 1 ? 's' : ''}`)
      return parts.join(' and ') || '0 seconds'
    },
    '{s}': () => {
      const s = Math.floor(dur.asSeconds())
      return `${s} second${s !== 1 ? 's' : ''}`
    },
  }

  return template.replace(/\{[a-z]+\}/g, (match) => {
    return tokens[match]?.() ?? match
  })
}
