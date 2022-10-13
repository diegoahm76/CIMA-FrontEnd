export interface Conditions {
  [prop: string]: any;
}

export interface ResourceOptions {
  action: string;
  conditions?: Conditions;
}

export interface Permissions {
  [role: string]: {[resource: string]: ResourceOptions[]};
}
