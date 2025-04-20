import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './HomeCarousel.css';

const HomeCarousel = () => {
  return (
    <Carousel className="home-carousel">
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/college.jpeg"
          alt="Hostel View"
        />
        <Carousel.Caption>
          <h3>Welcome to SNU Hive</h3>
          <p>Your complete hostel management solution</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/DiningHall.png"
          alt="Facilities"
        />
        <Carousel.Caption>
          <h3>Dining Hall</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/hostel.webp"
          alt="Support Services"
        />
        <Carousel.Caption>
          <h3>Hostels</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default HomeCarousel;