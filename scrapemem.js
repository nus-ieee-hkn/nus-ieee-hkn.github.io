// script to scrape committee page

var parent = document.getElementsByTagName("section");
var lst = [];

for (var i = 1; i < parent.length; ++i) {
    var nm = parent[i].getElementsByTagName("h4")[0].innerText;

    var year = {};
    year["name"] = nm;
    year["members"] = [];
    var tbn = parent[i].getElementsByTagName("td");
    for (var j = 0; j < tbn.length; ++j) {
        year["members"].push(tbn[j].innerText);
    }
    
    lst.push(year);
}
