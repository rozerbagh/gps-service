import dev_config from "./configs/dev.config.json";
import prod_config from "./configs/prod.config.json";
let config = dev_config;
switch (process.env.NODE_ENV) {
  case "dev":
    config = dev_config;
    break;
  case "prod":
    config = prod_config;
    break;
  default:
    config = dev_config;
    break;
}

export default config;
