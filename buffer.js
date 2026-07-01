const buf1 = Buffer.from('Hello, ');
const buf2 = Buffer.from('Node.js!');

// Concatenate buffers
const combined = Buffer.concat([buf1, buf2]);
console.log(combined.toString()); // 'Hello, Node.js!'

// With a maximum length parameter
const partial = Buffer.concat([buf1, buf2], 10);
console.log(partial.toString()); 