export function dateFormatter(time: string): string {
  const dateObj = new Date(time)
  let year = dateObj.getFullYear()
  let month = dateObj.getMonth() + 1
  let date = dateObj.getDate()
  let hour = dateObj.getHours() - 3
  let minutes = dateObj.getMinutes()

  const resMonth: string = month < 10 ? '0' + month : month.toString()
  const resDt: string = date < 10 ? '0' + date : date.toString()

  if (hour !== 0 || minutes !== 0) {
    const resHour: string = hour < 10 ? '0' + hour : hour.toString()
    const resMinutes: string = minutes < 10 ? '0' + minutes : minutes.toString()

    return resDt + '.' + resMonth + '.' + year + ' ' + resHour + ':' + resMinutes
  }

  return resDt + '.' + resMonth + '.' + year
}

export function isDateExpired(time: string): boolean {
  const targetDate = new Date(time)
  const currentDate = new Date()

  return targetDate < currentDate
}