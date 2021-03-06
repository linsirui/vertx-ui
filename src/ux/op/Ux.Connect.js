import E from "../Ux.Error";
import U from "underscore";
import M from '../monitor';
import Value from '../Ux.Value';

/**
 * 窗口onOk连接在函数，连接Html元素并设置onOk的触发器
 * @method connectButton
 * @param dialog 传入的dialog窗口配置
 */
const connectDialog = (dialog = {}) => {
    if ("string" === typeof dialog.onOk) {
        // 防止引用切换，必须使用Immutable
        const key = Value.clone(dialog);
        // Monitor连接部分代码
        M.writePointer(dialog, key.onOk);
        dialog.onOk = () => connectId(key.onOk);
    } else {
        // 防重复注入
        E.fxWarning(!U.isFunction(dialog.onOk), 10016, dialog.onOk);
    }
};

/**
 * 链接某个ID的元素
 * @param id
 */
function connectId(id) {
    const ele = document.getElementById(id);
    E.fxWarning(!ele, 10015, id);
    if (ele) {
        M.Logger.connect(id);
        ele.click();
    }
}

export default {
    // 连接
    connectButton: connectDialog,
    connectDialog,
    connectId,
};