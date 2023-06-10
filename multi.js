const puppeteer = require("puppeteer");
const axios = require("axios").default;

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: "data",
    });
    const page = await browser.newPage();
    await page.goto("https://www.gsmarena.com/samsung-phones-9.php", {
      timeout: 0,
    });

    await page.waitForSelector(".makers");

    const productLinks = await page.$$eval(".makers a", (links) =>
      links.map((link) => link.href)
    );
    console.log(`Total Products : ${productLinks.length}`);
    let product = productLinks.length;

    for (const link of productLinks) {
      await page.goto(link, { timeout: 0 });
      const data = await page.evaluate(() => {
        const title = document.querySelector(
          ".specs-phone-name-title"
        ).textContent;
        const brand = title.split(" ")[0];
        const regexPattern = new RegExp(`${brand}\\s`, "i");
        const model = title.replace(regexPattern, "");
        const model_id = title.split(" ").join("_").toLowerCase();
        const category = "smartphones";
        let variants;
        let img_url = "";
        const content = {};
        let status = "upcoming";
        let approved = true;

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
          approved,
          img_url,
          content,
        };
      });

      const img_url = await page.$(".specs-photo-main > a > img");
      const url = await img_url.evaluate((e) => e.src);
      data.img_url = url;
      const res = await axios.post(
        "http://localhost:5000/api/upload/scraping",
        data
      );
      product = product - 1;
      console.log(`Uploaded :${data.model} : and Pending ${product}`);
      await page.goBack();
    }
    console.log("All Product Uploaded");
    await browser.close();
  } catch (error) {
    console.log(error.message);
    await browser.close();
  }
})();
