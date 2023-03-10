import VNode from './vnode';
import {
    isPrimitive,
    isArray
} from '../util/index';

export function createElement(context, tag, data, children) {
    if (isArray(children)) {
        let _children = children;
        children = [];
        for (let i = 0, l = _children.length; i < l; i++) {
            let e = _children[i];
            // flatten nested
            if (isArray(e)) {
                for (let j = 0, k = e.length; j < k; j++) {
                    if (e[j]) {
                        children.push(e[j]);
                    }
                }
            } else if (isPrimitive(e)) {
                // convert primitive to vnode
                children.push(VNode(undefined, undefined, undefined, e));
            } else if (e) {
                children.push(e);
            }
        }
    }
    return VNode(tag, data, children, undefined, undefined, context);
}
