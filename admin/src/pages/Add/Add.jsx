import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const PAX_OPTIONS = [
  "50 PAX","100 PAX","150 PAX","200 PAX","250 PAX",
  "300 PAX","350 PAX","400 PAX","450 PAX","500 PAX","550 PAX","600 PAX"
];

const EVENT_TYPES = [
  "Wedding","Birthday","Debut","Christening",
  "Corporate","Reunion","Anniversary","Other"
];

const CATERING_CATEGORIES = [
  "Chafing Dish",
  "Motif",
  "Buffet Skirting",
  "Dessert Tray",
  "Extra Dessert",
  "Extra Foods",
  "Extra Drinks",
  "Extra Tent",
];

const Add = ({ url }) => {
  const [activeTab, setActiveTab] = useState("food");

  // ── Food state ───────────────────────────────────────────
  const [foodImage, setFoodImage] = useState(false);
  const [foodData, setFoodData] = useState({
    name: "", description: "", price: "", category: "Salad"
  });

  // ── Package state ────────────────────────────────────────
  const [pkgImage, setPkgImage] = useState(false);
  const [pkgData, setPkgData] = useState({
    name: "", description: "", price: "",
    pax: "50 PAX", packageLetter: "A", eventType: "Wedding",
  });

  // ── Catering Item state ──────────────────────────────────
  const [itemImage, setItemImage] = useState(false);
  const [itemData, setItemData] = useState({
    name: "", description: "", price: "", category: "Chafing Dish"
  });

  // ── Handlers: Food ───────────────────────────────────────
  const onFoodChange = (e) => {
    const { name, value } = e.target;
    setFoodData(prev => ({ ...prev, [name]: value }));
  };

  const onFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name",        foodData.name);
      formData.append("description", foodData.description);
      formData.append("price",       Number(foodData.price));
      formData.append("category",    foodData.category);
      formData.append("image",       foodImage);
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setFoodData({ name: "", description: "", price: "", category: "Salad" });
        setFoodImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add food item.");
    }
  };

  // ── Handlers: Package ────────────────────────────────────
  const onPkgChange = (e) => {
    const { name, value } = e.target;
    setPkgData(prev => ({ ...prev, [name]: value }));
  };

  const onPkgSubmit = async (e) => {
    e.preventDefault();
    if (!pkgImage) { toast.error("Please upload a package image."); return; }
    try {
      const formData = new FormData();
      formData.append("name",          `Package ${pkgData.packageLetter}`);
      formData.append("description",   pkgData.description);
      formData.append("price",         Number(pkgData.price));
      formData.append("pax",           pkgData.pax);
      formData.append("packageLetter", pkgData.packageLetter);
      formData.append("eventType",     pkgData.eventType);
      formData.append("image",         pkgImage);
      const response = await axios.post(`${url}/api/package/add`, formData);
      if (response.data.success) {
        setPkgData({ name: "", description: "", price: "", pax: "50 PAX", packageLetter: "A", eventType: "Wedding" });
        setPkgImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add package.");
    }
  };

  // ── Handlers: Catering Item ──────────────────────────────
  const onItemChange = (e) => {
    const { name, value } = e.target;
    setItemData(prev => ({ ...prev, [name]: value }));
  };

  const onItemSubmit = async (e) => {
    e.preventDefault();
    if (!itemImage) { toast.error("Please upload an image."); return; }
    try {
      const formData = new FormData();
      formData.append("name",        itemData.name);
      formData.append("description", itemData.description);
      formData.append("price",       Number(itemData.price));
      formData.append("category",    itemData.category);
      formData.append("image",       itemImage);
      const response = await axios.post(`${url}/api/cateringitem/add`, formData);
      if (response.data.success) {
        setItemData({ name: "", description: "", price: "", category: "Chafing Dish" });
        setItemImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add catering item.");
    }
  };

  return (
    <div className='add'>

      {/* ── Tab switcher ── */}
      <div className="add-tabs">
        <button className={`add-tab-btn ${activeTab === "food" ? "active" : ""}`} onClick={() => setActiveTab("food")}>🍽 Add Food Item</button>
        <button className={`add-tab-btn ${activeTab === "package" ? "active" : ""}`} onClick={() => setActiveTab("package")}>📦 Add Package</button>
        <button className={`add-tab-btn ${activeTab === "cateringitem" ? "active" : ""}`} onClick={() => setActiveTab("cateringitem")}>➕ Add Catering Item</button>
      </div>

      {/* ══════════════ FOOD FORM ══════════════ */}
      {activeTab === "food" && (
        <form className='flex-col' onSubmit={onFoodSubmit}>
          <div className="add-img-upload flex-col">
            <p>Upload Image</p>
            <label htmlFor="food-image">
              <img src={foodImage ? URL.createObjectURL(foodImage) : assets.upload_area} alt="" />
            </label>
            <input onChange={(e) => setFoodImage(e.target.files[0])} type="file" id="food-image" hidden required />
          </div>
          <div className="add-product-name flex-col">
            <p>Product name</p>
            <input onChange={onFoodChange} value={foodData.name} type="text" name="name" placeholder='Type here' required />
          </div>
          <div className="add-product-description flex-col">
            <p>Product description</p>
            <textarea onChange={onFoodChange} value={foodData.description} name="description" rows="6" placeholder='Write content here' required />
          </div>
          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Category</p>
              <select onChange={onFoodChange} name="category" value={foodData.category}>
                <option value="Salad">Salad</option>
                <option value="Foods">Foods</option>
                <option value="Dessert">Dessert</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>
            <div className="add-price flex-col">
              <p>Price</p>
              <input onChange={onFoodChange} value={foodData.price} type="number" name='price' placeholder='₱20' required />
            </div>
          </div>
          <button type='submit' className='add-btn'>ADD FOOD</button>
        </form>
      )}

      {/* ══════════════ PACKAGE FORM ══════════════ */}
      {activeTab === "package" && (
        <form className='flex-col' onSubmit={onPkgSubmit}>
          <div className="add-img-upload flex-col">
            <p>Upload Package Image</p>
            <label htmlFor="pkg-image">
              <img src={pkgImage ? URL.createObjectURL(pkgImage) : assets.upload_area} alt="" />
            </label>
            <input onChange={(e) => setPkgImage(e.target.files[0])} type="file" id="pkg-image" hidden required />
          </div>
          <div className="add-pkg-meta">
            <div className="add-category flex-col">
              <p>PAX Size</p>
              <select onChange={onPkgChange} name="pax" value={pkgData.pax}>
                {PAX_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="add-category flex-col">
              <p>Package Letter</p>
              <select onChange={onPkgChange} name="packageLetter" value={pkgData.packageLetter}>
                <option value="A">Package A</option>
                <option value="B">Package B</option>
                <option value="C">Package C</option>
              </select>
            </div>
            <div className="add-category flex-col">
              <p>Event Type</p>
              <select onChange={onPkgChange} name="eventType" value={pkgData.eventType}>
                {EVENT_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="pkg-name-preview">
            <span>Package name: </span>
            <strong>Package {pkgData.packageLetter} ({pkgData.pax})</strong>
            {" "}for <strong>{pkgData.eventType}</strong>
          </div>
          <div className="add-product-description flex-col">
            <p>Package description</p>
            <textarea onChange={onPkgChange} value={pkgData.description} name="description" rows="6" placeholder="e.g. Includes 5 main dishes, 2 desserts, drinks, tent setup..." required />
          </div>
          <div className="add-price flex-col">
            <p>Package price (₱)</p>
            <input onChange={onPkgChange} value={pkgData.price} type="number" name='price' placeholder='e.g. 8500' required />
          </div>
          <button type='submit' className='add-btn'>ADD PACKAGE</button>
        </form>
      )}

      {/* ══════════════ CATERING ITEM FORM ══════════════ */}
      {activeTab === "cateringitem" && (
        <form className='flex-col' onSubmit={onItemSubmit}>
          <div className="add-img-upload flex-col">
            <p>Upload Item Image</p>
            <label htmlFor="item-image">
              <img src={itemImage ? URL.createObjectURL(itemImage) : assets.upload_area} alt="" />
            </label>
            <input onChange={(e) => setItemImage(e.target.files[0])} type="file" id="item-image" hidden required />
          </div>

          <div className="add-product-name flex-col">
            <p>Item name</p>
            <input onChange={onItemChange} value={itemData.name} type="text" name="name" placeholder='e.g. Extra Round Table' required />
          </div>

          <div className="add-product-description flex-col">
            <p>Item description</p>
            <textarea onChange={onItemChange} value={itemData.description} name="description" rows="4" placeholder='Describe this add-on item...' required />
          </div>

          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Category</p>
              <select onChange={onItemChange} name="category" value={itemData.category}>
                {CATERING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="add-price flex-col">
              <p>Price (₱)</p>
              <input onChange={onItemChange} value={itemData.price} type="number" name='price' placeholder='e.g. 500' required />
            </div>
          </div>

          <button type='submit' className='add-btn'>ADD ITEM</button>
        </form>
      )}

    </div>
  );
};

export default Add;