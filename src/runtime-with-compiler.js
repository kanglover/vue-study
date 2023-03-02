import Vue from './core/index';
import {compile} from './compiler/index';


const mount = Vue.prototype.$mount;

Vue.prototype.$mount = function (el) {
    const options = this.$options;
    // 模版字符串 => AST语法树 => render函数
    if (!options.render) {
        let template = options.template;
        if (template) {
            if (typeof template === 'string') {
                if (template.charAt(0) === '#') {
                    template = document.querySelector(template).innerHTML;
                }
            }
            else if (template.nodeType) {
                template = template.innerHTML;
            }
            else {
                console.warn('invalid template option:' + template, this);
            }
        }
        else {
            template = getOuterHTML(el);
        }


        // AST => render => VNode
        options.render = compile(template, {
            // 传入 options，这里省略... 细节看源码
            // baseOptions: src/platforms/web/compiler/options.ts
            // finalOptions: src/compiler/create-compiler.ts
        });
    }
    // 调回 instance/index 挂载的方法执行 mountComponent
    mount.call(this, el);
};

function getOuterHTML(el) {
    if (el.outerHTML) {
        return el.outerHTML;
    }
    else {
        const container = document.createElement('div');
        container.appendChild(el.cloneNode(true));
        return container.innerHTML;
    }
}

Vue.compile = compile;
export default Vue;
