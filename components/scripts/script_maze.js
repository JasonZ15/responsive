//////////////////////////////
//////////the Maze
//////////////////////////////
var Maze = function(width, height) {
	this.width = width;
	this.height = height;

	this.startX = null;
	this.startY = null;
	this.startOrientation = null;
	this.endX = null;
	this.endY = null;
};

Maze.prototype.setStart = function(x, y, startOrientation) {
	this.startX = x;
	this.startY = y;
	this.startOrientation = startOrientation;
};

Maze.prototype.setEnd = function(x, y) {
	this.endX = x;
	this.endY = y;
};

Maze.prototype.initualize = function() {
	this.space = new Array(this.width);
	for (var i = 0; i < this.width; i++) {
		this.space[i] = new Array(this.height);
		for (var j = 0; j < this.height; j++) {
			this.space[i][j] = {
				north: false,
				south: false,
				west: false,
				east: false	
			};	
		}
	}
	for (var i = 0; i < this.width; i++) {
	    this.space[i][0]["south"] = true;
	}
	for (var i = 0; i < this.height; i++) {
        this.space[0][i]["west"] = true;
    }
    for (var i = 0, j = this.width - 1; i < this.height; i++) {
        this.space[j][i]["east"] = true;
    }
    for (var i = 0, j = this.height - 1; i < this.width; i++) {
        this.space[i][j]["north"] = true;
    }

    
	for (var key in this.space[this.startX][this.startY]) {
	    this.space[this.startX][this.startY][key] = false;
	}
	for (var key in this.space[this.endX][this.endX]) {
        this.space[this.endX][this.endX][key] = false;
    }
};

Maze.prototype.setWall = function(spaceX, spaceY, spaceWall) {
	this.space[spaceX][spaceY][spaceWall] = true;
};

//////////////////////////////
//////////the Robot
//////////////////////////////
var Robot = function() {
    this.robotX = m.startX;
    this.robotY = m.startY;
    this.robotOrientation = m.startOrientation;  
};

Robot.prototype.moveForward = function() {
    if(this.robotOrientation === "east" && !m.space[this.robotX][this.robotY]["east"] && !m.space[this.robotX+1][this.robotY]["west"]) {
        this.robotX++;
    }
    if(this.robotOrientation === "west" && !m.space[this.robotX][this.robotY]["west"] && !m.space[this.robotX-1][this.robotY]["east"]) {
        this.robotX--;
    }
    if(this.robotOrientation === "north" && !m.space[this.robotX][this.robotY]["north"] && !m.space[this.robotX][this.robotY+1]["south"]) {
        this.robotY++;
    }
    if(this.robotOrientation === "south" && !m.space[this.robotX][this.robotY]["south"] && !m.space[this.robotX][this.robotY-1]["north"]) {
        this.robotY--;
    }
};

Robot.prototype.turnLeft = function() {
    if(this.robotOrientation === "east") {
        this.robotOrientation = "north";
    } else if(this.robotOrientation === "west") {
        this.robotOrientation = "south";
    } else if(this.robotOrientation === "north") {
        this.robotOrientation = "west";
    } else {
        this.robotOrientation = "east";
    }
};
Robot.prototype.turnRight = function() {
    this.turnLeft();
    this.turnLeft();
    this.turnLeft();
}
Robot.prototype.turnBack = function() {
    this.turnLeft();
    this.turnLeft();
}

Robot.prototype.startOver = function() {
    this.robotX = m.startX;
    this.robotY = m.startY;
    this.robotOrientation = m.startOrientation;    
};





//create a presentation layer
$(function(){
    function showMaze() {
        html = '<table>'; 
        for(var j = m.height-1; j >= 0; j--){
            html += '<tr>'; 
            for(var i = 0; i < m.width ; i++){
                html += '<td id="space-' + i + '_' + j + '" class="';
                    for(var key in m.space[i][j]) {
                        if (m.space[i][j][key] === true) {
                            html += key + ' ';
                        }
                    }     
                html += '"></td>'; 
            }
            html += '</tr>';
        }
        html += '</table>'; 
        return html; 
    }
        
    function robotControl(controlName) {
        var control = controlName; 
        if(control === "startGame") {
            $('#maze-robot').html(showMaze());
            $("#space-" + r.robotX + "_" + r.robotY).addClass("robot face-" + r.robotOrientation);
        } else if(control === "moveForward" || control === "startOver") {
            $('td').removeClass("robot");
            r[control]();
            $("#space-" + r.robotX + "_" + r.robotY).addClass("robot face-" + r.robotOrientation);    
        } else {
            $('td').removeClass(function (index, css) { //A function returning one or more space-separated class names to be removed. Receives the index position of the element in the set and the old class value as arguments.
                return (css.match (/(^|\s)face-\S+/g) || []).join(' ');
            });
            r[control]();
            $("#space-" + r.robotX + "_" + r.robotY).addClass("face-" + r.robotOrientation);    
        }
    }
    
    $('button.robot-control').click(function() {        
        robotControl($(this).attr('name'));
    });
    
    //automatically move. use delay to slow motion.
    robotControl("startGame");

    //find the path. use a counter array to record the path.
    
});









