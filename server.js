var request = require('request');
var generate=require('./generator')
let helper=require('./test-helper')
const fs = require('fs');
var async = require("async");
let {logger}=require('./winston')
var process = require('process');
const delay = require('delay');
let formData;


let end
let arr={}
var centerPoint=
{ 
    "lat": "31.205753",
    "lng": "29.924526"
}
// var coords ={  
//   pickCoords: 
//     { 
//       "lat": helper.generateCoords().lat,
//       "lng": helper.generateCoords().lng 	
//     },
//     destCoords: 
//    { 
//      "lat": helper.generateCoords().lat,
//      "lng": helper.generateCoords().lng	
//     } ,
//     mobileNumber :"010"+helper.generate('numeric',8),
//     pickAddress:helper.generate('all-alpha',10)+","+helper.generate('all-alpha',10),  
//     destAddress:helper.generate('all-alpha',30) 
// }  

/**
 helper.generateCoords() returns a pair of lat and lng (a point) 
calling helper.generateCoords().lat will get only on side of a point and calling it 
again helper.generateCoords().lng will get only lng from another point the lat and lng are not related 
and most of the time will generate a point that may not be the one you intended to generate 
*/

console.log("====== DIAR APP TEST STARTED =======")
let pickCoords = helper.generateCoords();
let destCoords = helper.generateCoords();
let journeyObj = {
  pickCoords: pickCoords,
  destCoords: destCoords,
  mobileNumber:"010"+helper.generate('numeric',8),
  pickAddress:helper.generate('all-alpha',10)+","+helper.generate('all-alpha',10),

  destAddress:helper.generate('all-alpha',30)
}


