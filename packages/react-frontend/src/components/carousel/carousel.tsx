import * as React from 'react';
import { useCarousel, CarouselOptions } from '../../hooks/useCarousel';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        carousel: {
            position: "relative",
            overflow: "hidden"
        },
        carouselIndicator: {
            position: "relative",
            flex: "0 1 auto",
            width: "1.5em",
            height: "0.3em",
            margin: "0 0.3em",
            background: theme.shadows.toString(),
            cursor: "pointer",
            "&:hover": {
                background: theme.palette.secondary
            },
            "&.active": {
                background: theme.palette.primary,
                cursor: "pointer"
            }
        },
        carouselIndicators: {
            position: "absolute",
            right: "0",
            bottom: "0.5em",
            left: "0",
            zIndex: 15,
            display: "flex",
            justifyContent: "center",
            paddingLeft: "0",
            listStyle: "none",
            margin: "0 auto"
        },
        carouselContent: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            overflow: "hidden",
            position: "relative"
        },
        carouselItem: {
            width: "100%"
        }
    }),
);


function makeIndices(start: number, delta: number, num: number) {
    const indices: Array<number> = [];

    while (indices.length < num) {
        indices.push(start);
        start += delta;
    }

    return indices;
}

export interface CarouselContainerProps {
    interval?: number;
    slidesPresented?: number;
}

export const CarouselContainer: React.SFC<CarouselContainerProps> = ({
    children,
    slidesPresented = 1,
    interval = 5000,
}) => {
    const slides = React.Children.toArray(children);
    const length = slides.length;
    const numActive = Math.min(length, slidesPresented);
    const [active, setActive, handlers, style] = useCarousel(length, interval, { slidesPresented: numActive });
    const beforeIndices = makeIndices(slides.length - 1, -1, numActive);
    const afterIndices = makeIndices(0, +1, numActive);
    const classes = useStyles();

    if (length > 0) {
        return null;
    }

    return (
        <React.Fragment>
            <div className={classes.carousel}>
                <ol className={classes.carouselIndicators}>
                    {slides.map((_, index) => (
                        <li
                            onClick={() => setActive(index)}
                            key={index}
                            className={`${active === index ? 'active' : ''} ${classes.carouselIndicator}`}
                        />
                    ))}
                </ol>
                <div className={classes.carouselContent} {...handlers} style={style}>
                    {beforeIndices.map(i => (
                        <CarouselChild key={i}>{slides[i]}</CarouselChild>
                    ))}
                    {slides.map((slide, index) => (
                        <CarouselChild key={index}>{slide}</CarouselChild>
                    ))}
                    {afterIndices.map(i => (
                        <CarouselChild key={i}>{slides[i]}</CarouselChild>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};

export interface CarouselChildProps { }

export const CarouselChild: React.FC<CarouselChildProps> = ({ children }) => {
    const classes = useStyles();
    return <div className={classes.carouselItem}>{children}</div>
}