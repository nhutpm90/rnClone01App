import { StorageUtils } from '../utils/Utils';

import API from '../utils/API';
import Request from '../utils/Request';

const AccountService = {

    login(username, password) {
        const self = this;
        const request = new Request();
        request.fromUrl("/oauth/token");
        API.accessToken(request, "0938674470", "123456").then(res => {
            // {
            //     "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyX2lkIl0sInVzZXJfbmFtZSI6IjA5Mzg2NzQ0NzAiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiZXhwIjoxNTYxOTY0ODQ2LCJhdXRob3JpdGllcyI6WyJST0xFX0xPR19NQU5BR0VSIiwiUk9MRV9IVUJfU1RBRkYiLCJST0xFX0RSSVZFUiIsIlJPTEVfVVNFUiJdLCJqdGkiOiI4ZGNkNzVkZS02ZGE2LTQ5YzEtOWJmMi0zZTViNDVmMWI0MDUiLCJjbGllbnRfaWQiOiJ0cnVzdGVkLWFwcCJ9.XAEBEdGnoy_iiWqfTkjTuHSgF6-pg2bW0-d8_fKDFG48SnRYqM6zLjyv7DEOO06r7fJZl8yrxJpTwr6WTswN8F00OzdvcYUnnWfXDJfwfzfd1XaynH4LBTq_ZQvTdXX3taYlYMl4M66rGvmqdGNdu88NQHPH3_9-XnHdXssn8akzvzSKdRrk8NI793D-kF0iM70LTG1VYBxsfbQ0GF3NxBWMCv_nKVUsS93EfXAZD8ZjDvJgDeI0wwJ_otiIg0Ytac7h89lBw-FtPjn6Xp91nkw0ucI-x13V3Ri8pSXBnLK_KhDGw-g1CvorD2TIP9o37m7w8Ud-fm_VLz7_wjGI8w",
            //     "token_type": "bearer",
            //     "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyX2lkIl0sInVzZXJfbmFtZSI6IjA5Mzg2NzQ0NzAiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiYXRpIjoiOGRjZDc1ZGUtNmRhNi00OWMxLTliZjItM2U1YjQ1ZjFiNDA1IiwiZXhwIjoxNTY0NTU1MDQ2LCJhdXRob3JpdGllcyI6WyJST0xFX0xPR19NQU5BR0VSIiwiUk9MRV9IVUJfU1RBRkYiLCJST0xFX0RSSVZFUiIsIlJPTEVfVVNFUiJdLCJqdGkiOiI4YzA1ZWFlMS1hMjllLTRhOGYtOWIwNy0zYWIyNWI5NTA3YTkiLCJjbGllbnRfaWQiOiJ0cnVzdGVkLWFwcCJ9.ZHmIclaDFnLbcVATwZcMGQQrE8-KcvAKSqg3k_GAMMbABuDV3_y2XLKV6MhdCkDC_g7ecudxtNrHjF7Gu25rAZ1TNY8PXQBTANsi1kIn3DddZQF8_xQlYADHX4DuPtrp7t16JavahG3ed-i888ZriL4DVlc_tJkRAoHAfCNdrgSClHQ0OUFr8hx4WYbHaQkPco0FwWf3-bsLCXz8WdIJv6WjQ7hXd2UkoHvZYp4BZVj0LhGrQHOJ6KQOLmsgi0N7YMfzXpEW5k08wz9Ovb9uKsATWg2OOIjfaQXXJVntxD5-29q8rkcMGQRndHnEaxiIVnl2ch-CC9hnP4oe0pcIXQ",
            //     "expires_in": 1799,
            //     "scope": "read write",
            //     "jti": "8dcd75de-6da6-49c1-9bf2-3e5b45f1b405"
            //   }
            console.log(`login result:: ${JSON.stringify(res.data)}`);
            self.writeUser(res.data);
        });
    },

    accessToken(cb) {
        console.log("read accessToken");
        this.readUser(function(user) {
            console.log(`readUser ${JSON.stringify(user)}`);
            cb(user['access_token']);
        });
    },

    writeUser(user, callback) {
        console.log("write accessToken");
        StorageUtils.writeObj("user", user).then(() => {
            callback();
        });
    },

    readUser(callback) {
        console.log("readUser authentication");
        StorageUtils.read("user").then((value) => {
            callback(JSON.parse(value));
        });
    },

};

export default AccountService;
