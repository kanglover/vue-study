import Watcher from '../observer/watcher'
import {patch} from '../vdom';

export function initLifecycle(vm) {
    const options = vm.$options;

    let parent = options.parent;
    if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
            parent = parent.$parent;
        }
        parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._provided = parent ? parent._provided : Object.create(null);
    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
}

export function mountComponent(vm, el) {
    callHook(vm, 'beforeMount');
    vm.$el = el

    const updateComponent = () => {
        // 先调用 render.js 中的 _render 方法，生成 vnode
        // 然后调用 update 进行 patch
        vm._update(vm._render(), hydrating);
    }

    // 监听会触发 updateComponent 方法
    new Watcher(
        vm,
        updateComponent,
        () => {}
    );

    callHook(vm, 'mounted')
    return vm;
}

export function lifecycleMixin() {
    // 先写在这里
    Vue.prototype.__patch__ = patch;


    Vue.prototype._update = function (VNode) {
        callHook(this, 'beforeUpdate')
        this._vnode = vnode;

        if (!this._tree) {
            this.$el = this.__patch__(this.$el, VNode)
        } else {
            this.$el = this.__patch__(this._tree, VNode)
        }
        callHook(this, 'updated')
    }

    Vue.prototype.$forceUpdate = function () {
        const vm = this
        if (vm._watcher) {
            vm._watcher.update()
        }
    }

    Vue.prototype.$destroy = function () {
        const vm = this
        if (vm._isBeingDestroyed) {
            return
        }
        callHook(vm, 'beforeDestroy')
        vm._isBeingDestroyed = true
        const parent = vm.$parent
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
            remove(parent.$children, vm)
        }

        vm._isDestroyed = true
        vm.__patch__(vm._vnode, null)
        callHook(vm, 'destroyed')
        vm.$off()
    }
}



export function callHook(vm, hook) {
    vm.$emit('pre-hook:' + hook)
    var handlers = vm.$options[hook]
    if (handlers) {
        for (var i = 0, j = handlers.length; i < j; i++) {
            handlers[i].call(vm)
        }
    }
    vm.$emit('hook:' + hook)
}