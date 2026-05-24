# World Travel Journal

A cinematic personal travel website for marking visited places and future destinations.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Create a GitHub repository.
2. Upload all files in this folder to the repository.
3. Go to Vercel and import the GitHub repository.
4. Keep the default Vite settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click Deploy.

## Add a new place

Edit:

```text
src/data/places.js
```

Copy one existing object and change the fields.

Example:

```js
{
  id: 14,
  name: "Tokyo",
  zh: "东京",
  country: "Japan",
  countryZh: "日本",
  type: "City",
  typeZh: "城市",
  status: "Wishlist",
  statusZh: "想去",
  date: "Future",
  lat: 35.676,
  lng: 139.650,
  photo: "",
  note: "A future chapter of trains, food, and midnight streets.",
  noteZh: "未来章节：列车、美食与午夜街道。"
}
```

## Add photos

1. Put your image in:

```text
public/photos/
```

2. Example filename:

```text
public/photos/banff.jpg
```

3. In `src/data/places.js`, set:

```js
photo: "/photos/banff.jpg"
```

Do not use private photos unless you are comfortable publishing them online.
