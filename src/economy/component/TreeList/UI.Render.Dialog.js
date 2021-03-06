import {Button, Popover, Tooltip} from "antd";
import './Cab.less';
import Act from "./op/Op.Act";
import Is from './op/Op.Is';
import React from "react";
import Ux from "ux";
import Fn from "../../_internal/Ix.Fn";

const renderClose = (reference, item, title) => {
    return (
        <span className={"web-tree-popover-title"}>
            <span>{title ? title : false}</span>
            <Button icon={"close"} type={"danger"} shape={"circle"}
                    onClick={Act.rxCloseDialog(reference, item)}/>
        </span>
    );
};

const _calcPosition = (config = {}) => {
    const index = config._index;
    const size = config._size;
    if ("number" === typeof index
        && "number" === typeof size) {
        if (index >= (size - 4)) {
            return "rightBottom";
        } else if (index < 4) {
            return "rightTop";
        } else {
            return "right";
        }
    } else {
        return "right";
    }
};
const renderAdd = (reference, config = {}, item) => {
    const isDialog = Is.isDialog(reference, item);
    if (isDialog) {
        const {$formTreeAdd: Form} = reference.props;
        const position = _calcPosition(config);
        // 「LIMIT」限制继承
        const inherits = Ux.toLimitation(reference.props, Fn.Limit.TreeList.Form);
        return (
            <Popover content={
                <div className={"inner-form"}>
                    <Form {...inherits}
                          fnClose={() => Act.rxClose(reference, item)}/>
                </div>}
                     placement={position}
                     visible={Is.isVisible(reference, item)}
                     title={renderClose(reference, item,
                         config.over.add.title)}>
                {renderAddButton(Act.rxAddDialog(reference, item))}
            </Popover>
        );
    } else {
        return (
            <Tooltip {...config.over.add}>
                {renderAddButton(Act.rxPreAdd(reference, item))}
            </Tooltip>
        );
    }
};
const renderEdit = (reference, config = {}, item) => {
    const isDialog = Is.isDialog(reference, item);
    if (isDialog) {
        const {$formTreeEdit: Form} = reference.props;
        const position = _calcPosition(config);
        // 「LIMIT」限制继承
        const inherits = Ux.toLimitation(reference.props, Fn.Limit.TreeList.Form);
        return (
            <Popover content={
                <div className={"inner-form"}>
                    <Form {...inherits}
                          $inited={item}
                          fnClose={() => Act.rxClose(reference, item)}/>
                </div>}
                     placement={position}
                     visible={Is.isVisible(reference, item, false)}
                     title={renderClose(reference, item,
                         config.over.edit.title)}>
                {renderEditButton(Act.rxEditDialog(reference, item))}
            </Popover>
        );
    } else {
        return (
            <Tooltip {...config.over.edit}>
                {renderEditButton(Act.rxPreEdit(reference, item))}
            </Tooltip>
        );
    }
};

const renderEditButton = (onClick) => (
    <Button icon={"edit"} shape={"circle"} size={"small"}
            className={"web-tree-addon"}
            onClick={onClick}/>
);
const renderAddButton = (onClick) => (
    <Button icon={"plus"} shape={"circle"} size={"small"}
            className={"web-tree-addon"}
            onClick={onClick}/>
);
export default {
    renderAdd,
    renderEdit
};