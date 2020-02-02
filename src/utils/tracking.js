const TRACKER_IDs = ['UA-100571693-1', 'UA-100571693-2']

const isBrowser = typeof window !== 'undefined'
const isProdApp = window.location.origin === 'https://app.santiment.net'
const hasDoNotTrack = () => {
  const dnt =
    navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack
  return dnt !== '1' && dnt !== 'yes'
}
// GA strings need to have trailing whitespace trimmed,
function trim (s) {
  return s.replace(/^\s+|\s+$/g, '')
}

function loadScript () {
  const importGTAG = document.createElement('script')
  importGTAG.async = true
  importGTAG.type = 'text/javascript'
  importGTAG.src = '//www.googletagmanager.com/gtag/js?id=' + TRACKER_IDs[0]

  const head = document.getElementsByTagName('head')[0]
  head.appendChild(importGTAG)
}

export function initializeTracking (trackerIDs = TRACKER_IDs) {
  if (isBrowser && isProdApp && !hasDoNotTrack()) {
    loadScript()
    window.dataLayer = window.dataLayer || []
    function gtag () {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag
    gtag('js', new Date())

    trackerIDs.forEach(function (ID) {
      gtag('config', ID)
    })
  }
}

export const update =
  isBrowser && isProdApp && !hasDoNotTrack()
    ? user => {
      window.gtag('set', {
        user_id: user.id
      })
      window.Intercom('update', {
        name: user.username,
        user_id: user.id,
        email: user.email,
        ethAccounts: user.ethAccounts,
        nightmode: (user.settings || {}).theme
      })
    }
    : () => {}

/**
 * Use the event command to send event data
 *
 * @example
 *
 *   event({
 *     category: 'user',
 *     action: 'sign_up'
 *     method: 'metamask',
 *   })
 */
export const event =
  isBrowser && isProdApp && !hasDoNotTrack()
    ? ({ action, category, label, ...values }, type = ['ga']) => {
      if (type.includes('ga')) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          ...values
        })
      }
      if (type.includes('intercom')) {
        window.Intercom('trackEvent', action, {
          event_category: category,
          event_label: label,
          ...values
        })
      }
    }
    : () => {}

/**
 * pageview:
 * Basic GA pageview tracking
 * @param  {String} path - the current page e.g. '/about'
 * @param {Array} trackerIDs - (optional) a list of extra trackers to run the command on
 */
export function pageview (rawPath, trackerIDs = TRACKER_IDs) {
  if (!isBrowser || !isProdApp || hasDoNotTrack()) {
    return
  }
  // path is required in .pageview()
  if (!rawPath) {
    return
  }

  const path = trim(rawPath)

  // path cannot be an empty string in .pageview()
  if (path === '') {
    return
  }

  if (typeof window.gtag === 'function') {
    trackerIDs.forEach(function (ID) {
      window.gtag('config', ID, { page_path: path })
    })
  }
}

export default {
  initializeTracking,
  event,
  pageview
}
