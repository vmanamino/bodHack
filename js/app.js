function getZip(){
    // console.log("get establishment");
    
    var request = {
        $query: 'SELECT businessname, address, zip, violdesc, comments, result, resultdttm, violation WHERE zip=\'02113\''
    };
    
    $.ajax({
        url: "https://data.cityofboston.gov/resource/qndu-wx8w",
        data: request,
        dataType: 'json',
        type: 'GET'
    })
    .done(function(response){
    //   console.log(response); 
    });
}



function getEstablishment(establishment){
    // console.log("get establishment");
    
    var request = {
        $query: 'SELECT businessname, address, zip, violdesc, comments, result, resultdttm, violation WHERE businessname=\''+establishment+'\''
    };
    
    $.ajax({
        url: "https://data.cityofboston.gov/resource/qndu-wx8w",
        data: request,
        dataType: 'json',
        type: 'GET'
    })
    .done(function(response){
        console.log(response); 
    });
}


$(document).ready( function() {
    // console.log("document ready!");
    var establishment = "Pasta & Pomodoro";
    getEstablishment(establishment);
    
});