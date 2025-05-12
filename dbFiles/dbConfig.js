const config = {
    user: '',
    password: '',
    server: 'localhost',
    database: 'Test',
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS'
    },
    port: 4133
}

module.exports = config;