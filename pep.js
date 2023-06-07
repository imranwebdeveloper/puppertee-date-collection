const puppeteer = require("puppeteer");
const { convertVariant } = require("./test.js");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "data",
  });

  const page = await browser.newPage();
  await page.goto("https://www.gsmarena.com/samsung_galaxy_s23+-12083.php", {
    timeout: 0,
  });

  const data = await page.evaluate(() => {
    const title = document.querySelector(".specs-phone-name-title").textContent;
    const brand = title.split(" ")[0];
    const regexPattern = new RegExp(`${brand}\\s`, "i");
    const model = title.replace(regexPattern, "");
    const model_id = title.split(" ").join("_").toLowerCase();
    const category = "";
    let variants;
    const image_url = "";
    const content = {};
    let status = "upcoming";
    let approved = false;

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
                return { ROM: parseInt(rom), RAM: parseInt(ram), price: 0 };
              });
            }

            tableContent[subHeadingContent.split(" ").join("_").toLowerCase()] =
              textContent;
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
      image_url,
      content,
    };
  });

  console.log(data);
  await browser.close();
})();
