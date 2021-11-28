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
      // clean list first
      console.log('before filter: ', res.length);
      res = res.filter(item => isHebrewString(item));
      console.log('after filter: ', res.length);
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
const makeListsForClient = () => {
   const clientPath = '/Users/kobe/dev/github/wordsearch/frontend/public/words/';
   const list = JSON.parse(fs.readFileSync(DATA_FILES['50_TO_100_TERMS'], 'utf-8'));
   // wiki-lists
   const listsObject = {};
   list.forEach(l => {
      console.log(l);
      const fileName = catToFilename(l);
      const sourceFile = `${__dirname}/wiki-lists/${fileName}.json`
      // check file

      const data = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
      if (data.filter(item => isHebrewString(item)).length < 15) {
         console.log('skipping bad file', sourceFile);
         return;
      }

      fs.copyFileSync(sourceFile, `${clientPath}${fileName}.json`);
      listsObject[fileName] = {
         "jsonFile": fileName,
         "heb": l,
         "desc": ""
      }
   });
   fs.writeFileSync(clientPath + '/_categories.json', JSON.stringify(listsObject));
}


function isHebrewString(s) {
   var i, charCode;
   for (i = s.length; i--;) {
      charCode = s.charCodeAt(i)
      if (charCode == 1470) {

      }
      else if (charCode > 30 && charCode < 47) {

      }
      else if (charCode < 1488 || charCode > 1514) {
         return false
      }
   }
   return true
}



function deleteNonHebrewLists() {
   fs.readdir('./wiki-lists', (err, files) => {
      files.forEach(file => {
         const data = JSON.parse(fs.readFileSync(`${__dirname}/wiki-lists/${file}`, 'utf-8'));
         console.log(file);
         if (data.filter(item => isHebrewString(item)).length < 15) {
            fs.unlinkSync(`${__dirname}/wiki-lists/${file}`);
         }
      });
   });
}

function removeItemsFromListThatHasNoFile() {
   const file = JSON.parse(fs.readFileSync(DATA_FILES['50_TO_100_TERMS'], 'utf-8'));
   const newFile = [...file];
   file.forEach(l => {
      const filePath = `${__dirname}/wiki-lists/${catToFilename(l)}.json`;
      if (!fs.existsSync(filePath)) {
         newFile.splice(file.indexOf(l), 1);
      }
   });
   fs.writeFileSync(DATA_FILES['50_TO_100_TERMS'], JSON.stringify(newFile));

}

// deleteNonHebrewLists();
// removeItemsFromListThatHasNoFile();
// makeListsForClient();

main();
// console.log(catToFilename('שירי לנה דל ריי'));


//console.log(Buffer.from("16nXmdeo15kg15zXoNeUINeT15wg16jXmdeZ", 'base64').toString('utf-8'))
