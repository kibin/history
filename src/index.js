import Most from 'most'
import {subject as Subject} from 'most-subject'
import {
  createHistory,
  createHashHistory,
  useQueries,
  useBasename,
} from 'history'
import keys from 'fast.js/object/keys'
import forEach from 'fast.js/array/forEach'

import {filterLinks, supportsHistory} from './utils'

const makeHistory =
  (hash, queries, options) => {
    const useHash = hash || !supportsHistory()
    if (useHash && queries) {
      return useQueries(useBasename(createHashHistory))(options)
    }
    if (useHash && !queries) {
      return useBasename(createHashHistory)(options)
    }
    if (!useHash && queries) {
      return useQueries(useBasename(createHistory))(options)
    }
    if (!useHash && !queries) {
      return useBasename(createHistory)(options)
    }
  }

const createPushState =
  (history, basename) =>
    url => {
      if (`string` === typeof url) {
        history.pushState({}, url.replace(basename, ``))
      } else if (`object` === typeof url) {
        let {state = {}, path, query = {}} = url
        history.pushState(state, path.replace(basename, ``), query)
      } else {
        throw new Error(`History Driver input must be a string or
          object but received ${typeof url}`)
      }
    }

const createHistorySubject =
  history => {
    const subject = Subject()
    forEach(
      keys(history),
      key => {
        if (key !== `listen`) {
          subject[key] = history[key]
        }
      }
    )
    return subject
  }

const makeHistoryDriver =
  config => {
    const {hash = false, queries = true, ...options} = config || {}
    const history = makeHistory(hash, queries, options)
    const historySubject = createHistorySubject(history)

    const historyDriver =
      url$ => {
        url$.observe(createPushState(history, options.basename || ``))
        history.listen(location => historySubject.sink.add(location))
        return historySubject.stream
      }

    return historyDriver
  }

const makeServerHistoryDriver =
  startingLocation => {
    const {
      pathname = `/`,
      query = {},
      search = ``,
      state = {},
      action = `POP`,
      key = ``,
    } = startingLocation || {}

    const historyDriver =
      () => Most.just({
        pathname,
        query,
        search,
        state,
        action,
        key,
      })

    return historyDriver
  }

export {
  makeHistoryDriver,
  makeServerHistoryDriver,
  filterLinks,
}
