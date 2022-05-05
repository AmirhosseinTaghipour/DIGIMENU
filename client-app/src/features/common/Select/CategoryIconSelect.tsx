import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Select } from 'antd';
import { toDatabaseChar, ListIsNullOrEmpty } from '../../../app/common/util/util';
import { CheckOutlined } from '@ant-design/icons';
import { IComboBoxType, ISelectHandlerType } from '../../../app/models/common';

interface IProps {
    name: string;
    selectHandler: (input: ISelectHandlerType) => void;
    mode : "multiple" | "tags" | undefined;
}
export const CategoryIconSelect:React.FC<IProps> = ({name,selectHandler,mode}) => {
    return (
        null
        // <Select
        //     mode={mode}
        //     showSearch
        //     style={{
        //         width: "100%",
        //     }}
        //     loading={loadingTestWay}
        //     onChange={(values: string[] | string) => {

        //         if (Array.isArray(values)) {
        //             setCtrlValues(values)
        //             map.set(propertyName, !!values ? values.length > 0 ? values.join(",") : null : null);
        //         } else {
        //             setCtrlValues([values])
        //             map.set(propertyName, !!values ? values.length > 0 ? values : null : null);
        //         }

        //         const updatedObjesct = Object.fromEntries(map)
        //         relatedFunction({ ...updatedObjesct });

        //         if (validateField != undefined) {
        //             validateField();
        //         }
        //     }}
        //     onClear={() => {
        //         setCtrlValues(undefined
        //         )
        //         map.set(propertyName, null);

        //         const updatedObjesct = Object.fromEntries(map)
        //         relatedFunction({ ...updatedObjesct });
        //     }}
        //     filterOption={(input, option) =>
        //         option!.children
        //             .toLowerCase()
        //             .indexOf(toDatabaseChar(input.toLowerCase())) >= 0
        //     }
        //     placeholder="انتخاب"
        //     allowClear={
        //         TestWayComboList &&
        //         TestWayComboList.length > 1
        //     }
        //     bordered

        //     menuItemSelectedIcon={
        //         <CheckOutlined style={{ color: "green" }} />
        //     }
        //     value={ctrlValues}
        // >
        //     {TestWayComboList &&
        //         TestWayComboList.length > 0 &&
        //         TestWayComboList.map((val: IComboBoxType) => {
        //             return (
        //                 <Option key={`key_${val.key}`} value={val.key}>
        //                     {toDatabaseChar(val.value)}
        //                 </Option>
        //             );
        //         })}
        // </Select>
    )
}
