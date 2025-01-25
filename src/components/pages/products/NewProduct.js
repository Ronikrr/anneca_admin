import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Editor from "../../common/Editor";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchList } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { toast } from "react-toastify";
import { Routing } from "../../shared/constants/routing";
import {
  createNewProduct,
  deleteProductImage,
  fetchProductById,
  updateProductById,
} from "../../apis/services/ProductServices";
import Spinner from "../../layout/spinner/spinner";
import ReactSelect from "react-select";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { IoCloseOutline } from "react-icons/io5";
import { BASE_URL } from "../../config/Urls";


const options = [
  { label: "Marron", value: 7 },
  { label: "Blue", value: 8 },
  { label: "Beige", value: 14 },
  { label: "Cream", value: 17 },
  { label: "White", value: 18 },
  { label: "Gold", value: 19 },
  { label: "Grey", value: 23 },
  { label: "Brown", value: 24 },
  { label: "Purple", value: 27 },
];
const yearOptions = [
  { label: "6 Months to 12 Months", value: 0 },
  { label: "1 Year to 2 Year", value: 1 },
  { label: "2 Year to 3 Year", value: 2 },
  { label: "3 Year to 4 Year", value: 3 },
  { label: "4 Year to 5 Year", value: 4 },
  { label: "5 Year to 6 Year", value: 5 },
  { label: "6 Year to 7 Year", value: 6 },
  { label: "7 Year to 8 Year", value: 7 },
  { label: "8 Year to 9 Year", value: 8 },
  { label: "9 Year to 10 Year", value: 9 },
  { label: "10 Year to 11 Year", value: 10 },
  { label: "11 Year to 12 Year", value: 11 },
  { label: "12 Year to 13 Year", value: 12 },
  { label: "13 Year to 14 Year", value: 13 },
  { label: "14 Year to 15 Year", value: 14 },
  { label: "15 Year to 16 Year", value: 15 },
  { label: "16 Year to 17 Year", value: 16 },
];