function start(url,method,ticket,body) {
   
    let option={
        url: "http://ec2-54-89-227-143.compute-1.amazonaws.com:3000/api"+url,
        method:method,
        json: true,
        headers: {
            'ticket':ticket 
        },
        body: body,
        timeout: 100000
    }
   
   
    return new Promise(function (resolve, reject) {
       
      request(option, function (error, res, body) {
        //  console.log(option,"OPTIONS");

         // if (!error && res.statusCode == 200) {
          //   let obj2={
          //     url:url,
          //     response:JSON.stringify(body),
          //     process:process.pid,
          //     time:new Date().toTimeString()
          //   }
          //   logger.log({level:'info',message:obj2})
          //   resolve(body);
          // } else {
          //   let obj3={
          //     url:url,
          //     response:JSON.stringify(body),
          //     process:process.pid,
          //     time:new Date().toTimeString() 
          //   }
          //   logger.log({level:'error',message:obj3})
          //   console.log("IN start ERR<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",res);
          //   reject(error);
          // }
          res= res||{};
         let result = {
          url:url,
          statusCode: res.statusCode,
          response:JSON.stringify(body),
          process:process.pid,
          time:new Date().toTimeString() 
         }
          if(error){
            result.error = error;
            logger.log({level:'error', result: result})
            return reject(error);
          } 

          logger.log({level:'info', result:result});
          return setTimeout(resolve, 1000, body)
      }); 
    });
  }
  function activeDriver(url,method,ticket,body) {
   
    let option={
        url: "http://ec2-54-89-227-143.compute-1.amazonaws.com:3000/api"+url,
        method: method,
        formData:body,
        json:true,
        headers: {
            'ticket':ticket 
        }
    }
   
    return new Promise(function (resolve, reject) {
      
      request(option, function (error, res, body) {


        res= res||{};
         let result = {
          url:url,
          statusCode: res.statusCode,
          response:JSON.stringify(body),
          process:process.pid,
          time:new Date().toTimeString() 
         }
          if(error || (res && res.statusCode>200)){
            result.error = error;
            logger.log({level:'error', result: result})
            return reject(error);
          } 
          logger.log({level:'info', result:result});
          return setTimeout(resolve, 1000, body)

      });
    });
  }
  /////////////////////////////////////////////////////////////////////////////////
  async function main() {

  try{
  
    /**
     * superadmin login
     * 
     * add let infront of admin to limit the scope 
     * 
     * add the url directly to the function for better readability and there is no
     * reason for serperation 
     * 
     * modified the console log for better readability 
     */

    // let superAdminObject ={
    //   email:'bahi.hussein@gmail.com',
    //   password:'@Eserve2012'
    // }
    // let superadmin = await start('/access/staff','POST',null,superAdminObject)
    // console.log(`superadmin logged-in
    // ticket: ${superadmin.ticket}`)



    // /*
    //  * registering admin
    //  * 
    //  * add let infront of admin to limit the scope 
    //  * 
    //  * add the url directly to the function for better readability and there is no
    //  * reason for serperation 
    //  * 
    //  * modified the console log for better readability 
    //  */ 
    
    // let admin = generate.staff()
    // let regObject = await start('/stage/admin','POST',superadmin.ticket,admin)
    // console.log(`admin registered:
    // ${JSON.stringify(regObject)}`);

    // // url='/stage/admin'
    // // admin=generate.staff()
    // // let regObject = await start(url,'POST',superadmin.ticket,admin)
    // // console.log(regObject,"===========================Admin ############################");

    // //no need for delay - you can delay the resolve using settimeout - look back to the promise of start()
    // //await delay(1000);


    // /** using previous return admin regObject and adding password property to it  */
    // regObject.password=helper.generate('mix', 8);
    // admin = await start('/activate/staff','POST',null,regObject)
    // console.log(`activated admin: 
    // ${JSON.stringify(admin)}`)

    // /*registering supervisor*/
    // let supervisor=generate.staff();
    // regObject = await start('/stage/supervisor','POST',admin.ticket,supervisor)
    // console.log(`registered supervisor: 
    // ${JSON.stringify(regObject)}`
    // );

    // /* adding password to supervisor registration object for activation */
    // regObject.password=helper.generate('mix', 8)
    // supervisor = await start('/activate/staff','POST',null,regObject)
    // console.log(`activated supervisor: 
    // ${JSON.stringify(supervisor)}`);

    let supervisor="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjE3NDU0NzI1MywiZXhwIjoxNTUxNTM3MTQ0MDAwMDAwLCJpYXQiOjE1NTEyNzc5NDQwMDAwMDAsImRhdGEiOnsiX2lkIjoiNWM0MDk0M2I1NGI0ODUyZjE5NDhkNGFhIiwicm9sZSI6InN1cGVydmlzb3IifX0.vMXivfBb5weC6bwK3t6dmBY_n2oltMKvavMYefYdStw"
    regObject = await start('/stage/driver','POST',supervisor,generate.driver())
    console.log(`staged driver: 
    ${JSON.stringify(regObject)}`)

    /*adding password to driver regobject */
    regObject.password=helper.generate('mix', 8)
    regObject.mobileNumber="010"+helper.generate('numeric', 8)
    formData = {
        'image': fs.createReadStream('./image.jpg'),
        'email': regObject.email,
        'password':regObject.password,
        'mobileNumber':regObject.mobileNumber,
        'regCode':regObject.regCode,
    };

    /* stage driver */
    let driver=  await activeDriver('/activate/driver','POST',null,formData)
    console.log(`activated driver:
    ${JSON.stringify(driver)}`
    )
 
    /* register rider */
    let rider=generate.rider();
    /* you were using rider */
    let riderAccess=await start('/create/rider','POST',null,rider);
    console.log(`registered a rider`,riderAccess);
    
    /* access rider */
    rider=await start('/access/rider','POST',null,rider)
    console.log(`rider access: 
    ${rider.ticket}`)

    /* send rider bg location */
    await start('/location', 'POST',rider.ticket, helper.generateBgLocation(centerPoint))
    /* nothing to log here it will always return 200 {} */
    console.log(
      `sent rider background location.`
    )

     /* send driver bg location */
     await start('/location', 'POST',driver.ticket, helper.generateBgLocation(centerPoint))
     /* nothing to log here it will always return 200 {} */
     console.log(
       `sent driver background location.`
     )


    /* send rider and driver push id */
    let pushId = "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1bk3RNwTe3H0:CI2kbk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1bk3RNwTe3H0:CI2k"
    await start('/user/push','POST',rider.ticket,{'pushId':pushId});
    console.log(`sent rider push id.`);
    await start('/user/push','POST',driver.ticket,{'pushId':pushId});
    console.log(`sent driver push id.`);

    /*adding car */
     let carId=await start('/add/car','POST',supervisor,{
      'uniqueId':helper.generate('numeric',6),
      'desc':helper.generate("lalpha",30)
     })
     console.log(`added car:
     ${JSON.stringify(carId)}`);

     /*link car to driver*/
     await start('/car/driver','POST',driver.ticket,carId);
     console.log(`linked car to driver.`);

     /*create journey */
    let journey = await start('/journey','POST',rider.ticket,journeyObj);
    console.log(`created journey`);

    /*latest journey for driver to accept */
    let last=await start('/journey/latest','GET',rider.ticket);
    console.log(`got last journey: 
    ${JSON.stringify(last)}`);

    /* driver accept journey  */
    let accept=await start('/journey/accept','POST',driver.ticket,{"journeyId":last.journey._id})
    console.log(`driver accepted journey`);

    /* start journey */
    
    await  start('/journey/start','POST',driver.ticket,{"riderCode":accept.journey.riderCode})
    console.log(`driver started journey`);

    for(let x=0; x<300; x++){
      console.log("++++++HERE+++++");
      
      /*sending background location*/
      await start('/location','POST',driver.ticket,helper.generateBgLocation(centerPoint))
      console.log(`trace sent @ ${new Date().getTime()}`)
    }

    end=await start('/journey/end','POST',driver.ticket,{"riderCode":accept.journey.riderCode})

    console.log("####################END JOURNEY####################################",end.journey._id); 
  }catch(err) {
    console.log("catch() triggered: one of the requests failed. ")
    console.log(err)
    // console.log("####################################ERROR",err)
  }

}


// main()
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < 1; i++) {
    console.log('cpu: ' + i)
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {

  main()

  console.log(`Worker ${process.pid} started`);
  console.log(`Memory :${JSON.stringify(process.memoryUsage().heapUsed)} used`);
}






