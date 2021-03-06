const wiki = require('wikijs').default;
const fs = require('fs');
const path = require('path');

const blacklist = [
   'נפטרים ב',
   'ילידות 1',
   'שנפטרו ב-',
   'נפטרים ב-',
   'שנולדו ב-',
   'תבניות'
]

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
   '50_TO_100_TERMS': require(DATA_FILES['50_TO_100_TERMS']),
   '100_PLUS_TERMS': require(DATA_FILES['100_PLUS_TERMS']),
   '15_TO_50_TERMS': require(DATA_FILES['15_TO_50_TERMS']),
   'CATEGORIES': require(DATA_FILES.CATEGORIES)
}

const finish = () => {
   console.log('saving');
   for (let prop in DATA_FILES) {
      fs.writeFileSync(DATA_FILES[prop], JSON.stringify(DATA_ARRAYS[prop]))
   }

}


const main = () => {
   deleteNonHebrewLists();
   removeItemsFromListThatHasNoFile();
   makeListsForClient();
   //Promise.all(Array.from(Array(10).keys()).map(async a => doWork())).then(finish);
}

const saveList = (catName, list) => {
   const path = __dirname + '/wiki-lists/' + Buffer.from(catName).toString('base64') + '.json';
   fs.writeFileSync(path, JSON.stringify(list));
}


const doWork = async specificTerm => {
   let catIdx;
   if (specificTerm) {
      catIdx = DATA_ARRAYS.CATEGORIES.findIndex(c => c.indexOf(specificTerm) > -1);
   } else {
      catIdx = Math.floor(Math.random() * DATA_ARRAYS.CATEGORIES.length);
   }
   console.log(catIdx);
   if (catIdx === -1) {
      throw new Error(specificTerm + ' not found');
   }
   const catName = DATA_ARRAYS.CATEGORIES[catIdx];

   DATA_ARRAYS.CATEGORIES.splice(DATA_ARRAYS.CATEGORIES.indexOf(catName), 1);

   if (blacklist.some(b => catName.indexOf(b) > -1)) {
      console.log('Backlist category: ', catName);
      return;
   }
   console.log('category picked: ', catName);
   // if (catName.startsWith('ויקינתונים')) return; 
   return pagesInCategory('קטגוריה:' + catName).then(res => {

      // remove parenthesis and text inside, trim
      res = res.map(l => l.replace(/\(.*\)/g, ""));
      res = res.map(l => l.trim());

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
         console.log('under 15 not saved', catName, 'length:', res.length);


      }

   });
};

const makeListsForClient = () => {
   const clientPath = path.resolve(__dirname, '../', 'frontend/public/words/');
   const list1 = JSON.parse(fs.readFileSync(DATA_FILES['15_TO_50_TERMS'], 'utf-8'));
   const list2 = JSON.parse(fs.readFileSync(DATA_FILES['50_TO_100_TERMS'], 'utf-8'));
   const list3 = JSON.parse(fs.readFileSync(DATA_FILES['100_PLUS_TERMS'], 'utf-8'));

   const list = [...new Set([...list1, ...list2, ...list3])];

   // wiki-lists
   const listsObject = {};
   list.forEach(l => {
      console.log('makeListsForClient', l);
      const fileName = catToFilename(l);
      const sourceFile = `${__dirname}/wiki-lists/${fileName}.json`
      // check file

      let data = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
      if (data.filter(item => isHebrewString(item)).length < 15) {
         console.log('skipping bad file', sourceFile);
         return;
      }

      fs.copyFileSync(sourceFile, `${clientPath}/${fileName}.json`);
      listsObject[fileName] = {
         "jsonFile": fileName + '.json',
         "heb": l,
         "desc": ""
      }
   });
   fs.writeFileSync(clientPath + '/1categories.json', JSON.stringify(listsObject));
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
         console.log('deleteNonHebrewLists', file);
         if (data.filter(item => isHebrewString(item)).length < 15) {
            fs.unlinkSync(`${__dirname}/wiki-lists/${file}`);
         }
      });
   });
}

function removeItemsFromListThatHasNoFile() {
   const chosenFile = DATA_FILES['100_PLUS_TERMS'];

   const file = JSON.parse(fs.readFileSync(chosenFile, 'utf-8'));

   const newFile = [...file];
   file.forEach(l => {
      const filePath = `${__dirname}/wiki-lists/${catToFilename(l)}.json`;
      if (!fs.existsSync(filePath)) {
         newFile.splice(file.indexOf(l), 1);
      }
   });
   console.log(file.length, newFile.length);
   fs.writeFileSync(chosenFile, JSON.stringify(newFile));

}


main();
// console.log(catToFilename('שירי לנה דל ריי'));


//console.log(Buffer.from("16nXmdeo15kg15zXoNeUINeT15wg16jXmdeZ", 'base64').toString('utf-8'))

function fetchCat(catName) {
   pagesInCategory('קטגוריה:' + catName).then(res => {

      // remove parenthesis and text inside, trim
      res = res.map(l => l.replace(/\(.*\)/g, ""));
      res = res.map(l => l.trim());

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
         console.log('under 15 not saved', catName, 'length:', res.length);


      }

   });

}


