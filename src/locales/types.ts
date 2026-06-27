export type LocaleMessages<TMessages extends Record<string, string>> = {
  [TKey in keyof TMessages]: string;
};
