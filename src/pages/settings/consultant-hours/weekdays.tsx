import React, { FC, useState } from "react";
import styles from './_style.module.css';

interface RowData {
    id: number;
    selectedItems: string[];
    inputValue: string;
}

interface DaysProps {
    selectedVal: any;
    rowIndex: number;
    disableMode: string;
    handleToggleChange: (event: any, data:any) => void;
    className: number | string;
    dayInterval: number;
}
    
const WeekDays: FC<DaysProps> = ({selectedVal, handleToggleChange, rowIndex, disableMode, className, dayInterval}) => {
    const [rows, setRows] = useState<RowData[]>([
        { id: rowIndex, selectedItems: selectedVal ? selectedVal.split(',') : [], inputValue: selectedVal ? selectedVal : "" },
    ]);
    const handleClick = (rowId: number, value: string) => {
        setRows((prevRows) =>
            prevRows.map((row) => {
            if (row.id === rowId) {            
                const isSelected = row.inputValue.includes(value);
                const updatedItems = isSelected
                ? row.selectedItems.filter((item) => item != value)
                : [...row.selectedItems, value];
                handleToggleChange(row, updatedItems);
                return {
                ...row,
                selectedItems: updatedItems,
                inputValue: updatedItems.join(","), // Update inputValue as a comma-separated string
                };
            }
            return row;
            })
        );
    };

    return (
    <div>
        {rows.map((row) => (
        <div key={row.id} className={`${((className == '1' || className == '0') ? 'disabled' : '')} row`}>
            <ul className={`weekdays mt-1`}>
                {["M", "T", "W", "T", "F", "S", "S"].map((item, i) => (
                <li
                    key={(i+1)}
                    onClick={() => handleClick(row.id, (i+1))}
                    className={row.inputValue.includes((i+1)) ? styles.selected : ""}
                >
                    {item}
                </li>
                ))}
            </ul>
            <span className={`${(className == '2' ? 'd-none' : '')} p-2`} >Occurs every {dayInterval} day(s)</span>
        </div>
        ))}
    </div>
    );
};    
export default WeekDays;