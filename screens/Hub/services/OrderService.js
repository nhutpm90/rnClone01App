import API from '../utils/API';
import Request from './../utils/Request';

const OrderService = {

    orderDetail(id) {
        return new Request().fromUrl(`/orders/${id}`).doGet();
    }

};

export default OrderService;