const baseUrl = 'http://localhost:3030';

let user = {
    email: '',
    password: 'Abc54321'
};

let token = '';
let userId = '';

let lastCreatedPostcardId = '';
let pet = {
    _ownerId: "",
    name: "",
    breed: "",
    age: "2 years",
    weight: "2 kg",
    image: "/images/cat-create.jpg",
    _createdOn: 0,
    _id: ""
}

QUnit.config.reorder = false;

function getRandom() {
    return Math.floor(Math.random() * 100000);
}

QUnit.module("User Functionality", () => {
    QUnit.test("User Register testing", async (assert) => {
        //arrange
        let path = '/users/register';
        let email = `abv${getRandom()}@mailinator.bg`;
        user.email = email;

        //act
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        });

        let json = await response.json();
        if(enableLogging) console.log(json);

        assert.ok(response.ok);

        assert.ok(json.hasOwnProperty('email'), 'Email property exists');
        assert.equal(json['email'], user.email, 'email has correct value');
        assert.strictEqual(typeof json.email, 'string', "email has correct type");

        assert.ok(json.hasOwnProperty('password'), 'password property exists');
        assert.equal(json['password'], user.password, 'password has correct value');
        assert.strictEqual(typeof json.password, 'string', "password has correct type");

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn property exists');
        assert.strictEqual(typeof json._createdOn, 'number', "_createdOn has correct type");

        assert.ok(json.hasOwnProperty('_id'), '_id property exists');
        assert.strictEqual(typeof json._id, 'string', "_id has correct type");

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken property exists');
        assert.strictEqual(typeof json.accessToken, 'string', "accessToken has correct type");

        token = json['accessToken'];
        assert.true(token.length > 0);
        userId = json['_id'];
        assert.true(userId.length > 0);
        if(enableLogging) console.log(token)
    })

    QUnit.test('User Login testing', async (assert) =>{
        //arrange
        let path = "/users/login";

        //act
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });
        let json = await response.json();

        console.log("login response")
        if(enableLogging) console.log(json);

        //assert
        assert.ok(json.hasOwnProperty('email'), 'Email property exists');
        assert.equal(json['email'], user.email, 'email has correct value');
        assert.strictEqual(typeof json.email, 'string', "email has correct type");

        assert.ok(json.hasOwnProperty('password'), 'password property exists');
        assert.equal(json['password'], user.password, 'password has correct value');
        assert.strictEqual(typeof json.password, 'string', "password has correct type");

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn property exists');
        assert.strictEqual(typeof json._createdOn, 'number', "_createdOn has correct type");

        assert.ok(json.hasOwnProperty('_id'), '_id property exists');
        assert.strictEqual(typeof json._id, 'string', "_id has correct type");

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken property exists');
        assert.strictEqual(typeof json.accessToken, 'string', "accessToken has correct type");

        token = json['accessToken'];
        assert.true(token.length > 0);
        userId = json['_id'];
        assert.true(userId.length > 0);
        //sessionStorage.setItem('book-user', JSON.stringify(user));
    })
})

let enableLogging = true;


