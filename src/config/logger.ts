/** Required External Modules */
import bunyan from "bunyan";
import * as dotenv from "dotenv";

dotenv.config();

const LOG_LEVEL: any = process.env.LOG_LEVEL

const applogger = bunyan.createLogger({
  name: "otaas-auth",
  hostname: process.env.hostname,
  streams: [
    {
      level: "warn",
      type: 'rotating-file',
      path: '../logs/auth-server.log',
      period: '1d',   // daily rotation
      count: 10        // keep 3 back copies
    },
    {
      level: LOG_LEVEL,
      stream: process.stdout,
    },
  ],
});

export default applogger;
