export const randBetweenIncludeMax = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
export const randBetweenExcludeMax = (min: number, max: number) => Math.floor(Math.random() * (max + min)) - min;
