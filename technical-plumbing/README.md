# website template

a simple website template made of plain html, css and javascript. there is nothing to install or build.

## 1. get the files

```
git clone <your-repo-url>
cd web-template
```

(or download the project as a zip and unzip it.)

## 2. run it on your computer

### option a: with docker (recommended)

1. install [docker desktop](https://www.docker.com/products/docker-desktop/) and open it.
2. in the project folder, run:

   ```
   docker compose up
   ```

3. open **http://localhost:8080** in your browser.
4. edit any file, then refresh the page to see changes.
5. press `ctrl+c` to stop. run `docker compose down` to clean up.

no docker compose? use plain docker instead:

```
docker build -t my-website .
docker run -p 8080:80 my-website
```

(with this method you must rebuild after every change.)

### option b: without docker

```
python3 -m http.server 8080
```

then open http://localhost:8080. (opening the html files by double-clicking can break some features, so use a server.)

## 3. customize it

1. **`js/config.js`**: business name, phone, address, hours, colors, menus and map. start here.
2. **the `.html` pages**: edit the text directly. words like `{{name}}` and `{{phoneDisplay}}` are filled in from config.js automatically.
3. **`css/style.css`**: fine-tune the look. colors are at the top.
4. **`images/`**: put your photos here, then replace the grey `photo-placeholder` boxes with `<img src="images/photo.jpg" alt="describe the photo">`.
5. search the pages for `todo-note` and `[PLACEHOLDER]` to find text you still need to fill in.

## 4. contact form

the form needs somewhere to send messages. make a free form at [formspree.io](https://formspree.io), then paste its url into `formEndpoint` in `js/config.js`. until then the form sends nothing.

## 5. put it online (github pages)

1. push the project to github.
2. go to **settings > pages**, choose branch `main` and folder `/ (root)`, and save.
3. tick **enforce https**.
4. put a real email in `.well-known/security.txt`.

## security notes

- the pages include a content security policy. if you add an outside script, font or embed, add its domain to the `Content-Security-Policy` meta tag in every page.
- everything in this repo is public on github pages, so never put passwords or api keys in it.
- the docker setup also adds a few safety headers and hides hidden files.
