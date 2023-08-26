const puppeteer = require("puppeteer");
const { headers } = require("./headers.js");
const axios = require("axios").default;

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: "data",
    });
    const page = await browser.newPage();
    await page.goto("https://www.gsmarena.com/vivo_y77t-12482.php", {
      timeout: 0,
    });

    const data = await page.evaluate(() => {
      const title = document.querySelector(
        ".specs-phone-name-title"
      ).textContent;
      const getRandomInt = Math.floor(Math.random() * 9000) + 1000;

      const brand = title.split(" ")[0];
      const regexPattern = new RegExp(`${brand}\\s`, "i");
      const model = title.replace(regexPattern, "");
      const model_id = `${title
        .split(" ")
        .join("-")
        .split(".")
        .join("-")
        .split("+")
        .join("-plus")
        .toLowerCase()}-${getRandomInt}`;

      const category = "smartphones";
      let variants;
      let img_url = "";
      const content = {};
      let status = "UNAPPROVED";
      let approximatePrice = 0;

      const tableBodies = document.querySelectorAll("table > tbody");

      for (const body of tableBodies) {
        const rows = body.querySelectorAll("tr");

        let contentHeading;

        const tableContent = {};

        for (const row of rows) {
          const th = row.querySelector("th");
          const td = row.querySelector("td.ttl");

          if (th) {
            const heading = th.textContent;
            contentHeading = heading;
          }

          if (td) {
            const subHeadingContent = td.textContent;
            const tbContent = row.querySelector(".nfo");

            if (tbContent) {
              const textContent = tbContent.textContent;

              if (subHeadingContent === "Internal") {
                const deviceSpecs = textContent
                  .split(", ")
                  .map((spec) => spec.replace("GB", "").replace("TB", "000"));

                variants = deviceSpecs.map((spec) => {
                  const [rom, ram] = spec.split(" ");
                  return {
                    ROM: parseInt(rom),
                    RAM: parseInt(ram),
                    official: 0,
                    unofficial: 0,
                  };
                });
              }

              tableContent[subHeadingContent] = textContent;
            }
          }
        }

        if (contentHeading) {
          content[contentHeading.split(" ").join("_")] = tableContent;
        }
      }

      return {
        title,
        brand,
        model,
        model_id,
        category,
        variants,
        status,
        img_url,
        approximatePrice,
        content,
      };
    });

    const img_url = await page.$(".specs-photo-main > a > img");
    const url = await img_url.evaluate((e) => e.src);
    data.img_url = url;
    const res = await axios.post(
      "http://localhost:5000/api/upload/scraping",
      data,
      {
        headers: {
          "x-api-key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImphIiwibmFtZSI6ImltcmFuIiwiZG9tYWluIjoibW9iaWxlc2VsbGVyYmQuY29tIiwiaWF0IjoxNjg0MjE5NjA0fQ.Nc22sGygtB-5smG1OqeWBocmG-tJyDFhkCPpeudwnx4",
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVtcmFuIiwiX2lkIjoiNjQwMmVkMGM2NzEzZDJiNjQwMWIwZmY0IiwiaWF0IjoxNjkxNjMzNzIzLCJleHAiOjE2OTE2Njk3MjN9.GkC7X97DwRb11vbWQRXHtIXxekmmjmSlcEFmKOr6RB0",
        },
      }
    );

    await browser.close();
  } catch (error) {
    console.log(error.message);
    await browser.close();
  }
})();
