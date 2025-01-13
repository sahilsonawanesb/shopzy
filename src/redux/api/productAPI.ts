import {createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { allProductsResponse, CategoriesResponse, DeleteProductRequest, MessageResponse, NewProductRequest, ProductResponse, SearchProductsRequest, SearchProductsResponse, UpdateProductRequest } from "../../types/api-types";

// function for creating the productApi as follows..
export const productAPI = createApi({
    reducerPath : "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`
    }),
    // tagspoints..
    tagTypes:["Products"],
    endpoints : (builder) => ({
        latestProducts : builder.query<allProductsResponse, string>({
            query : () => "latest",
            providesTags : ["Products"]
        }),

        // api endpoints for admin all products
        allProducts : builder.query<allProductsResponse, string>({
            query : (id) => `admin-products?id=${id}`,
            providesTags : ["Products"]
        }),
        
        // api endpoints for searching all products using filter
        categories : builder.query<CategoriesResponse, string>({
            query : () => "categories",
            providesTags:["Products"]
        }),

        searchProducts : builder.query<SearchProductsResponse, SearchProductsRequest>({
            query : ({price,page,category,search,sort}) => {
                let base = `all?search=${search}&page=${page}&`;

                if(price) base += `&price=${price}`;
                if(category) base += `&category=${category}`;
                if(sort) base += `&sort=${sort}`;
                return base;
            },
            providesTags:["Products"],
        }),

        newProduct : builder.mutation<MessageResponse, NewProductRequest>({
            query: ({formData, id}) => ({
                url:`new?id=${id}`,
                method:"POST",
                body : formData,
            }),
            invalidatesTags :["Products"],
        }),

        productDetails : builder.query<ProductResponse, string>({
            query: (id) => id,
            providesTags: ["Products"],
        }),

        updateProduct : builder.mutation<MessageResponse, UpdateProductRequest>({
            
            query : ({ formData, userId, productId }) => ({
                url : `${productId}?id=${userId}`,
                method : "PUT",
                body : formData,
            }),
            invalidatesTags : ["Products"],
        }),

        deleteProduct : builder.mutation<MessageResponse,DeleteProductRequest>({
            query : ({ userId, productId }) => ({
                url : `${productId}?id=${userId}`,
                method : "DELETE",
            }),
            invalidatesTags : ["Products"],
        }),
    }), 

});

export const {
            useLatestProductsQuery,
            useAllProductsQuery,
            useCategoriesQuery,
            useSearchProductsQuery,
            useNewProductMutation,
            useProductDetailsQuery,
            useUpdateProductMutation,
            useDeleteProductMutation,
        } = productAPI; 