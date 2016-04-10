

function getZip(zip){
    // console.log("get establishment");
    
    var request = {
        $query: 'SELECT businessname, address, zip, violdesc, comments, result, resultdttm, violation WHERE zip=\''+zip+'\' ORDER BY resultdttm DESC'
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



// function getEstablishment(establishment){
//     // console.log("get establishment");
    
//     var request = {
//         $query: 'SELECT businessname, address, zip, violdesc, comments, result, resultdttm, violation WHERE businessname=\''+establishment+'\''
//     };
    
//     $.ajax({
//         url: "https://data.cityofboston.gov/resource/qndu-wx8w",
//         data: request,
//         dataType: 'json',
//         type: 'GET'
//     })
//     .done(function(response){
//         console.log(response); 
//     });
// }


$(document).ready( function() {
    // console.log("document ready!");
    // $(".est-getter").submit(function(e){
    //     e.preventDefault();
    //     $(".listing").html('');
    //     var establishment = $(this).find("input[name='establishment']").val();
    //     // establishment = "IDA'S RESTAURANT";
    //     getEstablishment(establishment);
    // });
    $(".zip-getter").submit(function(e){
        e.preventDefault();
        $(".listing").html('');
        var zip = $(this).find("input[name='zip']").val();
        getZip(zip);
    });
});