require('dotenv').config();

const { PORT } = process.env;
let { MONGODB_URI } = process.env;
let { NODE_ENV }= process.env;

//const URIregex=/<dbname>/i;

// Remember to copy your MONGODB App's URL to connect to your DB 
// Don't replace <dbname>, only add your user's password. i.e mongodb+srv://username:<password>@mongomarko-gzrof.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority.

// Replace the strings with the desired names for your DB Collection

/*const DBCollectionName='my_library';
const testDBCollectionName='test_library';
let selectedDB='';

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGODB_URI.replace(URIregex,testDBCollectionName);
  selectedDB=testDBCollectionName;
}
else{
  MONGODB_URI= process.env.MONGODB_URI.replace(URIregex,DBCollectionName);
  selectedDB=DBCollectionName;
}*/

module.exports = {
  MONGODB_URI,
  PORT,
  NODE_ENV,
  //selectedDB
};
