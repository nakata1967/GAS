/**
 * GA4からデータを取得し、特定のシートに書き込む関数
 */
function fetchAndStoreGA4Data() {
    // 書き込む対象のシートを取得
    const targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("結果を出力するシート名を書いて下さい");

    // 指標とディメンションの設定
    const metrics = [
        { name: "eventCount" }
    ];
    const dimensions = [
        { name: "pagePath" },
        { name: "eventName" },
        { name: "customEvent:select_key" },
        { name: "customEvent:select_value" }
    ];

    // 日付範囲の設定
    const timezone = "JST";
    const today = new Date();
    today.setDate(today.getDate() - 2); // 2日前の日付をセット
    const formattedEndDate = Utilities.formatDate(today, timezone, "yyyy-MM-dd");
    const dateRanges = [
        { startDate: "2023-10-12", endDate: formattedEndDate }
    ];

    // リクエストの設定
    const request = {
        dimensions: dimensions,
        metrics: metrics,
        dateRanges: dateRanges
        // 必要に応じて、他の設定（フィルタやソートなど）を追加
    };

    try {
        // APIの実行
        const report = AnalyticsData.Properties.runReport(request, 'properties/' + GA4_PROPERTY_ID);
        if (!report.rows) {
            Logger.log('データが取得できませんでした。');
            return;
        }

        // 共通メソッドを使用してシートにデータを書き込む
        writeReportToSheet(targetSheet, report);
    } catch (error) {
        Logger.log(`エラーが発生しました: ${error}`);
    }
}
