// Order Statuses 
const FO_SUBMITTED = "FO_SUBMITTED";
const FO_CANCELLED = "FO_CANCELLED";
const FO_AT_HUB = "FO_AT_HUB";
const FO_DISPATCHED = "FO_DISPATCHED";
const FO_DISPATCHED_FAIL = "FO_DISPATCHED_FAIL";
const FO_REJECTED_BY_SYSTEM = "FO_REJECTED_BY_SYSTEM";
const FO_REJECTED_BY_SHIPPER = "FO_REJECTED_BY_SHIPPER";	
const FO_ACCEPTED = "FO_ACCEPTED";
const FO_WITH_RIDER = "FO_WITH_RIDER";
const FO_IN_DELIVERY = "FO_IN_DELIVERY";
const FO_AT_HUB_FOR_COLLECTION = "FO_AT_HUB_FOR_COLLECTION";
const FO_DELIVERED = "FO_DELIVERED";
const FO_DELIVERY_FAIL = "FO_DELIVERY_FAIL";
const FO_AT_HUB_FOR_RETURN = "FO_AT_HUB_FOR_RETURN";
const FO_LOST = "FO_LOST";
const FO_LOST_CONFIRMED = "FO_LOST_CONFIRMED";
const FO_FOUND = "FO_FOUND";
const FO_RETURNED_TO_SENDER = "FO_RETURNED_TO_SENDER";
const FO_COLLECTED_BY_ILOGIC = "FO_COLLECTED_BY_ILOGIC";
const FO_RETURNED_TO_ILOGIC = "FO_RETURNED_TO_ILOGIC";
const FO_DELIVERED_BY_ILOGIC = "FO_DELIVERED_BY_ILOGIC";
const FO_DISPOSED = "FO_DISPOSED";	

const SO_DRAFT = "SO_DRAFT";
const SO_SUBMITTED = "SO_SUBMITTED";
const SO_CANCELLED = "SO_CANCELLED";
const SO_PICKUP_DISPATCHED = "SO_PICKUP_DISPATCHED";
const SO_PICKUP_DISPATCHED_FAIL = "SO_PICKUP_DISPATCHED_FAIL";
const SO_REJECTED_BY_SHIPPER = "SO_REJECTED_BY_SHIPPER";
const SO_REJECTED_BY_SYSTEM = "SO_REJECTED_BY_SYSTEM";
const SO_DISPATCHED = "SO_DISPATCHED";
const SO_DISPATCHED_FAIL = "SO_DISPATCHED_FAIL";	
const SO_PICKUP_ACCEPTED = "SO_PICKUP_ACCEPTED";
const SO_WITH_PICKUP = "SO_WITH_PICKUP";	
const SO_AT_HUB = "SO_AT_HUB";
const SO_AT_HUB_WAITING_FOR_COLLECT = "SO_AT_HUB_WAITING_FOR_COLLECT";
const SO_WITH_HUB_FOR_SHUTTLE = "SO_WITH_HUB_FOR_SHUTTLE";	
const SO_WITH_SHUTTLE = "SO_WITH_SHUTTLE";
const SO_WITH_SORTING = "SO_WITH_SORTING";
const SO_WITH_LINEHAUL = "SO_WITH_LINEHAUL";
const SO_ACCEPTED = "SO_ACCEPTED";
const SO_WITH_DRIVER = "SO_WITH_DRIVER";
const SO_IN_DELIVERY = "SO_IN_DELIVERY";
const SO_DELIVERED = "SO_DELIVERED";
const SO_DELIVERY_FAIL = "SO_DELIVERY_FAIL";
const SO_RETURNED_TO_SENDER = "SO_RETURNED_TO_SENDER";
const SO_RETURNED_TO_HUB = "SO_RETURNED_TO_HUB";
const SO_COLLECTED_BY_ILOGIC = "SO_COLLECTED_BY_ILOGIC";
const SO_RETURNED_TO_ILOGIC = "SO_RETURNED_TO_ILOGIC";
const SO_DELIVERED_BY_ILOGIC = "SO_DELIVERED_BY_ILOGIC";	
const SO_LOST_PICKUP = "SO_LOST_PICKUP";
const SO_LOST_HUB = "SO_LOST_HUB";
const SO_LOST_SHUTTLE = "SO_LOST_SHUTTLE";
const SO_LOST_SORTING = "SO_LOST_SORTING";
const SO_LOST_LINEHAUL = "SO_LOST_LINEHAUL";
const SO_LOST_DRIVER = "SO_LOST_DRIVER";
const SO_LOST_ILOGIC = "SO_LOST_ILOGIC";
const SO_LOST_CONFIRMED = "SO_LOST_CONFIRMED";
const SO_FOUND = "SO_FOUND";
const SO_DISPOSED = "SO_DISPOSED";

