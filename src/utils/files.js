const path = require('path');
export const filterRegexp = new RegExp(/\w+(\d{10})_(\d{10})\w+/);

export function getFileDates(file) {
    const result = filterRegexp.exec(file);
    return [result[1], result[2]];
}

export function dateIncludesRange(d, from, to) {
    return from <= d && d <= to;
}

export function filterFilesByDate(files, dateFrom, dateTo) {
    return files.filter(file => {
        const dates = filterRegexp.exec(file);
        return dateIncludesRange(dates[1], dateFrom, dateTo) || dateIncludesRange(dates[2], dateFrom, dateTo);
    });
}

export function getFileName(file) {
    return path.basename(file);
}
