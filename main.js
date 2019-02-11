
const path= require("path");
const remove_duplicate= require("./lib");

let dry_run = (()=>{

    switch(process.argv[2]){
        case "run": return false;
        case "dry-run": return true;
        default: return undefined;
    }

})();

if( dry_run === undefined ){

    console.log(`usage node ${path.basename(process.argv[1])} run [dirname]`);

}


let root_dir_path= process.argv[3];

root_dir_path = path.isAbsolute(root_dir_path) ?
    root_dir_path :
    path.join(process.cwd(), root_dir_path);


remove_duplicate(root_dir_path, dry_run);

