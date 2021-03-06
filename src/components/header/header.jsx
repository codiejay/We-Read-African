import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import UserDropdown from "../user-dropdown/user-dropdown";
import CustomButton from "../custom-button/custom-button";
import UserPreview from "../user-preview/user-preview";
import instagram from "../../assets/socials/instagram.svg";
import twitter from "../../assets/socials/twitter.svg";
import facebook from "../../assets/socials/facebook.svg";
import search from "../../assets/search.svg";
import logo from "../../assets/logo.svg";
import "./header.scss";
const Header = ({ currentUser, showSearch, history }) => {
  const [isShow, setisShow] = useState(false);
  const handleToggleUserDropdown = () => {
    setisShow(!isShow);
  };

  return (
    <header className="header">
      {currentUser ? null : (
        <div className="join-tribe">
          <p>
            Join the WeReadAfrican Tribe. Register to be a part of the forum.
          </p>
          <a href="https://forum.wereadafrican.com/#/signup">
            <CustomButton acen>Register</CustomButton>
          </a>
        </div>
      )}
      <div className="branding container">
        <div className="social">
          <img className="icon" src={instagram} alt="Instagram Icon" />

          <img className="icon" src={twitter} alt="Twitter Icon" />

          <img className="icon" src={facebook} alt="Facebook Icon" />
        </div>
        <div className="brand">
          <Link to="/">
            {" "}
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="controls">
          <span className="search">
            <img src={search} alt="Search Icon" onClick={showSearch} />
          </span>

          {currentUser ? (
            <div onClick={handleToggleUserDropdown}>
              <UserPreview currentUser={currentUser} arrowD />
              {isShow ? <UserDropdown /> : null}
            </div>
          ) : (
            <span className="buton">
              <a href="https://forum.wereadafrican.com/#/signin">
                <CustomButton acen>Log In / Register</CustomButton>
              </a>
            </span>
          )}
        </div>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              className="nav-link"
              style={
                history.location.pathname === "/"
                  ? { borderBottom: "3px solid #77323b" }
                  : { border: "none" }
              }
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="nav-link"
              style={
                history.location.pathname === "/about"
                  ? { borderBottom: "3px solid #77323b" }
                  : { border: "none" }
              }
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              className="nav-link"
              style={
                history.location.pathname.includes("/blog")
                  ? { borderBottom: "3px solid #77323b" }
                  : { border: "none" }
              }
            >
              Blog
            </Link>
          </li>
          <li>
            <a
              href="https://forum.wereadafrican.com"
              className="nav-link"
              style={
                history.location.pathname === "/forum"
                  ? { borderBottom: "3px solid #77323b" }
                  : { border: "none" }
              }
            >
              Forum
            </a>
          </li>
          <li>
            <Link
              to="/contact"
              className="nav-link"
              style={
                history.location.pathname === "/contact"
                  ? { borderBottom: "3px solid #77323b" }
                  : { border: "none" }
              }
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default withRouter(connect(mapStateToProps)(Header));
