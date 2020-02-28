import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { NavItems } from "./NavItem";
import { TabContainer } from "./TabContainer";
import { CLASSES_TAB, OWL_TAB } from "../labels/tabLabels"
import { DATABASE_HOME_TABS, SCHEMA_TABS } from "../labels/tabLabels"


const Tab = (props) => {

    const [activeTab, setActiveTab] = useState(props.defaultState);
    const navItems = [], tabPane = [], dbHomePane = [];

    const tabs = props.tabs || [];

    for (const [index, value] of tabs.entries()) {
        let entry = tabs[index];
        Object.keys(entry).forEach(function(key) {
          let tState = entry[key];
          navItems.push(<NavItems activeClassName = {activeTab == tState.state ? 'active' : ''}
                                  onClick = {() => setActiveTab(tState.state)}
                                  label = {tState.label} />)
          if(props.for == SCHEMA_TABS)
              tabPane.push(<TabPane tabId = {tState.state}>
                                <TabContainer tab = {tState} activeTab = {activeTab}/>
                           </TabPane>)
        });
    }

    return (
        <div>
            <hr className ="my-3"/>
            <Nav tabs>
                {navItems}
           </Nav>
           <hr className ="my-3"/>
           {tabPane && <TabContent activeTab = {activeTab}>
                {tabPane}
           </TabContent>}
        </div>
    );
}
export default Tab
