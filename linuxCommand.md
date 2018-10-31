先删除服务器上的文件夹：
进入到chenpan文件夹下
rm  -rf HotelAdmin/

上传最新的静态网页
pscp  -r E:\HotelAdmin ubuntu@120.77.41.102:/home/ubuntu/chenpan/

重新启动nginx
sudo service nginx restart
