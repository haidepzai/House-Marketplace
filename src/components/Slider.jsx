import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { orderBy, limit } from "firebase/firestore";

import Spinner from "./Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import useFetchListings from "../hooks/useFetchListings";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function Slider() {
  const navigate = useNavigate();

  const constraints = useMemo(
    () => [orderBy("timestamp", "desc"), limit(5)],
    []
  );

  const { listings, loading } = useFetchListings({
    constraints: constraints,
  });

  if (loading) return <Spinner />;
  if (listings.length === 0) return null;

  return (
    <div>
      <p className="exploreHeading">Recommended</p>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
      >
        {listings.map(({ data, id }) => (
          <SwiperSlide
            key={id}
            onClick={() => navigate(`/category/${data.type}/${id}`)}
          >
            <div
              style={{
                background: `url(${data.imgUrls[0]}) center no-repeat`,
                backgroundSize: "cover",
                padding: "150px",
              }}
              className="swipeSlideDiv"
            >
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                ${data.discountedPrice ?? data.regularPrice}{" "}
                {data.type === "rent" && "/month"}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Slider;
