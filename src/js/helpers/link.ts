export function splitLinkAtQuery(link: string): {
  prefix: string
  suffix: string | null
} {
  const queryIndex = link.indexOf('?')
  if (queryIndex === -1) {
    return { prefix: link, suffix: null }
  }

  return {
    prefix: link.slice(0, queryIndex + 1),
    suffix: link.slice(queryIndex + 1),
  }
}
