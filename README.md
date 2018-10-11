## 项目简介
- 1 学习超级账本(hyperledger fabric) 入门必备工具。
- 2 轻松搭建学习环境,无需使用docker容器。目前仅支持单机环境。
- 3 多平台支持 windows,liunx,mac。 

## 当前功能
- 1 组织管理 MSP管理 证书管理 联盟管理 通道管理
- 2 链码管理 添加链码 启动链码 停止链码
- 3 Orderer管理 启动节点 停止节点 查看区块
- 4 Peer管理 启动节点 停止节点 通道清单 加入通道 获取通道信息 安装链码 链码清单 初始化链码 调用链码 查询链码

## ubuntu下开发环境搭建
 - 1 获取项目
          
       $ cd $GOPATH/src/github.com
       $ mkdir fabric-lab && cd fabric-lab
       $ git clone https://github.com/fabric-lab/fabric-manager.git
 - 2 前端环境
       
       $ cd fabric-manager/app && npm install && gulp
       
       $ [17:14:56] Using gulpfile ~/work_dir/gopath/src/github.com/fabric-lab/fabric-manager/app/gulpfile.js
       $ [17:14:56] Starting 'styles'...
       $ [17:14:56] Starting 'vendor'...
       $ [17:14:56] Starting 'browserify-vendor'...
       $ [17:14:57] Starting 'watch'...
       $ [17:14:57] Finished 'watch' after 23 ms
       $ [17:14:58] Finished 'vendor' after 1.6 s
       $ [17:14:58] Finished 'styles' after 1.63 s
       $ [17:15:00] Finished 'browserify-vendor' after 3.24 s
       $ [17:15:00] Starting 'browserify-watch'...

 - 3 后端环境
       
       $ cd ../server && glide create && glide get
      
      国内由于网络原因，可以使用gopm安装依赖包,部分依赖包不能下载，可以进入~/.gopm/repos/ 手动安装
        
       $ cd ../server && gopm get 
       
      最后启动后端服务
       
       $ go run main.go
