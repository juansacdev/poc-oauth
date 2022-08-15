import winston from 'winston'

export const Logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
})
