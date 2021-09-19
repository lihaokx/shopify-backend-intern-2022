// const pro = new Promise(resolve =>{
//     setTimeout(() =>{
//         return resolve("good")}, 3000);
 
// });
// console.log("start")
// pro.then((res)=>{
//     console.log("start then")
//     console.log(res)
    
// } )

// const pro = new Promise(resolve =>{
//     setTimeout( resolve, 3000);
 
// });
// console.log("start")
// pro.then((res)=>{
 
//     console.log("start then") 
// } )


let hello = async function() {
    console.log('start')
    const a =  await test2()
    console.log("a", a)
    a.then((res)=>{console.log(res)})
    console.log('1')
    console.log('2')
    console.log('3')
    const b =  await test2()
    console.log("b", b)
    console.log('4')
    console.log('5')
    console.log('6')
    return "Hello" 
};
hello()
.then((res)=>{
    console.log(res)
});

function test2() {
    console.log("test2")
     return new Promise(resolve => {
        setTimeout( resolve  , 3000)
    });
}

// async function async1() {
//     console.log('async1 start')
//     await async2()
//     console.log('async1 end')
//   }
//   async function async2() {
//     return new Promise(resolve => setTimeout(resolve, 3000) )
//       .then(() => {
//         console.log('promise2')
//       })
//   }
//   console.log('script start')
//   setTimeout(() => {
//     console.log('setTimeout')
//   }, 0);
//   async1()
//   new Promise(resolve => {
//       console.log('promise3')
//       resolve()
//     })
//     .then(() => {
//       console.log('promise4')
//     })
//   console.log('script end')
  