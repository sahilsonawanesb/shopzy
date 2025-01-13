

export type User = {
    name : string;
    email : string;
    photo : string;
    gender : string;
    role : string;
    dob : string;
    _id : string;
};

export type Product = {
    name: string;
    price: number;
    stock: number;
    category: string;
    photo: string;
    _id:string; 
};

// cartItems- ShippingInfo Types
export type ShippingInfo  = {
    address: string;
    city : string;
    state : string;
    country : string;
    pinCode : string;
};

export type CartItem = {
    productId: string;
    photo: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
};


export type OrderItem = Omit<CartItem,"stock"> & { _id : string };

export type Order = {
    orderItems : OrderItem[];
    shippingDetails : ShippingInfo,
    subtotal : number,
    tax : number,
    shippingCharges : number,
    discount : number,
    total : number,
    status : string,
    user?:{
        name : string,
        _id : string,
    } | null,
    _id:string,
};


type CountAndChange = {
    revenue : number;
    product : number;
    user : number;
    order : number;
}

type LatesTranscation = {
    _id : string;
    amount : number;
    discount : number;
    quantity : number;
    status : string;  
};

export type Stats = {
    categoryCount: Record<string, number>[];
    changePercentage : CountAndChange;
    count : CountAndChange;
    chart : {
        order : number[];
        revenue : number[];
    };
    userRatio : {
        male: number;
        female: number;
    };
    lastTransaction : LatesTranscation[];
};


type RevenueDistribution = {
    
        netMargin : number,
        discount : number,
        productionCost : number,
        burnt : number,
        marketingCosts : number,
    };

type OrderFullfillment = {
    processing : number,
    shipped : number,
    delivered : number,
};

type StockAvailabilty = {
    inStock : number,
    outOfStock : number,
};

type UsersAgeGroup = {
    teen : number,
    adult : number,
    old : number,
};

type AdminCustomer = {
    admin : number,
    users : number,
};


export type Pie = {
    orderFullfillment : OrderFullfillment;
    productCategories : Record<string, number>[],
    stockAvailablity : StockAvailabilty,
    revenueDistribution : RevenueDistribution;
    usersAgeGroup : UsersAgeGroup;
    adminCustomer : AdminCustomer;
};

export type Bar = {
    users : number[];
    products : number[];
    orders : number[];
};

export type Line = {
    user : number[];
    product : number[];
    discount: number[];
    revenue : number[];
};

