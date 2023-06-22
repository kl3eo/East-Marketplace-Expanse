export function shortenAddress (address) {
  if (!address) return ''
  return address.slice(0, 8)
}

export function shortShortenAddress (address) {
  if (!address) return ''
  return address.slice(0, 4)
}
