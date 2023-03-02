import {parse} from './parser/index';
import {generate} from './codegen/index'

// 简单实现下，主要参考 src/compiler
export function compile(template, options) {
    const ast = parse(template.trim(), options)
    if (options.optimize !== false) {
        optimize(ast, options);
    }
    const render = generate(ast, options);
    return {
        ast,
        render
    }
}
