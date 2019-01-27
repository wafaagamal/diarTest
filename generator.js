var helper = require('./test-helper');

module.exports={
    driver:function () {
        return {
          email: helper.generate('lalpha', 20) + "@gmail.com",
          password:helper.generate('mix',20),
          fullname:helper.generate('all-alpha',6)+" "+helper.generate('all-alpha',6),
          mobileNumber:"011"+helper.generate('numeric',8)
        }
      }, 
      //create new Rider
     rider:function () {
        return {
          email: helper.generate('lalpha', 20) + "@gmail.com",
          fullname:helper.generate('all-alpha',6)+" "+helper.generate('all-alpha',6),
          password:helper.generate('mix',20),
          nationality:"Egyptian",
          mobileNumber:"011"+helper.generate('numeric',8)
        }
    },
    // super admin
   superadmin:function(){
        let superadmin = {
            email:process.env.SUPER_EMAIL,
            password: process.env.SUPER_PASSWORD
        };
       return superadmin
    },
    //create admin/supervisor/driver [register]
    staff:function(){
        return{
            email: helper.generate('lalpha', 20) + "@gmail.com",
            fullname:helper.generate('all-alpha',6)+" "+helper.generate('all-alpha',6),
        }
        
    }

}
 