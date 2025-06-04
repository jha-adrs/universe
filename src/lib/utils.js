import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNowStrict } from 'date-fns'
import locale from 'date-fns/locale/en-US'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const formatDistanceLocale = {
  lessThanXSeconds: 'just now',
  xSeconds: 'just now',
  halfAMinute: 'just now',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
}

function formatDistance(token, count, options) {
  options = options || {}

  const result = formatDistanceLocale[token ].replace('{{count}}', count.toString())

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result
    } else {
      if (result === 'just now') return result
      return result + ' ago'
    }
  }

  return result
}

export function formatTimeToNow(date) {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}

export function getJoinedDate(date) {
  let response;
  if(date instanceof Date) response = formatTimeToNow(date);
  else if(typeof date === 'string')  response= formatTimeToNow(new Date(date));
  const options = { month: 'long', year: 'numeric' };
  return `Joined ${response}`;
}

export const wait  = (ms)=> new Promise((resolve, reject)=>setTimeout(()=>resolve(),ms || 1000))

// Gradient color pairs for community headers
const gradientPairs = [
  ['from-blue-600', 'to-violet-600'],
  ['from-rose-500', 'to-orange-500'],
  ['from-emerald-500', 'to-teal-600'],
  ['from-pink-500', 'to-purple-600'],
  ['from-amber-500', 'to-red-500'],
  ['from-indigo-600', 'to-cyan-500'],
  ['from-green-500', 'to-cyan-600'],
  ['from-fuchsia-600', 'to-pink-500'],
  ['from-cyan-500', 'to-blue-600'],
  ['from-violet-600', 'to-indigo-600']
];

export function getRandomGradient(seed) {
  // If a seed is provided, generate a deterministic gradient based on the seed
  if (seed) {
    // Convert seed string to a number for consistency
    const seedValue = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seedValue % gradientPairs.length;
    return `bg-gradient-to-r ${gradientPairs[index][0]} ${gradientPairs[index][1]}`;
  }
  
  // Otherwise, return a random gradient
  const randomIndex = Math.floor(Math.random() * gradientPairs.length);
  return `bg-gradient-to-r ${gradientPairs[randomIndex][0]} ${gradientPairs[randomIndex][1]}`;
}