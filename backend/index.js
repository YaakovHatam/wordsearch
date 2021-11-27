const wiki = require('wikijs').default;
const fs = require('fs')

const pagesInCategory = catName => wiki({ apiUrl: 'https://he.wikipedia.org/w/api.php' }).pagesInCategory(catName);

const DATA_FILES = {
   '50_TO_100_TERMS': __dirname + '/wiki-data/categories-50-to-100-pages.json',
   '100_PLUS_TERMS': __dirname + '/wiki-data/categories-100-plus-pages.json',
   'UNDER_50_TERMS': __dirname + '/wiki-data/categories-under-50-page.json',
   'CATEGORIES': __dirname + '/wiki-data/categories.json'
}

/** @type {Object.<string, string[]>} */
const DATA_ARRAYS = {
   '50_TO_100_TERMS': [],
   '100_PLUS_TERMS': [],
   'UNDER_50_TERMS': [],
   'CATEGORIES': []
}

const init = () => {
   for (let prop in DATA_FILES) {
      DATA_ARRAYS[prop] = JSON.parse(fs.readFileSync(DATA_FILES[prop], 'utf-8'));
   }
}


const finish = () => {
   for (let prop in DATA_FILES) {
      fs.writeFileSync(DATA_FILES[prop], JSON.stringify(DATA_ARRAYS[prop]))
   }
}


const main = () => {
   init();

   doWork().then(finish)

}

const saveList = (catName, list) => {
   const path = __dirname + '/wiki-lists/' + Buffer.from(catName).toString('base64') + '.json';
   fs.writeFileSync(path, JSON.stringify(list));
}


const doWork = async () => {
   const rand = Math.floor(Math.random() * DATA_ARRAYS.CATEGORIES.length);
   const catName = DATA_ARRAYS.CATEGORIES[rand];

   DATA_ARRAYS.CATEGORIES.splice(DATA_ARRAYS.CATEGORIES.indexOf(catName), 1);

   console.log(catName);

   return pagesInCategory('קטגוריה:' + catName).then(res => {
      if (res.length >= 100) {
         DATA_ARRAYS['100_PLUS_TERMS'].push(catName);
      } else if (res.length >= 50) {
         DATA_ARRAYS['50_TO_100_TERMS'].push(catName);
      } else {
         DATA_ARRAYS['UNDER_50_TERMS'].push(catName);
      }
      saveList(catName, res);
   });
};

main();


// console.log(Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))

