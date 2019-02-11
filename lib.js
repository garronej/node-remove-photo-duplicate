
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const artifacts_file_names = ["Thumbs.db", ".picasa.ini"];
const media_extensions = new Set([
    ...require("./video_extensions"),
    ...require("./image_extensions")
]);

function remove_duplicate(root_dir_path, dry_run) {

    if (dry_run === undefined) {
        dry_run = true;
    }

    if (dry_run) {

        console.log("Dry run, nothing will actually be deleted.");

    }

    const build_map_rec = (dir_path, map, count) => {

        const computeDigest = buffer => crypto
            .createHash("md5")
            .update(buffer)
            .digest("hex")
            ;

        for (const file_name of fs.readdirSync(dir_path)) {

            count.value++;

            if (count.value % 300 === 0) {

                console.log(`${count.value} files analysed so far`);

            }

            const file_path = path.join(dir_path, file_name);

            if (fs.lstatSync(file_path).isDirectory()) {

                build_map_rec(file_path, map, count);

            } else {

                if (
                    !media_extensions.has(path.extname(file_name).substr(1).toLowerCase())
                    &&
                    artifacts_file_names.indexOf(file_name) < 0
                ) {

                    console.log(`${path.relative(root_dir_path, file_path)} is not a image nor a video, skipping`);

                    continue;

                }

                const buffer = fs.readFileSync(file_path);

                const digest = `${computeDigest(buffer)}-${file_name}`;

                if (!map.has(digest)) {
                    map.set(digest, []);
                }

                map.get(digest).push(file_path);

            }

        }

    }

    /** return true if deleted */
    const remove_dir_if_empty_rec = dir_path => {

        const file_names = fs.readdirSync(dir_path)


        const sub_dir_paths = file_names
            .map(file_name => path.join(dir_path, file_name))
            .filter(file_path => fs.lstatSync(file_path).isDirectory());

        if (
            file_names.filter(file_name => artifacts_file_names.indexOf(file_name) < 0).length
            !==
            sub_dir_paths.length
        ) {
            return false;
        }

        let do_delete = true;

        for (const sub_dir_path of sub_dir_paths) {

            do_delete = do_delete && remove_dir_if_empty_rec(sub_dir_path);

        }

        if (do_delete) {

            console.log(`${path.relative(root_dir_path, dir_path)} is now empty, deleting it.`);

            if (!dry_run) {

                for (
                    const artifacts_file_name
                    of
                    artifacts_file_names.filter(artifacts_file_name => file_names.indexOf(artifacts_file_name) >= 0)
                ) {

                    fs.unlinkSync(path.join(dir_path, artifacts_file_name));

                }

                fs.rmdirSync(dir_path);

            }

        }

        return do_delete;

    };

    /** Map file digest => path[] */
    const map = new Map();

    build_map_rec(root_dir_path, map, { "value": 0 });

    for (const [digest, arr] of map) {

        if (arr.length === 1) {

            map.delete(digest);


        }

    }

    console.log(`\n\nThere is ${map.size} files duplicated in ${root_dir_path}`);

    for (let arr of map.values()) {

        arr = arr.sort((a, b) => {

            const order= b.length - a.length

            return order !== 0 ?
                order:
                (a < b ? 1 : -1);

        });

        const kept_file_path = arr.pop();

        console.log(`\n\n${path.relative(root_dir_path, kept_file_path)} is duplicated ${arr.length} times`);

        for (const file_path of arr) {

            const dir_path = path.dirname(file_path);

            console.log(`Removing duplicate found in ${path.relative(root_dir_path, dir_path)}`);

            if (!dry_run) {

                fs.unlinkSync(file_path);

            }

            remove_dir_if_empty_rec(dir_path);

        }

    }

}

module.exports = remove_duplicate;

