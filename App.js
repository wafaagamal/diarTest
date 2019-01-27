var request = require('request');
var generate=require('./generator')
let helper=require('./test-helper')
const fs = require('fs');
let formData
let supervisor="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjIwOTg3MDQwNSwiZXhwIjoxNTQ4NzUyODk3MDAwMDAwLCJpYXQiOjE1NDg0OTM2OTcwMDAwMDAsImRhdGEiOnsiX2lkIjoiNWM0YzIzODE4YWYwYmExYWIwN2IyYWQ0Iiwicm9sZSI6InN1cGVydmlzb3IifX0.Ob9-jCjOO_faao55FyUwDUOkFVvozexhHckh1HXH8ns"
var regObject
let rider
let driverTickets=new Array()
let riderTickets=new Array()
let location

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


function stageDriver() {
   
    let option={
        url: "http://localhost:3000/api/stage/driver",
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json", 
            'ticket':supervisor 
        },
        body: generate.driver()
    }
    // console.log('######################333',option);
    
    return new Promise(function (resolve, reject) {
      request(option, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      });
    });
  }

  

  function activateDriver(option) {
    return new Promise(function (resolve, reject) {
      request(option, function (error, res, body) {
        if (!error && res.statusCode == 200) {
        
          resolve(body);
        } else {
          reject(error);
        }
      });
    });
  }
  
function createRider(){
  // console.log("************************************************");
 rider= generate.rider()
  let option={
    url: "http://localhost:3000/api/create/rider",
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json", 
    },
    body:rider
   }

  
       return new Promise(function (resolve, reject) {
          request(option, function (error, res, body) {
            if (!error && res.statusCode == 200) {  
    //  console.log(res,"CREATE%%%%%")
               resolve(body);
            } else {
              reject(error);
            }
          });
        });
    
  } 
function  accessRider(){

  let option={
    url: "http://localhost:3000/api/access/rider",
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json", 
    },
    body:rider,
  }

  return new Promise(function (resolve, reject) {
    request(option, function (error, res, body) {
      if (!error && res.statusCode == 200) {     
         resolve(body);
      } else {
        reject(error);
      }
    });
  });
}
  function bgLocation(ticket){
    location=helper.generateBgLocation(obj,500)
    // console.log(location,"+++++++++++++++++++++++++++++++++");
    
    let opt={
      url: "http://localhost:3000/api/location",
      method: "POST",
      json: true,
      headers: {
          "content-type": "application/json", 
          "ticket":ticket
      },
      body:location   
    }
    return new Promise(function (resolve, reject) {
      request(opt, function (error, res, body) {
        if (!error && res.statusCode == 200) {  
           resolve(body);
        } else {
          reject(error);
        }
      });
    });
  }
function pushId(ticket){
  let pushId="bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1bk3RNwTe3H0:CI2kbk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1bk3RNwTe3H0:CI2k"
  let opt={
    url: "http://localhost:3000/api/user/push",
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json", 
        "ticket":ticket
    },
    body:{pushId}   
  }
  
  return new Promise(function (resolve, reject) {
    request(opt, function (error, res, body) {
      if (!error && res.statusCode == 200) {  
        // console.log(res,"RESPONDESFAEG>RD++++++++++++++++++++");
        
         resolve(body);
      } else {
        reject(error);
      }
    });
  });
}
  function createJourney(ticket){     
    let opt={
      url: "http://localhost:3000/api/journey",
      method: "POST",
      json: true,
      headers: {
          "content-type": "application/json", 
          "ticket":ticket
      },
      body:coords   
    }
    
    return new Promise(function (resolve, reject) {
      request(opt, function (error, res, body) {
        if (!error && res.statusCode == 200) {  
          // console.log(body,"RESPONDESFAEG>RD");
          
           resolve(body);
        } else {
          reject(error);
        }
      });
    });
  }

