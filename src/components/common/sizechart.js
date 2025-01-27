import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { fetchList } from "../apis/services/CommonApiService";
import { ApiEndPoints } from "../apis/ApiEndPoints";
import { createNewMeasurement } from "../apis/services/ProductServices";
import { toast } from "react-toastify";
import Spinner from "../layout/spinner/spinner";

const sizeOptions = [
  { value: "12", label: "12" },
  { value: "14", label: "14" },
  { value: "16", label: "16" },
  { value: "18", label: "18" },
  { value: "20", label: "20" },
  { value: "22", label: "22" },
  { value: "24", label: "24" },
  { value: "26", label: "26" },
  { value: "28", label: "28" },
  { value: "30", label: "30" },
  { value: "32", label: "32" },
  { value: "34", label: "34" },
  { value: "36", label: "36" },
  { value: "38", label: "38" },
  { value: "40", label: "40" },
  { value: "42", label: "42" },
];


const ageOptions = [
  // { value: "6 Month to 12 Month", label: "6 Month to 12 Month" },
  // { value: "1 Year to 2 Year", label: "1 Year to 2 Year" },
  // { value: "2 Year to 3 Year", label: "2 Year to 3 Year" },
  // { value: "3 Year to 4 Year", label: "3 Year to 4 Year" },
  // { value: "4 Year to 5 Year", label: "4 Year to 5 Year" },
  // { value: "5 Year to 6 Year", label: "5 Year to 6 Year" },
  // { value: "6 Year to 7 Year", label: "6 Year to 7 Year" },
  // { value: "7 Year to 8 Year", label: "7 Year to 8 Year" },
  // { value: "8 Year to 9 Year", label: "8 Year to 9 Year" },
  // { value: "9 Year to 10 Year", label: "9 Year to 10 Year" },
  // { value: "10 Year to 11 Year", label: "10 Year to 11 Year" },
  // { value: "11 Year to 12 Year", label: "11 Year to 12 Year" },
  // { value: "12 Year to 13 Year", label: "12 Year to 13 Year" },
  // { value: "13 Year to 14 Year", label: "13 Year to 14 Year" },
  // { value: "14 Year to 15 Year", label: "14 Year to 15 Year" },
  // { value: "15 Year to 16 Year", label: "15 Year to 16 Year" },
  // { value: "16 Year to 17 Year", label: "16 Year to 17 Year" },
  { value: "S", label: "S" },
]

const INIT_FIELD = [
  { size: "", age: "", chest: "", dressLength: "", waist: "", shortLength: "", frokLength: "", topLength: "", skirtLength: "", blouseLength: "", bottomLength: "" }
];

