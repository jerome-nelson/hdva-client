import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import * as React from 'react';
 
export const CustomIcons: React.SFC<SvgIconProps> = ({ children, ...props }) => (
        <SvgIcon {...props}>
            {children}
        </SvgIcon>
);
