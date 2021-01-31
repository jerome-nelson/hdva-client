import { LoginContext } from "components/login-form/login.context";
import { GenericTable } from "components/table/generic-table";
import { postAPI } from "hooks/useAPI";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

type Property = Record<string, string>;

interface PropertyProps {
  propertyName: string;
}

// const initialState = {
//   photo: [],
//   floorplan: [],
//   vt: ""
// };

// function mediaReducer(state, action) {
//   switch (action.type) {
//     case 'increment':
//       return {count: state.count + 1};
//     case 'decrement':
//       return {count: state.count - 1};
//     default:
//       throw new Error();
//   }
// }

const getImage = (url: string, type: string): string => {
  let fileName = url.replace(/ /g, "+");
  if (type === "floorplan") {
    const seperator = fileName.split(".");
    fileName = `${seperator[0]}-500x350.${seperator[1]}`;
  }
  return `${process.env.REACT_APP_IMG}/${fileName}`;
}

export const PropertiesPage: React.SFC<PropertyProps> = () => {
  const { user } = useContext(LoginContext);
  
  const location = useLocation<{ propertyName: string; propertyId: string; }>();
  const [propertyData, setPropertyData] = useState<any>({});
  // const [mediaFiles, getMedia] = useReducer(mediaReducer, initialState);

  const { data } = useQuery({
    queryKey: [`properties`, user!.group, location.state.propertyId],
    queryFn: () => postAPI<any>('/get-media', {
      pids: [location.state.propertyId],
    }, {
      token: user!.token
    }),
    select: data => {
      const media = data.reduce((list, curr) => {
        return {
          ...list,
          [curr.type]: (list[curr.type] || []).concat([curr.resource]),
        }
      }, {});
      setPropertyData(media);
    },
    enabled: Boolean(user && user.group && location.state.propertyId)
  });


  return (
    <React.Fragment>
      {propertyData && (
        <GenericTable 
          
        />
      )}
      {propertyData.floorplan && propertyData.floorplan.map((plan: any) => (
        <img src={getImage(`${location.state.propertyName}/${plan}`, "floorplan")} />
      ))}
    </React.Fragment>
  );
}