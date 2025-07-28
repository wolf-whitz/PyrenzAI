export interface Range {
  from: number;
  to: number;
}

export interface OrderBy {
  column: string;
  ascending?: boolean;
}

export type Match<T = Record<string, any>> = {
  [K in keyof T]?: T[K] | T[K][];
};

export type FilterOperator =
  | 'in'
  | 'not_in'
  | 'not_overlaps'
  | 'eq'
  | (string & {});

export interface ExtraFilter {
  column: string;
  operator: FilterOperator;
  value: any;
}
