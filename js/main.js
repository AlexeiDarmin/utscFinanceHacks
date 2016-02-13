
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

var sap500 = $.getJSON("static/constituents.json", function(json) {
    return json;
});

/**
 * Generates the data for a question to be displayed
 * @return list containing Question, Option1 Name, Option2 Name, Answer, Option1 Logo Url,
 */
function questionLoad() {
    /*http://factsetfundamentals.xignite.com/xFactSetFundamentals.xml/GetFundamentalsDailyRange?IdentifierType=Symbol&Identifiers=MSFT,GOOG&FundamentalTypes=MarketCapitalization,SharesOutstanding,PERatio&StartDate=2/12/2015&EndDate=2/12/2016&ReportType=Annual&ExcludeRestated=false&UpdatedSince=*/
    var isValid = false;
    while (isValid) {
        var num = Math.floor(Math.random() * questionList.length);
        
        var option1 = {symbol: "", name: "", value: "", logo: getLogo("")};
        var option2 = {symbol: "", name: "", value: "", logo: getLogo("")};
        var question = {question: "", answer: "", o1: question1, o2: question2};
        return question;
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
    return [company1, company2];
}

/**
 * Return the value of the specified metric and company symbol
 * @return list containing 2 Name Objects (Option1 Name, Option2 Name, Answer, Option1 Logo Url,
 */
function getMetric(symbol, metric) {

}

/**
 * Return the url of a companies logo given the symbol of the company
 * @param symbol of company
 * @return list containing Question, Option1 Name, Option2 Name, Answer, Option1 Logo Url,
 */
function getLogo(symbol) {

}