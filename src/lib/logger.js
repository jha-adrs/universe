const winston = require('winston');
const environment = process.env.NODE_ENV || 'dev';
const { isPlainObject } = require('is-plain-object');
const isEmpty = require('is-empty');
const { createLogger, format, transports } = winston
const { combine, timestamp,printf } = format
const rTracer = require('cls-rtracer');
const { default: config } = require('@/config/config');
require('winston-mongodb')

const newFormat = printf((info) => {
    let message = deepRegexReplace(info.message) 
    let final_message = []
    for (var i = 0; i < message.length; i++) {
        const item = typeof message[i] == 'object'? JSON.stringify(message[i]):message[i]
        final_message.push(item)
    }
    final_message = final_message.join(' | ')
    return  `${info.timestamp} [${info.level}]: ${final_message}`
})

const deepRegexReplace = (value,single_key = '') => {

    try{
        const parsed_value = JSON.parse(value)
        if(typeof parsed_value == 'object'){
            value = parsed_value
        }
    }catch(e){}

    if (typeof value === 'undefined') return value || '';

    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i = i + 1) {
            value[i] = deepRegexReplace(value[i])
        }
        return value
    }else if(isPlainObject(value)){
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                value[key] = deepRegexReplace(value[key],key)
            }
        }
        return value
    }else{
          return value
    }

}

const winstonLogger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: combine(
            timestamp(),
            format.colorize(),
            newFormat
    )
        }),

    ],
    
})
if(process.env.NODE_ENV == 'production'){
    winstonLogger.add(
        new transports.MongoDB({
            level: 'info',
            db: process.env.MONGO_DB_CONNECTION_STRING,
            options:{
                useUnifiedTopology: true
            
            },
            collection: 'universe_logs',
            format: format.json()
        })
    )
}


const wrapper = ( original ) => {
    return (...args) => {
        var _transformedArgs = []
        args.forEach((arg) => {
            if( typeof arg == "object" ){
                if( arg instanceof Error){
                    _transformedArgs.push(arg.stack)
                }else{ 
                    _transformedArgs.push(JSON.stringify(arg))
                }
            }else{
                _transformedArgs.push(arg)
            }
        })
        return original(_transformedArgs)
    }
}

winstonLogger.error = wrapper(winstonLogger.error)
winstonLogger.warn = wrapper(winstonLogger.warn)
winstonLogger.info = wrapper(winstonLogger.info)
winstonLogger.verbose = wrapper(winstonLogger.verbose)
winstonLogger.debug = wrapper(winstonLogger.debug)
winstonLogger.silly = wrapper(winstonLogger.silly)

var Unilogger = {
    log: function(level, message, ...args) {
        winstonLogger.log(level, message, ...args)
    },
    error: function(message, ...args) {
        winstonLogger.error(message, ...args)
    },
    warn: function(message, ...args) {
        winstonLogger.warn(message, ...args)
    },
    info: function(message, ...args) {
        winstonLogger.info(message, ...args)
    },
    debug: function(message, ...args) {
        winstonLogger.debug(message, ...args)
    },
    verbose: function(message, ...args) {
        winstonLogger.verbose(message, ...args)
    },
    deepRegexReplace: (data) => {
        try{
            if(typeof data == 'object'){
                data = JSON.parse(JSON.stringify(data))
            }
            return deepRegexReplace(data)
        }catch(e){
            console.error('inside method deepRegexReplace exception',e)
            return data
        }
    }
}

exports.logger = Unilogger