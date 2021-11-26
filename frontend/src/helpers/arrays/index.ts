export const createTwoDimmArray = <T>(ROWS: Number, COLS: number, fill?: T) => Array.apply(null, Array(ROWS)).map(() => Array.from({ length: COLS }, () => fill));
