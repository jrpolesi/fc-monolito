import express, { Express } from "express";
import { checkoutRoute } from "./routes/checkout.routes";
import { clientRoute } from "./routes/client.routes";
import { invoiceRoute } from "./routes/invoice.routes";
import { productRoute } from "./routes/product.routes";

export const app: Express = express();

app.use(express.json());

app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);
