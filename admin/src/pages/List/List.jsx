import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from "react-toastify"

const List = ({ url }) => {
  const [activeTab, setActiveTab] = useState("food");

  const [foodList,    setFoodList]    = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [itemList,    setItemList]    = useState([]);

  // ── Fetchers ─────────────────────────────────────────────
  const fetchFood = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success) setFoodList(res.data.data);
      else toast.error("Error fetching food list");
    } catch { toast.error("Server error"); }
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${url}/api/package/list`);
      if (res.data.success) setPackageList(res.data.data);
      else toast.error("Error fetching package list");
    } catch { toast.error("Server error"); }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${url}/api/cateringitem/list`);
      if (res.data.success) setItemList(res.data.data);
      else toast.error("Error fetching catering item list");
    } catch { toast.error("Server error"); }
  };

  useEffect(() => {
    fetchFood();
    fetchPackages();
    fetchItems();
  }, []);

  // ── Removers ─────────────────────────────────────────────
  const removeFood = async (id) => {
    const res = await axios.post(`${url}/api/food/remove`, { id });
    await fetchFood();
    res.data.success ? toast.success(res.data.message) : toast.error("Error");
  };

  const removePackage = async (id) => {
    const res = await axios.post(`${url}/api/package/remove`, { id });
    await fetchPackages();
    res.data.success ? toast.success(res.data.message) : toast.error("Error");
  };

  const removeItem = async (id) => {
    const res = await axios.post(`${url}/api/cateringitem/remove`, { id });
    await fetchItems();
    res.data.success ? toast.success(res.data.message) : toast.error("Error");
  };

  return (
    <div className='list add flex-col'>

      {/* ── Tab switcher ── */}
      <div className="add-tabs">
        <button
          className={`add-tab-btn ${activeTab === "food" ? "active" : ""}`}
          onClick={() => setActiveTab("food")}
        >🍽 Food List</button>
        <button
          className={`add-tab-btn ${activeTab === "package" ? "active" : ""}`}
          onClick={() => setActiveTab("package")}
        >📦 Package List</button>
        <button
          className={`add-tab-btn ${activeTab === "cateringitem" ? "active" : ""}`}
          onClick={() => setActiveTab("cateringitem")}
        >➕ Catering Items</button>
      </div>

      {/* ══════════════ FOOD LIST ══════════════ */}
      {activeTab === "food" && (
        <>
          <p>All Food Items</p>
          <div className="list-table">
            <div className="list-table-format title">
              <b>Image</b><b>Name</b><b>Category</b><b>Price</b><b>Action</b>
            </div>
            {foodList.map((item, index) => (
              <div key={index} className='list-table-format'>
                <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>₱{item.price}</p>
                <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ══════════════ PACKAGE LIST ══════════════ */}
      {activeTab === "package" && (
        <>
          <p>All Packages</p>
          <div className="list-table">
            <div className="list-table-format title">
              <b>Image</b><b>Name</b><b>PAX</b><b>Event</b><b>Price</b><b>Action</b>
            </div>
            {packageList.map((item, index) => (
              <div key={index} className='list-table-format'>
                <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.pax}</p>
                <p>{item.eventType}</p>
                <p>₱{item.price}</p>
                <p onClick={() => removePackage(item._id)} className='cursor'>X</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ══════════════ CATERING ITEM LIST ══════════════ */}
      {activeTab === "cateringitem" && (
        <>
          <p>All Catering Items</p>
          <div className="list-table">
            <div className="list-table-format title">
              <b>Image</b><b>Name</b><b>Category</b><b>Price</b><b>Action</b>
            </div>
            {itemList.map((item, index) => (
              <div key={index} className='list-table-format'>
                <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>₱{item.price}</p>
                <p onClick={() => removeItem(item._id)} className='cursor'>X</p>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default List;