import axios from "axios"
import { createContext, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({})
    const url = "http://localhost:5000"
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([])
    const [userId, setUserId] = useState(null)  // ✅ added

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }))
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updated = { ...prev }
            if (updated[itemId] > 1) {
                updated[itemId] -= 1
            } else {
                delete updated[itemId]
            }
            return updated
        })
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } })
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } })
        setCartItems(response.data.cartData);
    }

    const getTotalCartItems = () => {
        let totalItems = 0;
        for (const item in cartItems) {
            totalItems += cartItems[item];
        }
        return totalItems;
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                const decoded = jwtDecode(savedToken);  // ✅ decode token
                setUserId(decoded.id);                   // ✅ save userId
                await loadCartData(savedToken);
            }
        }
        loadData();
    }, [])

    const contextValue = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        url,
        token,
        setToken,
        userId,    // ✅ added
        setUserId  // ✅ added
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider