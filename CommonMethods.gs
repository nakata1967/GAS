// GA4のプロパティIDの設定
const GA4_PROPERTY_ID = "プロパティIDを入れてください";

/**
 * 指定されたシートにGAの結果を書き込む関数
 * @param {Object} sheet - 書き込む対象のシート
 * @param {Object} report - GAから取得したレポートデータ
 */
function writeReportToSheet(sheet, report) {
    // 既存のデータをクリアする
    if (sheet.getLastRow() > 0) {
        sheet.clear();
    }

    // ヘッダーを追加する
    const dimensionHeaders = report.dimensionHeaders.map(header => header.name);
    const metricHeaders = report.metricHeaders.map(header => header.name);
    const headers = [...dimensionHeaders, ...metricHeaders];
    sheet.appendRow(headers);

    // データをフィルタリングして、シートに書き込む
    const rows = report.rows
        .filter(row => !row.dimensionValues.some(value => value.value === "(not set)"))
        .map(row => {
            const dimensionValues = row.dimensionValues.map(value => value.value);
            const metricValues = row.metricValues.map(value => value.value);
            return [...dimensionValues, ...metricValues];
        });

    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

    Logger.log(`レポートが以下のシートに書き込まれました: ${sheet.getSheetName()}`);
}