Instructions to deploy the forum

 1 - node dmserver.js HOST PORT

 2 - node forum.js PORT HOST(deployed dmserver) PORT(deployed dmserver)

 

 Example:

 	1 - node dmserver.js 127.0.0.1 8081
 	2 - node forum.js 8080 127.0.0.1 8081

 Then go to your browser and type "localhost:8080"