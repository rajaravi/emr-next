interface RuleAction {
    id: number | null;
    rule_action_id: string;
    is_user_input_required: boolean;
}

interface RuleCondition {
    id: number | null;
    global_condition_id: string;
    rule_actions: RuleAction[];
}

export interface RuleModel {
    id?: number | null;
    name: string;
    module_id: number;
    rule_conditions: RuleCondition[];
}