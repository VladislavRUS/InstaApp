var followsList;
var followedList;
var mainList = new Array();
            
var matrix;
var count = 0;
        
function initMatrix(){
    matrix = [mainList.length];
    for(var i = 0; i < mainList.length;i++){
        var m = [mainList.length];
        matrix[i] = m;
    }
                
    for(var i = 0; i < mainList.length; i++){
        for(var j = 0; j < mainList.length;j++){
            matrix[i][j] = 0;
        }
    }
}
            
Array.prototype.contains = function (v) {
    return this.indexOf(v) > -1;
}
            
function getText(){
    return document.getElementById("textForm").value;
}
            
function getUserIdByName(userName){
    handleId(userName);
}
            
function handleId(userName){
    $.ajax({
    type:"GET",
    url:'https://api.instagram.com/v1/users/search?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef&q='+userName,
    dataType: 'jsonp',
    success: function (data, textStatus, jqXHR) {
        var id = data.data[0].id;
        fillFollowed(userName, id);
        },
    error:  function (jqXHR, textStatus, errorThrown) {
            alert("Error handleId");
        }
    });
}
            
function fillFollowed(userName, id){
    $.when($.ajax({
        type:"GET",
        url:'https://api.instagram.com/v1/users/'+id+'/followed-by?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef',
        dataType: 'jsonp',
        success: function (data, textStatus, jqXHR) {
                    $("body").append('<h3>' + userName + '<br> Followed by :</h3>');
                    if(data.data.length < 25){
                        for(var i = 0; i < data.data.length;i++){
                            followedList.push(data.data[i].username);
                            $("body").append(data.data[i].username+'<br>');
                        }
                    }
                    else{
                        for(var i = 0; i < 25;i++){
                            followedList.push(data.data[i].username);
                            $("body").append(data.data[i].username+'<br>');
                        }
                    }
                },
        error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error followed");
                }
    })).done(function(){
        fillFollowes(userName, id);
    });
}
            
function fillFollowes(userName, id){
    
    $.when($.ajax({
        type:"GET",
        url:'https://api.instagram.com/v1/users/'+id+'/follows?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef',
        dataType: 'jsonp',
        success: function (data, textStatus, jqXHR) {
                    $("body").append('<h3>' + userName + '<br>Follows :</h3>');
                    if(data.data.length < 25){
                        for(var i = 0; i < data.data.length;i++){
                        followsList.push(data.data[i].username);
                        $("body").append(data.data[i].username+'<br>');
                        }
                    }
                    
                    else{
                        for(var i = 0; i < 25;i++){
                        followsList.push(data.data[i].username);
                        $("body").append(data.data[i].username+'<br>');
                        }
                    }
                    
                },
        error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error followes");
                }
    })).done(function(){
       fillList(userName, id)
    });
}

function search (a, b) {
    for (var i=0; i<b.length; i++){
        if(a===b[i]) return true;
    }
    return false;
}

function fillList(userName, id) {
    var i=0;
    $("body").append('<h3>' + userName + '<br>List :</h3>');
    for(i; i<followedList.length; i++){
        mainList[i]=followedList[i];
         $("body").append(mainList[i]+'<br>');
    }
    i++;
    
    for(var j=0; j<followsList.length; j++){
            if(search(followsList[j],followedList)===false){
                mainList[i]=followsList[j];
                $("body").append(mainList[i]+'<br>');
            }
    }
}
            
function showMatrix(){
    var el = $();
    el = el.add('<table>');
    for(var i = 0; i < mainList.length; i++){
        el = el.add('<tr>');
        for(var j = 0; j < mainList.length;j++){
            el = el.add('<td>' + matrix[i][j] + '&nbsp&nbsp' + '</td>');
        }
        el = el.add('</tr>');
    }
    el = el.add('</table>');
    $("body").append(el);
}
        
function getFromText(){
    amountOfFollows = 0;
    followedList = new Array();
    followsList = new Array();
    
    userName = getText();
    getUserIdByName(userName);
}
            
function goThrough(userName){
    getUserIdByNameThrough(userName);
}
            
function getUserIdByNameThrough(userName){
    handleIdThrough(userName);
}
            
function handleIdThrough(userName){
                $.when($.ajax({
    type:"GET",
    url:'https://api.instagram.com/v1/users/search?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef&q='+userName,
    dataType: 'jsonp',
    success:function (data, textStatus, jqXHR) {
                id = data.data[0].id;
                },
    error:  function (jqXHR, textStatus, errorThrown) {
                alert("Error handle through");
            }
    })).done(function(){
        fillFollowedThrough(userName, id);
    });
}
            
function fillFollowedThrough(userName, id){
    $.when($.ajax({
        type:"GET",
        url:'https://api.instagram.com/v1/users/'+id+'/followed-by?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef',
        dataType: 'jsonp',
        success:function (data, textStatus, jqXHR) {
                    for(var i = 0; i < data.data.length; i++){
                        if(mainList.contains(data.data[i].username)){
                            matrix[mainList.indexOf(userName)][mainList.indexOf(data.data[i].username)] = 1;
                            $("body").append("<h3> Followed + 1 <h3>");
                        }
                    }
                },
        error:  function (jqXHR, textStatus, errorThrown) {
                    alert("Error followed through");
                }
    })).done(function(){
        fillFollowesThrough(userName, id);
    });
}
            
function fillFollowesThrough(userName, id){
    $.when($.ajax({
        type:"GET",
        url:'https://api.instagram.com/v1/users/'+id+'/follows?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef',
        dataType: 'jsonp',
        success: function (data, textStatus, jqXHR) {
                    for(var i = 0; i < data.data.length; i++){
                        if(mainList.contains(data.data[i].username)){
                            matrix[mainList.indexOf(userName)][mainList.indexOf(data.data[i].username)] = 1;
                            $("body").append("<h3> Follows + 1 <h3>");
                        }
                    }
                },
        error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error follows through");
                }
    })).done(function(){
        
    });
}
            
function out(){
    initMatrix();
    for(var i = 0; i < mainList.length;i++){
        goThrough(mainList[i]);
    }
}
