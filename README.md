----------------------------------------
# 数据库
docker run --name db -d mongo:latest


----------------------------------------
# 网站
docker build -t joehe/wuming:1.0.0 .
docker run -p 80:80 -d -v /"$PWD":/wuming --name wuming --link db:db joehe/wuming:1.0.0


----------------------------------------
# 阿里云仓库
docker login -u l@live.cn -p h -e sample.aliyun.com registry.aliyuncs.com

# push
docker login registry.aliyuncs.com
docker tag 9ab2d1b8f96a registry.aliyuncs.com/joehe/wm
docker push registry.aliyuncs.com/joehe/wm

#pull
docker login registry.aliyuncs.com
docker pull registry.aliyuncs.com/joehe/wm


----------------------------------------
# 线上
docker run -p 80:80 -d -v "$(pwd)"/app:/wm/app --name wm --link db:db joehe/wm:1.0.0
