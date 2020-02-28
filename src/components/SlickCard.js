import React, {Fragment} from "react";
import Slider from "react-slick";
import {SlickContent} from "./SlickContent";

//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";

const CardElements =()=>{
	const cardEl=[];
	return SlickContent.map((item,index)=>{
		 return <div className={item.className} style={{backgroundImage: item.backgroundImage}}>
	            <div class="card__body">
	                <h5 class="h5 card__title">
						{item.title}
					</h5>
	                <img src="img/cards/card-icon-2.svg" alt="card-icon" class="card__icon"/>
	                <p class="card__link">
	                    Read more
	                </p>
	                <p class="card__text">
	                	{item.text}
	                </p>
            	</div>
            </div>
	})
}


const SlickCard = (props) => {
	  const settings = {
		      dots: false,
		      infinite: true,
		      speed: 600,
		      slidesToShow: 5,
		      slidesToScroll: 1,
		      initialSlide: 0,
		      centerPadding:0,
		      centerMode:true,
		      arrows:false,
		      rows: 1,
		      useTransform:false,
		      responsive: [
		        {
		          breakpoint: 1024,
		          settings: {
		            slidesToShow: 3,
		            slidesToScroll: 3,
		            infinite: true,
		            dots: true
		          }
		        },
		        {
		          breakpoint: 600,
		          settings: {
		            slidesToShow: 2,
		            slidesToScroll: 2,
		            initialSlide: 2
		          }
		        },
		        {
		          breakpoint: 480,
		          settings: {
		            slidesToShow: 1,
		            slidesToScroll: 1
		          }
		        }
		      ]
		    };

		let slider;

		const next=()=> {
    		slider.slickNext();
  		}

  		const previous=()=> {
    		slider.slickPrev();
  		}

   
   return (

   	<div className="page-strip page-strip--extended-top-padding">
		<div className="wrapper wrapper--relative">
			<h2 className="h2 page-strip__title">
				The Principles That Drive Us
			</h2>
			<div className="slider-cards__arrows">
				<button type="button"
				        aria-label="Previous slides"
				        className="arrow arrow--prev" onClick={previous}>
					<i className="icon-arrow-left arrow__icon arrow__icon--light"/>
				</button>
				<button type="button" onClick={next}
				        aria-label="Next slides"
				        className="arrow arrow--next">
					<i className="icon-arrow-right arrow__icon" />
				</button>
			</div>
		</div>
		<div class="wrapper wrapper--full-width">
    		<div class="slider-cards-container">
				<Slider {...settings} className="slider slider-cards" ref={c => (slider = c)}>
					{CardElements()}
				</Slider>
			</div>
		</div>
	</div>
   )
}


export default SlickCard;