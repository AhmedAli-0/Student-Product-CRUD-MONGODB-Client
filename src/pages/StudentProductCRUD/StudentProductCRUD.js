import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelectDataContext } from '../../contexts/AuthContext';
import { DeleteOutlined, EditOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Modal, Space, Spin, Tooltip, message } from 'antd';
import axios from 'axios';

const inputDataInitialState = {
  firstName: "",
  lastName: "",
  age: 0,
  courses: [],
  address: {
    street: "",
    city: "",
    zip: 0,
    state: "",
  },
};

const inputData1InitialState = {
  name: "",
  price: 0,
  category: "",
  tags: [],
  specifications: {
    weight: "",
    dimensions: {
      width: 0,
      heigth: 0,
      depth: 0,
    },
  },
};

export default function StudentProductCRUD() {

  const { selectedData } = useSelectDataContext();
  const [isLoading, setIsLoading] = useState(true);
  const [getData, setGetData] = useState([]);
  const [inputData, setInputData] = useState(inputDataInitialState);
  const [input1Data, setInput1Data] = useState(inputData1InitialState);
  const [isUpdate, setIsUpdate] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [input1Value, setInput1Value] = useState('');
  const [tags, setTags] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInput1Change = (e) => {
    setInput1Value(e.target.value);
  };

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };
  const handle1Change = (e) => {
    setInput1Data({ ...input1Data, [e.target.name]: e.target.value });
  };

  // for Object
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => {
      // Clone the previous state to ensure immutability
      const newData = { ...prevData };

      // Split the name attribute by dots to access nested properties
      const nameParts = name.split('.');

      // Update the nested property using a loop
      let currentObj = newData;
      for (let i = 0; i < nameParts.length - 1; i++) {
        currentObj = currentObj[nameParts[i]];
      }
      currentObj[nameParts[nameParts.length - 1]] = value;

      return newData;
    });
  };

  const handleSpecificationsChange = (e) => {
    const { name, value } = e.target;
    setInput1Data((prevData) => {
      const newData = { ...prevData };
      const nameParts = name.split('.');
      let currentObj = newData.specifications;
      for (let i = 1; i < nameParts.length - 1; i++) {
        currentObj = currentObj[nameParts[i]];
      }
      currentObj[nameParts[nameParts.length - 1]] = value;

      return newData;
    });
  };


  const handleInputKeyPress = (e) => {
    if (selectedData === 'student') {
      if (e.key === 'Enter' && inputValue.trim() !== '') {
        if (!inputData.courses.includes(inputValue.trim())) {
          setInputData({
            ...inputData,
            courses: [...inputData.courses, inputValue.trim()]
          });
          setTags([...tags, inputValue.trim()]);
          setInputValue('');
        } else {
          message.info('Course Already Added!');
        }
      }
    }
    if (selectedData === 'product') {
      if (e.key === 'Enter' && input1Value.trim() !== '') {
        if (!input1Data.tags.includes(input1Value.trim())) {
          setInput1Data({
            ...input1Data,
            tags: [...input1Data.tags, input1Value.trim()]
          });
          setTags([...tags, input1Value.trim()]);
          setInput1Value('');
        } else {
          message.info('Tags Already Added!');
        }
      }
    }
  };


  const handleRemoveTag = (tag) => {
    const updatedTags = tags.filter((item) => item !== tag);
    setTags(updatedTags);
  };

  // Modal 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
    message.info('Modal Open!');
  };

  // Create Data
  const handleOk = () => {
    axios
      .post("http://localhost:8000/addStudent", inputData)
      .then((response) => {
        setGetData((inputData) => [...inputData, response.data]);
        setInputData(inputDataInitialState);
        setTags([]);
      })
      .catch((error) => {
        console.error("Error : ", error.massage);
      });
    setIsModalOpen(false);
    message.info('Student Create Successfully!');
  };
  const handle1Ok = () => {
    axios
      .post("http://localhost:8000/addProduct", input1Data)
      .then((response) => {
        setGetData((input1Data) => [...input1Data, response.data]);
        setInput1Data(inputData1InitialState);
        setTags([]);
      })
      .catch((error) => {
        console.error("Error : ", error.massage);
      });
    setIsModalOpen(false);
    message.info('Product Create Successfully!');
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setInputData(inputDataInitialState);
    setInput1Data(inputData1InitialState);
    setTags([]);
    setIsUpdate(false);
    setInputValue('')
    setInput1Value('')
    message.info('Modal Close!');
  };


  // message.info(`WELLCOME in ${selectedData === 'student' ? 'Student' : 'Product'} CRUD`);

  // Read Data
  useEffect(() => {
    axios
      .get(`http://localhost:8000/${selectedData === 'student' ? 'student' : 'product'}`)
      .then((response) => {
        setGetData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error : ", error.massage);
      });
  }, []);


  const handleUpdateStudent = () => {
    axios
      .put("http://localhost:8000/updateStudent/" + inputData._id, inputData)
      .then((response) => {

        const tempUsers = getData.map((userData) => {
          return userData._id !== inputData._id ? userData : inputData;
        });

        setGetData(tempUsers);
        setIsModalOpen(false);
        setInputData(inputDataInitialState);
        setIsUpdate(false);
        setInputValue('')
        message.info('Student Update Successfully!');
      })
      .catch((error) => {
        console.error("Error : ", error.massage);
      });
  };
  const handleUpdateProduct = () => {
    axios
      .put("http://localhost:8000/updateProduct/" + input1Data._id, input1Data)
      .then((response) => {

        const tempUsers = getData.map((userData) => {
          return userData._id !== input1Data._id ? userData : input1Data;
        });

        setGetData(tempUsers);
        setIsModalOpen(false);
        setInput1Data(inputData1InitialState);
        setIsUpdate(false);
        setInput1Value('')
        setTags([]);
        message.info('Product Update Successfully!');
      })
      .catch((error) => {
        console.error("Error : ", error.massage);
      });
  };

  const handleUpdate = (user) => {
    setInput1Data(user);
    setIsModalOpen(true);
    setIsUpdate(true);
    setInput1Value(user.tags);
    message.info('Update Modal Open!');
  };

  // Delete Student
  const handleDelete = (userId) => {
    axios
      .delete(`http://localhost:8000/${selectedData === 'student' ? 'deleteStudent' : 'deleteProduct'}/` + userId)
      .then((response) => {
        const updateData = getData.filter((user) => user._id !== userId);
        setGetData(updateData);
        setIsLoading(false);
        message.info(`${selectedData === 'student' ? 'Student' : 'Product'} Deleted Successfully!`);
      })
      .catch((error) => {
        console.error("Error : ", error.massage)
      });
  };

  const showStudentTable = () => {
    return (
      <>
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Age</th>
            <th>Address</th>
            <th>Courses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="6" className="text-center my-5 py-5">
                <Spin tip="Loading" size="large">
                  <div className="content bg-secondary" />
                </Spin>
              </td>
            </tr>
          ) : (
            getData.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.firstName + " " + user.lastName}</td>
                <td>{user.age}</td>
                <td>{user.address.street + " " + user.address.city + " " + user.address.zip + " " + user.address.state}</td>
                <td>{user.courses.join(', ')}</td>
                <td>
                  <Space>
                    <Tooltip title="Edit">
                      <Button type="primary" icon={<EditOutlined />}
                        onClick={() => { handleUpdate(user) }}
                      />
                    </Tooltip>
                    <Tooltip title="Delete" color="red">
                      <Button danger className='bg-danger text-white' icon={<DeleteOutlined />}
                        onClick={() => { handleDelete(user._id) }}
                      />
                    </Tooltip>
                  </Space>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </>
    )
  }


  const showProductTable = () => {
    return (
      <>
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Tags</th>
            <th>Weight</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="7" className="text-center my-5 py-5">
                <Spin tip="Loading" size="large">
                  <div className="content bg-secondary" />
                </Spin>
              </td>
            </tr>
          ) : (
            getData.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.price}</td>
                <td>{user.category}</td>
                <td>{user.tags.join(', ')}</td>
                <td>{user.specifications.weight}</td>
                <td>
                  <Space>
                    <Tooltip title="Edit">
                      <Button type="primary" icon={<EditOutlined />}
                        onClick={() => { handleUpdate(user) }}
                      />
                    </Tooltip>
                    <Tooltip title="Delete" color="red">
                      <Button danger className='bg-danger text-white' icon={<DeleteOutlined />}
                        onClick={() => { handleDelete(user._id) }}
                      />
                    </Tooltip>
                  </Space>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </>
    )
  }

  return (
    <>
      <div className="container pt-5">
        <div className="row pt-5">
          <div className="col d-flex justify-content-between align-items-center">
            <h2 className='d-inline-block'>All {selectedData === 'student' ? "Student" : "Product"} List</h2>
            <button className='btn btn-secondary mb-2'>
              <Link className='text-decoration-none text-white fw-bold' onClick={showModal}>Add New {selectedData === 'student' ? "Student" : "Product"}</Link>
            </button>
          </div>
        </div>

        {/* Modal */}
        <Modal
          open={isModalOpen}
          className='w-50 custom-modal text-white'
          closeIcon={<CloseCircleOutlined style={{ color: 'white' }} onClick={handleCancel} />}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary"
              onClick={() => {
                if (selectedData === 'student' && isUpdate) {
                  handleUpdateStudent();
                } else if (selectedData === 'student' && !isUpdate) {
                  handleOk();
                } else if (selectedData === 'product' && isUpdate) {
                  handleUpdateProduct();
                } else {
                  handle1Ok();
                }
              }}>

              {isUpdate ? 'UPDATE' : 'ADD'} {selectedData === 'student' ? 'Student' : 'Product'}
            </Button>,
          ]}
        >
          <h2 className='text-center'>Input {selectedData === 'student' ? "Student" : "Product"} Field</h2>
          <Divider className='bg-light my-3' />

          {selectedData === 'student' ?
            <div className="container">
              <div className="mb-3 row">
                <label htmlFor="staticFirstName" className="col-sm-2 col-form-label text-center">First Name:</label>
                <div className="col-sm-4 ps-0">
                  <input type="text"
                    name="firstName"
                    value={inputData.firstName}
                    onChange={(e) => handleChange(e)}
                    className="form-control form-control-sm"
                    id="staticFirstName"
                    placeholder='Input First Name' required />
                </div>
                <label htmlFor="staticLastName" className="col-sm-2 col-form-label text-center">Last Name:</label>
                <div className="col-sm-4 ps-0">
                  <input type="text"
                    name="lastName"
                    value={inputData.lastName}
                    onChange={(e) => handleChange(e)}
                    className="form-control form-control-sm"
                    id="staticLastName"
                    placeholder='Input Last Name' required />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="staticAge" className="col-sm-2 col-form-label text-center">Age:</label>
                <div className="col-sm-4 ps-0">
                  <input type="number"
                    name="age"
                    value={inputData.age}
                    onChange={(e) => handleChange(e)}
                    className="form-control form-control-sm"
                    id="staticAge"
                    placeholder='Input Your Age'
                    min="0" />
                </div>
              </div>
              <div className="row">
                <div className="col text-center">
                  <Divider className='mt-0 mb-2' style={{ borderColor: 'white', color: 'white' }}>Address</Divider>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="staticStreet" className="col-sm-2 col-form-label text-center">Your Street:</label>
                <div className="col-sm-4 ps-0">
                  <input type="text"
                    name="address.street"
                    value={inputData.address.street}
                    onChange={(e) => handleAddressChange(e)}
                    className="form-control form-control-sm"
                    id="staticStreet"
                    placeholder='Input Your Street' />
                </div>
                <label htmlFor="staticCity" className="col-sm-2 col-form-label text-center">Your City:</label>
                <div className="col-sm-4 ps-0">
                  <input type="text" name="address.city" value={inputData.address.city} onChange={(e) => handleAddressChange(e)} className="form-control form-control-sm" id="staticCity" placeholder='Input Your City' />
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="staticZip" className="col-sm-2 col-form-label text-center">Your Zip:</label>
                <div className="col-sm-4 ps-0">
                  <input type="number" name="address.zip" value={inputData.address.zip} onChange={(e) => handleAddressChange(e)} className="form-control form-control-sm" id="staticZip" placeholder='Input Your Zip' min="0" />
                </div>
                <label htmlFor="staticState" className="col-sm-2 col-form-label text-center">Your State:</label>
                <div className="col-sm-4 ps-0">
                  <input type="text" name="address.state" value={inputData.address.state} onChange={(e) => handleAddressChange(e)} className="form-control form-control-sm" id="staticState" placeholder='Input Your State' />
                </div>
              </div>

              <div className="row">
                <div className="col text-center">
                  <Divider className='mt-0 mb-2' style={{ borderColor: 'white', color: 'white' }}>Courses</Divider>
                </div>
              </div>
              <div className="row">
                <label htmlFor="staticCourses" className="col-sm-2 col-form-label text-center">Your Courses:</label>
                <div className="col-sm-10 ps-0">
                  <input type="text" className="form-control form-control-sm"
                    id="staticCourses" placeholder='Input Your Courses and Press Enter'
                    onKeyPress={handleInputKeyPress}
                    value={inputValue}
                    onChange={handleInputChange} />
                </div>
              </div>
            </div>
            :
            <div className="container">
              <div className="mb-3 row">
                <label htmlFor="staticName" className="col-sm-2 col-form-label text-center">Name:</label>
                <div className="col-sm-4 ps-0">
                  <input type="text"
                    name="name"
                    value={input1Data.name}
                    onChange={(e) => handle1Change(e)}
                    className="form-control form-control-sm"
                    id="staticName"
                    placeholder='Input Product Name' required />
                </div>
                <label htmlFor="staticPrice" className="col-sm-2 col-form-label text-center">Enter Price:</label>
                <div className="col-sm-4 ps-0">
                  <input type="number"
                    name="price"
                    value={input1Data.price}
                    onChange={(e) => handle1Change(e)}
                    className="form-control form-control-sm"
                    id="staticPrice"
                    placeholder='Input Your Price'
                    min="0" />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="staticCategory" className="col-sm-2 col-form-label text-center">Category:</label>
                <div className="col-sm-4 ps-0">
                  <input type="text"
                    name="category"
                    value={input1Data.category}
                    onChange={(e) => handle1Change(e)}
                    className="form-control form-control-sm"
                    id="staticCategory"
                    placeholder='Input Product Category' />
                </div>
              </div>
              <div className="row">
                <div className="col text-center">
                  <Divider className='mt-0 mb-2' style={{ borderColor: 'white', color: 'white' }}>Specifications</Divider>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="staticWeight" className="col-sm-2 col-form-label text-center">Weight:</label>
                <div className="col-sm-4 ps-0">
                  <input type="text" name="specifications.weight" value={input1Data.specifications.weight} onChange={(e) => handleSpecificationsChange(e)} className="form-control form-control-sm" id="staticWeight" placeholder='Input Product Weight' />
                </div>
              </div>
              <div className="row w-50 mx-auto">
                <div className="col text-center">
                  <Divider className='mt-0 mb-2' style={{ borderColor: 'white', color: 'white' }}>Dimensions</Divider>
                </div>
              </div>
              <div className="row">
                <label htmlFor="staticWidth" className="col-sm-2 col-form-label text-center">Width:</label>
                <div className="col-sm-2 ps-0">
                  <input type="number" name="specifications.dimensions.width" value={input1Data.specifications.dimensions.width} onChange={(e) => handleSpecificationsChange(e)} className="form-control form-control-sm" id="staticWidth" placeholder='Input Product Width' min="0" />
                </div>
                <label htmlFor="staticHeigth" className="col-sm-2 col-form-label text-center">Heigth:</label>
                <div className="col-sm-2 ps-0">
                  <input type="number" name="specifications.dimensions.heigth" value={input1Data.specifications.dimensions.heigth} onChange={(e) => handleSpecificationsChange(e)} className="form-control form-control-sm" id="staticHeigth" placeholder='Input Product Heigth' min="0" />
                </div>
                <label htmlFor="staticDepth" className="col-sm-2 col-form-label text-center">Depth:</label>
                <div className="col-sm-2 ps-0">
                  <input type="number" name="specifications.dimensions.depth" value={input1Data.specifications.dimensions.depth} onChange={(e) => handleSpecificationsChange(e)} className="form-control form-control-sm" id="staticDepth" placeholder='Input Product Depth' min="0" />
                </div>
              </div>
              <div className="row">
                <div className="col text-center">
                  <Divider className='mt-0 mb-2' style={{ borderColor: 'white', color: 'white' }}>Tags</Divider>
                </div>
              </div>
              <div className="row">
                <label htmlFor="staticTags" className="col-sm-2 col-form-label text-center">Your Tags:</label>
                <div className="col-sm-10 ps-0">
                  <input type="text" className="form-control form-control-sm"
                    name='tags'
                    id="staticTags" placeholder='Input Your Tag and Press Enter'
                    onKeyPress={handleInputKeyPress}
                    value={input1Value}
                    onChange={handleInput1Change} />
                </div>
              </div>
            </div>
          }
          <div className='w-50 text-center mx-auto'>
            <Divider className='bg-light my-0 mt-1' />
            {tags.map((tag, index) => (
              <span key={index} className="tag fs-4">
                {tag}
                <CloseCircleOutlined className='ms-1 me-3 fs-6' style={{ color: 'white' }} onClick={() => handleRemoveTag(tag)} />
              </span>
            ))}
            <Divider className='bg-light my-0' />
          </div>


        </Modal>
        <Divider className='bg-light mt-0' />

        <div className="row">
          <div className="col">
            <div className="table-responsive">
              <table className="table table-striped table-hover table-dark table-bordered text-center align-middle">
                {selectedData === 'student' ? showStudentTable() : showProductTable()}
              </table>
            </div>
          </div>
        </div>

        <Divider className='bg-light mt-2 mb-4' />

        <div className="row mb-5">
          <div className="col d-flex justify-content-center">
            <button className='btn btn-secondary w-25'>
              <Link to="/" className='text-decoration-none text-white fw-bold'>Back To Home</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
