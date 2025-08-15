const https = require("https");
const fs = require("fs");
const path = require("path");

const fonts = [
  {
    name: "Inter-Regular.woff2",
    url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
  },
  {
    name: "Inter-Medium.woff2",
    url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2",
  },
  {
    name: "Inter-SemiBold.woff2",
    url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2",
  },
  {
    name: "Inter-Bold.woff2",
    url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2",
  },
];

const downloadFont = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(
      path.join(__dirname, "../public/fonts", filename)
    );
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`Downloaded ${filename}`);
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filename);
        reject(err);
      });
  });
};

const downloadAllFonts = async () => {
  try {
    for (const font of fonts) {
      await downloadFont(font.url, font.name);
    }
    console.log("All fonts downloaded successfully!");
  } catch (error) {
    console.error("Error downloading fonts:", error);
  }
};

downloadAllFonts();
