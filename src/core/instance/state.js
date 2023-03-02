
import {observe, set, del} from '../observer/index';

function proxy(target, sourceKey, key) {
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter() {
            return target[sourceKey][key];
        },
        set: function proxySetter(newVal) {
            target[sourceKey][key] = newVal;
        }
    });
}

export function initState(vm) {
    const opts = vm.$options
    if (opts.props) {
        initProps(vm, opts.props);
    }

    if (opts.methods) {
        initMethods(vm, opts.methods);
    }

    if (opts.data) {
        initData(vm);
    }
    else {
      const ob = observe((vm._data = {}))
      ob && ob.vmCount++
    }

    if (opts.computed) {
        initComputed(vm, opts.computed)
    }

    if (opts.watch) {
      initWatch(vm, opts.watch)
    }
}

function initData(vm) {
    const data = vm.$options.data;
    const keys = Object.keys(data);
    // 实现 vm.xxx -> vm._data.xxx
    keys.forEach(key => {
        proxy(vm, '_data', key);
    });

    // data 响应式
    observe(data);
}

function initComputed(vm) {
    var computed = vm.$options.computed;
    if (typeof computed === 'object') {
        Object.keys(computed).forEach(key => {
            Object.defineProperty(vm, key, {
                configurable: true,
                enumerable: true,
                get: typeof computed[key] === 'function'
                        ? computed[key]
                        : computed[key].get,
                set: function() {}
            });
        });
    }
}

function initWatch(vm, watch) {
    for (const key in watch) {
        const handler = watch[key]
        if (isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        }
        else {
            createWatcher(vm, key, handler)
        }
    }
}


function createWatcher(
    vm,
    expOrFn,
    handler,
    options
) {
    if (typeof handler === 'string') {
        handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options);
}


export function stateMixin(Vue) {
    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;
    Vue.prototype.$watch = function (
        expOrFn,
        cb,
        options
    ) {
        const vm = this;
        const watcher = new Watcher(vm, expOrFn, cb, options)
    }
}
