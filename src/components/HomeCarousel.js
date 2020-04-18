import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

class HomeCarousel extends React.Component {
  render() {
    return (
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="./pictures/desert.jpg"
            alt="First slide"
            height="500" width="800"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="./pictures/tree.jpg"
            alt="Third slide"
            height="500" width="800"
          />

          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="./pictures/river.jpg"
            alt="Third slide"
            height="500" width="800"
          />

          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
  }
}

export default HomeCarousel;