var followsList;
var followedList;

var picturesFs;
var picturesFd;

var withRelationFD;
var withRelationFS;

var mainPictures = new Array();
var mainList = new Array();
var relationList;

var matrix;
var transitiveMatrix;
var tMatrixWasFormed = false;
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
 

function initTransitiveMatrix(){
    transitiveMatrix = [mainList.length];
    for(var i = 0; i < mainList.length;i++){
        var m = [mainList.length];
        transitiveMatrix[i] = m;
    }
                
    for(var i = 0; i < mainList.length; i++){
        for(var j = 0; j < mainList.length;j++){
            transitiveMatrix[i][j] = 0;
        }
    }
    tMatrixWasFormed = true;
}


Array.prototype.contains = function (v) {
    return this.indexOf(v) > -1;
}
            
function getFromText(){
    followedList = new Array();
    followsList = new Array();
    
    picturesFd = new Array();
    picturesFs = new Array();
    
    userName = getText();
    handleId(userName);
}

function getText(){
    return document.getElementById("textForm").value;
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
                    for(var i = 0; i < data.data.length; i++){
                        followedList.push(data.data[i].username);
                        picturesFd.push(data.data[i].profile_picture);
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
                    for(var i = 0; i < data.data.length;i++){
                        followsList.push(data.data[i].username);
                        picturesFs.push(data.data[i].profile_picture);
                    }
                },
        error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error followes");
                }
    })).done(function(){
        fillList(userName, id)
    });
}

function fillList(userName, id) {
    $("body").append('<h3>' + userName + '<br>List :</h3>');
    for(var i = 0; i < followedList.length; i++){
        mainList[i]=followedList[i];
        mainPictures[i] = picturesFd[i];
        $("body").append(mainList[i]+'<br>');
    }
    for(var i = followedList.length, j = 0; j < followsList.length; j++){
            if(!followedList.contains(followsList[j])){
                mainList[i]=followsList[j];
                mainPictures[i]=picturesFs[j];
                $("body").append(mainList[i]+'<br>');
                i++;
            }
    }
}


function out(){
    initMatrix();
    //withRelationFD = new Array();
    //withRelationFS = new Array();
    for(var i = 0; i < mainList.length;i++){
        handleIdThrough(mainList[i]);
    }
    $("body").append("<h3> Done! <h3>");
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
                        }
                    }
                },
        error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error follows through");
                }
    })).done(function(){
    });
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

function showTransitiveMatrix(){
    var el = $();
    el = el.add('<table>');
    for(var i = 0; i < mainList.length; i++){
        el = el.add('<tr>');
        for(var j = 0; j < mainList.length;j++){
            el = el.add('<td>' + transitiveMatrix[i][j] + '&nbsp&nbsp' + '</td>');
        }
        el = el.add('</tr>');
    }
    el = el.add('</table>');
    $("body").append(el);
}

function alg() {
    initTransitiveMatrix();
    for(var i = 0; i < mainList.length; i++){
        for(var j = 0; j < mainList.length; j++){
            transitiveMatrix[i][j] = matrix[i][j];
        }
    }
    
    var k=0;
    while(k<mainList.length){
        for(var i=0; i<mainList.length; i++){
            for(var j=0; j<mainList.length; j++){
                if((matrix[k][i]===1) && (matrix[j][k]===1)){
                    if((i!==k) && (j!==k)) transitiveMatrix[j][i]=1;        
                }
            }
        }
        k++;
    }
}

function showAlg() {
    alg();
    $("body").append("<h3> Result: <h3>");
    showTransitiveMatrix();
}

function compareMatrix(){
    for(var i = 0; i < mainList.length; i++){
        for(var j = 0; j < mainList.length; j++){
            var a = transitiveMatrix[i][j];
            var b = matrix[i][j];
            if(a != b){
                transitiveMatrix[i][j] = 2;
            }
        }
    }
    $("body").append("Result of comparing: " + "<br>");
    showTransitiveMatrix();
}

function fillRelation(){
    relationList = [];
    var count = 0;
    var wasAdded = false;
    for(var i = 0; i < mainList.length; i++){
        for(var j = 0; j < mainList.length; j++){
            if(!wasAdded && matrix[i][j] > 0){
                if(!relationList.contains(mainList[i]))
                    relationList[count++] = mainList[i];
                if(!relationList.contains(mainList[j]))
                    relationList[count++] = mainList[j];
                //alert(mainList[i] + " " + mainList[j] + " " + matrix[i][j]);
                wasAdded = true;
            }
        }
        wasAdded = false;
    }
}


//Создали объекты, которые будут JSON
var graphNode = new Object();
var graphEdge = new Object();

function createJson() {
    fillRelation();
    var nodes = [];                 //Массив вершин
    var n;                          //Просто вершина, которую будем добавлять в этот массив
    for(var i = 0; i < relationList.length; i++){
        n = new Object();           //Проинициализировали пустым объектом
        n.name = relationList[i];       //Добавили имя из списка
        n.num = i;
        nodes[i] = n;               //И засунули в массив
    }
    
    var jsNode = JSON.stringify(nodes); //В переменную засунули строковое представление массива в формате JSON
    graphNode = JSON.parse(jsNode);     //Распарсили эту переменную, чтобы получить нормальный JSON объект
    
    var edges = []; 
    var e;
    var count = 0;
    for(var i = 0; i < relationList.length; i++){
        for(var j = 0; j < relationList.length; j++){
            if(transitiveMatrix[mainList.indexOf(relationList[i])][mainList.indexOf(relationList[j])] > 0){
                e = new Object();
                e.src = relationList[i];
                e.dest = relationList[j];
                e.color = "blue";
                if(transitiveMatrix[mainList.indexOf(relationList[i])][mainList.indexOf(relationList[j])] > 1){
                    e.color = "red";
                }
                edges[count] = e;
                count++;
            }
        }
    }
    
    var jsEdge = JSON.stringify(edges);
    graphEdge = JSON.parse(jsEdge);
    startGraph();   //Запускаем функцию из скрипта рисовалки графа
}
