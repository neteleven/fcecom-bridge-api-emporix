const generateAppMock = () => {
    return {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        head: jest.fn()
    };
};

const generateResponseMock = () => {
    const resMock = {
        end: jest.fn()
    };
    resMock.status = jest.fn().mockReturnValue(resMock);
    resMock.set = jest.fn().mockReturnValue(resMock);
    resMock.json = jest.fn().mockReturnValue(resMock);
    resMock.send = jest.fn().mockReturnValue(resMock);
    resMock.sendStatus = jest.fn().mockReturnValue(resMock);
    resMock.writeHead = jest.fn().mockReturnValue(resMock);
    return resMock;
};

const generateRequestMock = () => {
    return {
        params: {},
        query: {},
        body: '',
        method: 'GET'
    };
};

module.exports = {
    generateAppMock,
    generateResponseMock,
    generateRequestMock
};

