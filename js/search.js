
// Create list of [Name, Symbol] Pairs.




































var tsx = TSXjson.Companies;
var nys = NYSjson.Companies;
var nas = NASjson.Companies;

TSXjson = null;
NASjson = null;
NYSjson = null;
//console.log(nasdaq);
var final = [];
count = 0
for (i = 0; i < nys.length; i++){
	final.push(nys[i].Name);
}
for (i = 0; i < nas.length; i++){
	final.push(nas[i].Name);
}
for (i = 0; i < tsx.length; i++){
	final.push(tsx[i].Name);
}
nas = "";
tsx = "";
nys = "";



function matchPercent(phrase){
	var Plength = phrase.length;
	var bestRatio = 0;
	var bestStart = 10000;
	var suggestion = "";
	var ind = 100000;
	for (i = 0; i < final.length; i++){
		ind = final[i].toLowerCase().indexOf(phrase.toLowerCase());
		if(ind < bestStart && ind != -1)
		{
			bestStart = ind;
			bestRatio = Plength/final[i].length;
			suggestion = final[i];
		} 
		else if (ind == bestStart && ind > -1)
		{
			console.log(ind);
			if (Plength/final[i].length > bestRatio){
				bestRatio = Plength/final[i].length;
				suggestion = final[i];
			}
		}
	}
	return suggestion;
}

console.log(matchPercent("lent"));