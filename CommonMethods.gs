const GA4_PROPERTY_ID = "プロパティIDを入れてください";

// 指定されたシートにGAの結果を書き込む
function writeReport(sheet, report) {
  try {
    if (sheet.getLastRow() > 1 || sheet.getLastColumn() > 1) {
      sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).clear();
    }
    
    // Append the headers.
       
    const dimensionHeaders = report.dimensionHeaders.map(
      (dimensionHeader) => {
        return dimensionHeader.name;
      });
    const metricHeaders = report.metricHeaders.map(
        (metricHeader) => {
          return metricHeader.name;
        });
    const headers = [...dimensionHeaders, ...metricHeaders];

    sheet.appendRow(headers);

  // Append the results.
  const rows = report.rows
    .filter((row) => {
      return !row.dimensionValues.some((dimensionValue) => dimensionValue.value === "(not set)");
    })
    .map((row) => {
      const dimensionValues = row.dimensionValues.map((dimensionValue) => {
        return dimensionValue.value;
      });
      const metricValues = row.metricValues.map((metricValues) => {
        return metricValues.value;
      });
      return [...dimensionValues, ...metricValues];
    });

  sheet.getRange(2, 1, rows.length, headers.length)
        .setValues(rows);

    Logger.log(`Report spreadsheet created: ${sheet.getSheetName()}`);
  } catch (e) {
    // TODO (Developer) - Handle exception
    Logger.log(`Failed to write report with error: ${e}`);
  }  
}