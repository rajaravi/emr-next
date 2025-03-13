interface ConditionalParameter {
    name: string;
    value: string;
}
interface RuleParameter {
    name: string;
    value: number;
    conditional_parameters: [];
}
interface RuleAction {
    id: number | null;
    name: string;
    identifier: string;
    recipient: string;
    value: string;
    recipients: string;
    is_user_interaction_required: boolean;
    is_skippable: boolean;
    parameters: RuleParameter[]
}

interface RuleCondition {
    id: number | null;    
    field: string;
    condition: string;
    field_value: number;
}

export interface RuleModel {
    id?: number | null;
    name: string;
    module: string;
    rule_conditions: RuleCondition[];
    rule_actions: RuleAction[];    
}