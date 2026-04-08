# 智慧照護 Dora｜4 月底上線最小可運作清單（MVP）

## 0. 前提（依最新確認）
- 平台端可人工調整訂單狀態，且狀態會同步供應商端資料來源。
- 平台端收到款項後，人工調整為待出貨。
- 供應商將透過 Email 收到出貨通知（理想為系統自動，未完成可人工寄送）。
- 綁定機構 OTP 已開發完成，不列為本次 MVP 缺口。

## 1. MVP 目標流程
1. 客戶端下訂單並回報匯款資訊。
2. 平台端人工核款後，將訂單狀態改為待出貨。
3. 平台端觸發供應商通知（Email）。
4. 供應商出貨並回報（供應商端未完成時先人工回報）。
5. 平台端更新狀態為已出貨、已送達、已完成。
6. 客戶端與機構端可看到最小狀態集合。

## 2. 必要功能（必做）
### 2.1 客戶端
- 可完成下單流程（填單、確認訂單）。
- 可完成匯款回報（末五碼至少可提交）。

### 2.2 平台端（MVP 核心控制點）
- 可人工核款。
- 可手動調整為待出貨。
- 可觸發供應商通知（Email）。
- 可依供應商回報更新為已出貨、已送達、已完成。
- 狀態異動需留存時間與備註（最低可追溯）。

### 2.3 供應商端
- 若供應商端尚未完成，至少要有替代回報管道（Email 或電話），讓平台可代更新狀態。

### 2.4 客戶端/機構端可視狀態
- 至少可見以下四種：待出貨、已出貨、已送達、已完成。

## 3. 可人工補位項目（4 月底可接受）
1. 核款：人工核對銀行入帳與末五碼。
2. 通知：若自動寄信未完成，改人工寄 Email。
3. 供應商回報：供應商以 Email 或電話提供物流商、單號、出貨日，由平台代更新。
4. 跨端同步：若未即時同步，先採批次刷新或人工更新。

## 4. 非 MVP 範圍（可延後）
- 自動金流對帳。
- 即時推播通知。
- 完整供應商自助後台（全流程自動化）。

## 5. 上線前驗收（必做）
1. 全流程走查一次：
   下單 → 匯款回報 → 平台核款改待出貨 → 通知供應商 → 回報出貨 → 已送達 → 已完成。
2. 每一步必須有承接者（系統或人工），不得有空白節點。
3. 每筆訂單至少可追溯：核款人、改狀態人、通知寄送人、時間。

## 6. 主要參考檔案
- c:/Users/C1-0045/Desktop/智慧照護git/smart_healthcare_dora/1.客戶端/checkout.html
- c:/Users/C1-0045/Desktop/智慧照護git/smart_healthcare_dora/1.客戶端/order-confirm.html
- c:/Users/C1-0045/Desktop/智慧照護git/smart_healthcare_dora/1.客戶端/payment-confirm.html
- c:/Users/C1-0045/Desktop/智慧照護git/smart_healthcare_dora/2.機構端/orders.html
- c:/Users/C1-0045/Desktop/智慧照護git/smart_healthcare_dora/3.平台端/orders.html
- c:/Users/C1-0045/Desktop/智慧照護git/smart_healthcare_dora/3.平台端/js/platform.js
- c:/Users/C1-0045/Desktop/智慧照護git/smart_healthcare_dora/4.供應商端/supplier-orders.html
- c:/Users/C1-0045/Desktop/智慧照護git/smart_healthcare_dora/4.供應商端/supplier-order.html
- c:/Users/C1-0045/Desktop/智慧照護git/smart_healthcare_dora/需求資料/系統規格文件.md

## 7. 決策摘要
- 納入：平台人工核款與人工改狀態。
- 納入：供應商端未完工期間的人工補位 SOP。
- 排除：即時推播、自動對帳、完整供應商後台。
