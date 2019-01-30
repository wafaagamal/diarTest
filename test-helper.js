
deg2rad = function(deg) {
    return deg * (Math.PI/180)
};

/**
	 * generate random coords
	 * @param  {object} center {lat: number, lng:number}
	 * @param  {number} radius [in meter]
	 * @return {[type]}        [description]
	 */
	generateCoords = function(center={lat:30.0384389,lng:31.3422343}, radius = 500){

		console.log(`center==> ${JSON.stringify(center)}`)
	    var y0 = parseFloat(center.lat);
	    var x0 = parseFloat(center.lng);
	    var rd = radius / 111300; //about 111300 meters in one degree

	    var u = Math.random();
	    var v = Math.random();

	    var w = rd * Math.sqrt(u);
	    var t = 2 * Math.PI * v;
	    var x = w * Math.cos(t);
	    var y = w * Math.sin(t);

	    //Adjust the x-coordinate for the shrinking of the east-west distances
	    var xp = x / Math.cos(y0);

	    var newlat = y + y0;
	    var newlon = x + x0;
	    var newlon2 = xp + x0;

		console.log(`newLat => ${newlat}`)
	    return {
	        'lat': newlat.toFixed(5),
	        'lng': newlon.toFixed(5)
	    };


};

getDistanceFromLatLonInKm = function(coord1, coord2) {
    console.log(coord1);
    console.log(coord2)
    let R = 6371, 
    lat1 = parseFloat(coord1.lat);
    lng1 = parseFloat(coord1.lng);
    lat2 = parseFloat(coord2.lat);
    lng2 = parseFloat(coord2.lng);

    // console.log(lat1);
    // console.log(lng1);
    // console.log(lat2);
    // console.log(lng2)

    dLat = deg2rad(lat2-lat1),

    dLng = deg2rad(lng2-lng1),

    a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2),

    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)),

    d = R * c; 
    return d;
};


module.exports = {

    generateCoords: generateCoords,

    generate: function(opt, length){

        var text     = "";
        var possible = [];

        switch(opt) {
            case 'lalpha':
                possible = ["abcdefghijklmnopqrstuvwxyz"];
                break;
            case 'ualpha':
                possible = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
                break;
            case 'all-alpha':
                possible = [
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    "abcdefghijklmnopqrstuvwxyz"];
                break;
            case 'numeric':
                possible = ["0123456789"]
                break;
            case 'mix':
                var possible = [
                    "@$!%*?&",
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    "abcdefghijklmnopqrstuvwxyz", 
                    "0123456789"
                  ];
                break;
            default:
                return false;
        }
        var x = 0;
        for( var i=0; i < length; i++ ){
            if(x==(possible.length)){x=0;}
            text += possible[x].charAt(Math.floor(Math.random() * possible[x].length));
            x++;
	    }
        return text;
    },
    generateNationalId: function () {
        var centurey = 2;
        var day = Math.floor((Math.random() * 28) + 1);
        var month = Math.floor((Math.random() * 12) + 1);
        var year = Math.floor(Math.random() * (2002 - 1990 + 1) + 1990)+"";    
        var codeRegion = Math.floor(Math.random() * (4 - 1 + 1) + 1);
        var secretCode = Math.floor(Math.random() * (2000 - 1000 + 1) + 1000);
        var codeID = Math.floor(Math.random() * (7 - 1 + 1) + 1);    
        codeRegion = ("0" + codeRegion).slice(-2);        
        if (day<10) {
            day = ("0" + day).slice(-2);
        }    
        if(month<10) {
            month = ("0" + month).slice(-2);        
        }
        return centurey +year[2]+year[3]+month+day+codeRegion+secretCode+codeID;    
    },


     
	
    generateIntBetween: function(min, max){
  		return Math.floor(Math.random() * (max - min) + min);
	},
	//[lng1, lat1] [lng2, lat2]

    
    generateBgLocation: function(center={lat:30.0384389,lng:31.3422343}, radius = 500){


        
        let bgObj = {
            "provider":"fused",
            "time":1528819065498,
            "latitude":30.1332493,
            "longitude":31.3605612,
            "accuracy":16,
            "altitude":46,
            "locationProvider":1}
        let coords = generateCoords(center, radius);

        // console.log("****** generated coords with a distnace difference of in KM =====>");
        // console.log(getDistanceFromLatLonInKm({lat:bgObj.latitude, lng:bgObj.longitude}, coords))
        bgObj.latitude = coords.lat;
        bgObj.longitude = coords.lng;
        console.log(bgObj,"TEST HELPERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
        
        return [
            bgObj
        ]
    }

}