const NewProduct = (props) => {
  // edit & update product id
  const { id } = useParams();

  const navigate = useNavigate();

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [selectCategory, setSelectCategory] = useState(false);
  const [selectCategory_id, setSelectCategory_id] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedYearOption, setSelectedYearOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [createdOptions, setCreatedOptions] = useState([]);
  const [sizeSkus, setSizeSkus] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const [productDetail, setProductDetail] = useState({
    name: "",
    images: [],
    description: "",
    url_key: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: [],
    status: "",
    sku: "",
    price: "",
    weight: "",
    quantity: "",
    manage_stock: "",
    visibility: "",
    size: "",
    category: "",
    stock_availability: "",
  });

  useEffect(() => {
    setEditorLoaded(true);
    if (id) {
      setIsEditMode(true);
      fetchProductData(id);
    }
  }, [id]);

  const fetchProductData = async (productId) => {
    try {
      const result = await fetchProductById(productId);
      console.log(result);
      if (result.status === 200 && result.success) {
        const productData = result.data;
        setProductDetail({
          name: productData.name,
          images:  [],
          description: productData.description,
          url_key: productData.url_key,
          meta_title: productData.meta_title,
          meta_description: productData.meta_description,
          meta_keywords: productData.meta_keywords,
          status: productData.status,
          price: productData.price,
          weight: productData.weight,
          quantity: productData.quantity,
          manage_stock: productData.manage_stock,
          visibility: productData.visibility,
          size: productData.size[0].split(","),
          category: productData.category._id,
          stock_availability: productData.stock_availability,
        });
        setSelectCategory_id(productData.category);
        setSizeSkus(productData.sizeSkus);
        setSelectedYearOptions(
          productData.size[0].split(",").map((size) => ({
            label: size,
            value: yearOptions.find((opt) => opt.label === size)?.value,
          }))
        );
        setImages(productData.images.map((img) => img.url));
        // setImages(productData.images.map(img => ({ url: img.url, isExisting: true })));
      } else {
        toast.error("Failed to fetch product data");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product data");
    }
  };

  const handleCreateChange = (options) => {
    setCreatedOptions(options || []);
  };

  const handleProduct = (e) => {
    setProductDetail({ ...productDetail, [e.target.name]: e.target.value });
  };

  const handleSizeChange = (selectedOptions) => {
    const newSizeSkus = selectedOptions.map((option) => {
      const existingSku = sizeSkus.find((sku) => sku.size === option.label);
      return existingSku ? existingSku : { size: option.label, sku: "" };
    });
    setSizeSkus(newSizeSkus);
    setSelectedYearOptions(selectedOptions);
  };

  const handleSizeSkuChange = (index, sku) => {
    const updatedSizeSkus = [...sizeSkus];
    updatedSizeSkus[index].sku = sku;
    setSizeSkus(updatedSizeSkus);
  };

  const uploder = (e) => {
    const files = Array.from(e.target.files);
    
    setProductDetail({
      ...productDetail,
      images: [...productDetail.images, e.target.files[0]],
    });
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages([...images, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
 


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const {
      images,
      url_key,
      meta_title,
      meta_description,
      meta_keywords,
      size,
      category,
      ...formDataWithoutImages
    } = productDetail;

    
    if (selectCategory_id?.id) {
      formDataWithoutImages.category = selectCategory_id.id;
    }
    if (selectedYearOption && selectedYearOption.length > 0) {
      formDataWithoutImages.size = selectedYearOption.map((v) => v?.label);
    }

    for (const key in formDataWithoutImages) {
      if (
        formDataWithoutImages[key] !== undefined &&
        formDataWithoutImages[key] !== ""
      ) {
        formData.append(key, formDataWithoutImages[key]);
      }
    }
    if (sizeSkus.length > 0) {
      formData.append("sizeSkus", JSON.stringify(sizeSkus));
    }

    if (url_key) {
      formData.append("url_key", url_key);
    }
    if (meta_title) {
      formData.append("meta_title", meta_title);
    }
    if (meta_description) {
      formData.append("meta_description", meta_description);
    }
    if (meta_keywords && meta_keywords.length > 0) {
      formData.append("meta_keywords", meta_keywords.join(","));
    }

    images.forEach((image) => {
      console.log(image)
      formData.append("media", image);
    });
    console.log(formData ,"llllll")
     
    try {
      let result;
      if (isEditMode) {
        result = await updateProductById(id, formData);
      } else {
        result = await createNewProduct(formData);
      }

      if (result?.status === 200 || result?.status === 201) {
        setLoading(false);
        navigate(Routing.Product);
        toast.success(result?.message || "Product saved successfully");
      } else {
        setLoading(false);
        toast.error(result?.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      setLoading(false);
      toast.error("Failed to save product. Please try again.");
    }
  };
  const getCategorisList = async () => {
    const result = await fetchList(ApiEndPoints.GET_CATEGORIS);
    if (result?.status === 200) {
      const list = [];
      for (var j in result.data) {
        list.push({
          name: result.data[j].name,
          id: result.data[j]._id,
        });
      }
      setCategoryList(list);
    } else {
      setCategoryList([]);
    }
  };
  useEffect(() => {
    getCategorisList();
  }, [selectCategory]);

  const handleImageDelete = async (index) => {

   
    try {
      if (!id) {
        // If we're not in edit mode, just remove from local state
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        return;
      }
  
      setLoading(true);
  
      const result = await deleteProductImage(id, index);
      
      if (result.success) {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        toast.success("Image deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && <Spinner />}
      <div className="main-content-inner">
        <div className="max-w-100 mx-auto mt-3 mb-3">
          <div className="page-heading flex justify-between items-center">
            <div className="flex justify-start space-x-1 items-center">
              <Link
                to="/products"
                className="breadcrum-icon border block border-border rounded mr-075"
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="text-icon"
                    viewBox="0 0 20 20"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <path d="M17 9H5.414l3.293-3.293a.999.999 0 1 0-1.414-1.414l-5 5a.999.999 0 0 0 0 1.414l5 5a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L5.414 11H17a1 1 0 1 0 0-2z" />
                  </svg>
                </span>
              </Link>
              <div className="self-center">
                <h1 className="page-heading-title">Create A New Product</h1>
              </div>
            </div>
            <div className="flex justify-end space-x-1 items-center" />
          </div>
          <div>
            <div className="grid grid-cols-3 gap-x-2 grid-flow-row">
              <div className="col-span-2 grid grid-cols-1 gap-2 auto-rows-max">
                <div className="card shadow">
                  <div className="flex justify-between card-header">
                    <h2 className="card-title">General</h2>
                  </div>
                  <div className="card-section border-b box-border">
                    <div className="card-session-content pt-lg">
                      <div className="">
                        <div className="form-field-container null">
                          <label htmlFor="name">Name</label>
                          <div className="field-wrapper flex flex-grow">
                            <input
                              type="text"
                              name="name"
                              placeholder="Name"
                              value={productDetail.name}
                              onChange={handleProduct}
                            />
                            <div className="field-border" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-15">
                          <div>
                            <div className="form-field-container null">
                              <label htmlFor="price">Product Price</label>
                              <div className="field-wrapper flex flex-grow">
                                <input
                                  type="number"
                                  name="price"
                                  placeholder="Product Price"
                                  value={productDetail.price}
                                  onChange={handleProduct}
                                />
                                <div className="field-border" />
                                <div className="field-suffix">₹</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="form-field-container null">
                              <label htmlFor="weight">Selling Price</label>
                              <div className="field-wrapper flex flex-grow">
                                <input
                                  type="text"
                                  name="weight"
                                  placeholder="Selling Price"
                                  value={productDetail.weight}
                                  onChange={handleProduct}
                                />
                                <div className="field-border" />
                                <div className="field-suffix">₹</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-15 relative">
                          <div className="mb-1">Category</div>
                          {selectCategory_id && (
                            <div className="border rounded border-[#c9cccf] mb-1 p-1">
                              <span className="text-gray-500">
                                {selectCategory_id?.name}
                              </span>
                              <span className="text-interactive pl-2">
                                <p
                                  onClick={() =>
                                    setSelectCategory(!selectCategory)
                                  }
                                >
                                  Change
                                </p>
                                <p
                                  onClick={() => setSelectCategory_id("")}
                                  className="text-critical ml-2 cursor-pointer"
                                >
                                  Unassign
                                </p>
                              </span>
                            </div>
                          )}
                          {!selectCategory_id && (
                            <p
                              onClick={() => setSelectCategory(!selectCategory)}
                              className="text-interactive cursor-pointer"
                            >
                              Select category
                            </p>
                          )}
                          {selectCategory && (
                            <div className="absolute top-5 left-0 right-0 bg-[#eff2f5] z-50 border rounded border-[#c9cccf] p-[10px]">
                              <div>
                                <ul className="category-tree">
                                  {categoryList.map((item, index) => (
                                    <li
                                      onClick={() => {
                                        setSelectCategory_id(item);
                                        setSelectCategory(!selectCategory);
                                      }}
                                    >
                                      <div className="flex justify-start gap-1 items-center">
                                        <a href="#">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="2"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            width="15"
                                            height="15"
                                          >
                                            <path
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            ></path>
                                          </svg>
                                        </a>
                                        {selectCategory_id.id === item.id ? (
                                          <strong>{item?.name}</strong>
                                        ) : (
                                          <p>{item?.name}</p>
                                        )}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ckeditor">
                          <label htmlFor="description mt-1 ">Description</label>
                          <Editor
                            name="description"
                            value={productDetail.description}
                            onChange={(data) => {
                              setProductDetail((option) => ({
                                ...option,
                                description: data,
                              }));
                            }}
                            editorLoaded={editorLoaded}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card shadow">
                  <div className="flex justify-between card-header">
                    <h2 className="card-title">Media</h2>
                  </div>
                  <div className="card-section border-b box-border">
                    <div className="card-session-content pt-lg">
                      <div className="product-image-manager">
                        <div id="images" className="image-list" tabIndex={0}>
                          {images?.map((imgObj, index) =>
                            imgObj?.split("/")?.[0] === "data:video" ? (
                              <video width="150" height={150} controls>
                                <source src={imgObj} type="video/mp4" />
                              </video>
                            ) : (
                              <div>
                                <button
                                  onClick={() => handleImageDelete(index)}
                                >
                                  <IoCloseOutline />
                                </button>
                                <img
                                  key={index}
                                  src={imgObj}
                                  alt={`Image ${index}`}
                                />
                              </div>
                            )
                          )}
                          <div className="uploader grid-item">
                            <div>
                              <label htmlFor="image" className="uploadicon">
                                <svg
                                  style={{ width: 30, height: 30 }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </label>
                            </div>
                            <div className="invisible">
                              <input
                                type="file"
                                name="image"
                                id="image"
                                accept=".jpg,.jpeg,.png,.mp4"
                                multiple
                                onChange={uploder}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card shadow">
                  <div className="flex justify-between card-header">
                    <h2 className="card-title">Search engine optimize</h2>
                  </div>
                  <div className="card-section border-b box-border">
                    <div className="card-session-content pt-lg">
                      <div className="">
                        <div className="form-field-container null">
                          <label htmlFor="url_key">Url key</label>
                          <div className="field-wrapper flex flex-grow">
                            <input
                              type="text"
                              name="url_key"
                              value={productDetail.url_key}
                              onChange={handleProduct}
                            />
                            <div className="field-border" />
                          </div>
                        </div>
                        <div className="form-field-container null">
                          <label htmlFor="meta_title">Meta title</label>
                          <div className="field-wrapper flex flex-grow">
                            <input
                              type="text"
                              name="meta_title"
                              value={productDetail.meta_title}
                              onChange={handleProduct}
                            />
                            <div className="field-border" />
                          </div>
                        </div>
                        <div className="form-field-container null">
                          <label htmlFor="meta_keywords">Meta keywords</label>
                          <CreatableSelect
                            isMulti
                            value={createdOptions}
                            onChange={handleCreateChange}
                            placeholder="Type a keyword and press enter"
                            id="meta-keywords"
                            name="meta_keywords"
                          />
                        </div>
                        <div className="form-field-container null">
                          <label htmlFor="meta_description">
                            Meta description
                          </label>
                          <div className="field-wrapper flex flex-grow">
                            <textarea
                              type="text"
                              className="form-field"
                              id="meta_description"
                              name="meta_description"
                              value={productDetail.meta_description}
                              onChange={handleProduct}
                            />
                            <div className="field-border" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-2 auto-rows-max">
                <div className="card shadow subdued">
                  <div className="flex justify-between card-header">
                    <h2 className="card-title">Product status</h2>
                  </div>
                  <div className="card-section border-b box-border">
                    <div className="card-session-content pt-lg">
                      <div className="form-field-container null">
                        <label htmlFor="status">Status</label>
                        <div className="card-session-content pt-lg">
                          <div className="form-field-container null">
                            <div className="field-wrapper radio-field">
                              <div>
                                <label htmlFor="status0" className="flex">
                                  <input
                                    type="radio"
                                    name="status"
                                    id="status0"
                                    value={0}
                                    checked={productDetail.status === 0}
                                    onChange={(e) =>
                                      setProductDetail((option) => ({
                                        ...option,
                                        status: 0,
                                      }))
                                    }
                                  />
                                  <span className="radio-checked">
                                    <span />
                                  </span>
                                  <span className="pl-1">Disabled</span>
                                </label>
                              </div>
                              <div>
                                <label htmlFor="status1" className="flex">
                                  <input
                                    type="radio"
                                    name="status"
                                    id="status1"
                                    value={1}
                                    checked={productDetail.status === 1}
                                    onChange={(e) =>
                                      setProductDetail((option) => ({
                                        ...option,
                                        status: 1,
                                      }))
                                    }
                                  />
                                  <span className="radio-checked">
                                    <span />
                                  </span>
                                  <span className="pl-1">Enabled</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-section border-b box-border">
                    <div className="card-session-content pt-lg">
                      <div className="form-field-container null">
                        <label htmlFor="visibility">Visibility</label>
                        <div className="field-wrapper radio-field">
                          <div>
                            <label htmlFor="Visibility0" className="flex">
                              <input
                                type="radio"
                                name="visibility"
                                id="Visibility0"
                                value={0}
                                checked={productDetail.visibility === 0}
                                onChange={(e) =>
                                  setProductDetail((option) => ({
                                    ...option,
                                    visibility: 0,
                                  }))
                                }
                              />
                              <span className="radio-checked">
                                <span />
                              </span>
                              <span className="pl-1">Not visible</span>
                            </label>
                          </div>
                          <div>
                            <label htmlFor="Visibility1" className="flex">
                              <input
                                type="radio"
                                name="visibility"
                                id="Visibility1"
                                value={1}
                                checked={productDetail.visibility === 1}
                                onChange={(e) =>
                                  setProductDetail((option) => ({
                                    ...option,
                                    visibility: 1,
                                  }))
                                }
                              />
                              <span className="radio-checked">
                                <span />
                              </span>
                              <span className="pl-1">Visible</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card shadow subdued">
                  <div className="flex justify-between card-header">
                    <h2 className="card-title">Inventory</h2>
                  </div>
                  <div className="card-section border-b box-border">
                    <div className="card-session-content pt-lg">
                      <div className="form-field-container null">
                        <label htmlFor="manage_stock">Manage stock?</label>
                        <div className="field-wrapper radio-field">
                          <div>
                            <label htmlFor="stock0" className="flex">
                              <input
                                type="radio"
                                name="stock"
                                id="stock0"
                                value={0}
                                checked={productDetail.manage_stock === 0}
                                onChange={(e) =>
                                  setProductDetail((option) => ({
                                    ...option,
                                    manage_stock: 0,
                                  }))
                                }
                              />
                              <span className="radio-checked">
                                <span />
                              </span>
                              <span className="pl-1">No</span>
                            </label>
                          </div>
                          <div>
                            <label htmlFor="stock1" className="flex">
                              <input
                                type="radio"
                                name="stock"
                                id="stock1"
                                value={1}
                                checked={productDetail.manage_stock === 1}
                                onChange={(e) =>
                                  setProductDetail((option) => ({
                                    ...option,
                                    manage_stock: 1,
                                  }))
                                }
                              />
                              <span className="radio-checked">
                                <span />
                              </span>
                              <span className="pl-1">Yes</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-section border-b box-border">
                    <div className="card-session-content pt-lg">
                      <div className="form-field-container null">
                        <label htmlFor="stock_availability">
                          Stock availability
                        </label>
                        <div className="field-wrapper radio-field">
                          <div>
                            <label
                              htmlFor="stock_availability0"
                              className="flex"
                            >
                              <input
                                type="radio"
                                name="stock_availability"
                                id="stock_availability0"
                                value={1}
                                checked={productDetail.stock_availability === 0}
                                onChange={(e) =>
                                  setProductDetail((option) => ({
                                    ...option,
                                    stock_availability: 0,
                                  }))
                                }
                              />
                              <span className="radio-checked">
                                <span />
                              </span>
                              <span className="pl-1">No</span>
                            </label>
                          </div>
                          <div>
                            <label
                              htmlFor="stock_availability1"
                              className="flex"
                            >
                              <input
                                type="radio"
                                name="stock_availability"
                                id="stock_availability1"
                                value={1}
                                checked={productDetail.stock_availability === 1}
                                onChange={(e) =>
                                  setProductDetail((option) => ({
                                    ...option,
                                    stock_availability: 1,
                                  }))
                                }
                              />
                              <span className="radio-checked">
                                <span />
                              </span>
                              <span className="pl-1">Yes</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-section border-b box-border">
                    <div className="card-session-content pt-lg">
                      <div className="form-field-container null">
                        <label htmlFor="quantity">Quantity</label>
                        <div className="field-wrapper flex flex-grow">
                          <input
                            type="text"
                            name="quantity"
                            placeholder="Quantity"
                            value={productDetail.quantity}
                            onChange={(e) =>
                              setProductDetail((option) => ({
                                ...option,
                                quantity: e.target.value,
                              }))
                            }
                          />
                          <div className="field-border" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card shadow">
                  <div className="card-section border-b box-border">
                    <div className="flex justify-between card-section-header mb-1">
                      <h3 className="card-session-title">Attributes</h3>
                    </div>
                    <div className="card-session-content pt-lg">
                      <table className="table table-auto">
                        <tbody>
                          <tr>
                            <td>Size</td>
                            <td>
                              <input
                                type="hidden"
                                defaultValue="size"
                                name="attributes[0][attribute_code]"
                              />
                              <Select
                                options={yearOptions}
                                value={selectedYearOption}
                                onChange={handleSizeChange}
                                placeholder="Please select"
                                className="form-field"
                                id="attributes[1][value]"
                                name="attributes[1][value]"
                                isMulti
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="card shadow">
                  <div className="card-section">
                    {sizeSkus.map((sizeSku, index) => (
                      <div key={index} className="form-field-container">
                        <h4>{sizeSku.size}</h4>
                        <div className="form-field-container null">
                          <label htmlFor={`sku-${index}`} className="text-2xl">
                            SKU
                          </label>
                          <div className="field-wrapper flex flex-grow">
                            <input
                              type="text"
                              id={`sku-${index}`}
                              value={sizeSku.sku}
                              onChange={(e) =>
                                handleSizeSkuChange(index, e.target.value)
                              }
                              placeholder="Enter SKU"
                              className="form-field"
                            />
                            <div className="field-border" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-submit-button flex border-t border-divider mt-15 pt-15 justify-between">
              <button type="button" className="button critical outline">
                <span>Cancel</span>
              </button>
              <button
                type="button"
                className="button primary"
                onClick={handleSubmit}
              >
                <span>{isEditMode ? "Update" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    authUserDetails: state.auth.userInfo,
  };
};
export default connect(mapStateToProps)(NewProduct);