const Sizechart = () => {

  const [productsOptions, setProductsOptions] = useState([])
  const [productsId, setProductsId] = useState("")
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState([
    {
      // size: "",
      age: "",
      chest: "",
      dressLength: "",
      waist: "",
      shortLength: "",
      frokLength: "",
      topLength: "",
      skirtLength: "",
      blouseLength: "",
      bottomLength: ""
    }
  ]);

  const addField = () => {
    setFields([
      ...fields,
      {
        // size: "",
        age: "",
        chest: "",
        dressLength: "",
        waist: "",
        shortLength: "",
        frokLength: "",
        topLength: "",
        skirtLength: "",
        blouseLength: "",
        bottomLength: ""
      }
    ]);
  };

  const handleChange = (index, field, value) => {
    const updatedFields = [...fields];
    updatedFields[index][field] = value;
    setFields(updatedFields);
  };

  const getProductList = useCallback(async () => {
    const result = await fetchList(ApiEndPoints.GET_PRODUCTS);
    console.log(result?.data);

    if (result?.status === 200 && result?.data) {
      const formattedProducts = result.data.map((product) => ({
        value: product._id,
        label: product.name,
      }));

      setProductsOptions(formattedProducts);
    } else {
      setProductsOptions([]);
    }
  }, []);

  useEffect(() => {
    getProductList();
  }, []);

  const handleSubmit = async () => {
    setLoading(true)
    const res = await createNewMeasurement({
      productId: productsId,
      measurements: fields
    })
    if (res?.status === 201 || res?.status === 200) {
      setFields(INIT_FIELD)
      setLoading(false)
      setProductsId("")
      toast.success(res?.message)
    } else {
      setFields(INIT_FIELD)
      setLoading(false)
      setProductsId("")
      toast.error(res?.message);
    }
  }

  return (
    <>
      {loading && <Spinner />}
      <div className="container p-4 mx-auto sm:p-6 lg:p-8">
        <h2 className="mb-2 text-3xl font-semibold">Select Measurements</h2>
        <div className="mb-2">
          <label className="block mb-0 font-medium text-md">Product</label>
          <Select
            options={productsOptions}
            value={productsOptions.find((opt) => opt.value === productsId)}
            onChange={(selected) => setProductsId(selected.value)}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{ zIndex: 10 }}
          />
        </div>
        {fields.map((field, index) => (
          <div key={index} className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <div className="grid gap-5 lg:grid-cols-3">
              {/* <div className="mb-2">
                <label className="block mb-0 font-medium text-md">Size</label>
                <Select
                  options={sizeOptions}
                  value={sizeOptions.find((opt) => opt.value === field.size)}
                  onChange={(selected) => handleChange(index, "size", selected.value)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{ zIndex: 10 }}
                />
              </div> */}
              <div className="mb-2">
                <label className="block mb-0 font-medium text-md">Age</label>
                <Select
                  options={ageOptions}
                  value={ageOptions.find((opt) => opt.value === field.age)}
                  onChange={(selected) => handleChange(index, "age", selected.value)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{ zIndex: 10 }}
                />
              </div>
              <div className="mb-2">
                <label className="block mb-0 font-medium text-md">Chest (in inches)</label>
                <input
                  type="text"
                  value={field.chest}
                  onChange={(e) => handleChange(index, "chest", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  style={{ background: "#fff", border: "1px solid #ccc", zIndex: "0" }}
                />
              </div>
              <div className="mb-2">
                <label className="block mb-0 font-medium text-md">Dress Length (in inches)</label>
                <input
                  type="text"
                  value={field.dressLength}
                  onChange={(e) => handleChange(index, "dressLength", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  style={{ background: "#fff", border: "1px solid #ccc", zIndex: "0" }}
                />
              </div>
              <div className="mb-2">
                <label className="block mb-0 font-medium text-md">Waist (in inches)</label>
                <input
                  type="text"
                  value={field.waist}
                  onChange={(e) => handleChange(index, "waist", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  style={{ background: "#fff", border: "1px solid #ccc", zIndex: "0" }}
                />
              </div>
              <div className="mb-2">
                <label className="block mb-0 font-medium text-md">Short Length (in inches)</label>
                <input
                  type="text"
                  value={field.shortLength}
                  onChange={(e) => handleChange(index, "shortLength", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  style={{ background: "#fff", border: "1px solid #ccc", zIndex: "0" }}
                />
              </div>
              <div className="mb-2">
                <label className="block mb-0 font-medium text-md">Frok Length (in inches)</label>
                <input
                  type="text"
                  value={field.frokLength}
                  onChange={(e) => handleChange(index, "frokLength", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  style={{ background: "#fff", border: "1px solid #ccc", zIndex: "0" }}
                />
              </div>
              <div className="mb-2">
                <label className="block mb-0 font-medium text-md">Top Length(in inches)</label>
                <input
                  type="text"
                  value={field.topLength}
                  onChange={(e) => handleChange(index, "topLength", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  style={{ background: "#fff", border: "1px solid #ccc", zIndex: "0" }}
                />
              </div>
              <div className="mb-2">
                <label className="block mb-0 font-medium text-md">Skirt Length (in inches)</label>
                <input
                  type="text"
                  value={field.skirtLength}
                  onChange={(e) => handleChange(index, "skirtLength", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  style={{ background: "#fff", border: "1px solid #ccc", zIndex: "0" }}
                />
              </div>
              <div className="mb-2">
                <label className="block mb-0 font-medium text-md">Blouse Length (in inches)</label>
                <input
                  type="text"
                  value={field.blouseLength}
                  onChange={(e) => handleChange(index, "blouseLength", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  style={{ background: "#fff", border: "1px solid #ccc", zIndex: "0" }}
                />
              </div>
              <div className="mb-2">
                <label className="block mb-0 font-medium text-md">bottom Length (in inches)</label>
                <input
                  type="text"
                  value={field.bottomLength}
                  onChange={(e) => handleChange(index, "bottomLength", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  style={{ background: "#fff", border: "1px solid #ccc", zIndex: "0" }}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addField}
          className="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
          style={{ background: "#82ca9d", padding: "8px 16px", color: "#fff", marginTop: "20px" }}
        >
          Add Field
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
          style={{ background: "#e5097f", padding: "8px 16px", color: "#fff", marginLeft: "10px" }}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default Sizechart;
