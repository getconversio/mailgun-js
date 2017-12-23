const auth = require('./data/auth.json')
const fixture = require('./data/fixture.json')
const assert = require('assert')

const mailgun = require('../lib/mailgun')({
  'apiKey': auth.api_key,
  'domain': auth.domain
})

describe('Domains', () => {
  beforeEach((done) => {
    setTimeout(done, 500)
  })

  it('test domains().create() invalid missing address', (done) => {
    mailgun.domains().create({}, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'name'/.test(err.message))
      done()
    })
  })

  it('test domains().create() invalid missing smtp password', (done) => {
    mailgun.domains().create({
      'name': fixture.new_domain.name
    }, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'smtp_password'/.test(err.message))
      done()
    })
  })

  it.skip('test domains().create() ', () => {
    // mailgun.domains().create(fixture.new_domain, function (err, body) {
    //   assert.ifError(err);
    //   assert.ok(body.message);
    //   assert(/Domain has been created/.test(body.message));
    //   assert.ok(body.domain);
    //   assert.equal(fixture.new_domain.name, body.domain.name);
    //   assert.equal(fixture.new_domain.smtp_password, body.domain.smtp_password);
    //   done();
    // });
  })

  it('test domains().list()', (done) => {
    mailgun.domains().list((err, body) => {
      assert.ifError(err)
      assert.ok(body.total_count)
      assert.ok(body.items)
      done()
    })
  })

  it('test domains().info()', (done) => {
    mailgun.domains(fixture.existing_domain.name).info((err, body) => {
      assert.ifError(err)
      assert.ok(body.domain)
      assert.equal(fixture.existing_domain.name, body.domain.name)
      done()
    })
  })

  it('test domains().credentials().list()', (done) => {
    mailgun.domains(fixture.existing_domain.name).credentials().list((err, body) => {
      assert.ifError(err)
      assert.ok(body.total_count)
      assert.ok(body.items)
      done()
    })
  })

  it('test domains().credentials().create() missing login', (done) => {
    mailgun.domains(fixture.existing_domain.name).credentials().create({}, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'login'/.test(err.message))
      done()
    })
  })

  it('test domains().credentials().create() missing password', (done) => {
    mailgun.domains(fixture.existing_domain.name).credentials().create({
      'login': fixture.credentials.login
    }, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'password'/.test(err.message))
      done()
    })
  })

  it('test domains().credentials().create() invalid login type', (done) => {
    mailgun.domains(fixture.existing_domain.name).credentials().create({
      'login': 123,
      'password': 'password'
    }, (err) => {
      assert.ok(err)
      assert(/Invalid parameter type./.test(err.message))
      done()
    })
  })

  it('test domains().credentials().create() invalid password type', (done) => {
    mailgun.domains(fixture.existing_domain.name).credentials().create({
      'login': fixture.credentials.login,
      'password': 123
    }, (err) => {
      assert.ok(err)
      assert(/Invalid parameter type./.test(err.message))
      done()
    })
  })

  it('test domains().credentials().create()', (done) => {
    mailgun.domains(fixture.existing_domain.name).credentials().create({
      'login': fixture.credentials.login,
      'password': fixture.credentials.password
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      done()
    })
  })

  it('test domains().credentials().update() missing password', (done) => {
    mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).update({}, (err) => {
      assert.ok(err)
      assert(/Missing parameter 'password'/.test(err.message))
      done()
    })
  })

  it('test domains().credentials().update() invalid password type', (done) => {
    mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).update({
      'password': 123
    }, (err) => {
      assert.ok(err)
      assert(/Invalid parameter type./.test(err.message))
      done()
    })
  })

  it('test domains().credentials().update()', (done) => {
    mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).update({
      'password': fixture.credentials.password
    }, (err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      done()
    })
  })

  it('test domains().credentials().delete()', (done) => {
    mailgun.domains(fixture.existing_domain.name).credentials(fixture.credentials.login).delete((err, body) => {
      assert.ifError(err)
      assert.ok(body.message)
      done()
    })
  })

  it.skip('test domains().delete()', () => {
    // var domain = fixture.new_domain.name;
    // mailgun.domains(domain).delete(function (err, body) {
    //   assert.ifError(err);
    //   assert.ok(body.message);
    //   assert(/Domain has been deleted/.test(body.message));
    //   done();
    // });
  })

  it('test domains().verify() that it is a function', () => {
    // we can't actally just call this endpoint
    const fn = mailgun.domains(fixture.existing_domain.name).verify

    assert.ok(typeof fn === 'function')
  })

  it('server error should have status code', (done) => {
    mailgun.domains('domaintest@test123.com').info((err) => {
      assert.ok(err)
      assert.ok(err.statusCode)
      assert.equal(404, err.statusCode)
      done()
    })
  })
})
