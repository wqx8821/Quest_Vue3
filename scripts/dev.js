// 引入解析参数模块
const minimist = require('minimist');
// execa是可以调用shell和本地外部程序的javascript封装。会启动子进程执行
const execa = require('execa');


// 拿到脚本数据处理 (忽略前两个，前两个为node执行命令， 后面的才是需要的参数)
// process.argv 属性返回数组，其中包含启动 Node.js 进程时传入的命令行参数
const args = minimist(process.argv.slice(2));
// 根据参数拿到 目标文件名, 打包方式, sourcemap
const target = args._.length ? args._[0] :'reactivity';
const sourcemap = args.s || false;
const formats = args.f || 'global'


// 打包 内部开启进程执行
// 指定执行的脚本 rollup
execa('rollup', [
  '-wc', // ---watch --config 可以使用配置文件（建立rollup.config.js） 并能观测变化
  '--environment', // 传入环境变量
  [
    `TARGET: ${target}`,
    `FORMATS: ${formats}`,
    sourcemap ? 'SOURCE_MAP' : ''
  ].filter(Boolean).join(',')
], {
  stdio: 'inherit' // 子进程的输出是在我们的当前的命令行中输出
})


// 测试
// console.log(args);