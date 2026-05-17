
/* REGEX.TEST('stringValue)
        Exists only on REGEX. 
        Returns a Boolean value that indicates whether or not a pattern exists in a searched string.

    Decalre Regex in two main ways: 
            1. Literal Notation            :    /pattern/flags
            2. RegExp Constructor Object.  :    new RegExp('pattern', 'flags')


*/

//==================================================================================================

const str1: string = 'Hi administrators how are you? i am playwright admin';

const pattern = /admin/i;            // search for 'admin' , i = case-insensitive
console.log(pattern.test(str1)); 

const pattern1 = /^admin/i;          // ^ === search at the beginning
console.log(pattern1.test(str1)); 


const pattern2 = /admin$/i;          // $ === search at the end
console.log(pattern2.test(str1)); 

// EMAIL ID PATTERn ==================================================================================================
 
const emailPattern   = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/ ;   // email id pattern
const emailPattern2  = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ ;
const emailShortHand = /^[\w.+-]+@[a-zA-Z\d]+\.[a-zA-Z]{2,3}$/;
const result = emailPattern.test('cmsws_auto-123@gmail.com');
console.log(result);

//==================================================================================================
const fileNames = ['report.pdf', 'image.png', 'invoice.PDF'];
const pdfPattern = /\.pdf$/i;
const finalArr: any[] = [];
const pdfFiles = fileNames.filter((file, ind) => { 
                                      if (pdfPattern.test(file)) {   // .filter() loops through and keeps items where .test() returns true
                                         finalArr.push([file, ind]);  // nested array
                                         finalArr.push({file, ind});  // array of objects
                                         return true;
                                      }
                                      else {
                                        return false;
                                      }                           
                                }
                            );
console.log(pdfFiles);
console.log(finalArr);

//==================================================================================================


