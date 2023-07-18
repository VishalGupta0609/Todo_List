 // jshint eversion:6

module.exports.getDate = function getDate(){
    
    let tdate = new Date();

    let options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    };

    let day= tdate.toLocaleDateString("en-US",options);
    return day;

 }

exports.getDay = getDay ;

 function getDay()
 {
    let tdate = new Date();

    let options = {
        weekday : "long",
    };

    let day= tdate.toLocaleDateString("en-US",options);
    return day;
   
 }