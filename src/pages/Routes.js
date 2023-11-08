import { Route, Routes } from 'react-router-dom';
import React from 'react';
import Home from './Home';
import StudentProductCRUD from './StudentProductCRUD/StudentProductCRUD';

export default function Index() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/crud' element={<StudentProductCRUD />} />
            </Routes>
        </>
    )
}
