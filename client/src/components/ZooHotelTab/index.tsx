import React from "react";
import {TabPanel} from "../TabPanel";
import {CategoryTabType} from "../CategoryTabs";

export const ZooHotelTab: React.FC<CategoryTabType> = ({value, index}) => {
  return (
    <TabPanel value={value} index={index}>
      Item Two
    </TabPanel>
  )
}
