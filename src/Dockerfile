FROM dockerhub.tezign.com/library/nginx-nodejs-commons-new:v12

COPY dist/ /data/www.tezign.com/
# cdn 健康检查探针
# COPY public/health-check.js /data/www.tezign.com/dam_enterprise/static
# RUN chmod +x /data/www.tezign.com/node_modules/@tezign/html-webpack-plugin/build/docker-entrypoint.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
