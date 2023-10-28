function getFromGa4() {
  // 取得したデータを書き込むシート
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("結果を出力するシート名を書いて下さい");

  try {
    // 指標、複数指定可能
    const metric1 = AnalyticsData.newMetric();
    metric1.name = "eventCount";

    // ディメンション、複数指定可能
    const dimension1 = AnalyticsData.newDimension();
    dimension1.name = "pagePath";

    const dimension2 = AnalyticsData.newDimension();
    dimension2.name = "eventName";
    
    const dimension3 = AnalyticsData.newDimension();
    dimension3.name = "customEvent:select_key";

    const dimension4 = AnalyticsData.newDimension();
    dimension4.name = "customEvent:select_value";

    // データの日付範囲
    const dateRange = AnalyticsData.newDateRange();

    // 日本時間での日付取得
    const timezone = "JST";
    const today = new Date();
    today.setDate(today.getDate() - 2); // 2日前の日付をセット
    const endDate = Utilities.formatDate(today, timezone, "yyyy-MM-dd");

    dateRange.startDate = "2023-10-12";
    dateRange.endDate = endDate;

    // 上で作った設定値をリクエストパラメータに設定
    const request = AnalyticsData.newRunReportRequest();
    request.dimensions = [dimension1, dimension2, dimension3, dimension4];
    request.metrics = [metric1];
    request.dateRanges = [dateRange];
    // その他の設定（フィルタやソートなど）もここでrequestに設定してください。
    // 今回はフィルターとソートを使用していないので、下記2行でコメントアウトしてあります。
    // request.dimensionFilter = filter;
    // request.orderBys = order;

    // API 実行（ここから下は書き替え不要）
    const report = AnalyticsData.Properties.runReport(request,
        'properties/' + GA4_PROPERTY_ID);
    if (!report.rows) {
      Logger.log('No rows returned.');
      return;
    }

    // 共通メソッドでスプレッドシートに書き込み
    writeReport(sheet, report);
  } catch (e) {
    // TODO (Developer) - Handle exception
    Logger.log(`Failed with error: ${e}`);
  }
}
