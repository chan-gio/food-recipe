import React from 'react';
import CustomHeader from '../Header/Header'; // Import header từ component Header
import CustomFooter from '../Footer/Footer'; 
const Layout = ({ children }) => {
  return (
    <div>
      {/* Phần Header sẽ luôn hiển thị */}
      <CustomHeader />

      {/* Phần nội dung trang, sẽ được thay đổi tùy theo route */}
      <main>{children}</main>
      <CustomFooter />
    </div>
  );
};

export default Layout;
