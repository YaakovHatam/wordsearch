const wiki = require('wikijs').default;
const fs = require('fs')

const pagesInCategory = catName => wiki({ apiUrl: 'https://he.wikipedia.org/w/api.php' }).pagesInCategory(catName);

const catToFilename = catName => Buffer.from(catName).toString('base64');

const DATA_FILES = {
   '50_TO_100_TERMS': __dirname + '/wiki-data/categories-50-to-100-pages.json',
   '100_PLUS_TERMS': __dirname + '/wiki-data/categories-100-plus-pages.json',
   '15_TO_50_TERMS': __dirname + '/wiki-data/categories-15-to-50-page.json',
   'CATEGORIES': __dirname + '/wiki-data/categories.json'
}

/** @type {Object.<string, string[]>} */
const DATA_ARRAYS = {
   '50_TO_100_TERMS': [],
   '100_PLUS_TERMS': [],
   '15_TO_50_TERMS': [],
   'CATEGORIES': []
}

const init = () => {
   for (let prop in DATA_FILES) {
      DATA_ARRAYS[prop] = JSON.parse(fs.readFileSync(DATA_FILES[prop], 'utf-8'));
   }
}


const finish = () => {
   console.log('saving');
   for (let prop in DATA_FILES) {
      fs.writeFileSync(DATA_FILES[prop], JSON.stringify(DATA_ARRAYS[prop]))
   }

}


const main = () => {
   init();
   Promise.all(Array.from(Array(10).keys()).map(async a => doWork())).then(finish);
}

const saveList = (catName, list) => {
   const path = __dirname + '/wiki-lists/' + Buffer.from(catName).toString('base64') + '.json';
   fs.writeFileSync(path, JSON.stringify(list));
}


const doWork = async () => {
   const rand = Math.floor(Math.random() * DATA_ARRAYS.CATEGORIES.length);
   const catName = DATA_ARRAYS.CATEGORIES[rand];

   DATA_ARRAYS.CATEGORIES.splice(DATA_ARRAYS.CATEGORIES.indexOf(catName), 1);


   return pagesInCategory('קטגוריה:' + catName).then(res => {
      if (res.length >= 100) {
         DATA_ARRAYS['100_PLUS_TERMS'].push(catName);
      } else if (res.length >= 50) {
         DATA_ARRAYS['50_TO_100_TERMS'].push(catName);
      } else if (res.length >= 15) {
         DATA_ARRAYS['15_TO_50_TERMS'].push(catName);
      }

      if (res.length >= 15) {
         saveList(catName, res);
         console.log('saved', catName);
      } else {
         console.log('under 15 not saved', catName);


      }

   });
};

main();
// console.log(catToFilename('שירי לנה דל ריי'));



// console.log(Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))

