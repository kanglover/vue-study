
import {Dep} from './dep';

function defineReactive(obj, key, val) {
    // 订阅器
    const dep = new Dep();

    // val 为对象的话，需要递归处理
    observer(val);

    Object.defineProperty(obj, key, {
        get() {
            Dep.target && dep.depend(Dep.target);
            return val;
        },
        set(newVal) {
            if (newVal !== val) {
                val = newVal;
                // 同理，如果 set 的 val 值为对象，也需要递归处理
                observer(val);
                dep.notify();
            }
        }
    });
}


class Observer {
    constructor(value) {
        if (isArray(value)) {

        }
        else {
            this.walk(value);
        }
    }

    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key]);
        });
    }
}

export function observe(obj) {
    if (typeof obj !== 'object' || obj == null) {
        return obj;
    }

    return new Observer(obj);
}


export function set() {}
export function del() {}