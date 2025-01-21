const fs = require("fs-extra");
const path = require("path");

const submoduleDir = path.resolve(__dirname, "../submodule");
const destinationDir = path.resolve(__dirname, ".env"); // 복사할 위치

console.log("Submodule directory:", submoduleDir);

// .env 파일 복사
fs.copy(path.join(submoduleDir, ".env"), path.join(destinationDir, ".env"))
  .then(() => {
    console.log("Files were copied successfully!");
  })
  .catch((err) => {
    console.error("Error copying files:", err);
  });