QUnit.module("Pet functionality", () => {
    QUnit.test("Get All Postcards testing", async (assert) => {
        let path = '/data/pets';
        let queryParams = "?sortBy=_createdOn%20desc&distinct=name";

        let response = await fetch(baseUrl + path + queryParams);
        let json = await response.json();

        //assert
        if(enableLogging) console.log(json);
        assert.ok(response.ok, 'The response is successful');
        assert.ok(Array.isArray(json), "The response is an array");

        json.forEach(jsonData => {
            assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId exists");
            assert.strictEqual(typeof jsonData._ownerId, 'string', "_ownerId is from correct type");

            assert.ok(jsonData.hasOwnProperty('name'), "name exists");
            assert.strictEqual(typeof jsonData.name, 'string', "name is from correct type");

            assert.ok(jsonData.hasOwnProperty('breed'), "breed exists");
            assert.strictEqual(typeof jsonData.breed, 'string', "breed is from correct type");

            assert.ok(jsonData.hasOwnProperty('age'), "age exists");
            assert.strictEqual(typeof jsonData.age, 'string', "age is from correct type");

            assert.ok(jsonData.hasOwnProperty('weight'), "weight exists");
            assert.strictEqual(typeof jsonData.weight, 'string', "weight is from correct type");

            assert.ok(jsonData.hasOwnProperty('image'), "image exists");
            assert.strictEqual(typeof jsonData.image, 'string', "image is from correct type");

            assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn exists");
            assert.strictEqual(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

            assert.ok(jsonData.hasOwnProperty('_id'), "_id exists");
            assert.strictEqual(typeof jsonData._id, 'string', "_id is from correct type");

        });
    })

    QUnit.test("Create Postcard testing", async(assert) => {
        //arrange
        let path = "/data/pets";
        let random = getRandom();
        pet.name = `Random name ${random}`;
        pet.breed = `Random breed ${random}`;

        //act
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type' : 'application/json',
                'X-Authorization' : token
            },
            body: JSON.stringify(pet)
        });
        let json = await response.json();

        //assert
        assert.ok(response.ok, "Response is successfull");
        
        assert.ok(json.hasOwnProperty('_ownerId'), "_ownerId exists");
        assert.strictEqual(json._ownerId, userId, "ownerId has correct value");
        assert.strictEqual(typeof json._ownerId, 'string', "_ownerId is from correct type");


        assert.ok(json.hasOwnProperty('name'), "name exists");        
        assert.strictEqual(json.name, pet.name, "name has correct value");
        assert.strictEqual(typeof json.name, 'string', "name is from correct type");

        assert.ok(json.hasOwnProperty('breed'), "breed exists");
        assert.strictEqual(json.breed, pet.breed, "breed has correct value");
        assert.strictEqual(typeof json.breed, 'string', "breed is from correct type");

        assert.ok(json.hasOwnProperty('age'), "age exists");
        assert.strictEqual(json.age, pet.age, "age has correct value");
        assert.strictEqual(typeof json.age, 'string', "age is from correct type");

        assert.ok(json.hasOwnProperty('weight'), "weight exists");
        assert.strictEqual(json.weight, pet.weight, "weight has correct value");
        assert.strictEqual(typeof json.weight, 'string', "weight is from correct type");

        assert.ok(json.hasOwnProperty('image'), "image exists");
        assert.strictEqual(json.image, pet.image, "image has correct value");
        assert.strictEqual(typeof json.image, 'string', "image is from correct type");

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exists");
        assert.strictEqual(typeof json._createdOn, 'number', "_createdOn is from correct type");

        assert.ok(json.hasOwnProperty('_id'), "_id exists");
        assert.strictEqual(typeof json._id, 'string', "_id is from correct type");

        lastCreatedPostcardId = json._id;
    })

    QUnit.test("Edit Postcard testing", async (assert) => {
        //arrange
        let path = "/data/pets/" + lastCreatedPostcardId;
        let random = getRandom();
        pet.name = `Random edited name ${random}`;
        pet.breed = `Random edited breed ${random}`;

        //act
        let response = await fetch(baseUrl + path, {
            method: "PUT",
            headers: {
                'content-type' : 'application/json',
                'X-Authorization' : token
            },
            body: JSON.stringify(pet)
        });
        let json = await response.json();

        //assert
        assert.ok(response.ok, "Response is successfull");

        assert.ok(json.hasOwnProperty('_ownerId'), "_ownerId exists");
        assert.strictEqual(json._ownerId, userId, "ownerId has correct value");
        assert.strictEqual(typeof json._ownerId, 'string', "_ownerId is from correct type");

        assert.ok(json.hasOwnProperty('name'), "name exists");        
        assert.strictEqual(json.name, pet.name, "name has correct value");
        assert.strictEqual(typeof json.name, 'string', "name is from correct type");

        assert.ok(json.hasOwnProperty('breed'), "breed exists");
        assert.strictEqual(json.breed, pet.breed, "breed has correct value");
        assert.strictEqual(typeof json.breed, 'string', "breed is from correct type");

        assert.ok(json.hasOwnProperty('age'), "age exists");
        assert.strictEqual(json.age, pet.age, "age has correct value");
        assert.strictEqual(typeof json.age, 'string', "age is from correct type");

        assert.ok(json.hasOwnProperty('weight'), "weight exists");
        assert.strictEqual(json.weight, pet.weight, "weight has correct value");
        assert.strictEqual(typeof json.weight, 'string', "weight is from correct type");

        assert.ok(json.hasOwnProperty('image'), "image exists");
        assert.strictEqual(json.image, pet.image, "image has correct value");
        assert.strictEqual(typeof json.image, 'string', "image is from correct type");

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exists");
        assert.strictEqual(typeof json._createdOn, 'number', "_createdOn is from correct type");

        assert.ok(json.hasOwnProperty('_id'), "_id exists");
        assert.strictEqual(typeof json._id, 'string', "_id is from correct type");

    })

    QUnit.test("Delete Postcard testing", async (assert) => {
        let path = "/data/pets/" + lastCreatedPostcardId;

        //act
        let response = await fetch(baseUrl + path, {
            method: "DELETE",
            headers: {
                'X-Authorization': token
            }
        })

        //assert
        assert.ok(response.ok, 'Response is successfull')

        let json = await response.json();
        assert.ok(json.hasOwnProperty('_deletedOn'), "_deletedOn exists");
        assert.strictEqual(typeof json._deletedOn, 'number', "_deletedOn is from correct type");

        
        let response2 = await fetch(baseUrl + path, {
            method: "DELETE",
            headers: {
                'X-Authorization': token
            }
        })

        assert.equal(response2.status, 404);
    })
})