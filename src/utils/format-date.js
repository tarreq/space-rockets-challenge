import { parseZone } from 'moment'

export function formatDate(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function formatDateTime(timestamp, local = false) {
  const launchSiteUtcOffset = parseZone(timestamp).utcOffset();
  const localUserUtcOffset = new Date().getTimezoneOffset();

  // Construct a proper date object which represents local launch date
  const launchTimeLocal = new Date(new Date(timestamp).getTime() + (launchSiteUtcOffset * 60000) + (localUserUtcOffset * 60000));
  
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    ...(!local && {timeZoneName: "short"})
  }).format(local ? launchTimeLocal : new Date(timestamp));
  return local ? `${formattedTime} GMT${launchSiteUtcOffset / 60}` : formattedTime
}
