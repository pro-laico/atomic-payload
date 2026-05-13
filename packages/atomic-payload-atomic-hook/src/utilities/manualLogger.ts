export default function manualLogger(message: string) {
  let color
  if (message.includes('[INFO]')) color = '\x1b[38;5;117m%s\x1b[0m'
  if (message.includes('[Warning]')) color = '\x1b[38;5;208m%s\x1b[0m'
  if (message.includes('[Error]')) color = '\x1b[38;5;196m%s\x1b[0m'
  if (message.includes('[Preview]')) color = '\x1b[38;5;226m%s\x1b[0m'
  if (message.includes('[STORE]')) color = '\x1b[38;5;117m%s\x1b[0m'
  if (message.includes('[UPDATE]')) color = '\x1b[38;5;117m%s\x1b[0m'
  if (message.includes('[GENERATE]')) color = '\x1b[38;5;117m%s\x1b[0m'
  if (process?.env?.LOGS === 'true') console.log(color, message)
}
