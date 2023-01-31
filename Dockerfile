FROM nginx:stable-alpine

LABEL author="Louis Nguyen"
LABEL author_email="thonh.it@gmail.com"

WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*
COPY ./dist/visual-information-retrieval /usr/share/nginx/html

WORKDIR /
EXPOSE 80
