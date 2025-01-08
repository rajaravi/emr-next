export interface Validation {
    minLength?: number;
    maxLength?: number;
}

export interface Option {
    label: string;
    value: string;
    selected?: boolean;
}

export interface FormField {
    type: 'text' | 'dropdown' | 'date' | 'radio' | 'checkbox' | 'typeahead' | 'typeaheadDynamic' | 'submit' 
        | 'textarea' | 'switch' | 'color' | 'email';
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    validation?: Validation;
    pattern?: string;
    options?: Option[];
    order: number;
    value?: string;
    multiple?: boolean;
    rows?: number;
    disablePrevDate?: boolean;
    disableFutureDate?: boolean;
    defaultValue?: string | number | undefined | string[];
    colClass?: string;
}
  