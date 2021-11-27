const wiki = require('wikijs').default;
const fs = require('fs')

wiki({ apiUrl: 'https://he.wikipedia.org/w/api.php' })
   .allCategories().then(res => {
      fs.writeFile('categories.json', JSON.stringify(res), err => {
         if (err) {
            console.error(err)
            return
         }
      })
   });