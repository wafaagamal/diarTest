var request = require('request');
var generate=require('./generator')
let helper=require('./test-helper')
const fs = require('fs');
var async = require("async");
let {logger}=require('./winston')
var process = require('process');
const delay = require('delay');
let formData
let superadmin
let admin
let rider
let end
let arr={}
var obj=
{ 
    "lat": "31.205753",
    "lng": "29.924526"
}
var coords ={  
  pickCoords: 
    { 
      "lat": helper.generateCoords().lat,
      "lng": helper.generateCoords().lng 	
    },
    destCoords: 
   { 
     "lat": helper.generateCoords().lat,
     "lng": helper.generateCoords().lng	
    } ,
    mobileNumber :"010"+helper.generate('numeric',8),
    pickAddress:helper.generate('all-alpha',10)+","+helper.generate('all-alpha',10),  
    destAddress:helper.generate('all-alpha',30) 
}  
function start(url,method,ticket,body) {
   
    let option={
        url: "http://23.22.157.198:3000/api"+url,
        method:method,
        json: true,
        headers: {
            'ticket':ticket 
        },
        body: body
    }
   
    
    return new Promise(function (resolve, reject) {
      request(option, function (error, res, body) {
      
        if (!error && res.statusCode == 200) {
          let obj2={
            url:url,
            response:JSON.stringify(body),
            process:process.pid,
            time:new Date().toTimeString()
          }
          logger.log({level:'info',message:obj2})
          resolve(body);
        } else {
          let obj3={
            url:url,
            response:JSON.stringify(body),
            process:process.pid,
            time:new Date().toTimeString()
          }
          logger.log({level:'error',message:obj3})
          reject(error);
        }
      });
    });
  }
  function activeDriver(url,method,ticket,body) {
   
    let option={
        url: "http://23.22.157.198:3000/api"+url,
        method: method,
        formData:body,
        json:true,
        headers: {
            'ticket':ticket 
        }
    }
   
    return new Promise(function (resolve, reject) {
      request(option, function (error, res, body) {
        if (!error && res.statusCode == 200){   
          resolve(body);
        } else { 
          reject(error);
        }
      });
    });
  }
  /////////////////////////////////////////////////////////////////////////////////
  async function main() {

  try{
  
      let object ={
        email:'bahi.hussein@gmail.com',
        password:'@Eserve2012'
      }
    let url='/access/staff'
    superadmin = await start(url,'POST',null,object)
    console.log(superadmin.ticket,"===========================superAdmin ############################");

    url='/stage/admin'
    admin=generate.staff()
    let regObject = await start(url,'POST',superadmin.ticket,admin)
    console.log(regObject,"===========================Admin ############################");

    await delay(2000)
    
    regObject.password=helper.generate('mix', 8)
    url='/activate/staff'
    let Admin = await start(url,'POST',null,regObject)
    console.log(Admin,"===========================activate-Admin ############################");

    await delay(1000);
    url='/stage/supervisor'
    supervisor=generate.staff()
    regObject = await start(url,'POST',Admin.ticket,supervisor)
    console.log(regObject.email,"===========================supervisor ############################");

    await delay(1000);
    regObject.password=helper.generate('mix', 8)
    url='/activate/staff'
    let Supervisor = await start(url,'POST',null,regObject)
    console.log(Supervisor,"===========================activate-supervisor############################");

    // await delay(1000);
    url='/stage/driver'
    regObject = await start(url,'POST',Supervisor.ticket,generate.driver())
    
    regObject.password=helper.generate('mix', 8)
    regObject.mobileNumber="010"+helper.generate('numeric', 8)
    formData = {
        'image': fs.createReadStream('image.jpg'),
        'email': regObject.email,
        'password':regObject.password,
        'mobileNumber':regObject.mobileNumber,
        'regCode':regObject.regCode,
     };
     await delay(1000);
    url='/activate/driver'
    let _driver=  await activeDriver(url,'POST',null,formData)
   
 console.log(_driver.user._id,"=========================== DRIVER ID ############################");
 
 await delay(1000);
    url='/create/rider'
    rider=generate.rider()
    let riders=await start(url,'POST',null,rider)
    
   console.log(riders,"===================================CREATE #############################################");
   await delay(1000);
    url='/access/rider'
    let _rider=await start(url,'POST',null,rider)
   
    console.log(_rider.ticket,"==========================ACCESS #############################################");


if(_rider){

    await delay(1000);
     url='/location'
     let bgRider=await start(url,'POST',_rider.ticket,helper.generateBgLocation(obj,500))
    
     console.log(bgRider,"========================= BG LOCATION RIDER #########################");

    await delay(1000);
  let bgDriver=await start(url,'POST',_driver.ticket,helper.generateBgLocation(obj,500))

  console.log(bgDriver,"========================= BG LOCATION DRIVER #########################");

  await delay(1000);
    url='/user/push'
    let pushId="bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1bk3RNwTe3H0:CI2kbk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1bk3RNwTe3H0:CI2k"
    let rider_id=await start(url,'POST',_rider.ticket,{'pushId':pushId})
  
    console.log(rider_id,"========================= PUSH ID RIDER #########################");

    let driver_id=await start(url,'POST',_driver.ticket,{'pushId':pushId})
  
    console.log(driver_id,"========================= PUSH ID DRIVER #########################");
  
   url='/add/car'
   let car={
    'uniqueId':helper.generate('numeric',6),
    'desc':helper.generate("lalpha",30)
   }
    let carId=await start(url,'POST',Supervisor.ticket,car)
    console.log(carId,"========================= CREATE CAR #########################");

    await delay(1000);
    url='/car/driver'
    let msg=await start(url,'POST',_driver.ticket,carId)   
    console.log(msg,"========================= CONNECT DRIVER TO CAR #########################");
 
    await delay(1000);
    url='/journey'
    let jour=await start(url,'POST',_rider.ticket,coords)
    console.log(jour,"========================= CREATE JOURNEY #########################");

    await delay(1000);
    url='/journey/latest'
    let last=await start(url,'GET',_rider.ticket)
    console.log(last.journey._id,"========================= GET LAST JOURNEY #########################");
    
    
    await delay(3000);
    url='/journey/accept'
    let accept=await start(url,'POST',_driver.ticket,{"journeyId":last.journey._id})
    console.log(accept.journey._id,"========================= ACCEPT JOURNEY #########################");
 

    await delay(1000);
    url='/journey/start'
    let startJ=await  start(url,'POST',_driver.ticket,{"riderCode":accept.journey.riderCode})
    console.log(startJ,"========================= START JOURNEY #########################");
    
    for(let c=0; c<10000; c++){
      console.log("hereeeeeeeeeeeeeeeeeeeee");
      url='/location'
      let bg=await start(url,'POST',_driver.ticket,helper.generateBgLocation(obj,500))
      console.log(bg,"========================= BG LOCATION  #########################");
      await delay(1000);
    }
   
    // let time=setInterval(async function(){
    // console.log("HEREEEEE**************************************************");
    //       url='/location'
    //       let bg=await start(url,'POST',_driver.ticket,helper.generateBgLocation(obj,500))
    //       console.log(bg,"========================= BG LOCATION  #########################");
    //       if(end){
    //       console.log("============================CLEAR INTERVAL======================");
    //         clearInterval(time)
    //       }
    // },10000)
      
setTimeout(async function(){
    url='/journey/end'
    end=await start(url,'POST',_driver.ticket,{"riderCode":startJ.journey.riderCode})
     console.log(end.journey.cost,"%%%%%%%%%%%%%%%%%%%%%%JOURNNEY END%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
         arr[end.journey._id] =end.journey.cost
         fs.appendFile('history.json',`{${JSON.stringify(arr)} ,"prossesID": ${process.pid}}`+','+'\r\n')
         console.log(arr,"ARRAYYYYYY_____________________________==###");
         
    },1000*10000)

  }//  
  }catch(err) {
    console.log("####################################ERROR",err)
  }

}
  async.times(1, main, function(result){

    console.log("RESULT############################");	
    if (process.pid) {
      console.log('This process is your pid :' + process.pid);
    }
})