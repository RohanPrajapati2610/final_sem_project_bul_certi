const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'abc';

const hash= bcrypt.hashSync(myPlaintextPassword, saltRounds);
console.log(hash)

const result=bcrypt.compareSync(myPlaintextPassword, hash);
console.log(result)

