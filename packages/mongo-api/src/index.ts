
import { start } from "./mongoose";

// TODO: Use ENV to load instead
start("mongodb://0.0.0.0:27017", {
    dbName: "site_db",
    user: "site",
    pass: "pass",
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
