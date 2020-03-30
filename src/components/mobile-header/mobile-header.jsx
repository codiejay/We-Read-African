import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import menu from '../../assets/menu.svg';
import logo from '../../assets/logo.svg';
import search from '../../assets/search.svg';
import './mobile-header.scss';
import SideNav from '../side-nav/side-nav';
const MobileHeader = () => {
  const [isShow, setisShow] = useState(false);
  const handleToggleSideNav = () => {
    setisShow(!isShow);
  };
  return (
    <div className="mobile-header">
      <div className="menu">
        {isShow ? null : (
          <img src={menu} alt="Menu Icon" onClick={handleToggleSideNav} />
        )}
      </div>
      <div className="brand">
        <Link to="/">
          {' '}
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <span className="search">
        <img src={search} alt="Search Icon" />
      </span>
      {isShow ? <SideNav handleToggleSideNav={handleToggleSideNav} /> : null}
    </div>
  );
};

export default MobileHeader;
