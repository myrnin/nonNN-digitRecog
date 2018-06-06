This project is focused on providing digit and arithmetic operator recognition to an HTML5 canvas based calculator, which will require users to draw their inputs on the HTML5 canvas through a mouse instead of typing them through a keyboard.

Neural networks are highly successful (%99.5+ on MNIST) at recognizing hand-written digits; however, they fall behind in this segment as most users unintentionally add bizarre angles and sharp stops as typing is done using a mouse compared and not a pencil. 

You can try your success rate on an NN based algorithm when drawing on [comparisonToNNs.html]() file.

The success rate for most users go below %90, which is not acceptable for consistent use. These numbers, however, still retain the intentions behind main strokes that can be tracked. Addition of base case assumptions before the main algorithm runs helps with the prediction. Examples:
- A number is written starting from its upper bound
- A number that has no upper edge is likely to be one of {0,8,9}
- A number that has a left upper edge is likely to be one of {1,2,3,7}
- A number that has a right upper edge is likely to be one of {4,5,6}

Algorithm also has potential to recognize overlapping digits, though that level won't be reached in this version.

### Progress/History

- [x] P5.js canvas setup/customization features
	- [x] Canvas-to-pixel-to-matrix sensitivity control setup
	- [x] DBSCAN sensitivity control setup
	- [x] Update omission control setup
- [x] Reduce, resize, and convert canvas RGB pixel value array to a boolean matrix
- [x] Cluster nodes based on distance using [DBSCAN]() algorithm
- [x] Create side screen development interface to monitor and control intelligent agent behavior
	- [x] Compress all nodes into 400x400px monitor, prioritizing height
- [x] Intelligent agent ([bot]()) initialization stage
	- [x] Find upper edge based on square8Map nodes and distance
    - [x] Find starting point and direction based on upper bound node density
    - [x] Collect distance traveled
- [ ] Intelligent agent ([bot]()) direction history collection stage
	- [x] Start recording stroke direction
    - [ ] Generate likely number expectations based on initial readings to find biases
    - [ ] Change angle sensitivity to either side depending on generated expectations
- [ ] Cluster nodes based on breaking points
    - [x] Find breaking point direction values
	- [ ] Cluster similar angles after removal of breaking points to find main strokes of the digit
	- [ ] Destructure and categorize stroke clusters based on start/end point and angles
	- [ ] Save relative distance & angle to the center of number
- [ ] Intelligent agent ([bot]()) end stage
    - [ ] Collect end point values and remove intelligent agent
	- [ ] Categorize clustered strokes based on curvature and length
- [ ] Recognize sets of strokes through CNN
	- [ ] Produce and record 1K stroke-digit(or operator) pairs for each needed number/operator
	- [ ] Train CNN on the stroke(start P, end P, angle, dist, order) and digit/operator pair data
- [ ] Remove developmental tools and architecture from [bot]()
	- [ ] Set up internal/independent update architecture
	- [ ] Remove visual monitoring, mouse and keyboard intervention, all other debugging tools
