export type CustomCssStyling = {
  classNames: string[]
  css: string
};

export const isCustomCssStyling = (x: any): x is CustomCssStyling => {
    return (
        typeof x === 'object' &&
        x !== null &&
        Array.isArray(x.classNames) &&
        x.classNames.every((className: unknown) => typeof className === 'string') &&
        typeof x.css === 'string'
    );
}