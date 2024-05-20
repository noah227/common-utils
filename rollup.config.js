import {nodeResolve} from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import {terser} from "rollup-plugin-terser";

const path = require("path")

const defaultPlugins = [
    nodeResolve(),
    typescript({
        sourceMap: false,
    }),
    commonjs(),
]
const createExport = (input, output, plugins = []) => ({
    input, output, plugins: [...defaultPlugins, ...plugins]
})
const exportList = [
    [
        path.resolve("./src/index.ts"),
        {
            file: "./dist/index.js",
            format: "es"
        }
    ],
    [
        path.resolve("./src/index.ts"),
        {
            file: "./dist/index.min.js",
            format: "es"
        },
        [terser()]
    ],
    [
        path.resolve("./src/index.ts"),
        {
            file: "./dist/index.cjs.js",
            format: "cjs",
            exports: "named"
        }
    ],
]
export default exportList.map(config => createExport(...config))
