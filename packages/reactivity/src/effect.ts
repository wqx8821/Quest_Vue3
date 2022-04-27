
let effectStack:any = []; // 保证effect执行时 可以存储正确的关系 （因为会有嵌套的情况）
let activeEffect;
// 定义一个类 来让 effec 记录依赖了那些属性 同时记录当前属性依赖了那个 effect
class ReactiveEffect { 
  active = true; // 是否是激活状态
  deps = []; // 记录依赖
  constructor(public fn: any) {

  }
  run() { // 调用run的时候 让fn执行
    if(!this.active) { // 不是激活状态就 直接执行 fn
      return this.fn();
    }

    try {
      effectStack.push(activeEffect = this) // 标记effect
      return this.fn(); // 取值 会触发 Proxy get() 依赖收集
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  }
}

export function stack(target, key) {

}

// 默认传入函数 并转为响应式的对象
export function effect(fn: any): void {
  const _effect = new ReactiveEffect(fn);

  _effect.run()
}