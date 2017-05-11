// fix javascript modulo !?WTF javascript?!
Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

var cont = document.getElementById("value-container");
var len = 32;

var binaryString = "";

var monthTypes = [2,0,2,1,2,1,2,2,1,2,1,2];

for (var i = 0; i < 32; i++) {
    
    var letterCont = document.createElement("div");
    letterCont.className = "letterCont tooltips";
    letterCont.id = "letter-container-"+i;

    //letterCont.innerHTML = "cus";
    
    var letter = document.createElement("div");
    letter.className += "letter";
    letter.id = "letter_" + i;

    var timeval = document.createElement("div");
    timeval.className = "inner"
    timeval.innerHTML = getStringTime(i);
    timeval.id = "timeval_" + i;

    var tooltip = document.createElement("span") ;

    createTooltip(tooltip, i);

    letterCont.appendChild(letter);
    letterCont.appendChild(timeval);
    letterCont.appendChild(tooltip);

    cont.appendChild(letterCont);

    if ((i+1) % 8 == 0 && i < 31) {
        var space = document.createElement("li");
        space.className += "letterCont";
        space.innerHTML = " ";
        space.style = "min-width: 10px;";

        cont.appendChild(space);
    }

    
}

getTime();

setInterval(function () { getTime(); }, 100);

function createTooltip(tooltip, id)
{
    var preciseTimeText = document.createElement("div");
    preciseTimeText.innerHTML = "Digit time weight";
    preciseTimeText.className = "tooltip-text";

    var preciseTime = document.createElement("div");
    preciseTime.innerHTML = getPreciseTime(id);
    preciseTime.id = "precise-time-"+id;

    var nextOccuranceText = document.createElement("div");
    nextOccuranceText.innerHTML = "Next value change";
    nextOccuranceText.className = "tooltip-text";

    var timeToChange = document.createElement("div");
    timeToChange.id = "time-to-change-"+id;
    timeToChange.className = "time-to-change";

    var nextOccurance = document.createElement("div");
    nextOccurance.innerHTML = id;
    nextOccurance.id = "next-occurance-"+id;
    nextOccurance.className = "next-occurance";

    tooltip.appendChild(preciseTimeText);
    tooltip.appendChild(preciseTime);
    tooltip.appendChild(nextOccuranceText);
    tooltip.appendChild(timeToChange);
    tooltip.appendChild(nextOccurance);

}

function getPreciseTime(i)
{
    

    var inn = Math.pow(2,(31-i));

    return outputPreciseTime(inn);
}

function outputPreciseTime(inn)
{
    var currDate = new Date();

    var secs = inn%60;
    var mins = Math.floor(inn/60)%60;
    var hrs = Math.floor(inn/3600)%24;

    var days = Math.floor(inn/86400);

    var months = 0;
    var years = 0;

    var actualYear = currDate.getFullYear();
    var actualMonth = currDate.getMonth();

    // count years
    while (true)
    {
        var yearDays = ((actualYear%4)==0)?366:365;
        if ((days-yearDays) < 0) break;
        days -= yearDays;
        years++;
        actualYear--;
    }

    
    // count months
    while (true)
    {
        var monthType = monthTypes[actualMonth];
        var monthDays = 0;

        switch(monthType) {
            case 0:
                monthDays = ((actualYear%4)==0)?29:28;
                break;
            case 1:
                monthDays = 30;
                break;
            case 2:
                monthDays = 31;
                break;
            default:
                
        }

        if ((days - monthDays) < 0) break;
        days -= monthDays;
        months++;
        actualMonth = actualMonth.mod(4);

    }

    var out = "";

    if (years > 0.0) out += years + "y ";
    if (months > 0.0) out += months + "M ";
    if (Math.floor(days) > 0.0) out += days + "d ";
    if (Math.floor(hrs) > 0.0) out += hrs + "h " ;
    if (Math.floor(mins) > 0.0) out += mins + "m ";

    if (secs > 9) out += secs + "s ";
    else out += "0"+secs+"s ";
    
    

    return out;
}

function countTimeToChange(id)
{
    var time = 1;
    for(var i = id+1; i < binaryString.length; i++)
    {
        
        if (binaryString[i] == "0") time += Math.pow(2,(31-i));
    }

    return time;
}

function getStringTime(i)
{
    var inn = Math.pow(2,(31-i));

    var secs = inn%60;
    var mins = parseFloat(inn/60).toFixed(1);
    var hrs = parseFloat(inn/3600).toFixed(1);
    var days = parseFloat(inn/86400).toFixed(1);
    var months = parseFloat(inn/2628000).toFixed(1);
    var years = parseFloat(inn/31536000).toFixed(1);

    var out = "";
    if (Math.floor(years) > 0.0) return years + "y";
    if (Math.floor(months) > 0.0) return months + "M";
    if (Math.floor(days) > 0.0) return days + "d";
    if (Math.floor(hrs) > 0.0) return hrs + "h" ;
    if (Math.floor(mins) > 0.0) return mins + "m";
    if (secs > 0.0) return secs + "s";
    
    
    return 0;
}


function getTime() {
   
    var mili = Date.now();
    var sec = mili/1000;

    binaryString = separateBytes(decbin(sec, len));

    var format = document.getElementById("format-time");

    format.innerHTML = mili;
    
    // change tooltips
    for(var i = 0; i < len; i++)
    {
        var ttc = document.getElementById("time-to-change-"+i);
        var timeToChange = countTimeToChange(i);

        //var date = new Date(timeToChange*1000);

        ttc.innerHTML = outputPreciseTime(timeToChange);
    }

    //console.log(countTimeToChange(30)+1);
}


function separateBytes(bin) {
    var counter = 0;
    var cont = document.getElementById("value-container");

    for (var i = 0; i < 32; i++) {

        var let = document.getElementById("letter_" + i);

        if (let != null) let.innerHTML = bin[i];
    }

    return bin;
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function decbin(dec, length) {
    var out = "";
    while (length--)
        out += (dec >> length) & 1;
    return out;
}

