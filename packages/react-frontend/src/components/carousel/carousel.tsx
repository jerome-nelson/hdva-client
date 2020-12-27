import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import classNames from "classnames";
import { useCarouselStyles } from 'components/carousel/carousel.style';
import { messages } from 'config/en';
import { ButtonBack, ButtonNext, CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import React from 'react';
import { STYLE_OVERRIDES } from 'theme';
import { useElementSize } from "../../hooks/useElement";



interface ArrowProps {
    disabled?: boolean;
    type: string;
}

// TODO: Add grayscale. Fix Icon
const Arrow: React.FC<ArrowProps> = ({ disabled, type }) => {
    const classes = useCarouselStyles();
    const disabledClass = classNames({
        [classes.slideFull]: Boolean(disabled)
    });
    return (
        <React.Fragment>
            {type === 'left' ?
                <ArrowBackIosIcon
                    className={disabledClass}
                    color="action"
                    fontSize="large"
                /> :
                <ArrowForwardIosIcon
                    className={disabledClass}
                    color="action"
                    fontSize="large"
                />
            }
        </React.Fragment>
    );
}

export const NoImagePlaceholder = () => {
    const classes = useCarouselStyles();
    return (
        <div className={classes.imageCard}>
            <BrokenImageIcon color="disabled" className={classes.imageIcon} />
            {messages["no.image"]}
        </div>
    );
}

export const CarouselContainer: React.FC = ({ children }) => {
    const classes = useCarouselStyles();
    const elemSize = useElementSize("slider-elem");
    const count = React.Children.count(children);
    const match = elemSize && elemSize.width;
    const totalSlides = match && (match / STYLE_OVERRIDES.carousel.itemWidth);
    const slidesToShow = totalSlides && (totalSlides > count) ? count : totalSlides;

    const slides = React.Children.map(children, (child, index) => (
        <Slide className={classes.slides} index={index}>{child}</Slide>
    ));

    console.log(`Slides to show: ${slidesToShow}, match: ${match}, totalSlides: ${totalSlides}`);

    return (
        <CarouselProvider
            className={classes.carousel}
            visibleSlides={slidesToShow}
            hasMasterSpinner
            lockOnWindowScroll
            isIntrinsicHeight
            touchEnabled
            dragEnabled
            infinite
            naturalSlideHeight={STYLE_OVERRIDES.carousel.itemHeight}
            naturalSlideWidth={STYLE_OVERRIDES.carousel.itemWidth}
            totalSlides={count}
        >
            <Slider
                id="slider-elem">
                {slides}
            </Slider>
            <ButtonBack
                className={`${classes.slideBtn} ${classes.slideLeft} ${classNames({
                    [classes.slideFull]: Boolean(totalSlides && (totalSlides >= count))
                })}`}>
                <Arrow type="left" />
            </ButtonBack>
            <ButtonNext
                className={`${classes.slideBtn} ${classes.slideRight} ${classNames({
                    [classes.slideFull]: Boolean(totalSlides && (totalSlides >= count))
                })}`}>
                <Arrow type="right" />
            </ButtonNext>
        </CarouselProvider>
    )
}