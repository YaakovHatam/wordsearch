import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DATA_FILES = {
   '50_TO_100_TERMS': __dirname + '/wiki-data/categories-50-to-100-pages.json',
   '100_PLUS_TERMS': __dirname + '/wiki-data/categories-100-plus-pages.json',
   '15_TO_50_TERMS': __dirname + '/wiki-data/categories-15-to-50-page.json',
   'CATEGORIES': __dirname + '/wiki-data/categories.json'
}


/** @type {Object.<string, string[]>} */
const DATA_ARRAYS = {
   '50_TO_100_TERMS': JSON.parse(readFileSync(DATA_FILES['50_TO_100_TERMS'], 'utf-8')),
   '100_PLUS_TERMS': JSON.parse(readFileSync(DATA_FILES['100_PLUS_TERMS'], 'utf-8')),
   '15_TO_50_TERMS': JSON.parse(readFileSync(DATA_FILES['15_TO_50_TERMS'], 'utf-8')),
   'CATEGORIES': JSON.parse(readFileSync(DATA_FILES['CATEGORIES'], 'utf-8'))
}

const saveDataArrays = () => {
   console.log('saving');
   for (let prop in DATA_FILES) {
      writeFileSync(DATA_FILES[prop], JSON.stringify(DATA_ARRAYS[prop]))
   }
}

const saveList = (catName, list) => {
   const path = __dirname + '/wiki-lists/' + Buffer.from(catName).toString('base64') + '.json';
   writeFileSync(path, JSON.stringify(list));
}

export { DATA_ARRAYS, saveDataArrays, saveList }