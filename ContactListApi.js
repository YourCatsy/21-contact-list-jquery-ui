class ContactListApi {
    static URL = 'https://62054479161670001741b708.mockapi.io/api/contacts';

    static request(config) {
        const conf = {
          uri: '',
          method: 'GET',
          data: null,
          error: 'API request error.',
          ...config,
        };
        
        return fetch(`${this.URL}/${conf.uri}`, {
          method: conf.method,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
          body: conf.data ? JSON.stringify(conf.data) : undefined,
        })
          .then((res) => {
            if (res.ok) { 
              return res.json();
            }
    
            throw new Error(conf.error);
          });
      }
      
      static getList() {
        return this.request({ error: 'Can not fetch contacts list.' });
      }
    
      static getOne(id) {
        return this.request({ uri: id, error: `Can not fetch contact with id '${id}'.` });
      }
    
      static create(contact) {
        return this.request({ method: 'POST', data: contact, error: `Can not create contact.` });
      }
    
      static update(id, contact) {
        return this.request({ uri: id, method: 'PUT', data: contact, error: `Can not update contact.` });
      }
    
      static delete(id) {
        return this.request({ uri: id, method: 'DELETE', error: `Can not delete contact.` });
      }
    }

export default ContactListApi;