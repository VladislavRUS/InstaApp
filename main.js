var followsList;
var followedList;

var picturesFs;
var picturesFd;

var mainPictures = new Array();
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

  
function getFromText(){
    //amountOfFollows = 0;
    
    followedList = new Array();
    followsList = new Array();
    
    
    picturesFd = new Array();
    picturesFs = new Array();
    
    userName = getText();
    handleId(userName);
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

function out(){
    initMatrix();
    for(var i = 0; i < mainList.length;i++){
        handleIdThrough(mainList[i]);
    }
    $("body").append("<h3> Done! <h3>");
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

function alg() {
    
    var k=0;
    while(k<mainList.length){
        for(var i=0; i<mainList.length; i++){
            for(var j=0; j<mainList.length; j++){
                if((matrix[k][i]===1) && (matrix[j][k]===1)){
                    if((i!==k) && (j!==k)) matrix[j][i]=1;        
                }
            }
        }
        k++;
    }
}

function showAlg() {
    alg();
    $("body").append("<h3> Result: <h3>");
    showMatrix();
}


//Создали объекты, которые будут JSON
var graphNode = new Object();
var graphEdge = new Object();

function createJson() {
    var nodes = [];                 //Массив вершин
    var n;                          //Просто вершина, которую будем добавлять в этот массив
    for(var i = 0; i < mainList.length; i++){
        n = new Object();           //Проинициализировали пустым объектом
        n.name = mainList[i];       //Добавили имя из списка
        n.num = i;
        nodes[i] = n;               //И засунули в массив
    }
    
    var jsNode = JSON.stringify(nodes); //В переменную засунули строковое представление массива в формате JSON
    graphNode = JSON.parse(jsNode);     //Распарсили эту переменную, чтобы получить нормальный JSON объект
    
    
    var edges = []; 
    var e;
    var count = 0;
    for(var i = 0; i < mainList.length; i++){
        for(var j = 0; j < mainList.length; j++){
            if(matrix[i][j] > 0){
                e = new Object();
                e.src = mainList[i];
                e.dest = mainList[j];
                edges[count++] = e;
            }
        }
    }
    
    var jsEdge = JSON.stringify(edges);
    graphEdge = JSON.parse(jsEdge);
    startGraph();   //Запускаем функцию из скрипта рисовалки графа
}
