var request = require('request');
var generate=require('./generator')
let helper=require('./test-helper')
const fs = require('fs');
var async = require("async");
let {logger}=require('./winston')
var process = require('process');
const delay = require('delay');
let formData
var dateFormat = require('dateformat');
const FETCH_TIMEOUT = 30000;
let didTimeOut = false;
var now = new Date();
let rider
let Supervisor="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjY0NDYyMzczMSwiZXhwIjoxNTQ5NDUyMTg4MDAwMDAwLCJpYXQiOjE1NDkxOTI5ODgwMDAwMDAsImRhdGEiOnsiX2lkIjoiNWM1NmNmMWEzYzU4NjAwOTZkMWVhMWQzIiwicm9sZSI6ImFkbWluIn19.ypwvryBNuyJqNiqTcu0AdcfNAV4EBygfAPKPqdQncaE"
let end
let  regObject
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
        url: "http://ec2-54-224-160-154.compute-1.amazonaws.com:3000/api"+url,
        method:method,
        json: true,
        headers: {
            'ticket':ticket 
        },
        body: body,
        timeout: 1000000,
    }
   
    
    return new Promise(function (resolve, reject) {
      request(option, function (error, res, body) {
      console.log(option,"OPTIONS");
        if (!error && res.statusCode == 200) {
          let obj2={
            url:url,
            response:JSON.stringify(body),
            process:process.pid,
            time:dateFormat(now, "dd,mm, yyyy,h")
          }
          logger.log({level:'info',message:obj2})
            resolve(body);
        } else {
          let obj3={
            url:url,
            response:JSON.stringify(body),
            process:process.pid,
            time:dateFormat(now, "dd,mm, yyyy,h")
          }
          logger.log({level:'error',message:obj3})
          console.log("IN start ERR<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",res.statusCode,res.body);
          reject(error);
        }
      });
    });
  }
  function activeDriver(url,method,ticket,body) {
   
    let option={
        url: "http://ec2-54-224-160-154.compute-1.amazonaws.com:3000/api"+url,
        method: method,
        formData:body,
        json:true,
        headers: {
            'ticket':ticket 
        },
        timeout: 1000000
    }
   
    return new Promise(function (resolve, reject) {
      console.log(option,"OPTIONS 2 ####################");
      
      request(option, function (error, res, body) {
        if (!error && res.statusCode == 200){   
            let obj2={
                url:url,
                response:JSON.stringify(body),
                process:process.pid,
                time:dateFormat(now, "dd,mm, yyyy,h")
              }
              logger.log({level:'info',message:obj2})
          resolve(body);
        } else { 
          console.log("IN ACTIVATE ERR<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",res.statusCode,res.body);
          let obj3={
            url:url,
            response:JSON.stringify(body),
            process:process.pid,
            time:dateFormat(now, "dd,mm, yyyy,h")
          }
          logger.log({level:'error',message:obj3})
          reject(error);
        }
      });
    });
  }
  /////////////////////////////////////////////////////////////////////////////////
  async function main() {

  try{

    // await delay(1000);
    url='/stage/driver'
    regObject = await start(url,'POST',Supervisor,generate.driver())
    console.log(regObject.email,"#######################stage driver=================================");
    
    regObject.password=helper.generate('mix', 8)
    regObject.mobileNumber="010"+helper.generate('numeric', 8)
    formData = {
        'image': fs.createReadStream('./image.jpg'),
        'email': regObject.email,
        'password':regObject.password,
        'mobileNumber':regObject.mobileNumber,
        'regCode':regObject.regCode,
     };
    //  await delay(1000);
    url='/activate/driver'
    let _driver=  await activeDriver(url,'POST',null,formData)
   
 console.log(_driver.user._id,"=========================== DRIVER ID ############################");
 
 await delay(2000);
    url='/create/rider'
    rider=generate.rider()
    let riders=await start(url,'POST',null,rider)
    
   console.log(riders,"===================================CREATE #############################################");
   await delay(2000);
    url='/access/rider'
    let _rider=await start(url,'POST',null,rider)
   
    console.log(_rider,"==========================ACCESS #############################################");


if(_rider){

     await delay(2000);
     url='/location'
     console.log(obj,"center***************");
     let bg=helper.generateBgLocation(obj,300)
     let bgRider=await start(url,'POST',_rider.ticket,bg)
    
     console.log(bgRider,"========================= BG LOCATION RIDER #########################");
if(bgRider){
     await delay(2000);
    bg=helper.generateBgLocation(obj,500)
  let bgDriver=await start(url,'POST',_driver.ticket,bg)

  console.log(bgDriver,"========================= BG LOCATION DRIVER #########################");
}
   await delay(2000);
    url='/user/push'
    let pushId="bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1bk3RNwTe3H0:CI2kbk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1bk3RNwTe3H0:CI2k"
    let rider_id=await start(url,'POST',_rider.ticket,{'pushId':pushId})
  
    console.log(rider_id,"========================= PUSH ID RIDER #########################");

    let driver_id=await start(url,'POST',_driver.ticket,{'pushId':pushId})
  
    console.log(driver_id,"========================= PUSH ID DRIVER #########################");
  
    await delay(2000);
   url='/add/car'
   let car={
    'uniqueId':helper.generate('numeric',6),
    'desc':helper.generate("lalpha",30)
   }
    let carId=await start(url,'POST',Supervisor,car)
    console.log(carId,"========================= CREATE CAR #########################");

    await delay(1000);
    url='/car/driver'
    let msg=await start(url,'POST',_driver.ticket,carId)   
    console.log(msg,"========================= CONNECT DRIVER TO CAR #########################");
 
    await delay(2000);
    url='/journey'
    let jour=await start(url,'POST',_rider.ticket,coords)
    console.log(jour,"========================= CREATE JOURNEY #########################");

   await delay(2000);
    url='/journey/latest'
    let last=await start(url,'GET',_rider.ticket)
    console.log(last.journey._id,"========================= GET LAST JOURNEY #########################");
    
    
    await delay(3000);
    url='/journey/accept'
    let accept=await start(url,'POST',_driver.ticket,{"journeyId":last.journey._id})
    console.log(accept.journey._id,"========================= ACCEPT JOURNEY #########################");
 

    await delay(2000);
    url='/journey/start'
    let startJ=await  start(url,'POST',_driver.ticket,{"riderCode":accept.journey.riderCode})
    console.log(startJ,"========================= START JOURNEY #########################");
    
    await delay(2000);
    // for(let c=0; c<600; c++){
    //   console.log("hereeeeeeeeeeeeeeeeeeeee");
    //   url='/location'
    //   let bg=await start(url,'POST',_driver.ticket,helper.generateBgLocation(obj,500))
    //   console.log(bg,"========================= BG LOCATION  #########################");
    //   await delay(1000);
    // }
   
    let time=setInterval(async function(){
    console.log("HEREEEEE**************************************************");
          url='/location'
          let bg=await start(url,'POST',_driver.ticket,helper.generateBgLocation(obj,500))
          console.log(bg,"========================= BG LOCATION  #########################");
          if(end){
          console.log("============================CLEAR INTERVAL======================");
            clearInterval(time)
          }
    },1000)
      
setTimeout(async function(){
    console.log("%%%%%%%%%%%%%%%%%%%%%%JOURNNEY END%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    url='/journey/end'
    end=await start(url,'POST',_driver.ticket,{"riderCode":startJ.journey.riderCode})
     console.log(end.journey.cost,"%%%%%%%%%%%%%%%%%%%%%%JOURNNEY END%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
         arr[end.journey._id] =end.journey.cost
         fs.appendFile('history.json',`{${JSON.stringify(arr)} ,"prossesID": ${process.pid}}`+','+'\r\n')
         console.log(arr,"ARRAYYYYYY_____________________________==###");
         
    },600000)

  }//  
  }catch(err) {
    console.log("####################################ERROR",err)
  }

}
  async.times(2, main, function(result){

    console.log("RESULT############################");	
    if (process.pid) {
      console.log('This process is your pid :' + process.pid);
    }
})