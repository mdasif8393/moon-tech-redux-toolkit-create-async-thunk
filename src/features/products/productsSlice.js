import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteProduct, fetchProducts, postProduct } from "./productsApi";

const initialState = {
    products: [],
    isLoading: false,
    isError: false,
    error: "",
    postSuccess: false,
    deleteSuccess: false,
}

export const getProducts = createAsyncThunk("products/getProduct", async () => {
    const products = await fetchProducts();
    return products;
});

export const addProduct = createAsyncThunk("products/addProduct", async (data) => {
    const products = await postProduct(data);
    return products;
})
export const removeProduct = createAsyncThunk("products/removeProduct", async (id, thunkApi) => {
    const products = await deleteProduct(id);
    thunkApi.dispatch(removeFromList(id))
    return products;
})

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        togglePostSuccess: (state) => {
            state.postSuccess = false;
        },
        toggleDeleteSuccess: (state) => {
            state.deleteSuccess = false;
        },
        removeFromList: (state, action) => {
            state.products = state.products.filter(product => product._id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(getProducts.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.products = [];
            })
            .addCase(addProduct.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.postSuccess = false;
            })
            .addCase(addProduct.fulfilled, (state) => {
                state.isLoading = false;
                state.postSuccess = true;
            })
            .addCase(addProduct.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.products = [];
                state.postSuccess = false;
            })
            .addCase(removeProduct.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.postSuccess = false;
                state.deleteSuccess = false;
            })
            .addCase(removeProduct.fulfilled, (state) => {
                state.isLoading = false;
                state.postSuccess = true;
                state.deleteSuccess = true;
            })
            .addCase(removeProduct.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.products = [];
                state.postSuccess = false;
                state.deleteSuccess = false;
            })
    },
})

export const {togglePostSuccess, toggleDeleteSuccess, removeFromList} = productsSlice.actions;

export default productsSlice.reducer;