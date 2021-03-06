import React, { Component } from 'react';
import Carousel from 'nuka-carousel';
import rightArrow from '../../assets/rightArrow.svg';
import './instagram.scss';
export default class InstagramPosts extends Component {
  state = {
    posts: [],
    windowWidth: 0,
  };
  componentDidMount() {
    fetch('https://www.instagram.com/wereadafrican/?__a=1')
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          posts: data.graphql.user.edge_owner_to_timeline_media.edges.filter(
            (item, index) => index < 10
          ),
        });
      });
    window.addEventListener('resize', this.updateDimensions);
  }
  updateDimensions = () => {
    let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    this.setState({ windowWidth });
  };
  render() {
    return this.state.posts.length !== 0 ? (
      <div className="instagram-posts">
        <div className="shadow"></div>
        <Carousel
          renderCenterLeftControls={({ previousSlide }) =>
            this.state.windowWidth < 400 ? null : (
              <button className="ctrl-btn prev" onClick={previousSlide}>
                <img src={rightArrow} alt="" />
              </button>
            )
          }
          renderCenterRightControls={({ nextSlide }) =>
            this.state.windowWidth < 400 ? null : (
              <button className="ctrl-btn next" onClick={nextSlide}>
                <img src={rightArrow} alt="" />
              </button>
            )
          }
          slidesToShow={
            this.state.windowWidth < 400
              ? 2
              : this.state.windowWidth < 500
              ? 3
              : this.state.windowWidth < 700
              ? 4
              : 7
          }
        >
          {this.state.posts.map((item, index) => (
            <div key={index} className="post">
              <img
                src={item.node.thumbnail_src}
                height="180px"
                width="150px"
                alt="post"
              />
            </div>
          ))}
        </Carousel>
      </div>
    ) : (
      <div className="no-post">
        <span>No Post From IG Yet</span>
      </div>
    );
  }
}
