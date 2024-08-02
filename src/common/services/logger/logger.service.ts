import { Injectable } from '@nestjs/common';
import { format, createLogger, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {

    // loggers usados
    private loggerInfo: Logger;
    private loggerError: Logger;
    private loggerWarn: Logger;
    private loggerAll: Logger;

    constructor(){
        this.createLoggers();
        this.replaceConsole();
    }

    /**
     * Creating loggers
     */
    createLoggers(){

        // Text format
        const textFormat = format.printf((log) => {
            return `${log.timestamp} - [${log.level.toUpperCase().charAt(0)}] ${log.message}`;
        })

        // Date Format
        const dateFormat = format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        })

        // Logger de info
        this.loggerInfo = createLogger({
            level: 'info',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: 'log/info/info-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '7d'
                })
            ]
        });

        // Error logger
        this.loggerError = createLogger({
            level: 'error',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: 'log/error/error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '7d'
                })
            ]
        });

        // Warn logger
        this.loggerWarn = createLogger({
            level: 'warn',
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: 'log/warn/warn-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '7d'
                })
            ]
        });

        // Logger where we store everything, besides the consoleLogger donde almacenamos todo, ademas de la consola
        this.loggerAll = createLogger({
            format: format.combine(
                dateFormat,
                textFormat
            ),
            transports: [
                new transports.DailyRotateFile({
                    filename: 'log/all/all-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '7d'
                }),
                new transports.Console()
            ]
        });

    }

    /**
     * Replaces the functionality of console.log, console.error and console.warn
     */
    replaceConsole(){

        // console.log
        console.log = (message: any, params: any) => {
            if(params){
                this.loggerInfo.info(message + " " + JSON.stringify(params));
                this.loggerAll.info(message + " " + JSON.stringify(params));
            }else{
                this.loggerInfo.info(message);
                this.loggerAll.info(message);
            }
        }
        
        // console.error
        console.error = (message: any, params: any) => {
            if(params){
                this.loggerError.error(message + " " + JSON.stringify(params));
                this.loggerAll.error(message + " " + JSON.stringify(params));
            }else{
                this.loggerError.error(message);
                this.loggerAll.error(message);
            }
        }
        
        // console.warn
        console.warn = (message: any, params: any) => {
            if(params){
                this.loggerWarn.warn(message + " " + JSON.stringify(params));
                this.loggerAll.warn(message + " " + JSON.stringify(params));
            }else{
                this.loggerWarn.warn(message);
                this.loggerAll.warn(message);
            }
        }
    }

    //Necessary methods for the correct logger functioning 

    log(message: string){
        this.loggerInfo.info(message);
        this.loggerAll.info(message);
    }
    
    error(message: string){
        this.loggerError.error(message);
        this.loggerAll.error(message);
    }
    
    warn(message: string){
        this.loggerWarn.warn(message);
        this.loggerAll.warn(message);
    }
    
    debug(message: string){ 
        this.loggerAll.debug(message);
    }
    
    verbose(message: string){
        this.loggerAll.verbose(message);
     }
    
}