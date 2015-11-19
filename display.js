function clear () {
    document.getElementById("followed").innerHTML='';
    document.getElementById("followed2").innerHTML='';
    document.getElementById("followes").innerHTML='';
    document.getElementById("followes2").innerHTML='';
}

function follow () {
    if (getText()!=0){
    
    var follow = document.getElementById("follow"),
        followed = document.getElementById("followed"),
        followed2 = document.getElementById("followed2"),
        followes = document.getElementById("followes"),
        followes2 = document.getElementById("followes2");
    clear();
    follow.style.display = "block";
    
    
    $("#followed").append("<h3>Followed:</h3>");
    for (var i=0; i<23; i++){
        $("#followed").append(followedList[i]);
        $("#followed").append("<br>");
    }
    for (var i=23; i<followedList.length; i++){
        $("#followed2").append(followedList[i]);
        $("#followed2").append("<br>");
    }
    
    $("#followes").append("<h3>Followes:</h3>");
    for (var i=0; i<23; i++){
        $("#followes").append(followsList[i]);
        $("#followes").append("<br>");
    }
    
    for (var i=23; i<followsList.length; i++){
        $("#followes2").append(followsList[i]);
        $("#followes2").append("<br>");
    }
    }
}