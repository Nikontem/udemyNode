const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const {testDbConnString} = require('../util/env_params');
const User = require('../models/user');
const AuthController = require('../controllers/auth');
const feedController = require('../controllers/feed');
describe('Contoller Tests', function () {
    it("Throw Error if no User found", async function () {

        const req = {
            body: {
                email: 'asdasd',
                password: 'asdasd'
            }
        }
        sinon.stub(User, 'findOne');
        User.findOne.throws();
        const result = await AuthController.login(req, {}, () => {
        });
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);
        User.findOne.restore();
    });
});

describe("Database Connection", function () {
    let db;
    let user;
    before(async function (){
        db = await mongoose.connect(testDbConnString);
        user = new User({
            email: 'a@b.c',
            password: 'tester',
            name:'test'
        });
        await user.save();
    })
    it('Retrieve user status for existing user', async  function (){


        const req = {
            userId: user._id,
        }
        const res ={
            statusCode: 500,
            userStatus: null,
            status: function(code){
                this.statusCode = code;
                return this;
            },
            json: function (data){
                this.userStatus = data.status;
            }
        };
        await feedController.getStatus(req,res,()=>{});
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.eq('new');
    });

    after(async () => {
        await User.deleteMany();
        await db.disconnect();
    })

})