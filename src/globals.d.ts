declare namespace NodeJS {
    interface Process {
      env: ProcessEnv
    }
    interface ProcessEnv {
        PWD: string
        REQUEST_SERVER_DOMAIN: string
        REDIS_PORT: number
        REDIS_HOST: string
    }
}