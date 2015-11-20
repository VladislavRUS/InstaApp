var followsList;
var followedList;

var canvas = document.getElementById("viewport");

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

var repeat;

function initMatrix(matr){
    matr = [mainList.length];
    for(var i = 0; i < mainList.length;i++){
        var m = [mainList.length];
        matr[i] = m;
    }
                
    for(var i = 0; i < mainList.length; i++){
        for(var j = 0; j < mainList.length;j++){
            matr[i][j] = 0;
        }
    }
    return matr;
}

Array.prototype.contains = function (v) {
    return this.indexOf(v) > -1;
}
            
function getFromText(){
    followedList = new Array();
    followsList = new Array();
    
    picturesFd = new Array();
    picturesFs = new Array();
    
    userName = document.getElementById("inputUsername").value;
    handleId(userName);   
}

function handleId(userName){
    var photo = document.getElementById("photo");
    var name = document.getElementById("name");
    
    $.ajax({
    type:"GET",
    url:'https://api.instagram.com/v1/users/search?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef&q='+userName,
    dataType: 'jsonp',
    success: function (data, textStatus, jqXHR) {
            var id = data.data[0].id;
            photo.style.display = "block";
            photo.src = data.data[0].profile_picture;
            name.innerHTML = userName;
            fillFollowed(userName, id);
        },
    error:  function (jqXHR, textStatus, errorThrown) {
            alert("Error handleId");
        }
    });
}
            
function fillFollowed(userName, id){
    $.ajax({
        type:"GET",
        url:'https://api.instagram.com/v1/users/'+id+'/followed-by?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef',
        dataType: 'jsonp',
        success: function (data, textStatus, jqXHR) {
                    for(var i = 0; i < data.data.length; i++){
                        followedList.push(data.data[i].username);
                        picturesFd.push(data.data[i].profile_picture);
                    }
                    fillFollowes(userName, id);
                },
        error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error followed");
                }
    });
}
            
function fillFollowes(userName, id){
    $.ajax({
        type:"GET",
        url:'https://api.instagram.com/v1/users/'+id+'/follows?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef',
        dataType: 'jsonp',
        success: function (data, textStatus, jqXHR) {
                    for(var i = 0; i < data.data.length;i++){
                        followsList.push(data.data[i].username);
                        picturesFs.push(data.data[i].profile_picture);
                    }
                    fillList(userName, id);
                },
        error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error followes");
                }
    });
}

//Заполняет главный список без повторений и список с фотографиями
function fillList(userName, id) {
    for(var i = 0; i < followedList.length; i++){
        mainList[i]=followedList[i];
        mainPictures[i] = picturesFd[i];
    }
    for(var i = followedList.length, j = 0; j < followsList.length; j++){
            if(!followedList.contains(followsList[j])){
                mainList[i]=followsList[j];
                mainPictures[i]=picturesFs[j];
                i++;
            }
    }
    setTimeout(function(){
        follow();
    }, 3000);
}


function follow () {
    var follow = document.getElementById("follow"),
        followed = document.getElementById("followed"),
        followed2 = document.getElementById("followed2"),
        followes = document.getElementById("followes"),
        followes2 = document.getElementById("followes2");
    clear();

    follow.style.display = "block";
    $("#followed").append("<h3>Подписчики " + document.getElementById("inputUsername").value + ":</h3>");
    for (var i=0; i<23; i++){
        $("#followed").append(followedList[i]);
        $("#followed").append("<br>");
    }
    for (var i=23; i<followedList.length; i++){
        $("#followed2").append(followedList[i]);
        $("#followed2").append("<br>");
    }

    $("#followes").append("<h3>Подписки " + document.getElementById("inputUsername").value + ":</h3>");
    for (var i=0; i<23; i++){
        $("#followes").append(followsList[i]);
        $("#followes").append("<br>");
    }

    for (var i=23; i<followsList.length; i++){
        $("#followes2").append(followsList[i]);
        $("#followes2").append("<br>");
    }
}

function clear () {
    document.getElementById("followed").innerHTML='';
    document.getElementById("followed2").innerHTML='';
    document.getElementById("followes").innerHTML='';
    document.getElementById("followes2").innerHTML='';
    document.getElementById("before").innerHTML='';
    document.getElementById("after").innerHTML='';
}


//Заполняет матрицу, пробегая по всм друзьям
function out(){
    alert("out!");
    matrix = initMatrix(matrix);
    for(var i = 0; i < mainList.length;i++){
        handleIdThrough(mainList[i]);
    }
    setTimeout(function(){
        alg();
        setTimeout(function(){
            displayMatrix();
            displayTransitiveMatrix();
        }, 7000);
    }, 7000);
}

function displayMatrix() {
    
    var before = document.getElementById("before");
    clear();
    document.getElementById("matrix").style.display = "block";
        
    $("#before").append("<h3>Матрица смежности</h3>");
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
    $("#before").append(el);
}

function displayTransitiveMatrix(){
    var after = document.getElementById("after");
    document.getElementById("matrix").style.display = "block";
        
    $("#after").append("<h3>Матрица замыкания</h3>");
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
    $("#after").append(el);
}
        

function handleIdThrough(userName){
    $.ajax({
        type:"GET",
        url:'https://api.instagram.com/v1/users/search?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef&q='+userName,
        dataType: 'jsonp',
        success:function (data, textStatus, jqXHR) {
                    id = data.data[0].id;
                    fillFollowedThrough(userName, id);
                },
        error:  function (jqXHR, textStatus, errorThrown) {
                    alert("Error handle through");
                }
    });
}

function fillFollowedThrough(userName, id){
    $.ajax({
        type:"GET",
        url:'https://api.instagram.com/v1/users/'+id+'/followed-by?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef',
        dataType: 'jsonp',
        success:function (data, textStatus, jqXHR) {
                    for(var i = 0; i < data.data.length; i++){
                        if(mainList.contains(data.data[i].username)){
                            matrix[mainList.indexOf(userName)][mainList.indexOf(data.data[i].username)] = 1;
                        }
                    }
                    fillFollowesThrough(userName, id);
                },
        error:  function (jqXHR, textStatus, errorThrown) {
                    alert("Error followed through");
                }
    });
}
            
function fillFollowesThrough(userName, id){
    $.ajax({
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
    });
}

//Выводит обычную матрицу
function showMatrix(){
    alert("show!");
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

//Выводит матрицу транзитивного замыкания
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
}

//Делаем транзитивное замыкание, тут у нас уже должна быть matrix
function alg() {
    transitiveMatrix = initMatrix(transitiveMatrix);
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
    clear();
    fillRelation();
    compareMatrix();
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