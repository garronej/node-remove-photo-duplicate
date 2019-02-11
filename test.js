
const path= require("path");
const remove_duplicates= require("./lib");
const child_process= require("child_process");

remove_duplicates(
    path.join(__dirname, "test-sample"),
    true
);

child_process.execSync(`rm -rf ./test-sample-after`);
child_process.execSync(`cp -r ./test-sample ./test-sample-after`);

console.log("\n\n\n\nReal run");

remove_duplicates(
    path.join(__dirname, "test-sample-after"),
    false
);

console.log("Don't forget to remove test-sample-after once done with the examination");
