import Carousel, { arrowsPlugin, slidesToShowPlugin } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React from 'react';
import { useCarouselStyles } from "./carousel.style";


interface ArrowProps {
    disabled?: boolean;
    type: 'left' | 'right';
}

// TODO: Add grayscale. Fix Icon
const Arrow: React.FC<ArrowProps> = ({ disabled, type }) => {
    const classes = useCarouselStyles();

    return (
        <div className={classes.arrowIcon}>
            {type === 'left' ? <ArrowBackIosIcon fontSize="large" /> : <ArrowForwardIosIcon fontSize="large" />}
        </div>
    );
}

export const CarouselContainer: React.FC = ({ children }) => (
    <Carousel
        plugins={[
            'infinite',
            {
                resolve: slidesToShowPlugin,
                options: {
                 numberOfSlides: 2
                }
              },
            {
                resolve: arrowsPlugin,
                options: {
                    arrowLeft: <Arrow type="left" />,
                    arrowLeftDisabled: <Arrow type="left" />,
                    arrowRight: <Arrow type="right" />,
                    arrowRightDisabled: <Arrow type="right" />,
                    addArrowClickHandler: true,
                }
            },
        ]}
        >
            {children}
    </Carousel>
);