import React, { useState } from 'react'
import ProductCart from '../components/productCart';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useCategoriesQuery, useSearchProductsQuery } from '../redux/api/productAPI';
import { CustomError } from '../types/api-types';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/loader';
import { CartItem } from '../types/types';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/reducer/cartReducer';
// import { FaSearch } from 'react-icons/fa';

const Search = () => {

  // calling api here 

  const {data : categoriesResponse, isLoading:loadingCategories,isError, error } = useCategoriesQuery("");

  // default filter variables
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category,setCategory] = useState("");
  const [page, setPage] = useState(1);

  // calling api here..
  const {
      isLoading:productLoading,
     data:searchedData, 
     isError:productIsError, 
     error:productError 
    } = useSearchProductsQuery({
    search,
    sort,
    price:maxPrice,
    category,
    page
  });

  const dispatch = useDispatch();

  // add to cart event handler 
  const addToCartHandler = (cartItem:CartItem) => {
    if(cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  }
  
  // navigatote
  const navigate = useNavigate();

  // pagination..
  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  if(isError){
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  if(productIsError){
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  return (
    
    <div className='product-search-page'>
      
      <aside>
      <button className="back-btn" onClick={() => navigate("/")}>
        <BiArrowBack />
      </button>
        <h2>Filters</h2>

{/* Sorting Section */}
        <div>
          <h4>Sort</h4>
          <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}>

            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">price (High to Low)</option>
          </select>
        </div>

{/* Max Price Section */}
    <div>
      <h4>Max Price : {maxPrice || ""}</h4>
      <input 
      type="range" 
      min={100}
      max={1000000}
      value={maxPrice}
      onChange={(e) => setMaxPrice(Number(e.target.value))}
      />
    </div>

{/* Category Section.. */}
    <div>
      <h4>Category</h4>
      <select 
      value={category}
      onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        {
          !loadingCategories && categoriesResponse?.
            categories.map((i) => (
              <option key={i} value={i}>{i.toUpperCase()}</option>
            ))}
      </select>
    </div>
      </aside>
      <main>

        <h1>Products</h1>
        
        <input type="text" 
        placeholder='Search by name..'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />


      {
        productLoading ? (<Skeleton length={5}/>) : (<div className="search-product-list">  
        {
          searchedData?.products.map((i) => (
        <ProductCart 
        key={i._id}
        productId={i._id}
        name={i.name}
        price={i.price}
        stock={i.stock}
        handler={addToCartHandler}
        photo = {i.photo}
  />
      ))}
        </div>
        )}

{/* pagination secton */}
        {
          searchedData && searchedData?.totalPage > 1 && <article>
          <button 
            disabled = {!isPrevPage}
            onClick={() => setPage((prev) => prev - 1)}>
            Prev
          </button>
          <span>
            {page} of {searchedData?.totalPage}
          </span>
          <button 
            disabled = {!isNextPage}
            onClick={() => setPage((prev) => prev + 1)}>
            Next
          </button>
          
        </article>
        }

      </main>
    </div>
  )
}

export default Search
 