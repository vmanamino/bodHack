// record for food establishment
var indexRecord = {
    name: '',
    address: '',
    zip: '',
    violations: 0
};

var records = new Array();

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
    entryName.click(function(e){
        e.preventDefault();
        addRecord(name);
    });
    entryName.text(name);
    $('.listing').append(entry);
}

function showRecord(object){
    var establishment = $('.templates .establishment').clone();
    var estName = establishment.find('.name');
    estName.text(object.name);
    var estAddress = establishment.find('.address');
    estAddress.text(object.address);
    var estZip = establishment.find('.zipcode a');
    estZip.text(object.zip);
    estZip.click(function(e){
        e.preventDefault();
        getZip(object.zip);
    });
    var estViolations = establishment.find('.violations-count a');
    estViolations.text(object.violations);
    $('.listing').empty();
    $('.record').empty();
    $('.record').append(establishment);
}

function addRecord(name){
    var which = records.map(function(il){
        return il.name;
    }).indexOf(name);
    var object = records[which];
    // console.log(object);
    showRecord(object);
}

function addIndex(index){
    for (var i = 0; i < index.length; i++){
        showName(index[i]);
    }
}

// function linkToRecord(name){
    
// }

function createRecords(response, names){
    records.length = 0;
    var responseSorted = new Array();
    
    //sort response array to make things faster
    responseSorted = response.sort(function(a, b){
        if (a.businessname > b.businessname){
            return 1;
        }
        if (a.businessname < b.businessname){
            return -1;
        }
        return 0;
    });
    // console.log("create Records");
    // for (var i = 0; i < responseSorted.length; i++){
    //     // console.log(responseSorted[i].businessname);
    // }
    var offset = 0;
    for (var i = 0; i < names.length; i++){
        var record = Object.create(indexRecord);
        record.name = names[i];
        for (var j = offset; j < responseSorted.length; j++ ){
            if (record.name == responseSorted[j].businessname){
                record.violations += 1;
                if (!record.zip){
                    record.zip = responseSorted[j].zip;
                }
                if (!record.address){
                    record.address = responseSorted[j].address;
                }
            }
            else {
                offset = j;
                break;
            }
        }
        records.push(record);
    }
    // console.log(records);
    // var display = records.map(function(il){
    //     return il.name;
    // }).indexOf('HOT TOMATOES');
    // console.log(display);
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
    showSearchResults(names.length, indexList.length);
    return indexList;
    
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
    names = createIndex(names);
    createRecords(response, names);
    
}

function showSearchResults(violNum, estNum){
    $('.search-results').empty();
    var number = violNum + " violations total by the following "+ estNum + " food establishments" ;
    $('.search-results').append(number);
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
        // console.log(response.length);
        // var results = showSearchResults(response.length);
        // $('.search-results').append(results);
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