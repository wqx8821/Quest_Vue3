var VueReactivity = (function (exports) {
  'use strict';

  function effect() {
  }

  function isObject(value) {
      return value instanceof Object && value !== null;
  }

  // 引入判断是否为对象的 方法
  // 抽离proxy代理内部参数
  const mutableHandles = {
      // 1.操作的对象 2.具体的属性 3.代理本身
      get(target, key, receiver) {
          if (key === "__v_isReactive" /* IS_REACTIVE */) {
              return true;
          }
          // 读取时，就可以收集在那个Reflect中
          const res = Reflect.get(target, key, receiver);
          return res;
      },
      // 1.操作的对象 2.操作的属性 3.修改为的值 4.代理本身
      set(target, key, value, receiver) {
          // 修改值就可以驱动进行更新
          const res = Reflect.set(target, key, value, receiver); // 给目标对象属性key赋值 值为value
          return res;
      }
  };
  // 映射表 处理已经是响应式的数据，是响应式的就可以直接返回
  const reactiveMap = new WeakMap(); // WeakMap 弱引用，键必须为key，key没有被引用会自动回收
  // 工厂函数
  function createReactiveObject(target) {
      // reactive只针对对象
      if (!isObject(target)) {
          return target;
      }
      // 判断是否已经代理过，代理过就直接返回
      if (target["__v_isReactive" /* IS_REACTIVE */]) {
          return target;
      }
      // 如果已经存在代理 就直接返回这个代理
      const existingProxy = reactiveMap.get(target);
      if (existingProxy) {
          return existingProxy;
      }
      // 是对象就进行proxy代理 进行数据劫持
      const proxy = new Proxy(target, mutableHandles);
      // 源对象与代理对象创建出映射表
      reactiveMap.set(target, proxy);
      // 返回代理
      return proxy;
  }
  // 导出 reactive
  function reactive(target) {
      return createReactiveObject(target);
  }

  exports.effect = effect;
  exports.reactive = reactive;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
//# sourceMappingURL=reactivity.global.js.map
