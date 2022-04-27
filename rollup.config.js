import path from 'path';


// 获取 script/dev.js 内的配置文件 通过环境变量拿
const packagesFrom = process.env.FORMATS.trim()?.split(',');
const sourcemap = process.env.SOURCE_MAP;
const target = process.env.TARGET.trim();

// 需要根据 target 找到要打包的对象
const packagesDir = path.resolve(__dirname, 'packages') // packages的绝对路径
const packageDir = path.resolve(packagesDir, target) // 要打包的目录
const name = path.basename(packageDir) // 获取打包的名字
// 以打包的目录解析文件
const resolve = p => path.resolve(packageDir, p)

const pkg = require(resolve('package.json'))

// 打包配置
const outputConfig = {
  'esm-bundler': {
    file:resolve(`dist/${name}.esm-bundler.js`),
    format: 'es'
  },
  'cjs': {
    file:resolve(`dist/${name}.cjs.js`),
    format: 'cjs'
  },
  'global': {
    file:resolve(`dist/${name}.global.js`),
    format: 'iife'
  }
}

const packageConfigs = packagesFrom || pkg.buildOptions.formats

console.log(packageConfigs);
import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'


// 生成配置文件
function createConfig(format, output) {
  output.sourcemap = sourcemap
  output.exports = 'named' // 开启命名
  let external = []  // 外部模块 哪些模块不需要打包
  if(format === 'global') { // 是全局是就加上名字
    output.name = pkg.buildOptions.name
  } else {
    external = [...Object.keys(pkg.dependencies)]
  }
  return {
    input: resolve('src/index.ts'),
    output,
    external,
    plugins: [
      ts(),
      json(),
      commonjs(),
      nodeResolve(),
    ],
  }
}

// 返回数组会依次打包
export default packageConfigs.map(format => createConfig(format,outputConfig[format]))

// console.log(outputConfig);