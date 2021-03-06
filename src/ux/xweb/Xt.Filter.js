import Value from '../Ux.Value';
import E from "../Ux.Error";

const xtToValue = (values = {}) => {
    const filteredValue = {};
    Object.keys(values)
        .filter(key => !key.startsWith("$"))
        .forEach(key => filteredValue[key] = values[key]);
    return filteredValue;
};
const IGNORE_KEYS = Value.immutable(["reference", "fnOut"]);
const xtToProp = (reference = {}) => {
    E.fxTerminal(!reference, 10049, reference);
    const result = {};
    Object.keys(reference.props).filter(key => !IGNORE_KEYS.contains(key))
        .forEach(item => result[item] = reference.props[item]);
    return result;
};
export default {
    xtToValue,
    xtToProp
};