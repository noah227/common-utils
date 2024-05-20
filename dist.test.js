import cUtils from "./dist/index"

import {expect, test} from "vitest"

test("mapObject-Basic", () => {
    expect(cUtils.mapObject(["name", "gender"], {name: "tom", gender: "male", duty: "watch cat"})).toStrictEqual({
        name: "tom",
        gender: "male"
    })
})

test("mapObject-Complex Keys", () => {
    expect(cUtils.mapObject(["name", {alias: "maleOrFemale", key: "gender"}], {
        name: "tom",
        gender: "male",
        duty: "watch cat"
    })).toStrictEqual({
        name: "tom",
        maleOrFemale: "male"
    })
})

// test("mapObject-Return as Function", () => {
//     expect(cUtils.mapObject(
//         ["name", "gender"], {name: "tom", gender: "male", duty: "watch cat"},
//         true
//     )).toStrictEqual({
//         name: () => "tom",
//         gender: () => "male"
//     })
// })

test("chainGet", () => {
    expect(cUtils.chainGet("user.info.age", {
        user: {
            info: {
                name: "tom",
                age: 16
            }
        }
    })).toBe(16)
})

test("formatDate", () => {
    expect(
        cUtils.formatDate("1970-01-01 08:10:00", "YYYY/MM/DD hh*mm*ss")
    ).toBe("1970/01/01 08*10*00")
})

test("strToArray", () => {
    expect(cUtils.strToArray("We.Are.the.World!", ".")).toStrictEqual(["We", "Are", "the", "World!"])
})

test("arrToString", () => {
    expect(cUtils.arrToString(["We", "Are", "the", "World!"], "We.Are.the.World!"))
})

test("briefString", () => {
    expect(cUtils.briefString("Hello, this is a test for briefString!", 8)).toBe("Hell...ing!")
})

test("numToLocaleFixed", () => {
    expect(cUtils.numToLocaleFixed(120.1234, 2)).toBe("120.12")
})
