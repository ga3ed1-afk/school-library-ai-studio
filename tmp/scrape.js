const https = require('https');

const urls = [
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGH4J_eaTkESfU13EVPIk587cOKw3cX3LcIGKq35Kzxqzs_SCE0RWRKJ-AQZPjbhFW0YKJd0S529uDToE1vOwWIGj467jhsdUm_dCYIvF5qseYdRlpj3NBb7hl-qzmGywvjVqhFVO-QN1PzDo9gscNerOXfAeqYrO6wzUyV6eVLJ2Yet76-Eb_WLftYD67tmtZwjDs2qveTXCvBG7qd3iAF_qvw9HdaIpyc8rbs6x5qHmiOhAGNttt3rfG1rX6XVABOUsULYpBz2oXYFnDKAME95rvl1slx96RpeSJ3l3PA86rdPhUq5lT-lnHEYBCTivuzEQrr_XZK1u9VjueM7yI9j-P4T29eIfzG5cXPknxMa6z68ARXPfgRpVrpzTpurAmMtC0i7EwHUg-ZjQGldcNVxJWhX9Ce4u1UlK98QnY1E5FgG_o4gCwLYuznAO-YwIED1Cg0yL8cAZTGdZ_JZds9dTrvwa-8LiGCvtStif035udTdFqc",
  "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHF9A1N75KnsIX0TBCHue1Bh02MJH1Jwm5cCAPEH-MdHVR52C135Pza7v09uuea48TzBqkmlw5cu0_ub0l07cNLOIN0CQO95eIYreiAkkFf2mxuKmWP8GgHEgwNcw7YXM_14tZePVzLgO6OpmjxBW3Zw0WOJRKv81q7u8kHqAi3RnU4Cvz_QY5Lb2OAhCvgy-MT9uBdb-zpgRdtlYDSA9PGQ43RiG-v7nRvRWbTkNX9Fgmm-nqxt5Q10fZYp3Ii76atrBRVUTJjrpvHCBfQYayoEjUrnzTsSVyDyFYsxuw9-SVhWe7ap2S_sA4ua8A7k0RumS5AIKYIt3cel8pQC9iF8C2qRmIfbGTFnISi79R9zrAH1lBQZ1mGeco4SJ5qi8cygCFhh7w5Si5LZDQrAuIBBx63tKKQtc76ymSFdqeup4rZNu73pCzZGHlAuzs7PMxELgj_yMPSZxoNmFkNnaOuYOkdtisY_FtesJp5O8qNX0pJLKjM_rYT3RBT3dWUm_LHBc4I0d2oAA5dtuiDi0Z6EVN_w5b0mh-dssBYGeheTOwdIfVQkuoelf_X7j98q3QEJZyMG7O6kcXmSCy0AsQ8ooEKKdw8hCoSpF8_9H990ytIiIIUyAMDA2WI7i7SvZy9fbjMHKpk9YtD5zvKpjfz5iMApaityXMh1SUc-eah3YIc39dfvJQxgqk2O1Jj2Vw3"
];

function fetchUrl(u) {
  return new Promise((resolve) => {
    https.get(u, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve);
      }
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", () => resolve(""));
  });
}

async function run() {
  const images = new Set();
  for (const u of urls) {
    const html = await fetchUrl(u);
    const matches = html.match(/https:\/\/[^"'\s<>()]*fbcdn\.net[^"'\s<>()]*/g) || [];
    for (const m of matches) {
      const clean = m.replace(/&amp;/g, "&");
      if (clean.includes("/t39.30808") || clean.includes("scontent")) {
        if (!clean.includes("rsrc.php") && !clean.includes("emoji.php") && !clean.includes("p50x50") && !clean.includes("p32x32") && !clean.includes("p16x16") && !clean.includes("p24x24")) {
          images.add(clean);
        }
      }
    }
  }
  console.log("TOTAL FOUND:", images.size);
  console.log(JSON.stringify(Array.from(images), null, 2));
}

run();
