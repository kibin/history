/* global describe, it */
import assert from 'assert'
import {
  makeHistoryDriver,
  makeServerHistoryDriver
} from '../../src'
import {createLocation} from 'history'
import most from 'most'

const statelessUrl$ = most.from([
  `/home`,
  `/home/profile`,
  `/`,
  `/about`,
])

const statefulUrl$ = most.from([
  {state: {y: 400}, path: `/home`},
  {state: {y: 350}, path: `/home/profile`},
  {state: {y: 0}, path: `/`},
  {state: {y: 1000}, path: `/about?x=99`},
])

const mixedStateUrl$ = most.from([
  `/home`,
  `/home/profile`,
  {state: {y: 0}, path: `/`},
  `/about`,
])

describe(`makeHistoryDriver`, () => {
  it(`should return a driver function`, done => {
    assert.strictEqual(typeof makeHistoryDriver, `function`)
    done()
  })

  it(`should operate with default options`, done => {
    assert.doesNotThrow(() => {
      makeHistoryDriver()
    })
    done()
  })

  it(`should accept an options object`, done => {
    assert.doesNotThrow(() => {
      makeHistoryDriver({
        hash: true,
        queries: true,
        basename: `/home`,
      })
      done()
    })
  })

  it(`should ignore other parameters`, done => {
    assert.doesNotThrow(() => {
      makeHistoryDriver(`hello`)
      makeHistoryDriver([`hello`])
      makeHistoryDriver(true)
    })
    done()
  })

  describe(`historyDriver`, () => {
    const historyDriver = makeHistoryDriver()

    it(`should accept a stream of stateless urls`, done => {
      assert.doesNotThrow(() => {
        historyDriver(statelessUrl$)
      })
      done()
    })

    it(`should accept a stream of stateful urls`, done => {
      assert.doesNotThrow(() => {
        historyDriver(statefulUrl$)
      })
      done()
    })

    it(`should accept a stream mixed stateful and stateless urls`, done => {
      assert.doesNotThrow(() => {
        historyDriver(mixedStateUrl$)
      })
      done()
    })

    describe(`historySubject`, () => {
      it(`should return a history location object`, done => {
        makeHistoryDriver()(statefulUrl$)
          .debounce(1)
          .observe(location => {
            assert.strictEqual(typeof location, `object`)
            assert.strictEqual(location.pathname, `/about`)
            assert.strictEqual(location.search, `?x=99`)
            assert.strictEqual(typeof location.query, `object`)
            assert.strictEqual(location.query.x, `99`)
            assert.strictEqual(typeof location.state, `object`)
            assert.strictEqual(location.state.y, 1000)
            assert.strictEqual(location.action, `PUSH`)
            assert.strictEqual(typeof location.key, `string`)
            done()
          })
      })
    })
  })
})

const serverConfig = {
  pathname: `/about`,
  query: {x: `99`},
  search: `?x=99`,
  state: {y: 1000},
  action: `PUSH`,
  key: ``,
}

describe(`makeServerHistoryDriver`, () => {
  it(`should return a driver function`, done => {
    assert.strictEqual(typeof makeServerHistoryDriver(serverConfig), `function`)
    done()
  })

  it(`should accept a location object`, done => {
    assert.doesNotThrow(() => {
      makeServerHistoryDriver(serverConfig)
    })
    done()
  })

  it(`should return defaults`, done => {
    assert.doesNotThrow(() => {
      makeServerHistoryDriver()
    })
    done()
  })

  it(`should work with history.createLocation`, done => {
    assert.doesNotThrow(() => {
      makeServerHistoryDriver(
        createLocation(`/home`)
      )
    })
    done()
  })

  describe(`serverHistorySubject`, () => {
    it(`should return the passed in location`, done => {
      makeServerHistoryDriver(serverConfig)()
        //.debounce(1)
        .observe(location => {
          assert.strictEqual(typeof location, `object`)
          assert.strictEqual(location.pathname, `/about`)
          assert.strictEqual(location.search, `?x=99`)
          assert.strictEqual(typeof location.query, `object`)
          assert.strictEqual(location.query.x, `99`)
          assert.strictEqual(typeof location.state, `object`)
          assert.strictEqual(location.action, `PUSH`)
          assert.strictEqual(typeof location.key, `string`)
          done()
        })
    })
  })
})
