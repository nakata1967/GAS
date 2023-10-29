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

    // 除外ページを設定
    const dimensionFilter1 = AnalyticsData.newFilterExpression();
    const notExpression = AnalyticsData.newFilterExpression();
    const notPagePathFilter = AnalyticsData.newFilter();
    notPagePathFilter.fieldName = "pagePath";
    const notPagePathStringFilter = AnalyticsData.newStringFilter();
    notPagePathStringFilter.matchType = "FULL_REGEXP";
    notPagePathStringFilter.value = "^(\\/shop/aaa|\\/shop/bbb).*";
    notPagePathFilter.stringFilter = notPagePathStringFilter;
    notExpression.filter = notPagePathFilter;
    dimensionFilter1.notExpression = notExpression;

    // 端末種類でフィルタ
    const dimensionFilter2 = AnalyticsData.newFilterExpression();
    const deviceFilter = AnalyticsData.newFilter();
    deviceFilter.fieldName = "deviceCategory";
    const deviceStringFilter = AnalyticsData.newStringFilter();
    deviceStringFilter.matchType = "EXACT";
    deviceStringFilter.value = "Mobile";
    deviceFilter.stringFilter = deviceStringFilter;
    dimensionFilter2.filter = deviceFilter;

    // 複数フィルタを And で指定
    const dimensionFilters = AnalyticsData.newFilterExpressionList();
    dimensionFilters.expressions = [dimensionFilter1, dimensionFilter2];
    const dimensionFilter = AnalyticsData.newFilterExpression();
    dimensionFilter.andGroup = dimensionFilters;
    
    // リクエストの設定
    const request = {
        dimensions: dimensions,
        metrics: metrics,
        dateRanges: dateRanges,
        dimensionFilter: dimensionFilter  // フィルターをリクエストに追加
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
