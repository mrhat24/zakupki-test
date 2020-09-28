import {dateIncludesRange, filterFilesByDate, getFileDates, getFileName} from "../../src/utils/files";

describe('test file parse by date', function () {
   it('test date range check', function () {
      const from = '2015120100';
      const to = '2016010100';
      const result = dateIncludesRange('2015123100', from, to);
      expect(result).toEqual(true);
   });
   it('test get file dates', function () {
      const file = 'addinfo_Sverdlovskaja_obl_2015120100_2016010100_001';

      const result = getFileDates(file);
      expect(result[0]).toEqual('2015120100');
      expect(result[1]).toEqual('2016010100');
   });
   it('test filter files by dates', function () {
      const files = [
         'addinfo_Sverdlovskaja_obl_2015120100_2016010100_001',
         'addinfo_Sverdlovskaja_obl_2016010100_2016020100_001',
         'addinfo_Sverdlovskaja_obl_2016020100_2016030100_001',
         'addinfo_Sverdlovskaja_obl_2016020100_2016030100_001',
         'addinfo_Sverdlovskaja_obl_2015020100_2015030100_001',
      ];
      const from = '2015123000';
      const to = '2016013100';
      const result = filterFilesByDate(files, from, to);
      expect(result.includes(files[0])).toEqual(true);
      expect(result.includes(files[1])).toEqual(true);
      expect(result.includes(files[2])).toEqual(false);
      expect(result.includes(files[3])).toEqual(false);
      expect(result.includes(files[4])).toEqual(false);
   });
   it('test get file name', function () {
      const file = '/fcs_regions/Sverdlovskaja_obl/addinfo/prevMonth/addinfo_Sverdlovskaja_obl_2020083100_2020090100_001.xml.zip';
      const result = getFileName(file);
      expect(result).toEqual('addinfo_Sverdlovskaja_obl_2020083100_2020090100_001.xml.zip');
   })
});
