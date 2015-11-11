
function handleId(){
    alert("Dsdsd");
    $.ajax({
    type:"GET",
    url:'https://api.instagram.com/v1/users/search?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef&q=your_vanyushka',
    dataType: 'jsonp',
    success: function (data, textStatus, jqXHR) {
        var id = data.data[0].id;
        
        getImg(id);
        },
    error:  function (jqXHR, textStatus, errorThrown) {
            alert("Error handleId");
        }
    });
}
   
   
function getImg(user_id) {
    
    /*
    $("body").append("getInmg");
    $.ajax({
    type:"GET",
    url:"https://api.instagram.com/v1/users/"+user_id+"?access_token=1365770272.1fb234f.cbf09a381ea9460bbc5e4551865782ef",
    dataType: 'jsonp',
    success: function (data, textStatus, jqXHR) {
        $("body").append("dfdf");
        $("body").append("<img src='"+data.data.profile_picture+"' />");
        },
    error:  function (jqXHR, textStatus, errorThrown) {
            alert("Error handleId");
        }
    });*/
    
}


function al(){alert("sf");}