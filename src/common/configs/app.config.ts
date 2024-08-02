export const appConfig = () => ({
  port: parseInt(process.env.APP_PORT) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_DATABASE || 'mysql',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
  },
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpireInSecond: parseInt(process.env.JWT_EXPIRE_IN_SECOND) || 60 * 60,
  frontendUrl: process.env.FRONTEND_URL || '',
})
