export type PartialRequired<T, RequiredKeys extends keyof T> = Partial<Omit<T, RequiredKeys>> & Required<Pick<T, RequiredKeys>>;
