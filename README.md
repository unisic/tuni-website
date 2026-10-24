# tuni.unisic.app

The website for [Tuni](https://github.com/unisic/tuni). SvelteKit, prerendered to static files and served by nginx.

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # writes ./build
npm run check     # svelte-check
```

## Docker

```sh
docker build -t tuni-website .
docker run --rm -p 8080:80 tuni-website
```

## Screenshots

Everything in `static/img` is the real app, captured from a throwaway home directory on a virtual display. Change Tuni's look and they need taking again.

## Installer

`static/install.sh` is a copy of [`scripts/install.sh`](https://github.com/unisic/tuni/blob/main/scripts/install.sh), served at `https://tuni.unisic.app/install.sh`. After the installer changes in Tuni:

```sh
cp ../tuni/scripts/install.sh static/install.sh
```
