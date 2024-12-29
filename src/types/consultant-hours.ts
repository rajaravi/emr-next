interface WorkHours {
    id?: number | string | null;
    rowId: number;
    description: string;
    location_id: number;
    occurence_type_id: number;
    occurence_value: number;
    work_week_days: string;
    from_time: string;
    to_time: string;
}
export interface ConsultantHoursModel {
    [x: string]: any;
    id?: number | null;
    description: string;
    consultant_id: number;
    from_date: string;
    to_date: string;
    consultant_work_hour_details: WorkHours[];
}  