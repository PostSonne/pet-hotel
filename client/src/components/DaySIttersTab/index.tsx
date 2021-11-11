import React from "react";
import {CategoryTabType} from "../CategoryTabs";
import {TabPanel} from "../TabPanel";

export const DaySittersTab: React.FC<CategoryTabType> = ({value, index}) => {
  return (
    <TabPanel value={value} index={index}>
      Item Two
    </TabPanel>
  )
}
