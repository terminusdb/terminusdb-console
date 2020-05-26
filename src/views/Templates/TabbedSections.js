import React from "react";
import { Tabs, Tab } from "react-bootstrap-tabs/dist";
//this really should be changed to use reacstrap tabs - this one is crap and doesn't work properly
/**
 * Controlled tabbed sections - can be changed by sending in active
 * 
 * Works by wrapping each child in tab decoration
 */
export const TabbedSections = ({ id, active, sections, children }) => {
    id = id || "tabbed-sections"
    const [key, setKey] = useState(active || sections[0].id);
    useEffect( active => setKey(active), [active] )
    const elements = React.Children.toArray(children) 
    const tabs = elements.map((child, index)=>{
        let tab = (
            <Tab
                key={sections[index].id}
                eventKey={sections[index].id}
                label={sections[index].label}
                title={sections[index].label}
            >
                {child}
            </Tab>
        )
        return tab
    })
    return (
        <Tabs
            id={id}
            activeKey={key}
            //onSelect={(k) => setKey(k)}
        >
            {tabs}
        </Tabs>
    );   
}
