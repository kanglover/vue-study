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
    
    if (typeof tag === 'string') {
        /* 更细粒度的判断，见源码
        if (config.isReservedTag(tag)) {
            vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
        } else if (
          (!data || !data.pre) &&
          isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
        ) {
          // component
          vnode = createComponent(Ctor, data, context, children, tag)
        } else {
          vnode = new VNode(tag, data, children, undefined, undefined, context)
        }
        */
        vnode = new VNode(tag, data, children, undefined, undefined, context)
    } else {
        // createComponent 构造 Vue 的子类，执行 Vue 实例初始化逻辑（this._init）。安装组件钩子函数，实例化 vnode 并返回（组件 vnode 是没有 children）。
        vnode = createComponent(tag as any, data, context, children)
    }
    return vnode;
}
