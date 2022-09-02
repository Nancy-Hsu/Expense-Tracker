# Expense-Tracker
來一起統計一下私房錢吧！
<br />

## 功能
- 註冊帳號或使用FB或Gmail登入
- 瀏覽所有花費
- 篩選費用的種類，知道錢都花在那裡了!
- 對費用進行修改、刪除

## 安裝流程
1. 請先確認有安裝 node.js 與 npm

2. 將專案 clone 到本地

3. 在本地開啟之後，透過終端機進入資料夾，輸入： `npm install`

4. 安裝完畢後，設定環境變數連線 MongoDB
`RES_MONGODB_URI=mongodb+srv://<Your MongoDB Account>:<Your MongoDB Password>@cluster0.xxxx.xxxx.net/<Your MongoDB Table><?retryWrites=true&w=majority`

5. 繼續輸入： `npm run dev` 及 `npm run seed` 載入資料

5. 若看見此行訊息則代表順利運行， `express is listening on localhost:3000`

6. 接下來就可以打開瀏覽器進入以下網址 [http://localhost:3000](http://localhost:3000) 開始使用囉！

7. 若欲暫停使用，按下 `ctrl + c` 即可

## 開發工具
- Node.js 
- Express 
- Express-Handlebars 
- Bootstrap
- Font-awesome 
- Mongoose 
- MongoDB
- bcryptjs 
- connect-flash
- dotenv 
- mongoose 
- passport 
- method-override 
<br />
<br />
