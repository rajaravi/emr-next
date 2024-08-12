export interface Validation {
    minLength?: number;
    maxLength?: number;
}

export interface Option {
    label: string;
    value: string;
}

export interface FormField {
    type: 'text' | 'dropdown' | 'date' | 'radio' | 'checkbox' | 'submit';
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    validation?: Validation;
    options?: Option[];
    order: number;
    value?: string;
    multiple?: boolean;
    defaultValue?: string | number | undefined | string[]; 
}
  