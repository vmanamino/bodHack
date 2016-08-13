// record for food establishment
var indexRecord = {
    name: '',
    address: '',
    zip: '',
    violations: 0,
    offset: 0
};

var records = new Array();

// record for each violation referencing each index record via the businessname
var violation = {
    businessname: '',
    violation: '',
    desc: '',
    comments: '',
    result: '',
    resultdttm: ''
};

var violations = new Array();

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
        $(".record").empty();
        getZip(object.zip);
    });
    var estViolations = establishment.find('.violations-count a');
    estViolations.text(object.violations);
    estViolations.click(function(e){
        e.preventDefault();
        $(".record").empty();
        addViolation(object);
    });
    $('.listing').empty();
    $('.violations').empty();
    $('.record').empty();
    $('.record').append(establishment);
}

function showViolation(object){
    var viol = $(".templates .violation").clone();
    var name = viol.find('.name a');
    name.text(object.businessname);
    name.click(function(e){
        e.preventDefault();
        $(".violations").empty();
        addRecord(object.businessname);
    });
    
    if (object.violation){
        var code = viol.find('.code');
        code.text(object.violation);
    }
    else {
        var label = viol.find('.label-code');
        label.css("display", "none")
    }
    
    if (object.desc){
        var desc = viol.find('.desc');
        desc.text(object.desc);
    }
    else {
        var label = viol.find('.label-desc');
        label.css("display", "none")
    }
   
    if (object.comments){
        var comments = viol.find('.comments');
        comments.text(object.comments);
    }
    else {
        var label = viol.find('.label-comments');
        label.css("display", "none");
    }
    
    if (object.result){
        var result = viol.find('.result');
        result.text(object.result);
    }
    else {
        var label = viol.find('.label-result');
        label.css("display", "none")
    }
    
    if (object.resultdttm){
        var resultdt = viol.find('.resultdt');
        resultdt.text(object.resultdttm);
    }
    else {
        var label = viol.find('.label-resultdt');
        label.css("display", "none");
    }
    
    
    $('.record').empty();
    $('.violations').append(viol);
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

function addViolation(object){
    // console.log("addViolation");
    var viols = new Array();
    for (var i = object.offset; i < (object.offset + object.violations); i++){
        // console.log(violations[i]);
        // showViolation(violations[i]);
        viols.push(violations[i]);
    }
    viols.sort(function(a, b){
        if (a.resultdttm > b.resultdttm){
            return -1;
        }
        if (a.resultdttm < b.resultdttm){
            return 1;
        }
        return 0;
    });
    for (var i = 0; i < viols.length; i++) {
        console.log(viols[i]);
        showViolation(viols[i]);
    }
}

function createRecords(response, names){
    records.length = 0;
    violations.length = 0;
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
            var violationRecord = Object.create(violation);
            if (record.name == responseSorted[j].businessname){
                violationRecord.businessname = responseSorted[j].businessname;
                violationRecord.violation = responseSorted[j].violation;
                violationRecord.desc = responseSorted[j].violdesc;
                violationRecord.comments = responseSorted[j].comments;
                violationRecord.result = responseSorted[j].result;
                violationRecord.resultdttm = responseSorted[j].resultdttm;
                violations.push(violationRecord);
                record = uniqueRecord(record, responseSorted[j], offset);
            }
            else {
                offset = j;
                break;
            }
        }
        // 
        records.push(record);
    }
    console.log(records);
    // var display = records.map(function(il){
    //     return il.name;
    // }).indexOf('HOT TOMATOES');
    // console.log(display);
    console.log(violations);
}

//create record based on both name match (tested above) and address match (in the following function)
function uniqueRecord(record, responseSorted, offset){
    // this is a new and unique record, but also the first time that a businessname appears in the response
    if (!record.violations){
        record.zip = responseSorted.zip;
        record.address = responseSorted.address;
        record.offset = offset;
        record.violations = 1; // new and unique record
    }
    else {
        // this is a new and unique record, but the businessname has appeared before, which is why there is a match above
        // however, the current record passed in as a parameter has the address assigned in the first condition, and the current
        // response object has an address that is different, that is, a different establishment requiring a new record
        if (!(record.address === responseSorted.address)){
            var record = Object.create(indexRecord);
            record.name = responseSorted.businessname;
            record.zip = responseSorted.zip
            record.address = responseSorted.address;
            record.offset = offset;
            record.violations = 1; // new and unique
        }
        // if otherwise, the address matches, the establishment matches that in the response, and only the violations count
        // is incremented for that establishment.
        else {
            record.violations += 1;
        }
    }
    return record;
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
    var token = '';
    var request = {
        // $limit: 2000,
        // $offset: 0,
        $query: 'SELECT businessname, address, zip, violdesc, comments, result, resultdttm, violation WHERE zip=\''+zip+'\' LIMIT 50000'
        // $$app_token: token
        
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
        $(".search-results").html('');
        $(".listing").empty();
        $(".record").empty();
        $('.violations').empty();
        // $('.listing').html('');
        var zip = $(this).find("input[name='zip']").val();
        getZip(zip);
    });
});