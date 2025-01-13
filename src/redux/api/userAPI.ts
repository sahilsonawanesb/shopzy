import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllUserResponse, DeleteUserRequest, MessageResponse, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";

export const userAPI =  createApi({ 
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/` }),
    tagTypes : ["users"],
    endpoints: (builder) => ({
        login : builder.mutation<MessageResponse, User>({
            query: (user) => ({
                url : "new",
                method : "POST",
                body : user,
        }),
        invalidatesTags:["users"],
    }),

        deleteUser : builder.mutation<MessageResponse, DeleteUserRequest>({
            query : ({userId, adminUserId}) => ({
                url : `${userId}?id=${adminUserId}`,
                method : "DELETE",
            }),
        }),

        allUsers : builder.query<AllUserResponse, string>({
            query : (id) => `all?id=${id}`,
            providesTags:["users"],
        }),
        
    }),
});



export const getUser = async (id : string) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const {data} : {data : UserResponse} = await axios.get(
            `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
        );
        // console.log(data);
        
        return data;
    }catch(error){
        throw error;
    }

    
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } = userAPI;
