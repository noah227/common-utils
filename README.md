# common-utils

## usage

### mapObject

```js
import cUtils from "common-utils"

const obj = {name: "jack", age: 20}

cUtils.mapObject(["name"], obj) // {name: "jack"}
// with alias
cUtils.mapObject(["name", {alias: "theBoy", key: "name"}], obj) // {theBoy: "jack"}
// return as function
cUtils.mapObject(["name"], obj, true) // {name: () => "jack"}
```

### syncObject

See [test](./dist.test.js)

### chainGet

See [test](./dist.test.js)

### formatDate

See [test](./dist.test.js)

### selectFile

See [test](./dist.test.js)

### strToArray

See [test](./dist.test.js)

### arrToString

See [test](./dist.test.js)

### briefString

See [test](./dist.test.js)

### numToLocaleFixed

See [test](./dist.test.js)
