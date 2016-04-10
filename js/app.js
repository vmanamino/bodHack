// record for food establishment
var indexRecord = {
    name: '',
    address: '',
    zip: '',
    violations: 0
};

// record for each violation referencing each index record via the businessname
var violation = {
    businessname: '',
    violation: '',
    description: '',
    comments: '',
    result: '',
    resultdttm: ''
};

function showName(name){
    var entry = $('.templates .entry').clone();
    var entryName = entry.find('.name a');
    entryName.text(name);
    $('.listing').append(entry);
}

function addIndex(index){
    for (var i = 0; i < index.length; i++){
        showName(index[i]);
    }
}

// create the index that will point to a business record
function createIndex(names){
    // list of establishment names for quick handling, conservative layout, and easy referencing
    var indexList = new Array();
    var names = names.sort();
    console.log(names.length + "length of names");
    for (var i = 0; i < names.length; i++){
        if (i){
            if (!(names[i] === names[i-1])){
                // adding element by assignment with equal didn't work?
                // console.log(names[i]);
                indexList.push(names[i]);
            }
        }
        else {
            // adding elements by assignment with equal didn't work?
            // console.log(names[i]);
            indexList.push(names[i]);
        }
    }
    console.log("length of index" + indexList.length);
    // for (var i = 0; i < indexList.length; i++) {
    //     console.log(indexList[i]);
    // }
    addIndex(indexList);
    
}

// group returned establishments by bussinessname
function groupEstablishments(response){
    // response = response.sort();
    $('.listing').empty();
    console.log(response.length + "length of response");
    var names = [];
    
    for (var i = 0; i < response.length; i++ ){
        names[i] = response[i].businessname;
    }
    createIndex(names);
    
}

function getZip(zip){
    // console.log("get establishment");
    var request = {
        $query: 'SELECT businessname, address, zip, violdesc, comments, result, resultdttm, violation WHERE zip=\''+zip+'\'' //ORDER BY businessname DESC
    };
    
    $.ajax({
        url: "https://data.cityofboston.gov/resource/qndu-wx8w",
        data: request,
        dataType: 'json',
        type: 'GET'
    })
    .done(function(response){
        console.log("call received and answered successfully");
        console.log(response.length);
        groupEstablishments(response);
        
        
    })
    .fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.listing').append(errorElem);
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
        // $(".listing").empty();
        $('.listing').html('');
        var zip = $(this).find("input[name='zip']").val();
        getZip(zip);
    });
});