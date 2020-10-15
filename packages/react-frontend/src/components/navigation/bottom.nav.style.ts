import { makeStyles, createStyles, Theme, } from "@material-ui/core"

export const useBottomNavStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            top: 'auto',
            bottom: 0,
        },
    }),
);