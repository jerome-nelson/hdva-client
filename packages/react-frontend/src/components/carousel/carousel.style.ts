import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES, STYLE_OVERRIDES } from "theme";

export interface PlaceholderProps {
    thumbnail?: boolean;
}

export const useCarouselStyles = makeStyles((theme: Theme) => {
    return createStyles({
        imageCard: {
            textAlign: `center`,
            color: COLOR_OVERRIDES.hdva_grey,
            fontSize: `${theme.spacing(2.5)}px`,
            backgroundColor: COLOR_OVERRIDES.hdva_grey_light,
            height: (props: PlaceholderProps) => props.thumbnail ? STYLE_OVERRIDES.thumbnail : STYLE_OVERRIDES.carousel.imageHeight,
            width: (props: PlaceholderProps) => props.thumbnail ? STYLE_OVERRIDES.thumbnail : STYLE_OVERRIDES.carousel.itemWidth
        },
        slides: {
            margin: `0 auto`,
            [theme.breakpoints.up('sm')]: {
                marginRight: `${theme.spacing(2)}px`
            }
        },
        imageIcon: {
            color: COLOR_OVERRIDES.hdva_grey,
            display: 'block',
            margin: `0 auto`,
            paddingTop: (props: PlaceholderProps) => props.thumbnail ? `5px` : `inherit`,
            fontSize: (props: PlaceholderProps) => props.thumbnail ? `40px` : `${theme.spacing(24)}px`
        },
        carousel: {
            position: "relative",
        },
        slideBtn: {
            position: "absolute",
            top: "50%",
            marginTop: `-${theme.spacing(4)}px`,
            height: `${theme.spacing(8)}px`,
            width: `${theme.spacing(8)}px`,
            background: COLOR_OVERRIDES.hdva_black,
            borderRadius: `50%`,
            margin: `0`,
            padding: `0`,
            border: `none`,
        },
        slideLeft: {
            left: `${theme.spacing(2)}px`
        },
        slideRight: {
            right: `${theme.spacing(2)}px`
        },
        slideFull: {
            visibility: "hidden"
        }
    });
});