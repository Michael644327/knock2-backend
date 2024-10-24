import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import morgan from "morgan";

// 路由模組
import themes from "./routes/themes.js";
import teams from "./routes/teams.js";
import products from "./routes/products.js";
import users from "./routes/users/index.js";
import orders from "./routes/orders.js";
import checkout from "./routes/checkout.js";
import payments from "./routes/payments.js";
import coupons from "./routes/coupons.js";
import reservations from "./routes/reservations.js";
import notifications from "./routes/notifications.js";

// 掛載 express
const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://knock2-frontend-3qms.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 使用套件紀錄 http 請求 **** added by iris
app.use(morgan("dev"));

// 自訂頂層的 middleware
app.use((req, res, next) => {
  // 解析jwt
  const auth = req.get("Authorization");
  if (auth && auth.indexOf("Bearer ") === 0) {
    const token = auth.slice(7);
    try {
      req.my_jwt = jwt.verify(token, process.env.JWT_KEY);
    } catch (ex) {
      console.error('JWT verification failed:', ex.message);
    }
  }
  next();
});

// *********設定靜態內容資料夾*********
app.use(express.static("public"));

// 路由模組
app.use("/themes", themes);
app.use("/teams", teams);
app.use("/products", products);
app.use("/users", users);
app.use("/orders", orders);
app.use("/checkout", checkout);
app.use("/payments", payments);
app.use("/coupons", coupons);
app.use("/reservations", reservations);
app.use("/notifications", notifications);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

});

