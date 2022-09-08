import wiki from 'wikijs';
import { writeFileSync, readFileSync, copyFileSync, readdir, unlinkSync, existsSync } from 'fs';
import { resolve } from 'path';
import { isHebrewString } from './misc.js';
import { DATA_ARRAYS, saveDataArrays, saveList } from './data-files.js';

const blacklist = [
   'נפטרים ב',
   'ילידות 1',
   'שנפטרו ב-',
   'נפטרים ב-',
   'שנולדו ב-',
   'תבניות'
]

const pagesInCategory = catName => wiki({ apiUrl: 'https://he.wikipedia.org/w/api.php' })
   .pagesInCategory(catName);

const catToFilename = catName => Buffer.from(catName).toString('base64');

const main = () => {
   //deleteNonHebrewLists();
   //removeItemsFromListThatHasNoFile();
   //makeListsForClient();
   Promise.all(Array.from(Array(10).keys()).map(async a => doWork())).then(saveDataArrays);
}



/**
 * 
 * @param {string} specificTerm 
 * @returns 
 */
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
   const clientPath = resolve(__dirname, '../', 'frontend/public/words/');
   const list1 = JSON.parse(readFileSync(DATA_FILES['15_TO_50_TERMS'], 'utf-8'));
   const list2 = JSON.parse(readFileSync(DATA_FILES['50_TO_100_TERMS'], 'utf-8'));
   const list3 = JSON.parse(readFileSync(DATA_FILES['100_PLUS_TERMS'], 'utf-8'));

   const list = [...new Set([...list1, ...list2, ...list3])];

   // wiki-lists
   const listsObject = {};
   list.forEach(l => {
      console.log('makeListsForClient', l);
      const fileName = catToFilename(l);
      const sourceFile = `${__dirname}/wiki-lists/${fileName}.json`
      // check file

      let data = JSON.parse(readFileSync(sourceFile, 'utf-8'));
      if (data.filter(item => isHebrewString(item)).length < 15) {
         console.log('skipping bad file', sourceFile);
         return;
      }

      copyFileSync(sourceFile, `${clientPath}/${fileName}.json`);
      listsObject[fileName] = {
         "jsonFile": fileName + '.json',
         "heb": l,
         "desc": ""
      }
   });
   writeFileSync(clientPath + '/1categories.json', JSON.stringify(listsObject));
}




function deleteNonHebrewLists() {
   readdir('./wiki-lists', (err, files) => {
      files.forEach(file => {
         const data = JSON.parse(readFileSync(`${__dirname}/wiki-lists/${file}`, 'utf-8'));
         console.log('deleteNonHebrewLists', file);
         if (data.filter(item => isHebrewString(item)).length < 15) {
            unlinkSync(`${__dirname}/wiki-lists/${file}`);
         }
      });
   });
}

function removeItemsFromListThatHasNoFile() {
   const chosenFile = DATA_FILES['100_PLUS_TERMS'];

   const file = JSON.parse(readFileSync(chosenFile, 'utf-8'));

   const newFile = [...file];
   file.forEach(l => {
      const filePath = `${__dirname}/wiki-lists/${catToFilename(l)}.json`;
      if (!existsSync(filePath)) {
         newFile.splice(file.indexOf(l), 1);
      }
   });
   console.log(file.length, newFile.length);
   writeFileSync(chosenFile, JSON.stringify(newFile));

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


