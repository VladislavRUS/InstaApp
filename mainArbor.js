function startGraph(){
	var Renderer = function(canvas)
	{
		var canvas = $(canvas).get(0);
		var ctx = canvas.getContext("2d");
        canvas.width = 1198;
        canvas.height = 598;
		var particleSystem;

		var that = {
			init:function(system){
				//начальная инициализация
				particleSystem = system;
				particleSystem.screenSize(canvas.width, canvas.height); 
				particleSystem.screenPadding(80);
				that.initMouseHandling();
			},
      
			redraw:function(){
				//действия при перересовке
				ctx.fillStyle = "white";	//белым цветом
				ctx.fillRect(0,0, canvas.width, canvas.height); //закрашиваем всю область
			
	           particleSystem.eachEdge(	//отрисуем каждую грань
					function(edge, pt1, pt2){	//будем работать с гранями и точками её начала и конца
                        ctx.strokeStyle = edge.data;
						ctx.lineWidth = 2;	//толщиной в один пиксель
						ctx.beginPath();		//начинаем рисовать
						ctx.moveTo(pt1.x, pt1.y); //от точки один
						ctx.lineTo(pt2.x, pt2.y); //до точки два
						ctx.stroke();
				});
                
				particleSystem.eachNode(	//теперь каждую вершину
					function(node, pt){		//получаем вершину и точку где она
                        var image = new Image();
                        image.src = mainPictures[mainList.indexOf(node.name)];
						var w = 55;			//ширина квадрата
                        ctx.drawImage(image, pt.x - 5, pt.y - 5, w, w);
						ctx.fillStyle = "black";	//цвет для шрифта
						ctx.font = 'italic 13px sans-serif'; //шрифт
						ctx.fillText (node.name, pt.x, pt.y+1.5*w); //пишем имя у каждой точки
				});   
			},
		
			initMouseHandling:function(){	//события с мышью
				var dragged = null;			//вершина которую перемещают
				var handler = {
					clicked:function(e){	//нажали
						var pos = $(canvas).offset();	//получаем позицию canvas
						_mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top); //и позицию нажатия кнопки относительно canvas
						dragged = particleSystem.nearest(_mouseP);	//определяем ближайшую вершину к нажатию
						if (dragged && dragged.node !== null){
							dragged.node.fixed = true;	//фиксируем её
						}
						$(canvas).bind('mousemove', handler.dragged);	//слушаем события перемещения мыши
						$(window).bind('mouseup', handler.dropped);		//и отпускания кнопки
						return false;
					},
					dragged:function(e){	//перетаскиваем вершину
						var pos = $(canvas).offset();
						var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);
	
						if (dragged && dragged.node !== null){
							var p = particleSystem.fromScreen(s);
							dragged.node.p = p;	//тянем вершину за нажатой мышью
						}
	
						return false;
					},
					dropped:function(e){	//отпустили
						if (dragged===null || dragged.node===undefined) return;	//если не перемещали, то уходим
						if (dragged.node !== null) dragged.node.fixed = false;	//если перемещали - отпускаем
						dragged = null; //очищаем
						$(canvas).unbind('mousemove', handler.dragged); //перестаём слушать события
						$(window).unbind('mouseup', handler.dropped);
						_mouseP = null;
						return false;
					}
				}
				// слушаем события нажатия мыши
				$(canvas).mousedown(handler.clicked);
			},
      
		}
		return that;
	}    
    
  
    $(document).ready(function(){
        sys = arbor.ParticleSystem(10, 0.001, 0.05, true, 60, 0.02, 0.6); // создаём систему
		//sys.parameters({gravity:false}); // гравитация вкл
		sys.renderer = Renderer("#viewport") //начинаем рисовать в выбраной области
        
        //Добавляем все вершины 
        for(var i = 0; i < graphNode.length; i++)
            sys.addNode(graphNode[i].name);
        
        //Добавляем все ребра
        for(var i = 0; i < graphEdge.length; i++){
            sys.addEdge(sys.getNode(graphEdge[i].src),sys.getNode(graphEdge[i].dest), graphEdge[i].color);
        }
    });
}