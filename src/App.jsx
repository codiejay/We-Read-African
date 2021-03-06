import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  auth,
  firestore,
  createUserProfileDocument,
  convertFavSnapshotToMap,
} from "./firebase/firebase.utils";
import { setCurrentUser } from "./redux/user/user.actions";
import { selectCurrentUser } from "./redux/user/user.selectors";
import { selectAllBlog } from "./redux/blog/blog.selector";
import {
  updateCategories,
  updateBlogComments,
  updateBlogViews,
  setReadersFavorite,
} from "./redux/blog/blog.actions";
import Header from "./components/header/header";
import Search from "./components/searchcomponent/searchcomponent";
import Footer from "./components/footer/footer";
import Loader from "./components/loader/loader";
/*==============================*/
/*PAGES*/
/*==============================*/
import Homepage from "./pages/homepage/homepage";
import Contactpage from "./pages/contactpage/contactpage";
import Aboutpage from "./pages/aboutpage/aboutpage";
import Blogpage from "./pages/blogpage/blogpage";
import NotFound from "./pages/notfoundpage/NotFoundPage";
import MobileHeader from "./components/mobile-header/mobile-header";
import "./App.css";

class App extends React.Component {
  state = {
    isAvailableInYourCountry: false,
    isLoading: true,
    isShowSearch: false,
  };
  unsubscribFromSnapshot = null;
  unSubscribeFromAuth = null;
  componentDidMount() {
    const {
      updateBlogComments,
      updateCategories,
      updateBlogViews,
      setCurrentUser,
      setReadersFavorite,
    } = this.props;
    this.setState({ isLoading: true });
    const blogRef = firestore
      .collection("blog_temp")
      .orderBy("updated_at", "desc");
    const commentRef = firestore.collection("blog_comments");
    const viewRef = firestore.collection("blog_views");
    commentRef.onSnapshot(async (snapshot) => {
      const comments = [];
      snapshot.docs.forEach((doc) => {
        const commentObj = {
          id: doc.id,
          comments: doc.data(),
        };
        comments.push(commentObj);
      });
      updateBlogComments(comments);
    });
    blogRef.onSnapshot(async (snapshot) => {
      const blogs = [];
      snapshot.docs.forEach((doc) => {
        blogs.push(doc.data());
      });
      updateCategories(blogs);
    });
    viewRef.onSnapshot(async (snapshot) => {
      const views = [];
      snapshot.docs.forEach((doc) => {
        const viewObj = {
          id: doc.id,
          view: doc.data(),
        };
        views.push(viewObj);
      });
      const compare = (a, b) => {
        if (a.posted_at > b.posted_at) return 1;
        // if (a.view.views.length < b.view.views.length) return -1;
        return 0;
      };
      const favArrRef = convertFavSnapshotToMap(views);
      const favArr = [];
      this.props.allBlogs.sort(compare).map((blog) => {
        return favArrRef.forEach((item) => {
          if (blog.title.toLowerCase() === item.id) {
            favArr.push(blog);
          }
        });
      });
      setReadersFavorite(favArr);
      updateBlogViews(views);
    });
    this.unSubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      }
      setCurrentUser(userAuth);

      this.setState({
        isLoading: false,
      });
    });
  }
  componentWillUnmount() {
    this.unSubscribeFromAuth();
  }
  handleSearchShow = () => {
    this.setState({ isShowSearch: !this.state.isShowSearch });
  };
  render() {
    const { currentUser, history } = this.props;
    return (
      <div
        className="App"
        style={
          currentUser
            ? { paddingTop: "110px" }
            : history.location.pathname === "/notfound"
            ? { paddingTop: 0 }
            : { paddingTop: "160px" }
        }
      >
        {history.location.pathname === "/signin" ? null : history.location
            .pathname === "/notfound" ? null : history.location.pathname ===
          "/signup" ? null : (
          <div className="showing">
            <div className="desktop">
              <Header showSearch={this.handleSearchShow} />
            </div>
            <div className="mobile">
              <MobileHeader showSearch={this.handleSearchShow} />
            </div>
          </div>
        )}
        {this.state.isShowSearch ? (
          <Search showSearch={this.handleSearchShow} />
        ) : null}
        <div className="wrapper">
          {this.state.isLoading ? (
            <Loader />
          ) : (
            <Switch>
              <Route exact path="/" component={Homepage} />
              <Route path="/blog" component={Blogpage} />
              <Route exact path="/about" component={Aboutpage} />
              <Route exact path="/contact" component={Contactpage} />
              <Route component={NotFound} />
            </Switch>
          )}
        </div>
        {history.location.pathname === "/signin" ? null : history.location
            .pathname === "/signup" ? null : history.location.pathname ===
          "/notfound" ? null : history.location.pathname ===
          "/user-profile" ? null : (
          <Footer />
        )}
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  allBlogs: selectAllBlog,
});
const mapDispatchToProps = (dispatch) => ({
  updateCategories: (collectionsMap) =>
    dispatch(updateCategories(collectionsMap)),
  updateBlogComments: (comment) => dispatch(updateBlogComments(comment)),
  updateBlogViews: (views) => dispatch(updateBlogViews(views)),
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  setReadersFavorite: (fav) => dispatch(setReadersFavorite(fav)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
