// script to scrape committee page

var parent = document.getElementsByTagName("section");
var lst = [];

for (var i = 1; i < parent.length; ++i) {
    var nm = parent[i].getElementsByTagName("h4")[0].innerText;
    var sems = parent[i].getElementsByTagName("h5");

    var comms = {};
    comms["name"] = nm;
    comms["semester"] = [{}];
    comms["semester"][0]["members"] = [];
    var tb = parent[i].getElementsByTagName("div");
    var tbn = tb[0].getElementsByTagName("td");
    for (var j = 0; j < tbn.length; j += 2) {
        var memb = {};
        memb["designation"] = tbn[j].innerText;
        memb["name"] = tbn[j+1].innerText;
        comms["semester"][0]["members"].push(memb);
    }
    if (sems.length == 2) {
        comms["semester"].push({});
        comms["semester"][1]["members"] = [];
        comms["semester"][0]["semname"] = sems[0].innerText;
        comms["semester"][1]["semname"] = sems[1].innerText;
        
        tbn = tb[1].getElementsByTagName("td");
        for (var j = 0; j < tbn.length; j += 2) {
            var memb = {};
            memb["designation"] = tbn[j].innerText;
            memb["name"] = tbn[j+1].innerText;
            comms["semester"][1]["members"].push(memb);
        }
    }
    lst.push(comms);
}
