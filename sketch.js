p5.disableFriendlyErrors = true;


cSize = [1200,800];
dCanvas = 400; 													//Screen - Right Hand Screen Ending
mult = 4;
penSize = 3;
visUpRate = 12;
fRate = 30;


//Constants
bots = [];
tracerSize = 0;
normalized = [];
normalizedOriginal = [];
drawingCluster = [];
clusters = [];
img=[];
imgS=[];
imgN=[];
objs = [];
clusterCheck = [];
strW = 2;
pixV = [];

clusterColor = []; 												//Vision - Coloring for different recognized objects
contScreenSize = cSize[0]-dCanvas;
for(c=0;c<999;c++){
	if(c%3==0){
		clusterColor.push([Math.random()*100,Math.random()*100,Math.random()*100+155]);
	}
	else if(c%3==1){
		clusterColor.push([Math.random()*100,Math.random()*100+155,Math.random()*100]);
	}
	else if(c%3==2){
		clusterColor.push([Math.random()*100+155,Math.random()*100,Math.random()*100]);
	}
}


for(var i=0;i<dCanvas*cSize[1]/(mult*mult);i++){
	pixV.push([(i%(dCanvas/mult))*mult+mult/2,parseInt(i/(dCanvas/mult))*mult+mult/2]);
}


function setup() {
	pixelDensity(1);
	createCanvas(cSize[0],cSize[1]);
}

function draw() {

	//Constants
	frameRate(fRate);
	background(255);
	angleMode(RADIANS);
	fill(0);
	rect(dCanvas,0,20,cSize[1]);
	strokeWeight(strW);
	line(0,0,0,cSize[1]);
	line(0,0,cSize[0],0);
	line(cSize[0],0,cSize[0],cSize[1]);
	line(0,cSize[1],cSize[0],cSize[1]);


	//	MAIN LOOP

	//Vision - Render Drawn Lines
	strokeWeight(penSize);
	for(z=0;z<objs.length;z++){
		fill(0);
		line(objs[z][0],objs[z][1],objs[z][2],objs[z][3]);			
	}

	//Vision - Raw Pixels into Clusters
	strokeWeight(0.5);
	intervalRun();
	
	//Vision - Show Drawn Clustered Points, Left Screen
	clusterPainter();


	for(i=0;i<bots.length;i++){
		bots[i].update();
		bots[i].rend();
	}

	//Vision - Semi-Transparent Tracer Bubble
	fill(0,0,0,50);
	ellipse(mouseX,mouseY,tracerSize*0.1);

}






//Pen - Record Drawing Points
function mouseDragged() {
	if(mouseX<dCanvas){
		objs.push([mouseX, mouseY, pmouseX, pmouseY]);
	}
}

function intervalRun(){
	if(frameCount%(fRate/visUpRate)==1){			//Do these things at certain frames
		img = get();
		img.resize(cSize[0]/mult,cSize[1]/mult);	//Take screenshot, and resize image to further process easily
		img.loadPixels();
		imgS = rgb2Mono(img.pixels);				//Pixel color values of image are squeezed into monochromatic values between 0 and 1
		imgP = [];
		for(i=0;i<cSize[1]/mult;i++){				//Remove the controller screen pixels from being included
			for(j=0;j<dCanvas/mult;j++){
				imgP.push(imgS[i*(cSize[0]/mult)+j]);
			}
		}		
		
		clusterCheck = [];
		
		imgN = [];
		for(i=0;i<imgP.length;i++){
			imgN.push(1-imgP[i]/255);
			if(1-imgP[i]/255>0){
				clusterCheck.push({x:pixV[i][0],y:pixV[i][1]});
			}
		}
		dbScan();

		takeCluster(1);//From all clustered points, move cluster-n to 'clusters[n]' 
	  	normalizedOriginal = normalizeCluster(clusters[1]);
	  	//normalized = spreadTo400(normalizedOriginal);
	  	drawingCluster = [];
	  	drawingCluster.push(dCanvas+cSize[0]/5,(cSize[1]-400)/2);
	}
}

function mousePressed() {
  if (mouseX>dCanvas) {
  	bots[0] = new Bot(0,0,tracerSize,normalizedOriginal);
  }
}

function manualTrig(){
  	takeCluster(1);//From all clustered points, move cluster-n to 'clusters[n]' 
  	normalizedOriginal = normalizeCluster(clusters[1]);
  	//normalized = spreadTo400(normalizedOriginal);
  	drawingCluster = [];
  	drawingCluster.push(dCanvas+cSize[0]/5,(cSize[1]-400)/2);
  	bots[0] = new Bot(0,0,tracerSize,normalizedOriginal);
}

function clusterPainter(){
	if(mouseX>dCanvas){
		for(i=0;i<clusterCheck.length;i++){						
			fill(clusterColor[clusterCheck[i].cluster]);
			ellipse(clusterCheck[i].x,clusterCheck[i].y,mult);
		}
	}
}
