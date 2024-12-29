interface PurchaserType {
    id: number;
    description: string;
}

export interface PurchaserModel {
    id?: number | null;
    name: string;
    is_active: boolean;
    is_archive: boolean;
    purchaser_type: PurchaserType;
}  