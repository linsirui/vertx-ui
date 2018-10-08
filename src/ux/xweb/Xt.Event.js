import E from '../Ux.Error';
import U from 'underscore';
import Value from '../Ux.Value';
import Filter from './Xt.Filter';
import Dust from './Xt.Dust';
import Util from '../util';
import moment from 'moment';

const xtChange = (reference, changedValues = {}, key) => {
    const {onChange} = reference.props;
    // 10095规范：传入的自定义控件中没有onChange的函数
    E.fxFatal(!U.isFunction(onChange), 10095, onChange);
    // 专用于Array类型的onChange处理，生成新的newValue
    if (key) {
        // Array类型处理变更数据信息
        onChange(changedValues);
    } else {
        // 0.非Array类型
        let newValue = Object.assign({}, reference.state, changedValues);
        // 1.拷贝新数据
        newValue = Value.clone(newValue);
        // 2.过滤特殊数据
        newValue = Filter.xtFilter$(newValue);
        // 3.变更数据处理
        onChange(newValue);
    }
};

const xt2Change = (reference, field) => (event) => {
    // 1.读取Input数据
    const state = Dust.xtGet(reference, field, () => event.target ? event.target.value : undefined);
    // 2.更新状态
    reference.setState(state);
    // 3.调用内置的onChange专用事件
    xtChange(reference, state);
};
const xt2Blur = (reference, field) => (event) => {
    const {onBlur} = reference.props;
    if (U.isFunction(onBlur)) {
        onBlur(event);
        // 二次绑定处理
        xt2Change(reference, field)(event);
    }
};

const _xtValue = (input, normalize = data => data) => {
    let value = undefined;
    if (U.isFunction(input.preventDefault)) {
        input.preventDefault();
        value = input['target'] ? input['target'].value : undefined;
    } else {
        // 时间格式专用处理
        if (moment.isMoment(input)) {
            value = input.toISOString();
        } else {
            value = input;
        }
    }
    return normalize(value);
};

const xt2ChangeUnit = (reference, {
    index, field, key = "data",
    normalize = data => data,
}) => (event) => {
    const value = _xtValue(event, normalize);
    // 1.读取数据源 source为默认值
    let source = reference.state ? reference.state[key] : [];
    if (U.isArray(source)) {
        // 2.新处理数据源，取得新的key值
        if (!source[index]) {
            source[index] = {key: Util.randomUUID()};
        }
        source[index][field] = value;
    }
    source = Value.clone(source);
    // 3.状态更新
    const state = {};
    state[key] = source;
    reference.setState(state);
    // 4.调用本地的onChange
    xtChange(reference, source, key);
};
export default {
    xtChange,
    // 生成事件
    xt2Change,
    xt2Blur,
    // 核心列变更事件
    xt2ChangeUnit
};