export interface UserModel {
    id?: number | null;
    name: string;
    username: string;    
    email: string;
    role_id: number;
    is_active: boolean;
}