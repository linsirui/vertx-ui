import U from "underscore";
// 包导入
import Random from "../../util/";
import Prop from '../../prop';
// 文件导入
import Expr from "../expr/AI.Expr.String";
import E from "../../Ux.Error";
import Type from '../../Ux.Type';
import Value from '../../Ux.Value';
import Aid from './AI.RxAnt.Aid';

const _parseData = (reference, config = {}) => {
    // 源头
    let value = null;
    if ("form" === config.source) {
        value = Prop.formGet(reference, config.field);
    } else {
        // TODO: 其他读取数据方式
    }
    if ("integer" === config.type) {
        value = Value.valueInt(value);
    } else if ("decimal" === config.type) {
        value = Value.valueFloat(value);
    }
    return value;
};

const parseFilter = (reference, filter = () => true) => {
    let filters;
    if (U.isFunction(filter)) {
        // 直接返回过滤函数
        filters = filter;
    } else if ("string" === typeof filter) {
        // 通过过滤条件进行过滤
        filters = {};
        const processed = Expr.aiExprFilter(filter);
        if (!processed.type) processed.type = "string";
        if (processed.field) {
            if (!processed.cond) processed.cond = processed.field;
            delete processed.key;
            const value = _parseData(reference, processed);
            if (undefined !== value) {
                filters[processed.cond] = value;
            }
        }
    }
    return filters;
};

const parseExpr = (expr = "") => {
    const item = expr.replace(/ /g, '');
    const kv = item.split(',');
    const attr = {};
    kv.forEach(keyValue => {
        const key = keyValue.split('=')[0];
        attr[key] = keyValue.split('=')[1];
    });
    if (!attr.hasOwnProperty('key')) {
        attr.key = Random.randomString(12);
    }
    return attr;
};

const parseDatum = (config = {}) => {
    let meta = config.datum;
    if ("string" === typeof config.datum) {
        meta = parseExpr(config.datum);
    }
    return meta;
};

/**
 * 过滤器处理
 * @param reference
 * @param config 配置信息
 * @param filter
 */
const getDatum = (reference, config = {}, filter = () => true) => {
    let options = [];
    // 如果存在datum节点，则从Assist/Tabular数据源中读取
    const {source} = parseDatum(config);
    if (source && "string" === typeof source) {
        let data = [];
        const processed = parseFilter(reference, filter);
        E.fxTerminal(!U.isArray(data), 10043, source);
        if (U.isFunction(processed)) {
            data = Type.elementFindDatum(reference, source, {});
            data = data.filter(processed);
        } else {
            let filterData = {};
            if (processed && 0 < Object.keys(processed).length) {
                // 包含了Filter信息
                Object.assign(filterData, processed);
            }
            data = Type.elementFindDatum(reference, source,
                0 < Object.keys(filterData).length ? filterData : {});
        }
        // 将data赋值给options
        options = data;
    } else {
        E.fxTerminal(true, 10044, source);
    }
    return options;
};

const getSource = (reference, config, filter = {}) => {
    let options = [];
    if (config.items) {
        // 如果存在根节点，则直接items处理
        options = Expr.aiExprOption(config.items);
    } else if (config.datum) {
        // 如果存在datum节点，则从assist/tabular数据源中读取
        options = getDatum(reference, config, filter);
        const datum = parseDatum(config);
        // 处理config中核心的expr节点
        options.forEach(each => Aid.applyItem(each, datum, config.expr));
    }
    // 执行value的处理：value = key：如果key存在而value不存在
    Aid.applyValue(options);
    // 统一抽取expr表达式
    return options;
};
const parseOrigin = (items = [], config = {}) => {
    const {expr, ...rest} = config;
    const options = [];
    items.forEach(item => {
        const option = Aid.applyItem(item, rest, expr);
        options.push(option);
    });
    return options;
};
export default {
    parseExpr,
    parseDatum,
    parseFilter,
    parseOrigin,
    getDatum,
    getSource,
};