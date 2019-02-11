# node-remove-photo-duplicate

## Motivations

When photo backups accumulate over the years we often 
ends up with a bunch of duplicates photos in sub directories
and it can take for ever to clean everything up.

## Features

Will work on Windows, Mac and Linux.

Remove all duplicated images keeping only one copy of every file.  
The copy of the file kept is always the one the higher in the 
file directory ( closer to root ).
Two images are deemed duplicate only if they have the same
name and are strictly identical.  

Not only images but also video .zip and .rar folder will be handled.

The script will also remove all the directory that no longer contain photos.
Or that only contain ``Thumbs.db`` files or ``.picasa.ini`` files.
( not necessary shown by the dry run log ).

## Warning

If you have created some album folder where you have voluntary
copied some photo from an other directory be aware that this 
script will mess things up for you. You wont loose any photos tho.

## Example: 

![image](https://user-images.githubusercontent.com/6702424/52573834-43eb4e80-2e1b-11e9-9548-1db4497682d5.png)

![image](https://user-images.githubusercontent.com/6702424/52573690-f2db5a80-2e1a-11e9-980e-28648b329090.png)

## Usage

### Setup

- First install node.js [node.js](https://nodejs.org/en/).
- Download and extract [the repo](https://github.com/garronej/node-remove-photo-duplicate/archive/master.zip)`
- Open a terminal then cd to the extracted repo.

### Run

As the script is not interactive it is wise to first run 
it in dry mode to figure out what would be deleted
during the real execution.

```bash
node ./main dry-run [path_to_image_directory]
```
**IMPORTANT:** Suspend all the sync softwares watching the target
directory before running ( dropbox, google drive, google photo, iCloud, OneDrive, resilio-sync ect...)

```bash
node ./main run [path_to_image_directory]
```
