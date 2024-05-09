require('dotenv').config();
const Database = require('dbcmps369');

class ContactDB {
    constructor() {
        this.db = new Database();
    }

    async initialize() {
        await this.db.connect();

        await this.db.schema('Contacts', [
            {name: 'id', type: 'INTEGER'},
            {name: 'firstname', type: 'TEXT'},
            {name: 'lastname', type: 'TEXT'},
            {name: 'title', type: 'TEXT'},
            {name: 'address', type: 'TEXT'},
            {name: 'phone', type: 'TEXT'},
            {name: 'email', type: 'TEXT'},
            {name: 'contact_by_mail', type: 'INTEGER'},
            {name: 'contact_by_phone', type: 'INTEGER'},
            {name: 'contact_by_email', type: 'INTEGER'},
            {name: 'lat', type: 'REAL'}, 
            {name: 'lng', type: 'REAL'}
        ], 'id');

        await this.db.schema('Users', [
            { name: 'id', type: 'INTEGER' },
            { name: 'firstname', type: 'TEXT' },
            { name: 'lastname', type: 'TEXT' },
            { name: 'username', type: 'TEXT' },
            { name: 'password', type: 'TEXT' }
        ], 'id');
    }

    async createContact(first, last, title, address, phone, email, canMail, canCall, canEmail, lat, lng) {
        const id = await this.db.create('Contacts', [
            {column: 'firstname', value: first },
            {column: 'lastname', value: last },
            {column: 'title', value: title },
            {column: 'address', value: address },
            {column: 'phone', value: phone },
            {column: 'email', value: email },
            {column: 'contact_by_mail', value: canMail }, 
            {column: 'contact_by_phone', value: canCall },
            {column: 'contact_by_email', value: canEmail },
            {column: 'lat', value: lat},
            {column: 'lng', value: lng}
        ])
    }

    async createUser(first, last, user, password) {
        const id = await this.db.create('Users', [
            { column: 'firstname', value: first },
            { column: 'lastname', value: last },
            { column: 'username', value: user },
            { column: 'password', value: password },
        ])
        return id;
    }

    async deleteContact(id) {
        await this.db.delete('Contacts', [{ column: 'id', value: id}]);
    }

    async findContactByID(id) {
        const info = await this.db.read('Contacts', [{ column: 'id', value: id}]);
        return info[0];
    }

    async findUserByUsername(username) {
        const user = await this.db.read('Users', [{ column: 'username', value: username}]);
        return user.length > 0 ? user[0] : undefined;
    }

    async findUserByID(id) {
        const info = await this.db.read('Users', [{ column: 'id', value: id}]);
        return info[0];
    }

    async getAllContacts() {
        const cs = await this.db.read('Contacts', []);
        return cs;
    }

    async updateContact(id, first, last, title, address, phone, email, canMail, canCall, canEmail, lat, lng) {
        await this.db.update('Contacts', [
            { column: 'firstname', value: first },
            { column: 'lastname', value: last },
            { column: 'title', value: title },
            { column: 'address', value: address },
            { column: 'phone', value: phone },
            { column: 'email', value: email },
            { column: 'contact_by_mail', value: canMail },
            { column: 'contact_by_phone', value: canCall },
            { column: 'contact_by_email', value: canEmail },
            { column: 'lat', value: lat },
            { column: 'lng', value: lng }
        ], [{ column: 'id', value: id }]);
    }
}

module.exports = ContactDB;