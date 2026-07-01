// Shallow Copy or Deep Copy
const user1 = {
    name: "Akshay",
    age: 25,
    obj1: {
        phNo: 8888888888,
        Line: {
            no:14
        }
    }
}
const user2 = { ...user1 };
user2.name = "Rahul"
user2.address = "Delhi"
//user2.obj1.phNo = 6667874532
user2.obj1.Line.no = 17
// console.log("==>", user1);
// console.log("==>", user2);

const abc1 = {
    name: "Raman",
    lastname: "Dhiwan",
    age: 22,
    address: {
        city: "Delhi",
        pincode: 12009,
        father: {
            name: "Sonu",
            age: 49,
            mother: {
                name: "Geeta",
                age: 45
            }
        }
    }
}

const abc2 = structuredClone(abc1)
abc2.lastname = "Sharma"
abc2.address.city = "Punjab"
abc2.address.father.name = "Rampal"
abc2.address.father.mother.name = "Urmila"
//abc2.address.
//    console.dir(abc1, { depth: null });
// console.dir(abc2, { depth: null });

const abc3 = {
    name: "Akshay Kumar",
    age:22
}
const abc4 =              abc3
     //{ ...abc3 }
abc3.name = "ala habbibi"
console.log("==", abc4);
const no = [1, 2, 3, 4, 5]
console.log(typeof no);
