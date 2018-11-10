[ENGLISH](https://github.com/fabric-lab/hyperledger-fabric-manager/blob/master/README.md) | [中文版](https://github.com/fabric-lab/hyperledger-fabric-manager/blob/master/README-zh.md)
## Releases

- [v1.1.0.0-2018.10.12](https://github.com/fabric-lab/hyperledger-fabric-manager/releases/tag/V1.0.1) Embed Hyperledger Fabric 1.1 component

## Get started
- Download and Extract [v1.1.0.0-2018.10.12](https://github.com/fabric-lab/hyperledger-fabric-manager/releases/tag/V1.0.1)
- Run server
- Open http://localhost:8080


## Introduction
- 1 Essential tool for you to start learning hyperledger fabric.
- 2 User friendly building environment, docker container not needed. Single machine mode only.
- 3 Cross-platform for windows,liunx,mac. 
- 4 Adapt for hyperledger fabric 1.1,1.2,1.3 

## Features
  A few of the things you can do with hyperledger fabric manager:
- 1 Organizations Manage,MSPs Auto Create,Certificates Manage,Consortiums Manage,Channels Manage.
- 2 Add ChainCode,Enable Chaincode,Stop Chaincode.
- 3 Orderers Manage,Run Orderer,Stop Orderer,View Block.
- 4 Peers Manage, Run Peer, Stop Peer, List Channel, Join Channel, Get Channel Info, Install ChainCode, List ChainCode, Init ChainCode, Invoke ChainCode, Query Chaincode.

## Develop  for Ubuntu user
 - 1 Clone the repository
          
       $ cd $GOPATH/src/github.com
       $ mkdir fabric-lab && cd fabric-lab
       $ git clone https://github.com/fabric-lab/hyperledger-fabric-manager.git
 - 2 Front-end ,depend on node.js,gulp,bower
       
       $ cd hyperledger-fabric-manager/app && npm install && gulp
       
       $ [17:14:56] Using gulpfile ~/work_dir/gopath/src/github.com/fabric-lab/hyperledger-fabric-manager/app/gulpfile.js
       $ [17:14:56] Starting 'styles'...
       $ [17:14:56] Starting 'vendor'...
       $ [17:14:56] Starting 'browserify-vendor'...
       $ [17:14:57] Starting 'watch'...
       $ [17:14:57] Finished 'watch' after 23 ms
       $ [17:14:58] Finished 'vendor' after 1.6 s
       $ [17:14:58] Finished 'styles' after 1.63 s
       $ [17:15:00] Finished 'browserify-vendor' after 3.24 s
       $ [17:15:00] Starting 'browserify-watch'...
       
 - 3 Get Orderer and Peer binary from [hyperledger-fabric releases](https://nexus.hyperledger.org/content/repositories/releases/org/hyperledger/fabric/hyperledger-fabric/)，put in server/bin/linux(windows,drawin)/amd64/ directory。
       
       bin/
         └── linux
             └── amd64
                 ├── orderer
                 └── peer
 - 4 Back-end
       
       $ cd ../server && glide create && glide get  
       $ go run main.go

