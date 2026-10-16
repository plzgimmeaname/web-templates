# serves the static site with nginx
FROM nginx:alpine
COPY . /usr/share/nginx/html
# 404 page for missing urls
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n  error_page 404 /404.html;\n  add_header X-Content-Type-Options nosniff;\n  add_header Cache-Control "no-cache";\n  add_header X-Frame-Options DENY;\n  location ~ /\\.(?!well-known) { deny all; }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
