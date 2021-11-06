export const environment = {
    identity: {
        port: 3001,
        db: {
            host: 'localhost',
            user: 'admin',
            password: 'admin',
            port: 27017,
            dbname: 'identity'
        }
    },
    task: {
        port: 3002,
        db: {
            host: 'localhost',
            user: 'admin',
            password: 'admin',
            port: 27017,
            dbname: 'task'
        }
    },
    broker: {
        url: 'localhost:9092',
        groupId: 'task-exchange-system'
    }
};
