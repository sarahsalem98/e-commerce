//this is a reference for our db 
let db;

export var dbController = {

    openDataBase: function () {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('AdminDataBase');

            request.onupgradeneeded = function (event) {

                const db = event.target.result;

                if (!db.objectStoreNames.contains('users')) {

                   const usersStore=  db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                   usersStore.createIndex('email', 'email', { unique: false }); 

                }
                if (!db.objectStoreNames.contains('sellers')) {
                   const sellersStore= db.createObjectStore('sellers', { keyPath: 'id', autoIncrement: true });
                   sellersStore.createIndex('email', 'email', { unique: false }); 
                }
                if (!db.objectStoreNames.contains('products')) {
                    const productsStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });

                    productsStore.createIndex('seller_id', 'seller_id', { unique: false }); 

                    // here we made a seller id index for saller id for quick search

                }
                if (!db.objectStoreNames.contains('reviews')) {
                    const reviewsStore = db.createObjectStore('reviews', { keyPath: 'id', autoIncrement: true });
                    reviewsStore.createIndex('user_id', 'user_id', { unique: false }); 
                    reviewsStore.createIndex('product_id', 'product_id', { unique: false }); 

                }

                if (!db.objectStoreNames.contains('carts')) {

                    const cartstore = db.createObjectStore('carts', { keyPath: 'id', autoIncrement: true });
                    cartstore.createIndex('userId_isFinished', ['user_id', 'is_finished'], { unique: false });

                    // compound idex for query based on user_id and at the same time is not finished for [cart]
                }

                if (!db.objectStoreNames.contains('orders')) {

                    const orderStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
                    orderStore.createIndex('user_id', 'user_id', { unique: false }); 
                    orderStore.createIndex('cart_id', 'cart_id', { unique: false }); 
                    
                    //why we use cart id.

                }
                if (!db.objectStoreNames.contains('contactus')) {
                    const contact = db.createObjectStore('contactus', { keyPath: 'id', autoIncrement: true });
                    contact.createIndex('email', 'email', { unique: false }); 
                }
            };

            // this event is going to fire in case our database opend succussfully or event created for the first time 
            request.onsuccess = function (event) {

                //in case of sucusse we will init out globale ref 
                db = event.target.result;
                console.log("Database opened successfully");
                resolve(db);  // Database is now open and ready to use
            };

            request.onerror = function (event) {
                console.error('Error opening database:', event.target.errorCode);
                reject(event.target.errorCode);  // Reject if there's an error opening the database
            };
        });
    },


    // table name that you want to store in it 
    // you have to pass the data in shape of array of objects

    ////why you don't use promise !!!

    saveDataArray: function (table, data) {

        if (!db) {
            console.error('Database not initialized');
            return;
        }
        console.log(data);
        // for test purpose

        const transaction = db.transaction([table], 'readwrite');
        // Opens a transaction for the tabel object store.
        
        const objectStore = transaction.objectStore(table);
        // Gets a reference to the table object store within the transaction.

        data.forEach(item => {

            const request = objectStore.add(item);

            request.onsuccess = function () {
                console.log('Data added successfully');
            };
            request.onerror = function (event) {
                console.error('Error adding data:', event);
            };
        });

        transaction.oncomplete = function () {
            console.log('All data saved successfully');
        };

        transaction.onerror = function (event) {
            console.error('Error saving data:', event.target.errorCode);
        };
    },


    getItem: function (table, id) {
        let idParsed = parseInt(id);
        
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error('Database not initialized');
                return;
            }

            const transaction = db.transaction([table], 'readonly');
            const objectStore = transaction.objectStore(table);
            const request = objectStore.get(idParsed);

            request.onsuccess = function (event) {

                // console.log("hello i'm the res : "+ request.result); // may be it return null

                if (request.result) {

                    // console.log(' Data:', request.result);

                    resolve(request.result); //the data will be returned in case of resolving

                }
            };


            request.onerror = function (event) {
                console.error('Error retrieving :', event.target.errorCode);
                reject(event.target.errorCode);
            };
        });

    },

     

    // for fetching specific data tabel

    getDataArray: function (table) {

        return new Promise((resolve, reject) => {

            if (!db) {
                console.error('Database not initialized');
                return reject('Database not initialized');
            }

            const transaction = db.transaction([table], 'readonly');
            const objectStore = transaction.objectStore(table);
            const request = objectStore.getAll();

            request.onsuccess = function (event) {
                const data = event.target.result;
                console.log('Data from ' + table + ' table:', data);
                resolve(data);  // Resolve the promise with the data
            };

            request.onerror = function (event) {
                console.error('Error retrieving data from ' + table + ' table:', event.target.errorCode);
                reject(event.target.errorCode);  // Reject the promise with the error
            };

        });
    },


    
    updateItem: function (table, id, updatedData) {

        let idParsed = parseInt(id);

        return new Promise((resolve, reject) => {
            if (!db) {
                console.error('Database not initialized');
                resolve(false); // Return false when the database is not initialized
                return;
            }
    
            const transaction = db.transaction([table], 'readwrite');
            const objectStore = transaction.objectStore(table);
            const request = objectStore.get(idParsed);
    
            request.onsuccess = function (event) {

                const item = event.target.result;
    
                if (item) {

                    Object.assign(item, updatedData);
    
                    const putRequest = objectStore.put(item);

                    putRequest.onsuccess = function () {
                        console.log('User updated successfully');
                        resolve(true); // Return true on successful update
                    };
    
                    putRequest.onerror = function (event) {
                        console.error('Error updating user:', event.target.errorCode);
                        resolve(false); // Return false on update error
                    };

                } else {
                    console.log('User not found');
                    resolve(false); // Return false if the user is not found
                }
            };
    
            request.onerror = function (event) {
                console.error('Error retrieving user:', event.target.errorCode);
                resolve(false); // Return false on retrieval error
            };

        });
    },

    deleteItem: function (table, id) {

        return new Promise(function (resolve, reject) {
            let idParsed=parseInt(id);
            if (!db) {
                console.error('Database not initialized');
                resolve(false)
                return;
            }
            console.log("id inside delete " + id);

            const transaction = db.transaction([table], 'readwrite');
            const objectStore = transaction.objectStore(table);
            const request = objectStore.delete(idParsed);  

            request.onsuccess = function (event) {
                console.log('User deleted successfully');
                resolve(true);
            };

            request.onerror = function (event) {
                console.error('Error deleting user:', event.target.errorCode);
                resolve(false)
            };


            transaction.oncomplete = function () {
                console.log("Transaction completed.");
            };

            transaction.onerror = function (event) {
                console.error("Transaction error:", event.target.errorCode);
            };
        })

    },

    addItem: function (table, data) {
        return new Promise((resolve, reject) => {

            if (!db) {
                console.error('Database not initialized');
                reject(false);
                return;
            }
    
            const transaction = db.transaction([table], 'readwrite');
            const objectStore = transaction.objectStore(table);
    
            const request = objectStore.add(data);
    
            request.onsuccess = function (event) {
                console.log('Item added successfully:', event.target.result);
                resolve(event.target.result); // Return the ID of the added item
            };
    
            request.onerror = function (event) {
                console.error('Error adding item:', event.target.errorCode);
                resolve(false); // Return false on error
            };
        });
    },


    //unique like email in our state.
    //why items and it's a unique key
    getItemsByUniqueKey: function (table, key, value) {
        return new Promise((resolve, reject) => {

            if (!db) {
                console.error('Database not initialized');
                return reject('Database not initialized');
            }
    
            console.log("value value :" + value)
            const transaction = db.transaction([table], 'readonly');
            const objectStore = transaction.objectStore(table);
            const index = objectStore.index(key);
            const request = index.getAll(value); 

            request.onsuccess = function (event) {
                const data = event.target.result;
                console.log('Data from ' + table + ' table based on foreign key ' + key + ':', data);
                resolve(data);  
            };
    
            request.onerror = function (event) {
                console.error('Error retrieving data from ' + table + ' table based on foreign key:', event.target.errorCode);
                reject(event.target.errorCode);  
            };

        });
    },


    getItemsByIndex: function (tableName, indexName, indexValues) {

        return new Promise((resolve, reject) => {
            if (!db) {
                console.error('Database not initialized');
                return reject('Database not initialized');
            }
    
            const transaction = db.transaction([tableName], 'readonly');
            const objectStore = transaction.objectStore(tableName);
    
            if (!objectStore.indexNames.contains(indexName)) {
                // console.error(`Index '${indexName}' does not exist in table '${tableName}'`);
                return resolve([]); // Return an empty array if the index doesn't exist
            }
    
            // console.log('Querying index:', indexName, 'with values:', indexValues);
    
            const index = objectStore.index(indexName);
            const request = index.getAll(IDBKeyRange.only(indexValues));
    
            request.onsuccess = function (event) {
                // console.log('Query successful:', event.target.result);
                resolve(event.target.result);
            };
    
            request.onerror = function (event) {
                console.error('Error querying index:', event.target.error);
                reject(event.target.error);
            };
        });
    },

    getItemsByIndexspecialEd: function (tableName, indexName, conditionValue) {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error('Database not initialized');
                return reject('Database not initialized');
            }
    
            const transaction = db.transaction([tableName], 'readonly');
            const objectStore = transaction.objectStore(tableName);
    
            if (!objectStore.indexNames.contains(indexName)) {
                console.error(`Index '${indexName}' does not exist in table '${tableName}'`);
                return resolve([]); // Return an empty array if the index doesn't exist
            }
    
            console.log('Querying index:', indexName, 'with condition:', conditionValue);
    
            const index = objectStore.index(indexName);
            const results = [];
            const request = index.openCursor();
    
            request.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    const [key1, key2] = cursor.key; // Assuming a compound index [key1, key2]
                    if (key2 === conditionValue) { // Check only the second key
                        results.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    console.log('Query complete:', results);
                    resolve(results);
                }
            };
    
            request.onerror = function (event) {
                console.error('Error querying index:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    
    
    

}