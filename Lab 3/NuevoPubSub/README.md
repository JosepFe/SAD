Instructions to deploy the forum

 1 - node dmserver.js HOST PORT
 
 1 - node dmserver.js HOST PORT PUBPORT LIST[SUBHOST:SUBPORT]
 
 (lista separada por ",")
 
 
 dmserver.js 127.0.0.1 8082 9007 127.0.0.1:9001,127.0.0.1:9000
 
 node forum.js 9002 127.0.0.1:8080 127.0.0.1:9000

 2 - node forum.js PORT HOST(deployed dmserver) PORT(deployed dmserver)

 

 Example:

  1- node dmserver.js 127.0.0.1 8080 9000 127.0.0.1:9001,127.0.0.1:9002
     node dmserver.js 127.0.0.1 8081 9001 127.0.0.1:9000,127.0.0.1:9002
     node dmserver.js 127.0.0.1 8082 9002 127.0.0.1:9000,127.0.0.1:9001
     
  2 - node forum.js 4000 127.0.0.1:8080 127.0.0.1:9000
      node forum.js 4001 127.0.0.1:8081 127.0.0.1:9001
      node forum.js 4002 127.0.0.1:8082 127.0.0.1:9002
  
  3- Then go to your browser 
     - Open new tap and type "localhost:4000"
     - Open new tap and type "localhost:4001"
     - Open new tap and type "localhost:4002"
