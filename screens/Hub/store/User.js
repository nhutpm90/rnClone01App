import { StorageUtils } from '../utils/Utils';
import _ from 'lodash';

export default class User {
    constructor(userInfo, credentials) {
        console.log(`init user:: userInfo:: ${JSON.stringify(userInfo)} - credentials:: ${JSON.stringify(credentials)}`);
        this.userInfo = userInfo;
        // {
        //     "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyX2lkIl0sInVzZXJfbmFtZSI6IjA5Mzg2NzQ0NzAiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiZXhwIjoxNTYxOTY0ODQ2LCJhdXRob3JpdGllcyI6WyJST0xFX0xPR19NQU5BR0VSIiwiUk9MRV9IVUJfU1RBRkYiLCJST0xFX0RSSVZFUiIsIlJPTEVfVVNFUiJdLCJqdGkiOiI4ZGNkNzVkZS02ZGE2LTQ5YzEtOWJmMi0zZTViNDVmMWI0MDUiLCJjbGllbnRfaWQiOiJ0cnVzdGVkLWFwcCJ9.XAEBEdGnoy_iiWqfTkjTuHSgF6-pg2bW0-d8_fKDFG48SnRYqM6zLjyv7DEOO06r7fJZl8yrxJpTwr6WTswN8F00OzdvcYUnnWfXDJfwfzfd1XaynH4LBTq_ZQvTdXX3taYlYMl4M66rGvmqdGNdu88NQHPH3_9-XnHdXssn8akzvzSKdRrk8NI793D-kF0iM70LTG1VYBxsfbQ0GF3NxBWMCv_nKVUsS93EfXAZD8ZjDvJgDeI0wwJ_otiIg0Ytac7h89lBw-FtPjn6Xp91nkw0ucI-x13V3Ri8pSXBnLK_KhDGw-g1CvorD2TIP9o37m7w8Ud-fm_VLz7_wjGI8w",
        //     "token_type": "bearer",
        //     "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyX2lkIl0sInVzZXJfbmFtZSI6IjA5Mzg2NzQ0NzAiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiYXRpIjoiOGRjZDc1ZGUtNmRhNi00OWMxLTliZjItM2U1YjQ1ZjFiNDA1IiwiZXhwIjoxNTY0NTU1MDQ2LCJhdXRob3JpdGllcyI6WyJST0xFX0xPR19NQU5BR0VSIiwiUk9MRV9IVUJfU1RBRkYiLCJST0xFX0RSSVZFUiIsIlJPTEVfVVNFUiJdLCJqdGkiOiI4YzA1ZWFlMS1hMjllLTRhOGYtOWIwNy0zYWIyNWI5NTA3YTkiLCJjbGllbnRfaWQiOiJ0cnVzdGVkLWFwcCJ9.ZHmIclaDFnLbcVATwZcMGQQrE8-KcvAKSqg3k_GAMMbABuDV3_y2XLKV6MhdCkDC_g7ecudxtNrHjF7Gu25rAZ1TNY8PXQBTANsi1kIn3DddZQF8_xQlYADHX4DuPtrp7t16JavahG3ed-i888ZriL4DVlc_tJkRAoHAfCNdrgSClHQ0OUFr8hx4WYbHaQkPco0FwWf3-bsLCXz8WdIJv6WjQ7hXd2UkoHvZYp4BZVj0LhGrQHOJ6KQOLmsgi0N7YMfzXpEW5k08wz9Ovb9uKsATWg2OOIjfaQXXJVntxD5-29q8rkcMGQRndHnEaxiIVnl2ch-CC9hnP4oe0pcIXQ",
        //     "expires_in": 1799,
        //     "scope": "read write",
        //     "jti": "8dcd75de-6da6-49c1-9bf2-3e5b45f1b405"
        // }
        this.credentials = credentials;

        // StorageUtils.writeObj("user", user).then(() => {

        // });
    }

    getUserInfo() {
        return this.userInfo;
    }
    getCredentials() {
        return this.credentials;
    }

    getUserData(key) {
        return _.get(this.getUserInfo(), key);
    }
    getUsername() {
        return this.getUserData('userName');
    }
    getHubInfo() {
        return this.getUserData('hub');
    }
    getHubCode() {
        return this.getUserData('hub.code');
    }
    getRoles() {
        return this.getUserData('roles');
    }
}


// {
//     "success": true,
//     "data": {
//       "created": 1536219225000,
//       "userName": "0909795262",
//       "hubberCode": "ILG1904002",
//       "fullName": "0909795262",
//       "phoneNumber": "0909795262",
//       "email": "van.nguyen@ilogic.vn",
//       "imgProfile": "./asset/IMAGE/ios_avatar_0909795262_1542872226.jpg",
//       "active": true,
//       "accountNonLocked": true,
//       "roles": [
//         "ROLE_SORTING_STAFF",
//         "ROLE_HUB_STAFF"
//       ],
//       "firstLogin": false,
//       "hub": {
//         "id": 4,
//         "hubType": "HUB_MANUAL",
//         "code": "HQ3-01",
//         "name": "iLogic SP-Võ Văn Tần",
//         "image": "",
//         "phone": "",
//         "location": {
//           "id": 97,
//           "lat": 10.777473,
//           "lng": 106.691238,
//           "address": "63A Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh",
//           "placeName": "iLogic SP-Võ Văn Tần",
//           "street": "Võ Văn Tần",
//           "level1": "Hồ Chí Minh",
//           "level2": "Quận 3"
//         },
//         "startWorkingHour": null,
//         "endWorkingHour": null,
//         "description": null,
//         "live": true,
//         "distance": null,
//         "locationType": null,
//         "capacity": {
//           "B_LARGE": 1,
//           "B_MEDIUM": 0,
//           "B_SMALL": 0
//         },
//         "usedCapacity": {
//           "B_LARGE": 1,
//           "B_MEDIUM": 0,
//           "B_SMALL": 0
//         },
//         "availableCapacity": {
//           "B_LARGE": 0,
//           "B_MEDIUM": 0,
//           "B_SMALL": 0
//         },
//         "boxes": [
//           {
//             "id": 19,
//             "code": "C01",
//             "boxSize": "B_LARGE",
//             "orderCodes": [
//               {
//                 "orderCode": "ILG002954",
//                 "parcelDimension": "LARGE_SIZED",
//                 "boxGoodStatus": "SOMETHING",
//                 "orderStatus": null,
//                 "token": null
//               },
//               {
//                 "orderCode": "ILG003050",
//                 "parcelDimension": "MEDIUM_SIZED",
//                 "boxGoodStatus": "SOMETHING",
//                 "orderStatus": null,
//                 "token": null
//               },
//               {
//                 "orderCode": "ILG004194",
//                 "parcelDimension": "LARGE_SIZED",
//                 "boxGoodStatus": "SOMETHING",
//                 "orderStatus": null,
//                 "token": null
//               }
//             ],
//             "boxGoodsStatus": "SOMETHING",
//             "boxOpenStatus": "CLOSE",
//             "driverBooard": "B-VO VAN TAN",
//             "updated": 1561961977000
//           }
//         ],
//         "active": true,
//         "homelessCount": 0,
//         "zones": null,
//         "placeName": null,
//         "mapUrl": null,
//         "shortenMapUrl": null
//       }
//     }
//   }