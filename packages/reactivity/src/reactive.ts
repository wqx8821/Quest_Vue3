// 引入判断是否为对象的 方法
import {isObject} from '@vue/shared'
import { stack } from './effect';

// 用来标识是否已经是响应式的
const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive"
}

// 抽离proxy代理内部参数
const mutableHandles:ProxyHandler<Record<any, any>> = {
  // 1.操作的对象 2.具体的属性 3.代理本身
  get(target, key, receiver) {
    if(key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    stack(target, key); // 依赖收集
    // 读取时，就可以收集在那个Reflect中
    const res = Reflect.get(target, key, receiver)
    return res;
  },
  // 1.操作的对象 2.操作的属性 3.修改为的值 4.代理本身
  set(target, key, value, receiver) {
    // 修改值就可以驱动进行更新

    const res = Reflect.set(target, key, value, receiver) // 给目标对象属性key赋值 值为value
    return res;
  }
}

// 映射表 处理已经是响应式的数据，是响应式的就可以直接返回
const reactiveMap = new WeakMap(); // WeakMap 弱引用，键必须为key，key没有被引用会自动回收



// 工厂函数
function createReactiveObject(target: object){
  // reactive只针对对象
  if(!isObject(target)) {
    return target
  }
  // 判断是否已经代理过，代理过就直接返回
  if((target as any)[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }


  // 如果已经存在代理 就直接返回这个代理
  const existingProxy = reactiveMap.get(target)
  if(existingProxy) {
    return existingProxy
  }

  // 是对象就进行proxy代理 进行数据劫持
  const proxy = new Proxy(target,mutableHandles)
  // 源对象与代理对象创建出映射表
  reactiveMap.set(target, proxy)


  // 返回代理
  return proxy
}

// 导出 reactive
export function reactive(target:object) {
  return createReactiveObject(target)
}