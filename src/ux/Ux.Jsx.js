import React from 'react';
import Norm from './Ux.Normalize';
import Prop from './prop/Ux.Prop';
import Value from './Ux.Value';
import Log from './monitor/Mt.Logger';
import E from './Ux.Error';
import {Form} from 'antd';
// UI专用渲染方法
import DFT from './jsx/Ux.Jsx.Default';
import fieldRender from './jsx/Ux.Jsx.Single';
import View from './jsx/Ux.Jsx.View.Fn';
import Op from './jsx/Ux.Jsx.Op';
// Raft
import Raft from './Ux.Form';
import U from 'underscore';

/**
 * 仅渲染交互式组件，Grid布局
 * @method jsxFieldGrid
 * @param {React.PureComponent} reference React对应组件引用
 * @param renders 每个字段不同的render方法
 * @param column 当前Form的列数量
 * @param values Form的初始化值
 * @param config Form相关配置项
 * @return {boolean}
 */
const jsxFieldGrid = (reference = {}, renders = {}, column = 4, values = {}, config = {}) => {
    // Fix Issue
    if (!values) values = {};
    const {key = "form"} = config;
    const form = Norm.extractForm(reference, key);
    const configData = {form};
    Object.assign(configData, config);
    const jsx = fieldRender.jsxRow(reference, renders, column, values, configData);
    // 关闭日志
    Log.render(3);
    return jsx;
};
/**
 * 渲染某个子表单的Page页
 * @method jsxFieldPage
 * @param {React.PureComponent} reference React对应组件引用
 * @param renders 每个字段不同的render方法
 * @param column 当前Form的列数量
 * @param config Form的初始化配置
 * @param values 读取的初始值
 * @return {boolean}
 */
const jsxFieldPage = (reference, renders, column = 4, values, config = {}) =>
    _uiForm(reference, config, column, values, (processed, $config = {}) => {
        // 两列修正
        const {window} = $config;
        if (0.5 === window) column = 2;
        return jsxFieldGrid(reference, renders, column, processed, $config);
    });
const jsxExtension = (reference, renders, column = 4, values, config = {}) =>
    _uiForm(reference, config, column, values, (processed, $config = {}) => {
        // 两列修正
        const {window} = $config;
        if (0.5 === window) column = 2;
        return jsxFieldGrid(reference, renders, column, processed, $config);
    }, true);
/**
 * window的合法值
 * 1：标准布局
 * 1/3：搜索栏专用值
 * 0.4：宽Label专用值
 */
const _uiForm = (reference, config = {}, column, values, callback, disableRaft) => {
    // Raft桥接
    const {raft = {}} = reference.state;

    // raft.enabled = false;
    // extension部分必须disableRaft
    if (raft.enabled && !disableRaft) {
        // 兼容旧代码专用，对于$button的专用插入模式，在Raft之后接入，动态Op
        if (config.renders && config.renders.hasOwnProperty("$button")) {
            raft.rows.forEach(row => row.cells
                .filter(cell => "$button" === cell.field)
                .forEach(cell => cell.render = config.renders.$button));
        }
        return Raft.raftJsx(reference, values, config);
    } else {
        const {key = "form"} = config;
        const form = Prop.fromHoc(reference, key);
        if (form) {
            // 初始化值信息
            if (!values) values = DFT.uiInited(reference);
            // 在values中追加前缀
            const window = form.window ? form.window : 1;
            const $config = window ? {...config, window} : config;
            // 打印信息，开始
            Log.render(1, $config, key);
            // Error信息
            if (0.5 === window && 2 !== column) {
                // 两列专用布局验证
                return E.fxFailure(10011, column);
            } else {
                // 两列修正
                return callback(values, $config, form);
            }
        } else {
            return E.fxFailure(10012, key);
        }
    }
};
const uiFieldForm = (reference = {}, renders = {}, column = 4, values, config = {}) =>
    _uiForm(reference, {
        ...config,
        renders,
    }, column, values, (processed, $config = {}, form) => {
        // 两列修正
        const {window} = $config;
        if (0.5 === window) column = 2;
        const className = form.className ? form.className : "web-form";
        return (
            <Form layout={"inline"} className={className}>
                {jsxFieldGrid(reference, renders, column, processed, $config)}
            </Form>
        );
    });
const uiFieldFilter = (reference = {}, renders = {}, column = 2, values, config = {}) =>
    _uiForm(reference, {
        ...config,
        renders,
    }, column, values, (processed, $config = {}, form) => {
        // 两列修正
        const {window} = $config;
        if (0.5 === window) column = 2;
        const {$page} = reference.props;
        const page = Value.valueUnit($page);
        const className = form.className ? form.className : "page-filter";
        const win = Value.mathMultiplication(window, page);
        return (
            <Form layout={"inline"} className={className}>
                {jsxFieldGrid(reference, renders, column, processed, {
                    ...$config, window: win,
                    rowHeight: 64
                })}
            </Form>
        );
    });

const jsxCell = (Element, attrs = {}, text) => {
    if (text && U.isObject(text)) {
        // 是否包含了colSpan和className
        const obj = {props: {}};
        if (text.hasOwnProperty('colSpan')) {
            obj.props.colSpan = text.colSpan;
        }
        // 等于0的时候直接就不计算了
        if (0 < obj.props.colSpan) {
            const {className = "", value} = text;
            obj.children = (
                <span className={className}>
                    <Element {...attrs} value={value}/>
                </span>
            );
        }
        return obj;
    } else {
        // 纯渲染
        attrs.value = text;
    }
    return (<Element {...attrs}/>);
};
/**
 * @class Jsx
 * @description 字段专用输出函数
 */
export default {
    uiForm: _uiForm,
    // Form专用
    uiFieldForm,
    uiFieldFilter,
    // -------------- 以上为Form内置 ---------------
    ...View,
    // -------------- 以上为View内置 ---------------
    ...Op,
    // -------------- 以上为Op内置 -----------------
    ...fieldRender,
    // -------------- 以上是专用单组件处理 ----------
    /**
     * 登录页这种单列布局使用
     * 配置文件格式【一维数组】
     * "_form":{
     *     "ui":[
     *         {
     *         }
     *     ]
     * }
     */
    jsxFieldRow: fieldRender.jsxItem,
    // 单个字段的渲染
    jsxField: fieldRender.jsxItem,
    /**
     * Grid布局使用
     * 配置文件格式【二维数组】
     * "_form":{
     *     "ui":[
     *         [
     *              {
     *              }
     *         ]
     *     ]
     * }
     */
    jsxFieldGrid,
    // 渲染子表单专用，可根据Form的key渲染子表单，field且不一样
    jsxFieldPage,
    jsxExtension,
    jsxCell,
    // 计算动态Renders
    calcRenders: DFT.uiRender
};
