### API

#### `makeHistoryDriver(options: Object): Function`
This is a factory function which creates the history driver using the provided options. All options available are

  - <h5 style="margin:0;">hash :</h5>
    Enable or disable the use of hash based routing instead of the History API. If the browser does not support the History API it is enabled automatically. By default it is `false`.
  - <h5 style="margin:0;margin-top:0.35em;">queries :</h5>
    Enable or disable [Query Support](https://github.com/rackt/history/blob/master/docs/QuerySupport.md). By default it is `true`.
  - <h5 style="margin:0;margin-top:0.25em;">basename: </h5>
    Set a basename for the History API to manage. More information can be found [here](https://github.com/rackt/history/blob/master/docs/BasenameSupport.md). By default it is an empty string `""`.

Further options available are all of those available to `rackt/history`'s `createHistory(options)` method. The documentation for `rackt/history` is available [here](https://github.com/rackt/history/tree/master/docs).

###### Example
```js
makeHistoryDriver({
  hash: false,
  queries: true,
  basename: '/blog',
  // any other options from rackt/history
})
```
The function returned `historyDriver(url$)` is what Motorcycle interacts with. More information available [here](https://github.com/motorcyclejs/motorcycle-history/tree/master/docs/historyDriver.md)

#### `makeServerHistoryDriver(Location: Object): Function`

When using Cycle to create an isomorphic/universal application you likely want to incorporate your routing solution. This function makes it possible to do just that.

This function expects a [Location object](https://github.com/rackt/history/blob/master/docs/Location.md) as input. Please read the documentation on that page if you wish to use this.

###### Example
```js
import { makeServerHistoryDriver } from '@motorcycle/history'
import { createLocation } from 'history'

makeServerHistoryDriver(
  createLocation( req.url, {
    state: 'generated/retrieved on the server',
  })
)
```

#### `filterLinks(event: Event): Boolean`

This is a helper function which allows the filtering of links. When you click a link that should be handled by your application it will accept it, but if it is an external/download/etc link not meant to be handled internally it will be ignored.

###### Example
```js
import { filterLinks } from '@motorcycle/history'

function intent({ DOM }) {
  const click$ = DOM
    .select('a')
    .events('click')
    .filter(filterLinks)

  return {
    click$,
  }
}
```

<hr />

# Not a router

This driver is not intended to be a full-featured router. To achieve this kind of functionality you can use a route matching library like:

- [switch-path](https://github.com/staltz/switch-path
  ) by André Staltz
- [url-mapper](https://github.com/christianalfoni/url-mapper) by Christian Alfoni

Know of another library that could be useful or would like to add your own to this list? Open an issue or submit a pull request!

# Real-World Examples

For more of a concrete example checkout any of the following:

- [tylors/cycle-starter](https://github.com/tylors/cycle-starter) by Tylor Steinberger

Have an application you'd like to see added to this list? Open an issue, or better yet submit a pull request!
