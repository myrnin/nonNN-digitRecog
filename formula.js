function dbScan(){
	var dbscanner = jDBSCAN().eps(20).minPts(1).distance('EUCLIDEAN').data(clusterCheck);
	var point_assignment_result = dbscanner();
	//console.log('Resulting DBSCAN output', point_assignment_result);
	point_assignment_result.forEach(function (d, i) {
		clusterCheck[i].cluster = d;
	});
}

function dbScan2(data,result){
	var dbscanner = jDBSCAN().eps(3).minPts(1).distance('EUCLIDEAN').data(data);
	var point_assignment_result = dbscanner();
	//console.log('Resulting DBSCAN output', point_assignment_result);
	point_assignment_result.forEach(function (d, i) {
		result[i]= d;
	});
}




function rgb2Mono(array) {
	result = [];
	for(var i = 0; i < array.length; i = i+4){
		temp = [array[i],array[i+1],array[i+2],array[i+3]];
		result.push((array[i]*0.3+array[i+1]*0.5+array[i+2]*0.2)*array[i+3]/255);
	}
	return result;
}


function mono2Rgb(array) {
	result = [];
	for(var i = 0; i < array.length; i++){
		result.push(array[i],array[i],array[i],255);
	}
	return result;
}

function multMat(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function dotProduct(a,b) {
	var n = 0, lim = Math.min(a.length,b.length);
	for (var i = 0; i < lim; i++) n += a[i] * b[i];
	return n;
}

function angleBetweenVector(a,b) {
	return Math.acos(dotProduct(a,b)/(dist(0,0,a[0],a[1])*dist(0,0,b[0],b[1])));
}

function visAng([x,y,Sin,Cos,xPoi,yPoi,xh,yh]){
	var lf = dist(x+10*Sin,y-10*Cos,xPoi,yPoi);
	var rt = dist(x-10*Sin,y+10*Cos,xPoi,yPoi);
	var dir = -1;
	if(lf<=rt){
		dir = -1;
	}
	if(lf>rt){
		dir = 1;
	}
	return (dir*angleBetweenVector([xh-x,yh-y],[xPoi-x,yPoi-y]));
	//angleBetweenVector([this.hx-this.x,this.hy-this.y],[this.poi[0]-this.x,this.poi[1]-this.y]);
}

function visAngAbs([x,y,uniSin,uniCos,xh,yh],[xPoi,yPoi]){
	return Math.abs(angleBetweenVector([xh-x,yh-y],[xPoi-x,yPoi-y]));
	//angleBetweenVector([this.hx-this.x,this.hy-this.y],[this.poi[0]-this.x,this.poi[1]-this.y]);
}



	function rnd_snd() {
		return (Math.random() * 2 - 1) + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
	}

	function rnd(mean, stdev) {
		return Math.round(rnd_snd() * stdev + mean);
	}



function drawCluster(arr){
	var temp5 = arr.slice();
	if(drawingCluster.length==2){
		fill(255);
		rect(drawingCluster[0],drawingCluster[1],400,400);
		for(z=0;z<temp5.length;z++){
			strokeWeight(0);
			fill(200);
			ellipse(drawingCluster[0]+temp5[z][0]+40,drawingCluster[1]+temp5[z][1]+40,mult);
		}
	}
}

function takeCluster(clusterNum){
	clusters[clusterNum]=[];
	for(cc=0;cc<clusterCheck.length;cc++){
		if(clusterCheck[cc].cluster==clusterNum){
			clusters[clusterNum].push([clusterCheck[cc].x,clusterCheck[cc].y]);
		}
	}
}

function normalizeCluster(arr){
	var temp1 = arr.slice();
	var highX = 9999;
	var highY = 9999;
	for(t=0;t<temp1.length;t++){
		if(temp1[t][0]<highX){
			highX=temp1[t][0];
		}
		if(temp1[t][1]<highY){
			highY=temp1[t][1];
		}
	}
	for(tt=0;tt<temp1.length;tt++){
		temp1[tt][0]=(temp1[tt][0]-highX)/mult;
		temp1[tt][1]=(temp1[tt][1]-highY)/mult;
	}
	return temp1;
}

function spreadTo400(arr){
	var temp2 = arr.slice();
	var result2 = [];
	var maxX = 0;
	var maxY = 0;
	for(m=0;m<temp2.length;m++){
		if(temp2[m][0]>maxX){
			maxX=temp2[m][0];
		}
		if(temp2[m][1]>maxY){
			maxY=temp2[m][1];
		}
	}

	var spreadMult = 320/Math.max(maxX, maxY);
	tracerSize = spreadMult*5;

	var spreadX = 320/maxX;
	var spreadY = 320/maxY;
	var offset = [];



	if(maxX>maxY){
		offset = [0,160-160/((maxX/maxY))];
	}
	if(maxY>maxX){
		offset = [160-160/((maxY/maxX)),0];
	}
	for(f=0;f<temp2.length;f++){
		result2.push([temp2[f][0]*spreadMult+offset[0],temp2[f][1]*spreadMult+offset[1]]);
	}
	return result2;
}

function xyMax(arr){
	var temp3 = arr.slice();
	var result3 = [];
	var maxX = 0;
	var maxY = 0;
	for(m=0;m<temp3.length;m++){
		if(temp3[m][0]>maxX){
			maxX=temp3[m][0];
		}
		if(temp3[m][1]>maxY){
			maxY=temp3[m][1];
		}
	}

	return [maxX,maxY];
}

function startPos(arr,maxX){
	var temp4 = arr.slice();
	var distMin = 999;
	var minYtemp = [0,0];
	for(var mm=0;mm<temp4.length;mm++){
		if(dist(temp4[mm][0],temp4[mm][1],maxX/2,-10)<distMin){
			distMin = dist(temp4[mm][0],temp4[mm][1],maxX/2,0);
			minYtemp = [temp4[mm][0],temp4[mm][1]];
		}
	}
	return minYtemp;
}

function sortNumber(a,b) {
    return a - b;
}

function zeroMatrix(size){
	var result = [];
	for(var i=0;i<size[1];i++){
		var temp = [];
		for(var j=0;j<size[0];j++){
			temp.push(0);
		}
		result.push(temp);
	}
	return result;
}

function pointsToMatrix(points,size){
	var max=size.slice();
	max[0]++;
	max[1]++;
	var temp = zeroMatrix(max);
	for(var i=0;i<points.length;i++){
		temp[points[i][1]][points[i][0]] = 1;
	}
	return temp;
}

function square8pointMapper(points,matrix){
	var tPoints = points.slice();
	var tMatrix = matrix;
	var result = [];
	for(var i=0;i<tPoints.length;i++){
		var coords = tPoints[i];
		var arr = [];
		var mods = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
		for(var a=0;a<mods.length;a++){
			try {
				if(tMatrix[coords[1]+mods[a][1]][coords[0]+mods[a][0]] == null){
					arr.push(0);
				} else {
			   		arr.push(tMatrix[coords[1]+mods[a][1]][coords[0]+mods[a][0]]);
				}
			}
			catch(err) {
			    arr.push(0);
			}
		}
		result.push(arr);
	}
	return result;
}

function matrixEdgeDet(matrix){
	result = [];
	for(var i=0;i<matrix.length;i++){
		var tempM = matrix[i];
		var highest = 0;
		var counter = 0;
		var tempMdouble = tempM.concat(tempM);
		for(var j=0;j<tempMdouble.length;j++){
			if(tempMdouble[j]==0){
				counter++;
			} else if (tempMdouble[j]==1){
				if(counter>highest){
					highest=counter;
				}
				counter = 0;
			}
		}
		result.push(highest);
	}
	return result;
}