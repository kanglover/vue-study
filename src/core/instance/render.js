import {createElement} from '../vdom/create-element'

/**
 * render 方法，即 createElement
 */
export function initRender(vm) {
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
    vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
}


export function renderMixin(Vue) {
    // AST + DATA => VNode
    Vue.prototype._render = function () {
        const {render, _parentVnode} = vm.$options;
        // 调用 render（_c => createElement） 方法生成 vnode
        vnode = render.call(vm._renderProxy, vm.$createElement);

        return vnode;

    }
}
