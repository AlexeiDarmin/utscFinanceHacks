
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

/**
 * GLOBALS
 */

/* var question = {question: questionList[num].text, 
                    answer: (value1>value2), 
                    option1: option1, 
                    option2: option2};
*/

var question = {};

// Create question option objects
// var option1 = {
//     symbol: companyPair[0].Symbol,
//     name: companyPair[0].Name,
//     value: value1,
//     logo: logo1
// };

// var option2 = {
//     symbol: companyPair[1].Symbol,
//     name: companyPair[1].Name,
//     value: value2,
//     logo: logo2
// };
var option1 = {
    symbol: "",
    name: "",
    value: "",
    logo: ""
};

var option2 = {
    symbol: "",
    name: "",
    value: "",
    logo: ""
};

// used in getLogo
var logo_url = "";

// used in getAllMetrics
// var metric_output = "";

var token = "FCAC0E1A3DB14E33993F2F10C1A281BA";
var sap500 = $.getJSON("static/constituents.json", function(json) {
    return json;
});

var response;
var errorCount = 0;

window.onload = renderQuestion;

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
    // var q = demoLoad();
    var q = question;

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
    $(comps[0]).attr('onclick', 'processAnswer(this.id)');

    $(comps[1]).find("a").text(q.option2.name);
    $(comps[1]).attr('isCorrect', String(!q.answer));
    $(comps[1]).children().eq(0).css("background-image", "url("+q.option2.logo+")");
    $(comps[1]).children().eq(1).addClass("invisible");
    $(comps[1]).children().eq(1).text(q.option2.value);
    $(comps[1]).children().eq(1).removeClass("correct");
    $(comps[1]).children().eq(1).removeClass("incorrect");
    $(comps[1]).attr('onclick', 'processAnswer(this.id)');

    $("button").addClass("hide");
}

/**
 * Manipulates the dom to react to one of the options being selected
 * correct or incorrect
 */
function processAnswer(sel) {
    var comps = $('.card-square');

    $(comps[0]).children().eq(1).removeClass("invisible");
    $(comps[0]).removeAttr('onclick');

    $(comps[1]).children().eq(1).removeClass("invisible");
    $(comps[1]).removeAttr('onclick');

    if ($(comps[0]).attr("isCorrect") == 'true') {
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

    var num = Math.floor(Math.random() * questionList.length);
    question.question = questionList[num].text;
    question.metric = questionList[num].metric;

    // Make api calls and get data for question generation
    var companyPair = getRandomCompanyPair();
    console.log(companyPair);
        
    // value 1
    getMetric(companyPair[0].Symbol);

    // value 2
    getMetric(companyPair[1].Symbol);

    // logo 1
    getLogo(companyPair[0].Symbol);

    // logo 2
    getLogo(companyPair[1].Symbol);

    check();  

    // return question;
}

function check() {
    $.get("", checkCallBack);
}

function checkCallBack() {
    if (option1.value && option2.value) {
        question.answer = option1.value > option2.value;
        question.option1 = option1;
        question.option2 = option2;
        renderQuestion();
    } else {
        check();
    }
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
    if (company1.Symbol == company2.Symbol) { throw "same company"; }
    return [company1, company2];
}

/**
 * Return the value of the specified metric and company symbol
 * @return a list with all fundamentals for a given symbol
 */
function getMetric(symbol) {
     
    // var metrics = "CompanyName,Website,";
    // for (var i = 0; i < questionList.length; i++) {
    //     if (i == questionList.length - 1) { metrics += questionList[i].metric }
    //     else { metrics += questionList[i].metric + ","; }
    // }
    // console.log(question.metric);

    var APIURL = "http://factsetfundamentals.xignite.com/xFactSetFundamentals.json/GetFundamentals?IdentifierType=Symbol&Identifiers=" + symbol + "&FundamentalTypes=" + question.metric + "&AsOfDate=2/12/2016&ReportType=Annual&ExcludeRestated=false&UpdatedSince=&_token=" + token;
    console.log(APIURL);
    $.getJSON(APIURL, caller1); /*{
        for (var i = 0; i < questionList.length; i++) { 
            // metric_output += data[0].FundamentalsSets[0].Fundamentals[i].Value + "%%";
            metric_output += data[0].FundamentalsSets[0].Fundamentals[i].Value + "%%";
            // console.log(metric_output); 
        }
    });
    console.log(metric_output);
    /* } else {
        // console.log("2");
        metric_output = [];
    }*/
}

function caller1(data) {
    // console.log(data);
    // var metric_output = ;
    // for (var i = 0; i < questionList.length; i++) { 
        // metric_output += data[0].FundamentalsSets[0].Fundamentals[i].Value + "%%";
        // metric_output += data[0].FundamentalsSets[0].Fundamentals[i].Value + "%%"; 
    // }

    var symbol = data[0].Company.Symbol;

    if (option1.symbol == symbol) {
        option1.value = data[0].FundamentalsSets[0].Fundamentals[0].Value;
        option1.name = data[0].Company.Name;
    } else if (option2.symbol == symbol) {
        option2.value = data[0].FundamentalsSets[0].Fundamentals[0].Value;
        option2.name = data[0].Company.Name;
    } else if (!option1.symbol) {
        option1.value = data[0].FundamentalsSets[0].Fundamentals[0].Value;
        option1.name = data[0].Company.Name;
    } else {
        option2.value = data[0].FundamentalsSets[0].Fundamentals[0].Value;
        option1.name = data[0].Company.Name;
    }
}

/**
 * Return the url of a companies logo given the symbol of the company
 * @param symbol of company
 * @return list containing Question, Option1 Name, Option2 Name, Answer, Option1 Logo Url,
 */
function getLogo(symbol) {
    var APIURL = "http://factsetfundamentals.xignite.com/xFactSetFundamentals.json/GetFundamentals?IdentifierType=Symbol&Identifiers=" + symbol + "&FundamentalTypes=Website&AsOfDate=2/12/2016&ReportType=Annual&ExcludeRestated=false&UpdatedSince=&_token=" + token; //+ "&_callback=caller2";
    console.log(APIURL);
    $.getJSON(APIURL, caller2);
}

function caller2(data) {
    console.log(data);
    var result = data[0].FundamentalsSets[0].Fundamentals[0].Value; 
    var start = result.indexOf(".");
    var domain = result.substring(start + 1, result.length);
    logo_url = "https://logo.clearbit.com/" + domain;

    var symbol = data[0].Company.Symbol;
    if (option1.symbol == symbol) {
        option1.logo = logo_url;
    } else if (option2.symbol == symbol) {
        option2.logo = logo_url;
    } else if (!option1.symbol) {
        option1.logo = logo_url;
    } else {
        option2.logo = logo_url
    }

    console.log(option1, option2);
    // return data;
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
        question: "Which firm has a larger number of employees?",
        answer: false,
        option1: {
            symbol: "ATVI",
            name: "Activision Blizzard Inc.",
            value: "6,800",
            logo: "https://logo.clearbit.com/activision.com"
        },
        option2: {
            symbol: "EA",
            name: "Electronic Arts Inc.",
            value: "8,400",
            logo: "https://logo.clearbit.com/ea.com"
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
        question: "Which firm had more revenue in 2015?",
        answer: false,
        option1:{
            symbol: "TWTR",
            name: "Twitter Inc.",
            value: "2218 Million",
            logo: "https://logo.clearbit.com/twitter.com"
        },
        option2:{
            symbol: "LNKD",
            name: "LinkedIn",
            value: "2992 Million",
            logo: "https://logo.clearbit.com/linkedin.com"
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