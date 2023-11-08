import { Card, Divider } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { useSelectDataContext } from '../../contexts/AuthContext';

// import Images
import StudentImage from "../../assets/images/student.jpg"
import ProductImage from "../../assets/images/product.jpg"

export default function Home() {

    const { selectedData, setSelectedData } = useSelectDataContext();

    // message.info('WELLCOME in MONGODB CRUD');

    console.log("selectedData : ", selectedData);
    
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col text-center mt-5 pt-5">
                        <h1>Student - Product CRUD</h1>
                    </div>
                </div>
                <div className="row px-5">
                    <div className="col px-5">
                        <Divider className='bg-light' />
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col d-flex align-items-center justify-content-end pe-5">
                        <Link to="/crud" className='text-decoration-none' onClick={() => setSelectedData("student")}>
                            <Card
                                style={{
                                    width: 300,
                                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0), 0 0 5px 5px #4F494C',
                                }}
                                cover={<img alt="student" src={StudentImage} />}
                            >
                                <h3 className='text-center'>Student CRUD</h3>
                            </Card>
                        </Link>
                    </div>
                    <div className="col d-flex align-items-center justify-content-start ps-5">
                        <Link to="/crud" className='text-decoration-none'>
                            <Card
                                style={{
                                    width: 300,
                                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0), 0 0 5px 5px #4F494C',
                                }}
                                cover={<img alt="product" src={ProductImage} onClick={() => setSelectedData("product")} />}
                            >
                                <h3 className='text-center'>Product CRUD</h3>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
