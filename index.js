import {filterFilesByDate, getFileName} from "./src/utils/files";

const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
const ftp = require('basic-ftp');

async function extractZipFile(filepath, outdir, lookingstr) {
    fs.createReadStream(filepath)
        .pipe(unzipper.Parse())
        .on('entry', function (entry) {
            const fileName = entry.path;
            // const type = entry.type; // 'Directory' or 'File'
            // const size = entry.vars.uncompressedSize; // There is also compressedSize;
            if (fileName.includes(lookingstr)) {
                if (!fs.existsSync(outdir)) {
                    fs.mkdirSync(outdir);
                }
                console.log('found', filepath, fileName);
                entry.pipe(fs.createWriteStream(path.join(outdir, fileName)));
            } else {
                entry.autodrain();
            }
        })
}

async function findPrevMonth(client) {
    const files = [];
    const list = await client.list();
    const basePath = await client.pwd();
    for (const item of list) {
        if (item.isDirectory) {
            try {
                await client.cd(path.join(basePath, item.name));
                const innerFiles = await findPrevMonth(client);
                files.push(...innerFiles);
            } catch (e) {
                console.log(e);
            }
        } else {
            const fileName = path.join(basePath, item.name);
            files.push(fileName);
        }
    }
    return files;
}
const download = false;

async function main() {
    if (download) {
        const client = new ftp.Client()
        client.ftp.verbose = true
        await client.access({
            host: 'ftp.zakupki.gov.ru',
            user: "free",
            password: "free",
            secure: false,
        });
        await client.cd('/fcs_regions/Sverdlovskaja_obl')
        const files = await findPrevMonth(client);
        const dateFrom = '2020080100';
        const dateTo = '2020100100';
        const filteredFiles = filterFilesByDate(files, dateFrom, dateTo);
        for (const file of filteredFiles) {
            const downloadableFile = path.join(__dirname, 'out', 'archieves', getFileName(file));
            if (!fs.existsSync(downloadableFile)) {
                await client.downloadTo(downloadableFile, file);
            }
        }
        client.close();
    }

    const readableDir = path.resolve(__dirname, 'out', 'archieves');
    const downloaded = fs.readdirSync(readableDir);
    for (const file of downloaded) {
        if (path.extname(file).includes('zip')) {
            const out = path.join(__dirname, 'out', 'result', path.basename(file, path.extname(file)));
            await extractZipFile(path.join(readableDir, file), out, '0362100003120000015');
        }
    }
}

main();
