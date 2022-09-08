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

export { isHebrewString }