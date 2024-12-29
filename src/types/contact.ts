export interface ContactModel {
    id?: number | null;
    designation_id: number;
    firstname: string;
    surname: string;
    organization: string;
    profession_id: number;
    address1: string;
    address2: string;
    address3: string;
    county: string;
    eircode: string;
    phone: string;
    mobile: string;
    email: string;
    is_archive: boolean;
}