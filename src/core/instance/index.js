import {initMixin} from './init';
import {stateMixin} from './state';
import {lifecycleMixin} from './lifecycle';
import {renderMixin} from './render';

export default function Vue(options) {
    this._init(options);
}

// _init 方法
initMixin(Vue);
stateMixin(Vue);
// _update、destroy 方法
lifecycleMixin(Vue);
// _render 方法
renderMixin(Vue)