function newCar(){

  let opt={
    url: "http://localhost:3000/api/add/car",
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json", 
        "ticket":supervisor
    },
    body:{
      'uniqueId':helper.generate('numeric',6),
      'desc':helper.generate("lalpha",30)
     }
  }
  
  return new Promise(function (resolve, reject) {
    request(opt, function (error, res, body) {
      if (!error && res.statusCode == 200) {  
        // console.log(body,"RESPONDESFAEG>RD");
        
         resolve(body);
      } else {
        reject(error);
      }
    });
  });

}
function carDriver(ticket,carId){
  let opt={
    url: "http://localhost:3000/api/car/driver",
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json", 
        "ticket":ticket
    },
    body:carId
  }
  
  return new Promise(function (resolve, reject) {
    request(opt, function (error, res, body) {
      if (!error && res.statusCode == 200) {  
        // console.log(body,"RESPONDESFAEG>RD");
        
         resolve(body);
      } else {
        reject(error);
      }
    });
  });
}
function lastjour(ticket){
  let opt={
    url: "http://localhost:3000/api/journey/latest",
    method: "GET",
    json: true,
    headers: {
        "content-type": "application/json", 
        "ticket":ticket
    }
  }
  
  return new Promise(function (resolve, reject) {
    request(opt, function (error, res, body) {
      if (!error && res.statusCode == 200) {  
        // console.log(body,"RESPONDESFAEG>RD");
        
         resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

function acceptJour(journeyId,ticket){
  let opt={
    url: "http://localhost:3000/api/journey/accept",
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json", 
        "ticket":ticket
    },body:{"journeyId":journeyId}
  }
  
  return new Promise(function (resolve, reject) {
    request(opt, function (error, res, body) {
      if (!error && res.statusCode == 200) {  
        // console.log(body,"RESPONDESFAEG>RD");
        
         resolve(body);
      } else {
        reject(error);
      }
    });
  });
}
function startjour(riderCode,ticket){
  let opt={
    url: "http://localhost:3000/api/journey/start",
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json", 
        "ticket":ticket
    },body:{"riderCode":riderCode}
  }
  
  return new Promise(function (resolve, reject) {
    request(opt, function (error, res, body) {
      if (!error && res.statusCode == 200) {  
        // console.log(body,"RESPONDESFAEG>RD");
        
         resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

function endjour(riderCode,ticket){
  let opt={
    url: "http://localhost:3000/api/journey/end",
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json", 
        "ticket":ticket
    },body:{"riderCode":riderCode}
  }
  
  return new Promise(function (resolve, reject) {
    request(opt, function (error, res, body) {
      if (!error && res.statusCode == 200) {  
        // console.log(body,"RESPONDESFAEG>RD");
        
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
   regObject = await stageDriver()
    regObject.password=helper.generate('mix', 8)
    regObject.mobileNumber="010"+helper.generate('numeric', 8)
    formData = {
        'image': fs.createReadStream('image.jpg'),
        'email': regObject.email,
        'password':regObject.password,
        'mobileNumber':regObject.mobileNumber,
        'regCode':regObject.regCode,
     };
    let option={
        url: "http://localhost:3000/api/activate/driver",
        method: "POST",
        formData:formData,
        json:true
    }

  //  console.log("##############################################");
    
   let _driver=  await activateDriver(option)
      //  console.log("333333333333333333333333333333",res);
    //  driverTickets.push(res.ticket)
     // console.log(driverTickets);
     let riders=await createRider()
    // console.log(riders,'COUNTTTTTTTTTTTTTTTTTTTTTTTTTTttt');
    // console.log(riderTickets[i],"+++++++++++++++++++++++++++++++++-------------------rider");
   
      let rider=await accessRider()
      //console.log(rider,"TREEEEEEEEEEEEEEEEEEE");
          
    // riderTickets.push(result.ticket)
   // console.log(rider.ticket,"))))))))))))))((((((((((((((((((");
    
     let r=await bgLocation(rider.ticket)
    // console.log(r,"bgrider************************88"); 
    
      let id=await pushId(rider.ticket)
     // console.log(id,"+++++++++++++++++=");
      
     let d=await bgLocation(_driver.ticket)
    // console.log(d,"+++++++++++++++++++++++++");
    let i=await pushId(_driver.ticket)
 //console.log(i,"+++++++++++++++++++++++++");
     let jour=await createJourney(rider.ticket)
   // console.log(jour,"+++++=================journy");
     let carId=await newCar()
    //  console.log(car,"CAR^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    let msg=await carDriver(_driver.ticket,carId)
    // console.log(msg,"+++++++++++++++++++++++++=");
     let Jo=await lastjour(rider.ticket)
//console.log(Jo.journey._id,"+****************************");
     let a=await acceptJour(Jo.journey._id,_driver.ticket)
   //  console.log(a,"++++++++++++++++++++++++++==acept");
      let b=await  startjour(a.journey.riderCode,_driver.ticket)
     // console.log(b,"++++++++++++++++++++++++++==acept");
      let dtt=await bgLocation(_driver.ticket)
      let end=await  endjour(b.journey.riderCode,_driver.ticket)
      console.log(end,"%%%%%%%%%%%%%%%%%%%%%%");
      
  }catch(err) {
    console.log("####################################ERROR",err)
  }

}
let cnt=0
let time=setInterval(function(){
    main();
   
    if(cnt==50){
        clearInterval(time)
        console.log("####################################################");
      //  console.log("end",driverTickets);
        console.log(riderTickets.length,"CREATE*********************************");
      //  console.log(driverTickets.length,"ARRAY================================");
        
    }
    cnt++;
  
  },1000)

  