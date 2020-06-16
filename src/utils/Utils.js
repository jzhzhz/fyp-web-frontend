/**
 * Returns a string of current date 
 * splitted by the separator
 * 
 * @param {String} separator 
 */
export const getCurrentDate = (separator='') => {

  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  
  return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`;
}

/**
 * Returns an array with arrays of the given size.
 *
 * @param {Array} myArray  Array to split
 * @param {Integer} chunkSize Size of every group
 */
export const chunkArray = (myArray, chunk_size) => {
  let results = [];
  
  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }
  
  return results;
}