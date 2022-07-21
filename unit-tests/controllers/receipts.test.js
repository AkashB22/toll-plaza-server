const receiptsController = new (require('./../../controllers/receipts.controller'))();
const receiptsDao = require('./../../daos/receipts.dao');
const sinon = require('sinon');
const assert = require('chai').assert;

describe('Get All Receipts API', () => {
    let jsonSpy;
    let status;
    let res;
    let statusSpy;
    beforeEach(function () {
        jsonSpy = sinon.spy();
        status = () => { return { json: jsonSpy } };
        res = {
            status
        };
        statusSpy = sinon.spy(res, 'status');
    });

    afterEach(function () {
        sinon.restore();
    });


    it('Testing get all receipts api', async () => {
        const data = {
            receipts: [{ 'vehicleId': 'test' }]
        };
        sinon.stub(receiptsDao.prototype, 'get').resolves(data);
        await receiptsController.get({ 'params': { 'receiptId': '3131314' }, 'query': {} }, res);
        assert.equal(statusSpy.calledOnce, true);
        assert.equal(statusSpy.getCall(0).args[0], 200);
        assert.equal(jsonSpy.getCall(0).args[0].receipts[0].vehicleId, data.receipts[0].vehicleId);
    });

    it('Testing get all receipts api with no data', async () => {
        const data = [];
        sinon.stub(receiptsDao.prototype, 'get').resolves(data);
        await receiptsController.get({ 'params': { 'receiptId': '3131314' }, 'query': {} }, res);
        assert.equal(statusSpy.calledOnce, true);
        assert.equal(statusSpy.getCall(0).args[0], 200);
        assert.property(jsonSpy.getCall(0).args[0], 'message');
    });
})

describe('Post Receipts API', () => {
    let jsonSpy;
    let status;
    let res;
    let statusSpy;
    beforeEach(function () {
        jsonSpy = sinon.spy();
        status = () => { return { json: jsonSpy } };
        res = {
            status
        };
        statusSpy = sinon.spy(res, 'status');
    });

    afterEach(function () {
        sinon.restore();
    });


    it('Testing add receipts api', async () => {
        const data = {
            'vehicleNo': 'test',
            'amount': 100
        };
        sinon.stub(receiptsDao.prototype, 'insert').resolves({ 'toJSON': () => data });
        await receiptsController.add({ 'body': data }, res);
        assert.equal(statusSpy.calledOnce, true);
        assert.equal(statusSpy.getCall(0).args[0], 200);
        console.log(jsonSpy.getCall(0).args[0].vehicleNo);
        assert.equal(jsonSpy.getCall(0).args[0].vehicleNo, data.vehicleNo);
    });

    it('Testing add receipt api with wrong request body', async () => {
        const data = {};
        await receiptsController.add({ 'body': data }, res);
        assert.equal(statusSpy.calledOnce, true);
        assert.equal(statusSpy.getCall(0).args[0], 400);
        assert.property(jsonSpy.getCall(0).args[0][0], 'message');
    });
})

describe('Validate Receipts API', () => {
    let jsonSpy;
    let status;
    let res;
    let statusSpy;
    beforeEach(function () {
        jsonSpy = sinon.spy();
        status = () => { return { json: jsonSpy } };
        res = {
            status
        };
        statusSpy = sinon.spy(res, 'status');
    });

    afterEach(function () {
        sinon.restore();
    });


    it('Testing validate receipts api with success scenario', async () => {
        const data = {
            'receiptId': 'test'
        };
        sinon.stub(receiptsDao.prototype, 'get').resolves({
            type: 'two way',
            status: 'has return',
            createdAt: new Date()
        });
        sinon.stub(receiptsDao.prototype, 'update').resolves({ 'toJSON': () => data });
        await receiptsController.validate({ 'params': data }, res);
        assert.equal(statusSpy.calledOnce, true);
        assert.equal(statusSpy.getCall(0).args[0], 200);
        console.log(jsonSpy.getCall(0).args[0].message);
        assert.equal(jsonSpy.getCall(0).args[0].message, 'receipt validated successfully for return');
    });

    it('Testing validate receipts api with one way error scenario', async () => {
        const data = {
            'receiptId': 'test'
        };
        sinon.stub(receiptsDao.prototype, 'get').resolves({
            type: 'one way',
            status: 'has return',
            createdAt: new Date()
        });
        await receiptsController.validate({ 'params': data }, res);
        assert.equal(statusSpy.calledOnce, true);
        assert.equal(statusSpy.getCall(0).args[0], 400);
        console.log(jsonSpy.getCall(0).args[0].message);
        assert.equal(jsonSpy.getCall(0).args[0].message, 'one way receipt data found');
    });

    it('Testing validate receipts api with used two way error scenario', async () => {
        const data = {
            'receiptId': 'test'
        };
        sinon.stub(receiptsDao.prototype, 'get').resolves({
            type: 'two way',
            status: 'used return',
            createdAt: new Date()
        });
        await receiptsController.validate({ 'params': data }, res);
        assert.equal(statusSpy.calledOnce, true);
        assert.equal(statusSpy.getCall(0).args[0], 400);
        console.log(jsonSpy.getCall(0).args[0].message);
        assert.equal(jsonSpy.getCall(0).args[0].message, 'two way receipt has been already used');
    });

    it('Testing validate receipts api with expired two way error scenario', async () => {
        const data = {
            'receiptId': 'test'
        };
        const date = new Date();
        date.setDate(date.getDate - 1);
        sinon.stub(receiptsDao.prototype, 'get').resolves({
            type: 'two way',
            status: 'has return',
            createdAt: date
        });
        await receiptsController.validate({ 'params': data }, res);
        assert.equal(statusSpy.calledOnce, true);
        assert.equal(statusSpy.getCall(0).args[0], 400);
        console.log(jsonSpy.getCall(0).args[0].message);
        assert.equal(jsonSpy.getCall(0).args[0].message, 'two way receipt time has been expired');
    });

    it('Testing validate receipts api with validation error scenario', async () => {
        const data = {};
        await receiptsController.validate({ 'params': data }, res);
        assert.equal(statusSpy.calledOnce, true);
        assert.equal(statusSpy.getCall(0).args[0], 400);
        console.log(jsonSpy.getCall(0).args[0][0].message);
    });
})