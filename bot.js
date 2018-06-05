function Bot(xx,yy,tracerS,data) {

	this.x = xx;
	this.y = yy;
	this.sX = 0.01;
	this.sY = 0.01;
	this.size = 1.2*tracerS/30;
	this.searchRad = 3.5;
	this.data = data;
	this.bodyAngle = 0;
	this.points = [];
	this.pos400=[];
	this.detected = [];
	this.rightRange=1;
	this.leftRange=1;
	this.maximums = xyMax(data);
	this.scanPact = 0.3;			//The decreased pulling force multiplier of points after being scanned
	this.stage = 0;
	this.status = "observe";
	this.angleDist = [];

	this.edgeFound = [];
	this.previousPos = [0,0];
	this.distTraveled = 0;
	this.traceList = [];
	for(var i=0;i<data.length;i++){
		this.points.push([this.data[i][0],this.data[i][1],0,1]);
	}

	this.square8 = square8pointMapper(this.data,pointsToMatrix(this.data,this.maximums));
	this.sqaure8MaxMap = matrixEdgeDet(this.square8);


	//General Starting Position
	var highest = [0,0];
	for(var i=0;i<this.points.length;i++){
		if(this.sqaure8MaxMap[i]>4){
			if(this.points[i][1]<this.maximums[1]/3){
				var score=(this.sqaure8MaxMap[i]-3)*this.maximums[1]/2-this.points[i][1]*2-this.points[i][0]/2;
				console.log("value: "+(this.sqaure8MaxMap[i]-3)*this.maximums[1]/2)+100;
				console.log("minus: "+this.points[i]);
				if(score>highest[0]){
					highest[0] = score;
					highest[1] = i;
				}
			}
		}
	}
	this.genStartPos = [this.points[highest[1]][0],this.points[highest[1]][1]];

	this.update = function(){
		this.sX = this.sX/1.5;
		this.sY = this.sY/1.5;
		this.bodyAngle = Math.atan2(this.sY,this.sX);
		this.bodyCos = Math.cos(this.bodyAngle);
		this.bodySin = Math.sin(this.bodyAngle);
		//Point of Vision
		this.visX = this.x+20*this.bodyCos;
		this.visY = this.y+20*this.bodySin;


	this.points.push([this.x,this.y]);
	this.pointsNormalized = spreadTo400(this.points.slice());
	this.pos400 = this.pointsNormalized[this.pointsNormalized.length-1];		//To be deleted in final form, only for debugging with mouse
	this.points.splice(-1,1);
	this.pointsNormalized = spreadTo400(this.points.slice());

		this.x += (mouseX-pmouseX)/(this.size*5);								//Mouse controller
		this.y += (mouseY-pmouseY)/(this.size*5);
		this.sX += (mouseX-pmouseX)/(this.size*15);								//Mouse controller
		this.sY += (mouseY-pmouseY)/(this.size*15);
		this.detected = [];


		//Points distance update

		for(var p=0;p<this.points.length;p++){
			var distTemp = dist(this.x,this.y,this.points[p][0],this.points[p][1]);
			this.points[p][2]=distTemp;
		}

		//Detected Points Processing

		for(var i=0;i<this.points.length;i++){
			if(this.searchRad>this.points[i][2]){
				var tempInput = [this.x,this.y,this.bodySin,this.bodyCos,this.points[i][0],this.points[i][1],this.visX,this.visY];
				this.detected.push({
					x: this.points[i][0],
					y: this.points[i][1],
					dist: this.points[i][2],
					angle: visAng(tempInput),
					id: i,
					impact: this.points[i][3],
					fired: 0
				});
			}
		}
		this.speedTotal = dist(this.sX,this.sY,0,0);



		//Distance Traveled Tracker
		this.distTraveled+=dist(this.x,this.y,this.previousPos[0],this.previousPos[1]);
		if(parseInt(this.distTraveled/5) > this.traceList.length){
			this.traceList.push([this.x,this.y]);
		}

		this.angleDist[parseInt(this.distTraveled)] = this.bodyAngle;

		//STAGE MANAGEMENT

		//Stage 0 - Identifying edges and categorizing


		if(this.stage == 0){
			if(this.distTraveled<this.points.length/4 && this.edgeFound.length == 0){
				this.x =this.genStartPos[0];
				this.y =this.genStartPos[1];
				this.stage = 1;
				this.speedTotal = 1;
				this.rightRange=1.6;
				this.leftRange=1.6;
			}






		}
				if(this.stage == 1){
					this.rightRange=1.2;
					this.leftRange=1.2;
				}



		this.bodyAngle = Math.atan2(this.sY,this.sX);  //Refreshing for changes in sX and sY to take affect

	if (keyIsDown(87))//W
    this.rightRange += 0.1;
	if (keyIsDown(87))//W
	this.leftRange += 0.1;
	if (keyIsDown(83))//S
    this.rightRange -= 0.1;
	if (keyIsDown(83))//S
	this.leftRange -= 0.1;

		this.status="crawl";
		if(this.status == "crawl"){
			for(var d=0;d<this.detected.length;d++){
				if(this.detected[d]["angle"]<this.rightRange && this.detected[d]["angle"]>-this.leftRange){
					if(this.detected[d]["dist"]>3){
					var tempPact = this.points[this.detected[d]["id"]][3];
					this.sX+=tempPact*(this.detected[d]["x"]-this.x)/20;
					this.sY+=tempPact*(this.detected[d]["y"]-this.y)/20;
					this.points[this.detected[d]["id"]][3] = this.scanPact*2;
					this.detected[d]["fired"] = 1;
					}
					else if(this.detected[d]["dist"]>2){
					var tempPact = this.points[this.detected[d]["id"]][3];
					this.sX+=tempPact*(this.detected[d]["x"]-this.x)/20;
					this.sY+=tempPact*(this.detected[d]["y"]-this.y)/20;
					this.points[this.detected[d]["id"]][3] = this.scanPact;
					this.detected[d]["fired"] = 1;
					}

				}
			}
		}



		text("Position: " + [parseInt(this.x),parseInt(this.y)],600,80);
		text("x: " + this.sX,600,100);
		text("y: " + this.sY,600,120);
		text("Right range: " + this.rightRange,600,140);
		text("Left range: " + this.leftRange,600,160);
		text("Detected: " + this.detected.length,600,180);
		text("Stage: " + this.stage,600,200);
		text("Dist Traveled: " + this.distTraveled,600,220);

		//Distance Traveled & Speed Update
		this.previousPos[0]=this.x;
		this.previousPos[1]=this.y;
		this.x+=this.sX;
		this.y+=this.sY;
	};










	this.rend = function(){

		//Points Rendering
		for(var zz=0;zz<this.points.length;zz++){
			strokeWeight(0);
			fill(this.points[zz][3]*200,255-this.points[zz][3]*200,200);
			ellipse(drawingCluster[0]+this.pointsNormalized[zz][0]+40,drawingCluster[1]+this.pointsNormalized[zz][1]+40,mult);
		}

		// for(var zz=0;zz<this.points.length;zz++){
		// 	strokeWeight(0.2);
		// 	fill(255-(this.sqaure8MaxMap[zz]-4)*85);
		// 	ellipse(drawingCluster[0]+this.pointsNormalized[zz][0]+40,drawingCluster[1]+this.pointsNormalized[zz][1]+40,mult*1.2);
		// }

		for(var zb=0;zb<this.detected.length;zb++){
			if(this.detected[zb]["fired"]===1){
				strokeWeight(0.5);
				fill(100,0,255);
				ellipse(drawingCluster[0]+this.pointsNormalized[this.detected[zb]["id"]][0]+40,
					drawingCluster[1]+this.pointsNormalized[this.detected[zb]["id"]][1]+40,mult*1.5);
				strokeWeight(0);
			}
		}

		// for(var t=0;t<this.traceList.length;t++){
		// 	ellipse(this.traceList[t][0]*2,this.traceList[t][1]*2,mult*2);
		// }
		// Bot Object Rendering
		push();
		translate(drawingCluster[0]+this.pos400[0]+40,drawingCluster[1]+this.pos400[1]+40);
		fill(0);
		//ellipse(this.visX-this.x, this.visY-this.y,this.size*3);
		rotate(this.bodyAngle);

		fill(200,50,50,30);
		ellipse(0,0,this.searchRad*tracerS/2.5);
		fill(50,200,50,150);
		ellipse(0,0,30*this.size/1.2); //head
		strokeWeight(0.6);
		fill(220,220,240); //eyes
		quad(0,-11*this.size,2*this.size,-1*this.size,4*this.size,-1*this.size,4*this.size,-7*this.size);
		quad(0,11*this.size,2*this.size,1*this.size,4*this.size,1*this.size,4*this.size,7*this.size);
		fill(255);
		pop();



	};


}
