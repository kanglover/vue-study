/**
 * Virtual DOM implementation based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * with custom modifications.
 */

import createPatchFunction from './patch';
// TODO
import _class from './modules/class';
import style from './modules/style';
import props from './modules/props';
import attrs from './modules/attrs';
import events from './modules/events';

// 创建patch函数
const patch = createPatchFunction([
    _class,
    props,
    style,
    attrs,
    events
]);

export {
    patch
};