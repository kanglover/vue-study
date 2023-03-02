import {mountComponent, callHook} from './lifecycle';
import {initRender} from './render';
import {initState} from './state';

export function initMixin(Vue) {
    /**
     * 初始化过程数据劫持最重要的两个步骤：
     * initState => 对 data 数据进行响应式绑定
     * mount => Compile 阶段订阅数据变化（new watch），绑定更新函数（update）
     */
    Vue.prototype._init = function () {
        const vm = this;
        // initProxy(vm);
        initLifecycle(vm);
        initEvents(vm);
        initRender(vm);
        callHook(vm, 'beforeCreate');
        // initInjections(vm);
        // 劫持数据
        initState(vm);
        // initProvide(vm);
        callHook(vm, 'created');

        if (vm.$options.el) {
            // runtime-with-compiler 中声明
            vm.$mount(vm.$options.el);
        }
    };

    // AST时compiler中把模板编译成有规律的数据结构，方便转换成render函数所存在的；而VNode是优化DOM操作的，减少频繁DOM操作的，提升DOM性能的。
    Vue.prototype.$mount = function (el) {
        mountComponent();
    }
}