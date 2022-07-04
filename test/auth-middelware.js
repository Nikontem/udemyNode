const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddelware = require('../middleware/is-auth');

describe('Auth Middleware Tests', function () {

    it('Throw An Error if authorization is not preset', function () {
        const req = {
            get: function () {
                return null;
            }
        }
        expect(authMiddelware.bind(this, req, {}, () => {
        })).to.throw('Not authenticated.');
    });

    it('Throw An Error for invalid tokens', function () {
        const req = {
            get: function () {
                return 'xyv';
            }
        }
        expect(authMiddelware.bind(this, req, {}, () => {
        })).to.throw();
    });

    it('Append UserId to Authenticated Requests', function () {
        const req = {
            get: function (headerName) {
                return "Bearer x";
            }
        };
        sinon.stub(jwt,'verify')
        jwt.verify.returns({userId: 'asb'});

        authMiddelware(req, {}, () => {});
        expect(req).to.have.property('userId');
        jwt.verify.restore();
    });
});

