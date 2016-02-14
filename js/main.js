
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

var sap500 = $.getJSON("static/constituents.json", function(json) {
    return json;
});

var response;


function demoLoad() {
    var nextQ = demoList[0];
    demoList.shift();
    demoList.push(nextQ);
    return nextQ;
}

/**
 * Manipulates the dom to show a new question
 */
function renderQuestion() {
    var q = demoLoad();
    //var q = questionLoad();

    $(".question").text(q.question);

    var comps = $('.card-square');

    // Update titles, images and correct values for the new question
    $(comps[0]).find("a").text(q.option1.name);
    $(comps[0]).attr('isCorrect', String(q.answer));
    $(comps[0]).children().eq(0).css("background-image", "url("+q.option1.logo+")");
    $(comps[0]).children().eq(1).addClass("invisible");
    $(comps[0]).children().eq(1).text(q.option1.value);
    $(comps[0]).children().eq(1).removeClass("correct");
    $(comps[0]).children().eq(1).removeClass("incorrect");

    $(comps[1]).find("a").text(q.option2.name);
    $(comps[1]).attr('isCorrect', String(!q.answer));
    $(comps[1]).children().eq(0).css("background-image", "url("+q.option2.logo+")");
    $(comps[1]).children().eq(1).addClass("invisible");
    $(comps[1]).children().eq(1).text(q.option2.value);
    $(comps[1]).children().eq(1).removeClass("correct");
    $(comps[1]).children().eq(1).removeClass("incorrect");

    $("button").addClass("hide");
}

/**
 * Manipulates the dom to react to one of the options being selected
 * correct or incorrect
 */
function processAnswer(sel) {
    var comps = $('.card-square');

    //comps.unbind('click');
    //comps.on('click',processAnswer());

    $(comps[0]).children().eq(1).removeClass("invisible");
    $(comps[1]).children().eq(1).removeClass("invisible");

    if ($(comps[0]).attr("isCorrect") == 'true' && $(comps[0]).id == sel) {
        if ($(comps[0]).attr('id') == sel) {
            $(comps[0]).children().eq(1).addClass("correct");
        } else {
            $(comps[1]).children().eq(1).addClass("incorrect");
        }
    } else if ($(comps[1]).attr('id') == sel) {
        $(comps[1]).children().eq(1).addClass("correct");
    } else {
        $(comps[0]).children().eq(1).addClass("incorrect");
    }

    $("button").removeClass("hide");
}

/**
 * Generates the data for a question to be displayed
 * @return list containing Question, Option1 Name, Option2 Name, Answer, Option1 Logo Url,
 */
function questionLoad() {
    var isValid = false;
    while (!isValid) {
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
        }
    }
    return question;
}

var demoList = [
    {
        question: "Which firm has a larger 'Market Capitalization'?",
        answer: false,
        option1:{
            symbol: "AMZN",
            name: "Amazon Inc.",
            value: "$245.25 Billion",
            logo: "https://logo.clearbit.com/amazon.com"
        },
        option2:{
            symbol: "MSFT",
            name: "Microsoft Corp.",
            value: "$399.26 Billion",
            logo: "https://logo.clearbit.com/microsoft.com"
        }
    },
    {
        question: "Which firm has a larger 'Market Capitalization'?",
        answer: true,
        option1: {
            symbol: "AMZN",
            name: "Amazon.com, Inc.",
            value: "$240.30 Billion",
            logo: "https://logo.clearbit.com/amazon.com"
        },
        option2: {
            symbol: "EBAY",
            name: "eBay Inc",
            value: "$27.00 Billion",
            logo: "https://logo.clearbit.com/ebay.ca"
        }
    },
    {
        question: "Which company holds a higher 'Beta' value?",
        answer: true,
        option1:{
            symbol: "T",
            name: "AT&T Inc.",
            value: "0.30",
            logo: "https://logo.clearbit.com/att.com"
        },
        option2:{
            symbol: "VZ",
            name: "Verizon Communications Inc.",
            value: "0.22",
            logo: "https://logo.clearbit.com/verizon.com"
        }
    },
    {
        question: "Which company has a higher 'Earnings Per Share' (EPS) value for 2015?",
        answer: false,
        option1:{
            symbol: "YHOO",
            name: "Yahoo! Inc.",
            value: "-4.62",
            logo: "https://logo.clearbit.com/yahoo.com"
        },
        option2:{
            symbol: "MSFT",
            name: "Microsoft Corp.",
            value: "1.40",
            logo: "https://logo.clearbit.com/microsoft.com"
        }
    },
    {
        question: "Which firm has a more favourable 'Price To Earnings' (P/E) ratio?",
        answer: false,
        option1:{
            symbol: "V",
            name: "Visa Inc",
            value: "27.00",
            logo: "https://logo.clearbit.com/visa.com"
        },
        option2:{
            symbol: "MA",
            name: "Mastercard Inc",
            value: "25.37",
            logo: "https://logo.clearbit.com/mastercard.com"
        }
    },
    {
        question: "Which stock would be a more favourable choice in terms of 'Institutional Ownership'?",
        answer: true,
        option1:{
            symbol: "CBS",
            name: "CBS Corporation",
            value: "89%",
            logo: "https://logo.clearbit.com/cbs.com"
        },
        option2:{
            symbol: "TWX",
            name: "Time Warner Inc",
            value: "85%",
            logo: "https://logo.clearbit.com/timewarnercable.com"
        }
    },
    {
        question: "Which firm has a higher 'Dividend Yield Ratio'?",
        answer: true,
        option1:{
            symbol: "STX",
            name: "Seagate Technology PLC",
            value: "8.68%",
            logo: "https://logo.clearbit.com/seagate.com"
        },
        option2:{
            symbol: "SNDK",
            name: "SanDisk Corp.",
            value: "1.78%",
            logo: "https://logo.clearbit.com/sandisk.com"
        }
    },
    {
        question: "Which firm has a higher 'Cash Flow per Share' value?",
        answer: false,
        option1:{
            symbol: "EXPE",
            name: "Expedia Inc",
            value: "$4.81/share",
            logo: "https://logo.clearbit.com/expedia.com"
        },
        option2:{
            symbol: "PCLN",
            name: "Priceline Group Inc",
            value: "$54.14/share",
            logo: "https://logo.clearbit.com/priceline.com"
        }
    }
];

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
    var metrics = "";
    for (var i = 0; i < questionList.length; i++) {
        if (i == questionList.length - 1) {
            metrics += questionList[i].metric
        } else {
            metrics += questionList[i].metric + ",";
        }
    }   
    
    var APIURL = "http://factsetfundamentals.xignite.com/xFactSetFundamentals.json/GetFundamentals?IdentifierType=Symbol&Identifiers=" + symbol + "&FundamentalTypes=" + metrics + "&AsOfDate=2/12/2016&ReportType=Annual&ExcludeRestated=false&UpdatedSince=&_token" + token;
    var out = [];

    $.getJSON(APIURL, function(data) {
        // console.log(data[0].FundamentalsSets[0].Fundamentals[0].Value);
        for (var i = 0; i < questionList.length; i++) {
            out.push(data[0].FundamentalsSets[0].Fundamentals[i].Value);
        }
        console.log(out);
        return out; 
    });
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
        var domain = result.substring(start + 1,result.length);
        var logo_url = "https://logo.clearbit.com/" + domain;
        console.log(logo_url);
        return logo_url;
    });
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
}