const EO_DRAFT = "EO_DRAFT";
const EO_SUBMITTED = "EO_SUBMITTED";
const EO_CANCELLED = "EO_CANCELLED";
const EO_PICKUP_DISPATCHED = "EO_PICKUP_DISPATCHED";
const EO_PICKUP_DISPATCHED_FAIL = "EO_PICKUP_DISPATCHED_FAIL";
const EO_REJECTED_BY_SHIPPER = "EO_REJECTED_BY_SHIPPER";
const EO_REJECTED_BY_SYSTEM = "EO_REJECTED_BY_SYSTEM";
const EO_DISPATCHED = "EO_DISPATCHED";
const EO_DISPATCHED_FAIL = "EO_DISPATCHED_FAIL";	
const EO_PICKUP_ACCEPTED = "EO_PICKUP_ACCEPTED";
const EO_WITH_PICKUP = "EO_WITH_PICKUP";	
const EO_AT_HUB = "EO_AT_HUB";
const EO_AT_HUB_WAITING_FOR_COLLECT = "EO_AT_HUB_WAITING_FOR_COLLECT";
const EO_WITH_HUB_FOR_SHUTTLE = "EO_WITH_HUB_FOR_SHUTTLE";	
const EO_WITH_SHUTTLE = "EO_WITH_SHUTTLE";
const EO_WITH_SORTING = "EO_WITH_SORTING";
const EO_WITH_LINEHAUL = "EO_WITH_LINEHAUL";
const EO_ACCEPTED = "EO_ACCEPTED";
const EO_WITH_DRIVER = "EO_WITH_DRIVER";
const EO_IN_DELIVERY = "EO_IN_DELIVERY";
const EO_DELIVERED = "EO_DELIVERED";
const EO_DELIVERY_FAIL = "EO_DELIVERY_FAIL";
const EO_RETURNED_TO_SENDER = "EO_RETURNED_TO_SENDER";
const EO_RETURNED_TO_HUB = "EO_RETURNED_TO_HUB";
const EO_COLLECTED_BY_ILOGIC = "EO_COLLECTED_BY_ILOGIC";
const EO_RETURNED_TO_ILOGIC = "EO_RETURNED_TO_ILOGIC";
const EO_DELIVERED_BY_ILOGIC = "EO_DELIVERED_BY_ILOGIC";	
const EO_LOST_PICKUP = "EO_LOST_PICKUP";
const EO_LOST_HUB = "EO_LOST_HUB";
const EO_LOST_SHUTTLE = "EO_LOST_SHUTTLE";
const EO_LOST_SORTING = "EO_LOST_SORTING";
const EO_LOST_LINEHAUL = "EO_LOST_LINEHAUL";
const EO_LOST_DRIVER = "EO_LOST_DRIVER";
const EO_LOST_ILOGIC = "EO_LOST_ILOGIC";
const EO_LOST_CONFIRMED = "EO_LOST_CONFIRMED";
const EO_FOUND = "EO_FOUND";
const EO_DISPOSED = "EO_DISPOSED";

const BOX_BOOKING_SUBMITTED = "BOX_BOOKING_SUBMITTED";
const BOX_BOOKING_NOT_USED = "BOX_BOOKING_NOT_USED";
const BOX_BOOKING_CANCELLED = "BOX_BOOKING_CANCELLED";
const BOX_BOOKING_AT_HUB_FOR_COLLECTION = "BOX_BOOKING_AT_HUB_FOR_COLLECTION";
const BOX_BOOKING_COLLECTED_BY_ILOGIC = "BOX_BOOKING_COLLECTED_BY_ILOGIC";
const BOX_BOOKING_RETURNED_TO_ILOGIC = "BOX_BOOKING_RETURNED_TO_ILOGIC";
const BOX_BOOKING_DELIVERED = "BOX_BOOKING_DELIVERED";
const BOX_BOOKING_DELIVERED_BY_ILOGIC = "BOX_BOOKING_DELIVERED_BY_ILOGIC";
const BOX_BOOKING_LOST = "BOX_BOOKING_LOST";
const BOX_BOOKING_LOST_CONFIRMED = "BOX_BOOKING_LOST_CONFIRMED";
const BOX_BOOKING_FOUND = "BOX_BOOKING_FOUND";
const BOX_BOOKING_DISPOSED = "BOX_BOOKING_DISPOSED";


