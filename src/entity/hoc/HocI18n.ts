import {Langue} from "environment";
import * as U from 'underscore';
import * as Immutable from 'immutable';
import HocContainer from "./HocContainer";

class HocI18n implements HocContainer {
    private hoc: any = {};
    private ready: boolean = false;
    private lg: any = {};
    private props: any = {};

    constructor(name: String, hoc: Object) {
        this.lg = Langue(name);
        this.hoc = hoc;
        this.ready = true;
    }

    is(): boolean {
        return this.ready;
    }

    mergeVector(path, key, value) {
        if (this.ready && U.isArray(path) && value) {
            let $hoc = Immutable.fromJS(this.lg);
            // 修正第一路径
            if (path[0] && !path[0].startsWith("_")) {
                path[0] = `_${path[0]}`;
            }
            // 直接设置该路径的值
            let $target = $hoc.getIn(path);
            if ($target && $target.toJS) {
                $target = $target.toJS();
                if ("object" === typeof value) {
                    // 遍历value
                    for (const field in value) {
                        if ($target.hasOwnProperty(field)) {
                            const ref = $target[field];
                            if (ref) {
                                // 最终设值
                                ref[key] = value[field];
                            }
                        }
                    }
                    $hoc = $hoc.setIn(path, $target);
                }
            } else {
                console.error("[ZI] This method require your hit node must be object/array.");
            }
            this.lg = $hoc.toJS();
        }
    }

    to(): any {
        let ret = {};
        if (this.hoc) {
            // TODO: 合并Hoc
        }
        Object.assign(ret, this.lg);
        return ret;
    }

    _(key: string): any {
        let targetKey = key;
        if (!key.startsWith("_")) {
            targetKey = `_${key}`;
        }
        if (this.lg) {
            return this.lg[targetKey];
        }
    }

    bind(props: any): HocI18n {
        this.props = props;
        return this;
    }
}

export default HocI18n;
