
var questionList = [
    {metric: "MarketCapitalization", text: "Which has more market capital?"},
    {metric: "SalesOrRevenue", text: "Which has more revenue?"},
    {metric: "NumberOfEmployees", text: "Which has more employees?"},
    {metric: "OperatingMargin", text: "Which has a higher operating margin?"},
    {metric: "BookValue", text: "Which has a higher book value?"},
    {metric: "PERatio", text: "Which has a higher PE Ratio?"},
    {metric: "EarningsGrowth", text: "Which has more earnings growth?"},
    {metric: "Beta", text: "Which has higher beta?"},
    {metric: "TotalOperatingExpenses", text: "Which has more total operating expenses?"}
];
/*EBITDAMargin
* DividendRate*/
var token = "FCAC0E1A3DB14E33993F2F10C1A281BA";
// used in getLogo
var logo_url = "";
// used in getAllMetrics
var metric_output = [];

var sap500 = $.getJSON("static/constituents.json", function(json) {
    return json;
});

jQuery.ajaxSetup({async:false});

var response;
var errorCount = 0;

$("button").click(renderQuestion());

/**
 * Manipulates the dom to show a new question
 */
function renderQuestion() {
    var q = questionLoad();
    $(".question").text(q.question);

    var comps = $('.card-square');

    // Update titles, images and correct values for the new question
    comps[0].find("a").text(q.option1.name);
    comps[0].attr('isCorrect', String(q.answer));
    comps[0].child(1).css("background-image", "url("+q.option1.logo+")");

    comps[1].find("a").text(q.option2.name);
    comps[1].attr('isCorrect', String(!q.answer));
    comps[1].child(1).css("background-image", "url("+q.option2.logo+")");

    // Bind click actions to the two options
    comps.unbind('click');
    comps.click(processAnswer());

    $("button").addClass("hide");
}

/**
 * Manipulates the dom to react to one of the options being selected
 * correct or incorrect
 */
function processAnswer() {
    this.html

    $("button").removeClass("hide");
}

/**
 * Generates the data for a question to be displayed
 * @return list containing Question, Option1 Name, Option2 Name, Answer, Option1 Logo Url,
 */
function questionLoad() {
    var isValid = false;
    while (!isValid && errorCount < 5) {
        isValid = true;
        var num = Math.floor(Math.random() * questionList.length);

        // Make api calls and get data for question generation
        try {
            var companyPair = getRandomCompanyPair();
            var value1 = getMetric(companyPair[0].symbol, questionList[num].metric);
            var value2 = getMetric(companyPair[1].symbol, questionList[num].metric);
            var logo1 = getLogo(companyPair[0].symbol);
            var logo2 = getLogo(companyPair[1].symbol);

            // Create question option objects
            var option1 = {
                symbol: companyPair[0].symbol,
                name: companyPair[0].name,
                value: value1,
                logo: logo1
            };
            var option2 = {
                symbol: companyPair[1].symbol,
                name: companyPair[1].name,
                value: value2,
                logo: logo2
            };

            // Create question object
            var question = {question: questionList[num].text, answer: (value1>value2), option1: option1, option2: option2};
        } catch (err) {
            // An api call failed, restart generation process
            console.log(err.message);
            isValid = false;
            errorCount += 1;
        }
    }
    return question;
}

/**
 * Returns two random companies from the same industry
 * @return list containing 2 Company Objects {symbol, name, sector)
 */
function getRandomCompanyPair() {
    var num = Math.floor(Math.random() * 494);
    var company1 = sap500.responseJSON[num];
    var sector1 = company1.Sector;
    var fsap500 = sap500.responseJSON.filter(function(value) { return value.Sector == sector1});
    num = Math.floor(Math.random() * fsap500.length);
    var company2 = fsap500[num];
    if (company1.symbol == company2.symbol) { throw "same company"; }
    return [company1, company2];
}

/**
 * Return the value of the specified metric and company symbol
 * @return list containing 2 Name Objects (Option1 Name, Option2 Name, Answer, Option1 Logo Url,
 */
function getAllMetrics(symbol) {
    // flush out the current contents, if any
    metric_output = [];
    var metrics = "CompanyName,Website,";
    for (var i = 0; i < questionList.length; i++) {
        if (i == questionList.length - 1) { metrics += questionList[i].metric }
        else { metrics += questionList[i].metric + ","; }
    }
    var APIURL = "http://factsetfundamentals.xignite.com/xFactSetFundamentals.json/GetFundamentals?IdentifierType=Symbol&Identifiers=" + symbol + "&FundamentalTypes=" + metrics + "&AsOfDate=2/12/2016&ReportType=Annual&ExcludeRestated=false&UpdatedSince=&_token" + token;
    $.getJSON(APIURL, function(data) {
        for (var i = 0; i < questionList.length; i++) { 
            metric_output.push(data[0].FundamentalsSets[0].Fundamentals[i].Value); 
        }
    });
    return metric_output;
}

/**
 * Return the url of a companies logo given the symbol of the company
 * @param symbol of company
 * @return list containing Question, Option1 Name, Option2 Name, Answer, Option1 Logo Url,
 */
function getLogo(symbol) {
    var APIURL = "http://factsetfundamentals.xignite.com/xFactSetFundamentals.json/GetFundamentals?IdentifierType=Symbol&Identifiers=" + symbol + "&FundamentalTypes=Website&AsOfDate=2/12/2016&ReportType=Annual&ExcludeRestated=false&UpdatedSince=&_token" + token;
    $.getJSON(APIURL, function(data) {
        var result = data[0].FundamentalsSets[0].Fundamentals[0].Value; 
        var start = result.indexOf(".");
        var domain = result.substring(start + 1, result.length);
        logo_url = "https://logo.clearbit.com/" + domain;
    });
    return logo_url;
}

function fuck(){
    
    var APIURL = "http://www.xignite.com/xLogos.json/GetLogo?IdentifierType=Symbol&Identifier=ATVI&_callback=getMetricReturn";
    var finalURL = APIURL + "&Username=" + token;

    $.ajax({
        url:finalURL,
        dataType: 'jsonp',
        jsonp : false,
        jsonpCallback: 'jsonCallback',
        async: false
    })
}

function getMetricReturn(data) {
    response = data;
    // console.
}