const ORDER_STATUSES = {
  FO_SUBMITTED,
  FO_CANCELLED,
  FO_AT_HUB,
  FO_DISPATCHED,
  FO_DISPATCHED_FAIL,
  FO_REJECTED_BY_SYSTEM,
  FO_REJECTED_BY_SHIPPER,	
  FO_ACCEPTED,
  FO_WITH_RIDER,
  FO_IN_DELIVERY,
  FO_AT_HUB_FOR_COLLECTION,
  FO_DELIVERED,
  FO_DELIVERY_FAIL,
  FO_AT_HUB_FOR_RETURN,
  FO_LOST,
  FO_LOST_CONFIRMED,
  FO_FOUND,
  FO_RETURNED_TO_SENDER,
  FO_COLLECTED_BY_ILOGIC,
  FO_RETURNED_TO_ILOGIC,
  FO_DELIVERED_BY_ILOGIC,
  FO_DISPOSED,	

  SO_DRAFT,
  SO_SUBMITTED,
  SO_CANCELLED,
  SO_PICKUP_DISPATCHED,
  SO_PICKUP_DISPATCHED_FAIL,
  SO_REJECTED_BY_SHIPPER,
  SO_REJECTED_BY_SYSTEM,
  SO_DISPATCHED,
  SO_DISPATCHED_FAIL,	
  SO_PICKUP_ACCEPTED,
  SO_WITH_PICKUP,	
  SO_AT_HUB,
  SO_AT_HUB_WAITING_FOR_COLLECT,
  SO_WITH_HUB_FOR_SHUTTLE,	
  SO_WITH_SHUTTLE,
  SO_WITH_SORTING,
  SO_WITH_LINEHAUL,
  SO_ACCEPTED,
  SO_WITH_DRIVER,
  SO_IN_DELIVERY,
  SO_DELIVERED,
  SO_DELIVERY_FAIL,
  SO_RETURNED_TO_SENDER,
  SO_RETURNED_TO_HUB,
  SO_COLLECTED_BY_ILOGIC,
  SO_RETURNED_TO_ILOGIC,
  SO_DELIVERED_BY_ILOGIC,	
  SO_LOST_PICKUP,
  SO_LOST_HUB,
  SO_LOST_SHUTTLE,
  SO_LOST_SORTING,
  SO_LOST_LINEHAUL,
  SO_LOST_DRIVER,
  SO_LOST_ILOGIC,
  SO_LOST_CONFIRMED,
  SO_FOUND,
  SO_DISPOSED,

  EO_DRAFT,
  EO_SUBMITTED,
  EO_CANCELLED,
  EO_PICKUP_DISPATCHED,
  EO_PICKUP_DISPATCHED_FAIL,
  EO_REJECTED_BY_SHIPPER,
  EO_REJECTED_BY_SYSTEM,
  EO_DISPATCHED,
  EO_DISPATCHED_FAIL,	
  EO_PICKUP_ACCEPTED,
  EO_WITH_PICKUP,	
  EO_AT_HUB,
  EO_AT_HUB_WAITING_FOR_COLLECT,
  EO_WITH_HUB_FOR_SHUTTLE,	
  EO_WITH_SHUTTLE,
  EO_WITH_SORTING,
  EO_WITH_LINEHAUL,
  EO_ACCEPTED,
  EO_WITH_DRIVER,
  EO_IN_DELIVERY,
  EO_DELIVERED,
  EO_DELIVERY_FAIL,
  EO_RETURNED_TO_SENDER,
  EO_RETURNED_TO_HUB,
  EO_COLLECTED_BY_ILOGIC,
  EO_RETURNED_TO_ILOGIC,
  EO_DELIVERED_BY_ILOGIC,	
  EO_LOST_PICKUP,
  EO_LOST_HUB,
  EO_LOST_SHUTTLE,
  EO_LOST_SORTING,
  EO_LOST_LINEHAUL,
  EO_LOST_DRIVER,
  EO_LOST_ILOGIC,
  EO_LOST_CONFIRMED,
  EO_FOUND,
  EO_DISPOSED,

  BOX_BOOKING_SUBMITTED,
  BOX_BOOKING_NOT_USED,
  BOX_BOOKING_CANCELLED,
  BOX_BOOKING_AT_HUB_FOR_COLLECTION,
  BOX_BOOKING_COLLECTED_BY_ILOGIC,
  BOX_BOOKING_RETURNED_TO_ILOGIC,
  BOX_BOOKING_DELIVERED,
  BOX_BOOKING_DELIVERED_BY_ILOGIC,
  BOX_BOOKING_LOST,
  BOX_BOOKING_LOST_CONFIRMED,
  BOX_BOOKING_FOUND,
  BOX_BOOKING_DISPOSED,
};

export { ORDER_STATUSES };
